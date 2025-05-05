

def test_api_access(unauthorized_client, authorized_client_user_1):

    response = unauthorized_client.get('https://testserver/api/file_versions')
    assert response.status_code == 403

    response = authorized_client_user_1.get('https://testserver/api/file_versions')
    assert response.status_code == 200


def test_document_revision_access(document_version_for_user_1, document_version_for_user_2, authorized_client_user_1,
                                           authorized_client_user_2):

    # User only has access to its own files. User can't see nor access files uploaded by other users
    response = authorized_client_user_1.get('https://testserver/api/file_versions/')
    response_data = response.json()
    assert response.status_code == 200
    assert len(response_data) ==1
    assert response_data[0].get('url') == document_version_for_user_1.url

    response = authorized_client_user_2.get('https://testserver/api/file_versions/')
    response_data = response.json()
    assert response.status_code == 200
    assert len(response_data) ==1
    assert response_data[0].get('url') == document_version_for_user_2.url

    # trying to access files on urls uploaded by other users will return an Exception
    response = authorized_client_user_1.get(
        f'https://testserver/api/file_versions/get_document_by_url?file_url={document_version_for_user_2.url}')
    assert response.status_code == 500

