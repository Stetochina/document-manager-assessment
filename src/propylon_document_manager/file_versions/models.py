from django.db import models
from propylon_document_manager.accounts.models import User


class FileInstance(models.Model):
    file_name = models.fields.CharField(max_length=512, null=True)
    file_hash = models.fields.CharField(max_length=512)
    file = models.FileField(upload_to="documents/", null=True, blank=True)

class FileRevision(models.Model):
    revision_number = models.fields.IntegerField()
    url = models.CharField(max_length=512, db_index=True)
    file = models.ForeignKey(FileInstance, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE, related_name='file_revisions')
