import hashlib
from urllib.parse import urlparse, parse_qs


def generate_file_hash(file):
    if not file:
        return None
    hasher = hashlib.sha256()
    file.seek(0)
    for chunk in file.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


def parse_url(url):
    parsed_url = urlparse(url)
    return {"path": parsed_url.path, "params":parse_qs(parsed_url.query)}
