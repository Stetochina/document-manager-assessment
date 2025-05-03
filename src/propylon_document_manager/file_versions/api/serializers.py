from rest_framework import serializers

from ..models import FileRevision, FileInstance



class FileInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileInstance
        fields = ['file_name', 'file_hash', 'file']


class FileRevisionSerializer(serializers.ModelSerializer):
    file = FileInstanceSerializer(read_only=True)

    class Meta:
        model = FileRevision
        fields = ['file', 'url', 'revision_number', 'user']

