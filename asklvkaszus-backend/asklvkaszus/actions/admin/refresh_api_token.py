from ...extensions import csrf
from flask import jsonify
from ...modules.rest_core import regenerate_api_key

def admin_refresh_api_token(identity):
    csrf.protect()

    regenerate_api_key_result = regenerate_api_key(identity)

    if "error" in regenerate_api_key_result:
        return jsonify(regenerate_api_key_result), 400

    return jsonify(regenerate_api_key_result), 200
