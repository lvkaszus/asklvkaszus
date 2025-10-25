from ...modules.response_handler import jsonify_on_steroids
from flask_wtf.csrf import generate_csrf

def fetch_csrf_token():
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    csrf_token = generate_csrf()

    return jsonify_on_steroids(csrf_token=csrf_token, headers=response_headers), 200
