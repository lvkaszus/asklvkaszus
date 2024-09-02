import os
from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.registered_users import RegisteredUsers
import re
import bcrypt

def register():
    admin_user_registered = RegisteredUsers.query.first()

    if request.method == 'GET':
        if admin_user_registered:
            sql.session.close()
            return jsonify(registration_enabled=False), 200
        else:
            sql.session.close()
            return jsonify(registration_enabled=True), 200


    elif request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        csrf.protect()

        if admin_user_registered:
            return jsonify(error="Registration for new users is not allowed!"), 403

        if len(password) < 12:
            return jsonify(error='Password must be at least 12 characters long!'), 400
        elif not re.search("[A-Z]", password):
            return jsonify(error='Password must contain at least one uppercase letter!'), 400
        elif not re.search("[0-9]", password):
            return jsonify(error='Password must contain at least one number!'), 400
        elif not re.search("[!@#$%^&*]", password):
            return jsonify(error='Password must contain at least one special character like: !, @, #, $, %, ^, &, *!'), 400
        elif password != confirm_password:
            return jsonify(error='Confirmed password is not the same as password!'), 400

        if username == "asklvkaszus":
            return jsonify(error="This username is not allowed! Please try again with another username."), 400
        

        existing_user = RegisteredUsers.query.filter_by(username=username).first()
        if existing_user:
            return jsonify(error='User with this username already exists.'), 409

        salt = bcrypt.gensalt(rounds=14)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        try:
            new_user_credentials = RegisteredUsers(username=username, password=hashed_password)
            sql.session.add(new_user_credentials)
            sql.session.commit()

            return jsonify(success='Registration successful.'), 201

        except Exception as e:
            current_app.logger.error(f"An error occured inside asklvkaszus/actions/auth/register module: {e}")

            return jsonify(error='An error occured while registering your account! Try again later.'), 500

        finally:
            sql.session.close()
