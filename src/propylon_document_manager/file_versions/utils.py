import hashlib
from urllib.parse import urlparse, parse_qs

# hash the provide document
def generate_file_hash(document):
    if not document:
        return None
    hasher = hashlib.sha256()
    document.seek(0)
    for chunk in document.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()

# extract provided url and query parameters.
# the url is relevant for File Revision storing
# while the query params are very important for various calculations -
# (such as extracting revision_number in order to return the specific revision of the document)
def parse_url(url):
    parsed_url = urlparse(url)
    return {"path": parsed_url.path, "params":parse_qs(parsed_url.query)}
