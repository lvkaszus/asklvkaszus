from ..modules.response_handler import jsonify_on_steroids
from ..version import backend_version

def fetch_backend_version():
    response_headers = {
        "Cache-Control": "public, max-age=86400, must-revalidate"
    }

    return jsonify_on_steroids(backend_version=backend_version, headers=response_headers), 200
