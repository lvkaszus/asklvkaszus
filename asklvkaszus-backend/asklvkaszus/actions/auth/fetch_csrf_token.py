from flask import jsonify
from flask_wtf.csrf import generate_csrf

def fetch_csrf_token():
    csrf_token = generate_csrf()
    return jsonify(csrf_token=csrf_token), 200
