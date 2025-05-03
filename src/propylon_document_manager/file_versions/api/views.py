from copy import deepcopy

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from urllib.parse import urlparse, parse_qs

from ..models import FileRevision, FileInstance
from .serializers import FileRevisionSerializer
from ..utils import generate_file_hash


class FileRevisionViewSet(CreateModelMixin, RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = FileRevisionSerializer

    def get_queryset(self):
        return FileRevision.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = deepcopy(request.data)

        parsed_url, query_params = self._parse_url(data['url'])

        queryset = FileRevision.objects.filter(url=parsed_url).exclude(user=self.request.user)

        if len(queryset) > 0:
            raise Exception("Provided url is already in use")

        queryset = self.get_queryset()
        file_revision = queryset.filter(url=parsed_url).order_by("-revision_number").all()

        # file provided by client
        file = data.pop("file")

        file_hash = generate_file_hash(file[0])

        file_instance = FileInstance.objects.filter(file_hash=file_hash).first()

        if not file_instance:
            file_instance = FileInstance(
                file_hash=file_hash,
                file_name=file.name,
                file=file
            )
            file_instance.save()

        # if we find that the file with the given URL already exist
        # create a new instance while bumping the file version
        # otherwise, set the version to 0
        new_instance_version = 0
        if file_revision:
            new_instance_version = file_revision[0].revision_number + 1

        data.update({
            "user": request.user.id,
            "revision_number": new_instance_version,
            "file": file_instance.id,
        })

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(file=file_instance)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @staticmethod
    def _parse_url(url):
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        return parsed_url.path, query_params
