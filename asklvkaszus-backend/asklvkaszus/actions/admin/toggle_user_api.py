from ...extensions import csrf
from flask import jsonify
from ...modules.rest_core import toggle_user_api

def admin_toggle_user_api(identity):
    csrf.protect()

    toggle_user_api_result = toggle_user_api(identity)
    
    if "error" in toggle_user_api_result:
        return jsonify(toggle_user_api_result), 400

    return jsonify(toggle_user_api_result), 200
