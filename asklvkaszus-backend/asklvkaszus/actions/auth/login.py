import os
from ...config import Config
from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import current_app, request, make_response
from ...modules.captcha_verification import verify_captcha
from ...modules.response_handler import jsonify_on_steroids
import re
from ...models.registered_users import RegisteredUsers
import bcrypt
from ...modules.jwt_core import create_access_token, create_refresh_token
from flask_wtf.csrf import CSRFError

def login():
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    data = request.get_json()

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    captcha_token = safe_get(data, 'captcha_token', str)

    if not verify_captcha(captcha_token):
        return jsonify_on_steroids(error="CAPTCHA Verification Failed!", headers=response_headers), 403

    username = safe_get(data, 'username', str)
    password = safe_get(data, 'password', str)

    if not username or not password:
        return jsonify_on_steroids(error="Username and Password is required!", headers=response_headers), 400

    if len(username) > 32:
        return jsonify_on_steroids(error="Username must be less than 32 characters long!", headers=response_headers), 400

    elif len(password) > 100:
        return jsonify_on_steroids(error="Password must be less than 100 characters long!", headers=response_headers), 400

    elif not re.match(r"^[a-zA-Z0-9_-]+$", username):
        return jsonify_on_steroids(error="Username may contain only Latin letters (a–z, A–Z), digits (0–9), hyphens (-), and underscores (_)!", headers=response_headers), 400

    elif re.search(r"[-_]{2,}", username):
        return jsonify_on_steroids(error="Username cannot contain consecutive hyphens (-) or underscores (_)!", headers=response_headers), 400

    elif not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", password):
        return jsonify_on_steroids(error="Password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!", headers=response_headers), 400


    user = RegisteredUsers.query.filter_by(username=username).first()
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(username)
        refresh_token = create_refresh_token(username)

        response = make_response(jsonify_on_steroids(success="Successfully logged in!", headers=response_headers), 202)

        response.set_cookie('access_token', access_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
        response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

        current_app.logger.info('%s logged in successfully!', username)
        
        return response

    else:
        current_app.logger.info('%s entered incorrect password!', username)

        return jsonify_on_steroids(error='Incorrect username or password!', headers=response_headers), 401