from flask import jsonify
from ..version import backend_version

def fetch_backend_version():
    return jsonify(backend_version=backend_version)