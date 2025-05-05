import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from propylon_document_manager.file_versions.models import User, FileRevision, FileInstance
from propylon_document_manager.file_versions.utils import generate_file_hash
from .factories import UserFactory, AuthorizedClientFactory
from rest_framework.test import RequestsClient


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass

@pytest.fixture(autouse=True)
def media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture
def user_1(db) -> User:
    return UserFactory()


@pytest.fixture
def user_2(db) -> User:
    return UserFactory()


@pytest.fixture
def unauthorized_client():
    """ Used for testing the access of unauthorized users"""
    return RequestsClient()


@pytest.fixture
def authorized_client_user_1(user_1):
    return AuthorizedClientFactory(user_1).get_client()

@pytest.fixture
def authorized_client_user_2(user_2):
    return AuthorizedClientFactory(user_2).get_client()


@pytest.fixture
def document_fixture_1():
    """Returns a mock uploaded file fixture."""
    document_content = b"First test doc"
    return SimpleUploadedFile("test_file_1.txt", document_content, content_type="text/plain")


@pytest.fixture
def document_fixture_2():
    document_content = b"Second test doc"
    return SimpleUploadedFile("test_file_2.txt", document_content, content_type="text/plain")


@pytest.fixture
def document_fixture_3():
    document_content = b"Third test doc"
    return SimpleUploadedFile("test_file_3.txt", document_content, content_type="text/plain")

@pytest.fixture
def document_instance_fixture_1(document_fixture_1):
    return FileInstance.objects.create(
        file_name='test_file_1.txt',
        file_hash=generate_file_hash(document_fixture_1),
        file=document_fixture_1,
        id=1
    )

@pytest.fixture
def document_instance_fixture_2(document_fixture_2):
    return FileInstance.objects.create(
        file_name='test_file_2.txt',
        file_hash=generate_file_hash(document_fixture_2),
        file=document_fixture_2,
        id=2
    )


@pytest.fixture
def document_version_for_user_1(document_instance_fixture_1, user_1, document_fixture_1):
    return FileRevision.objects.create(
        user=user_1,
        url='/test/file_1/test_doc_1.txt',
        file=document_instance_fixture_1,
        revision_number=0,
    )

@pytest.fixture
def document2_version_for_user_1(document_instance_fixture_1, user_1, document_fixture_1):
    return FileRevision.objects.create(
        user=user_1,
        url='/test/file_1/test_doc_1.txt',
        file=document_instance_fixture_1,
        revision_number=1,
    )


@pytest.fixture
def document_version_for_user_2(document_instance_fixture_2, user_2, document_fixture_2):
    return FileRevision.objects.create(
        user=user_2,
        url='/test/file_1/test_file_2.txt',
        revision_number=0,
        file=document_instance_fixture_2
    )
