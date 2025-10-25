import os
from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import current_app, request
from ...modules.captcha_verification import verify_captcha
from ...modules.response_handler import jsonify_on_steroids
from ...models.registered_users import RegisteredUsers
import re
import bcrypt

def register():
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    admin_user_registered = RegisteredUsers.query.first()


    if request.method == "GET":
        if admin_user_registered:
            sql.session.close()

            return jsonify_on_steroids(registration_enabled=False, headers=response_headers), 200
        else:
            sql.session.close()
            return jsonify_on_steroids(registration_enabled=True, headers=response_headers), 200

    elif request.method == "POST":
        if admin_user_registered:
            return jsonify_on_steroids(error="Registration for new users is not allowed!", headers=response_headers), 403

        data = request.get_json()

        if not data:
            return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

        captcha_token = safe_get(data, 'captcha_token', str)

        if not verify_captcha(captcha_token):
            return jsonify_on_steroids(error="CAPTCHA Verification Failed!", headers=response_headers), 403

        username = safe_get(data, 'username', str)
        password = safe_get(data, 'password', str)
        confirm_password = safe_get(data, 'confirm_password', str)

        if not username or not password or not confirm_password:
            return jsonify_on_steroids(error="Username, Password and Confirmed Password is required!", headers=response_headers), 400

        if username == "asklvkaszus":
            return jsonify_on_steroids(error="This username is not allowed! Please try again with another username.", headers=response_headers), 400

        existing_user = RegisteredUsers.query.filter_by(username=username).first()
        if existing_user:
            return jsonify_on_steroids(error="User with this username already exists!", headers=response_headers), 409


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


        salt = bcrypt.gensalt(rounds=14)
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        new_user_credentials = RegisteredUsers(username=username, password=hashed_password)
        sql.session.add(new_user_credentials)
        sql.session.commit()


        return jsonify_on_steroids(success="Registration successful!", headers=response_headers), 201
