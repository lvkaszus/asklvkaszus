import os
from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import current_app, request
from ...modules.captcha_verification import verify_captcha
from ...modules.response_handler import jsonify_on_steroids
from ...models.registered_users import RegisteredUsers
import re
import bcrypt

# Ask @lvkaszus! - Auth System REST API: New User Registration

def register():
    # Check CSRF token and session cookie when HTTP request method is POST
    # as defined in the application configuration script (config.py: WTF_CSRF_METHODS)
    # by using function from Flask-WTF library.
    csrf.protect()

    # Defining the response headers to be added into the JSON response return.
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    # Then, check if any already registered user exists by fetching any first entry
    # in the "registered_users" application database table with an SQLAlchemy database
    # table model.
    admin_user_registered = RegisteredUsers.query.first()


    # Next, we are checking if the HTTP request method is GET.

    # Below, we are checking if "admin_user_registered" variable from database query
    # above is NOT empty. When it is NOT empty - we return information in JSON format
    # that the new user registration is available!
    if request.method == "GET":
        if admin_user_registered:
            sql.session.close()

            return jsonify_on_steroids(registration_enabled=False, headers=response_headers), 200
        else:
            # But when "admin_user_registered" variable IS empty, then we return
            # information that the new user registration is NOT available!
            sql.session.close()
            return jsonify_on_steroids(registration_enabled=True, headers=response_headers), 200

    # But when the HTTP request method is POST, we are again checking if the registration
    # is available. If is not, then we return error that the new user registration is NOT
    # available.
    elif request.method == "POST":
        if admin_user_registered:
            return jsonify_on_steroids(error="Registration for new users is not allowed!", headers=response_headers), 403

        # When registration is available, this API route expects a request with JSON
        # data as a payload.
        data = request.get_json()

        # When request has been sent without any JSON data, then we return an error about
        # invalid JSON payload.
        if not data:
            return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

        # Get captcha token from the JSON data.
        captcha_token = safe_get(data, 'captcha_token', str)

        # If captcha token verification failed, return an error.
        if not verify_captcha(captcha_token):
            return jsonify_on_steroids(error="CAPTCHA Verification Failed!", headers=response_headers), 403

        # Next, extract username, password, and confirm_password fields from the JSON data.
        username = safe_get(data, 'username', str)
        password = safe_get(data, 'password', str)
        confirm_password = safe_get(data, 'confirm_password', str)

        # If any required field is missing, return an error.
        if not username or not password or not confirm_password:
            return jsonify_on_steroids(error="Username, Password and Confirmed Password is required!", headers=response_headers), 400

        # Disallow registration with the reserved username "asklvkaszus".
        if username == "asklvkaszus":
            return jsonify_on_steroids(error="This username is not allowed! Please try again with another username.", headers=response_headers), 400

        # Check if a user with the same username already exists in the database.
        existing_user = RegisteredUsers.query.filter_by(username=username).first()
        if existing_user:
            return jsonify_on_steroids(error="User with this username already exists!", headers=response_headers), 409


        # Now, validate the username and password according to security requirements:
        # - Username must have minimum of 4 characters
        # - Username must have maximum of 32 characters
        # - Password must have minimum of 12 characters
        # - Password must have maximum of 100 characters
        # - Username may contain only Latin letters, digits, hyphens and underscores
        # - Username cannot contain consecutive special characters such as "--" or "__"
        # - Password may contain only Latin letters, digits and special characters
        # - Password must have at least one uppercase letter
        # - Password must have at least one number
        # - Password must have at least one special character
        # - Password must match the confirmation password
        if len(username) < 4:
            return jsonify_on_steroids(error="Username must be at least 4 characters long!", headers=response_headers), 400

        elif len(username) > 32:
            return jsonify_on_steroids(error="Username must be less than 32 characters long!", headers=response_headers), 400

        elif len(password) < 12:
            return jsonify_on_steroids(error="Password must be at least 12 characters long!", headers=response_headers), 400

        elif len(password) > 100:
            return jsonify_on_steroids(error="Password must be less than 100 characters long!", headers=response_headers), 400

        elif not re.match(r"^[a-zA-Z0-9_-]+$", username):
            return jsonify_on_steroids(error="Username may contain only Latin letters (a–z, A–Z), digits (0–9), hyphens (-), and underscores (_)!", headers=response_headers), 400

        elif re.search(r"[-_]{2,}", username):
            return jsonify_on_steroids(error="Username cannot contain consecutive hyphens (-) or underscores (_)!", headers=response_headers), 400

        elif not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", password):
            return jsonify_on_steroids(error="Password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!", headers=response_headers), 400

        elif not re.search("[A-Z]", password):
            return jsonify_on_steroids(error="Password must contain at least one uppercase letter!", headers=response_headers), 400

        elif not re.search("[0-9]", password):
            return jsonify_on_steroids(error="Password must contain at least one number!", headers=response_headers), 400

        elif not re.search("[!@#$%^&*]", password):
            return jsonify_on_steroids(error="Password must contain at least one special character like: !, @, #, $, %, ^, &, *!", headers=response_headers), 400

        elif password != confirm_password:
            return jsonify_on_steroids(error="Confirmed password is not the same as password!", headers=response_headers), 400


        # If all checks pass, generate a secure salt and hash the password using bcrypt.
        salt = bcrypt.gensalt(rounds=14)
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        # Create a new RegisteredUsers object and add it to the database session.
        new_user_credentials = RegisteredUsers(username=username, password=hashed_password)
        sql.session.add(new_user_credentials)
        sql.session.commit()


        # Return a success message in JSON format with HTTP status 201 (Created).
        return jsonify_on_steroids(success="Registration successful!", headers=response_headers), 201
