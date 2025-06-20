from flask import jsonify
from flask_wtf.csrf import generate_csrf

# Ask @lvkaszus! - Auth System REST API: Fetch CSRF Token

def fetch_csrf_token():
    # Generate a new CSRF token using Flask-WTF's generate_csrf() function.
    csrf_token = generate_csrf()

    # Return the CSRF token in JSON format with HTTP 200 status.
    return jsonify(csrf_token=csrf_token), 200
