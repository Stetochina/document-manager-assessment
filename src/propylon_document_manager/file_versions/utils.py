import hashlib


def generate_file_hash(file):
    """
    Calculate SHA-256 hash of the file contents.
    """
    if not file:
        return None
    hasher = hashlib.sha256()
    file.seek(0)
    for chunk in file.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()
