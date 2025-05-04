from propylon_document_manager.file_versions.models import FileRevision

def test_document_version_storing(user_1, document_instance_fixture_1):
    url='/test/test/'
    file_version = 0
    FileRevision.objects.create(
        url=url,
        revision_number=0,
        user=user_1,
        file=document_instance_fixture_1
    )
    files = FileRevision.objects.all()
    assert files.count() == 1
    assert files[0].url == url
    assert files[0].revision_number == file_version
