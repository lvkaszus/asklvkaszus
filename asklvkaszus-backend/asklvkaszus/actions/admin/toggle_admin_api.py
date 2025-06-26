from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids
from ...modules.rest_core import toggle_admin_api

def admin_toggle_admin_api(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    toggle_admin_api_result = toggle_admin_api(identity)
    
    if "error" in toggle_admin_api_result:
        return jsonify_on_steroids(toggle_admin_api_result, headers=response_headers), 400

    return jsonify_on_steroids(toggle_admin_api_result, headers=response_headers), 200
