from ...modules.response_handler import jsonify_on_steroids
from flask_wtf.csrf import generate_csrf

# Ask @lvkaszus! - Auth System REST API: Fetch CSRF Token

def fetch_csrf_token():
    # Defining the response headers to be added into the JSON response return.
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    # Generate a new CSRF token using Flask-WTF's generate_csrf() function.
    csrf_token = generate_csrf()

    # Return the CSRF token in JSON format with HTTP 200 status.
    return jsonify_on_steroids(csrf_token=csrf_token, headers=response_headers), 200
