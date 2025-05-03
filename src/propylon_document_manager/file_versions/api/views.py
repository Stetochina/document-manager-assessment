from django.shortcuts import render

from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

from ..models import FileRevision
from .serializers import FileRevisionSerializer

class FileRevisionViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = []
    serializer_class = FileRevisionSerializer
    queryset = FileRevision.objects.all()
    lookup_field = "id"
