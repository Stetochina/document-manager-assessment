from copy import deepcopy

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from urllib.parse import urlparse, parse_qs
from rest_framework.decorators import action
from django.http import FileResponse
from rest_framework.exceptions import APIException


from ..models import FileRevision, FileInstance
from .serializers import FileRevisionSerializer
from ..utils import generate_file_hash


class FileRevisionViewSet(CreateModelMixin, RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = FileRevisionSerializer

    def get_queryset(self):
        return FileRevision.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = deepcopy(request.data)
        url = data['url'] if data['url'].startswith('/') else f"/{data['url']}"

        parsed_url, query_params = self._parse_url(url)

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
                file_name=file[0].name,
                file=file[0]
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
            "url": url
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

    @action(detail=False, methods=["GET"])
    def retrieve_revisions_by_hash(self, request, *args, **kwargs):
        """
        Retrieve all revisions for a user that match the given file hash
        """
        queryset = self.get_queryset()
        file_hash = request.query_params.get("file_hash")
        if not file_hash:
            raise Exception("You must provide 'file_hash' query param")

        file = FileInstance.objects.filter(file_hash=file_hash).first()
        if not file:
            raise Exception("No File exists with this hash")


        return Response(self.get_serializer_class()(instance=queryset.filter(file=file.id), many=True).data)

    @action(detail=False, methods=["GET"])
    def get_file_by_url(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        if not (file_url := request.query_params.get("file_url")):
            raise Exception("You must provide 'file_url' query param")
        parsed_url, query_params = self._parse_url(file_url)
        file_revision = None
        if not query_params:
            file_revision = queryset.filter(url=parsed_url).order_by("-revision_number").first()
        elif "revision" in query_params.keys():
            filtered_queryset = queryset.filter(url=parsed_url, revision_number=query_params["revision"][0])
            try:
                file_revision = filtered_queryset.get()
            except FileRevision.DoesNotExist:
                pass

        if not file_revision:
            raise Exception(f"Could not find a file with url '{file_url}'")

        file_path = file_revision.file.file.path
        response = FileResponse(open(file_path, "rb"), as_attachment=True)

        response["Content-Disposition"] = f'attachment; filename="{file_revision.file.file_name}"'
        return response

    @action(detail=False, methods=["GET"])
    def download_file_by_hash(self, request, *args, **kwargs):

        file_hash = request.query_params.get("file_hash")

        file = FileInstance.objects.filter(file_hash=file_hash).first()

        if not file:
            raise Exception("No File exists with this hash")

        queryset = self.get_queryset()
        revisions = queryset.filter(file=file.id).order_by("-revision_number")

        if not revisions:
            raise Exception("You do not have permission to download this file")

        file_path = file.file.path
        response = FileResponse(open(file_path, "rb"), as_attachment=True)

        response["Content-Disposition"] = f'attachment; filename="{file.file_name}"'
        return response
