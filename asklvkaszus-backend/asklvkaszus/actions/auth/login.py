import os
from ...config import Config
from ...extensions import csrf, sql
from flask import current_app, request, jsonify
import re
from ...models.registered_users import RegisteredUsers
import bcrypt
from ...modules.jwt_core import create_access_token, create_refresh_token
from flask_wtf.csrf import CSRFError

# Ask @lvkaszus! - Auth System REST API: User Login

def login():
    # Check CSRF token and session cookie when HTTP request method is POST
    # as defined in the application configuration script (config.py: WTF_CSRF_METHODS)
    # by using function from Flask-WTF library.
    csrf.protect()

    # If the CSRF validation passed, this API route expects a request with JSON
    # data as a payload.
    data = request.get_json()

    # When request has been sent without any JSON data, then we return an error about
    # invalid JSON payload.
    if not data:
        return jsonify(error="Invalid JSON payload!"), 400


    # Next, extract username and password fields from the JSON data.
    username = data.get('username').strip()
    password = data.get('password').strip()

    # If any required field is missing, return an error.
    if not username or not password:
        return jsonify(error="Username and Password is required!"), 400


    # Now, validate the username and password according to security requirements:
    # - Username must have maximum of 32 characters
    # - Password must have maximum of 100 characters
    # - Username may contain only Latin letters, digits, hyphens and underscores
    # - Username cannot contain consecutive special characters such as "--" or "__"
    # - Password may contain only Latin letters, digits and special characters
    if len(username) > 32:
        return jsonify(error="Username must be less than 32 characters long!"), 400

    elif len(password) > 100:
        return jsonify(error="Password must be less than 100 characters long!"), 400

    elif not re.match(r"^[a-zA-Z0-9_-]+$", username):
        return jsonify(error="Username may contain only Latin letters (a–z, A–Z), digits (0–9), hyphens (-), and underscores (_)!"), 400

    elif re.search(r"[-_]{2,}", username):
        return jsonify(error="Username cannot contain consecutive hyphens (-) or underscores (_)!"), 400

    elif not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", password):
        return jsonify(error="Password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!"), 400


    # If all checks pass, we check if a user account with the provided username exists
    # in the database by fetching the first matching record.
    user = RegisteredUsers.query.filter_by(username=username).first()
    
    # If an user with the provided username exists in the database and the provided
    # password matches the stored (hashed) password, proceed with successful 
    # authentication.
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        # Generate a new access token (JWT) for the authenticated user.
        access_token = create_access_token(username)
        # Generate a new refresh token for the authenticated user.
        refresh_token = create_refresh_token(username)

        # Prepare a JSON response indicating successful login.
        response = jsonify(success="Successfully logged in!")
        # Set HTTP status code 202 (Accepted) for the response.
        response.status_code = 202

        # Set the access token as an HttpOnly, SameSite and Secure cookie (if enabled
        # in the application configuration file (config.yml: cookies_secure)).
        response.set_cookie('access_token', access_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
        # Set the refresh token as an HttpOnly, SameSite and Secure cookie (if enabled
        # in the application configuration file (config.yml: cookies_secure)).
        response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

        # Log the successful login event with the username.
        current_app.logger.info('%s logged in successfully!', username)
        
        # Return the prepared response to the client.
        return response

    # If an user with the provided username DOES NOT exist or when the password DOES NOT
    # match the stored (hashed) password, proceed with failure message.
    else:
        # Log the failed login attempt with the provided username.
        current_app.logger.info('%s entered incorrect password!', username)

        # Return a JSON error message with HTTP status 401 (Unauthorized).
        return jsonify(error='Incorrect username or password!'), 401
