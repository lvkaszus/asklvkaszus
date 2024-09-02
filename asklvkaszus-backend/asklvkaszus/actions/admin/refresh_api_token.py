from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...modules.rest_core import regenerate_api_key

def admin_refresh_api_token(identity):
    csrf.protect()

    try:
        regenerate_api_key_result = regenerate_api_key(identity)

        if "error" in regenerate_api_key_result:
            return jsonify(regenerate_api_key_result), 400

        return jsonify(regenerate_api_key_result), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/refresh_api_token module: {e}")

        return jsonify(error='An error occurred while refreshing User API Token! Try again later.'), 500
