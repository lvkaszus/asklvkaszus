from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids
from ...modules.rest_core import regenerate_api_key

def admin_refresh_api_token(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    regenerate_api_key_result = regenerate_api_key(identity)

    if "error" in regenerate_api_key_result:
        return jsonify_on_steroids(regenerate_api_key_result, headers=response_headers), 400

    return jsonify_on_steroids(regenerate_api_key_result, headers=response_headers), 200
