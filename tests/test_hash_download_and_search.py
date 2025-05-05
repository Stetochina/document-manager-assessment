import pytest
from propylon_document_manager.file_versions.utils import generate_file_hash

def test_hash_search(authorized_client_user_1, document_version_for_user_1, document2_version_for_user_1, document_fixture_1):
    response = authorized_client_user_1.get(f'https://testserver/api/file_versions/retrieve_revisions_by_hash/?file_hash={generate_file_hash(document_fixture_1)}')
    response_data = response.json()
    assert response.status_code == 200
    assert len(response_data) == 2
    assert response_data[0]['revision_number'] == 0
    assert response_data[1]['revision_number'] == 1
    assert response_data[0]['file']['file_hash'] == generate_file_hash(document_fixture_1)


def test_hash_search_wrong_hash(authorized_client_user_1, document_version_for_user_1, document2_version_for_user_1, document_fixture_1):
    with pytest.raises(Exception):
        response = authorized_client_user_1.get(
            f'https://testserver/api/file_versions/retrieve_revisions_by_hash/?file_hash={generate_file_hash(document_fixture_1)}XY')
        response.json()

def test_hash_download(authorized_client_user_1, document_fixture_1, document_instance_fixture_1,
                           document_version_for_user_1):
        response = authorized_client_user_1.get(
            f'https://testserver/api/file_versions/download_file_by_hash/?file_hash={generate_file_hash(document_fixture_1)}')

        # Check status code
        assert response.status_code == 200


def test_wrong_hash_download(authorized_client_user_1, document_fixture_1, document_instance_fixture_1,
                       document_version_for_user_1):
    with pytest.raises(Exception):
        # trying to download a non existant file
        response = authorized_client_user_1.get(f'https://testserver/api/file_versions/download_file_by_hash/?file_hash={generate_file_hash(document_fixture_1)}XY')
        response.json()


def test_existent_file_but_no_revisions(authorized_client_user_1, document_fixture_1, document_instance_fixture_1):
    with pytest.raises(Exception):
        # If a user does not any revisions on the file (even if the file exists) he is unable to download it!
        response = authorized_client_user_1.get(
            f'https://testserver/api/file_versions/download_file_by_hash/?file_hash={generate_file_hash(document_fixture_1)}')
        response.json()

