from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids

def session_guard(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    return jsonify_on_steroids(logged_in_as=identity, headers=response_headers), 200
