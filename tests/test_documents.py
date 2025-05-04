from propylon_document_manager.file_versions.models import FileRevision


def test_document_storing(authorized_client_user_1, document_fixture_1, user_1):

    file = {
        "file": document_fixture_1
    }
    data = {
        "url": "/document/upload.txt",
    }

    response = authorized_client_user_1.post('https://testserver/api/file_versions/', data=data, files=file)
    response_data = response.json()
    assert response.status_code == 201
    assert response_data['url'] == data['url']
    assert response_data['user'] == user_1.id


def test_revisions_upload_and_retrieval(authorized_client_user_1, document_fixture_1,
                                              document_fixture_2, document_fixture_3, user_1):

    file = {"file": document_fixture_1}
    data = {"url": "/document/upload.txt"}

    response = authorized_client_user_1.post('https://testserver/api/file_versions/', data=data, files=file)
    response_data = response.json()
    assert response.status_code == 201
    assert response_data['revision_number'] == 0

    file = {"file": document_fixture_2}
    response = authorized_client_user_1.post('https://testserver/api/file_versions/', data=data, files=file)
    response_data = response.json()
    assert response.status_code == 201
    assert response_data['url'] == data['url']
    assert response_data['user'] == user_1.id
    assert response_data['revision_number'] == 1

    # add one more file, which is now the latest revision of the document
    file = {"file": document_fixture_3}
    authorized_client_user_1.post('https://testserver/api/file_versions/', data=data, files=file)


    # this should retrieve the latest version
    response = authorized_client_user_1.get(
        f'https://testserver/api/file_versions/get_document_by_url?file_url={data["url"]}')
    assert response.status_code == 200
    assert response.text == document_fixture_3.file.getvalue().decode('UTF-8')

    # this should retrieve the first version
    url=f"{data['url']}?revision=0"
    response = authorized_client_user_1.get(
        f'https://testserver/api/file_versions/get_document_by_url?file_url={url}')
    assert response.status_code == 200
    assert response.text == document_fixture_1.file.getvalue().decode('UTF-8')

    # we can also retrieve any revision that exists
    url=f"{data['url']}?revision=1"
    response = authorized_client_user_1.get(
        f'https://testserver/api/file_versions/get_document_by_url?file_url={url}')
    assert response.status_code == 200
    assert response.text == document_fixture_2.file.getvalue().decode('UTF-8')

    # asking for a revision that does not exist returns bad request
    url=f"{data['url']}?revision=5"
    response = authorized_client_user_1.get(
        f'https://testserver/api/file_versions/get_document_by_url?file_url={url}')
    assert response.status_code == 500
