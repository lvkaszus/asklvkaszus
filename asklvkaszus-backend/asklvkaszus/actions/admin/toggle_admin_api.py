from ...extensions import csrf
from flask import jsonify
from ...modules.rest_core import toggle_admin_api

def admin_toggle_admin_api(identity):
    csrf.protect()

    toggle_admin_api_result = toggle_admin_api(identity)
    
    if "error" in toggle_admin_api_result:
        return jsonify(toggle_admin_api_result), 400

    return jsonify(toggle_admin_api_result), 200
