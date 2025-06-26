from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids
from ...modules.rest_core import toggle_user_api

def admin_toggle_user_api(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    toggle_user_api_result = toggle_user_api(identity)
    
    if "error" in toggle_user_api_result:
        return jsonify_on_steroids(toggle_user_api_result, headers=response_headers), 400

    return jsonify_on_steroids(toggle_user_api_result, headers=response_headers), 200
