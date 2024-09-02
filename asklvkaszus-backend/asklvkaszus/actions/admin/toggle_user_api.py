from ...extensions import csrf
from flask import current_app, jsonify
from ...modules.rest_core import toggle_user_api

def admin_toggle_user_api(identity):
    csrf.protect()

    try:
        toggle_user_api_result = toggle_user_api(identity)
        
        if "error" in toggle_user_api_result:
            return jsonify(toggle_user_api_result), 400

        return jsonify(toggle_user_api_result), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/toggle_user_api module: {e}")

        return jsonify(error='An error occurred while changing User API state! Try again later.'), 500
