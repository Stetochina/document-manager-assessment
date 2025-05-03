from rest_framework import serializers

from ..models import FileRevision

class FileRevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileRevision
        fields = "__all__"
