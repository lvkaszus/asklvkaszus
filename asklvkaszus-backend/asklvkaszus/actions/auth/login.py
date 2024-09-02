import os
from ...config import Config
from ...extensions import sql
from flask import current_app, request, jsonify
from ...models.registered_users import RegisteredUsers
import bcrypt
from ...modules.jwt_core import create_access_token, create_refresh_token

def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        user = RegisteredUsers.query.filter_by(username=username).first()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            access_token = create_access_token(username)
            refresh_token = create_refresh_token(username)

            response = jsonify(success="Successfully logged in.")
            response.status_code = 202

            response.set_cookie('access_token', access_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
            response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
        
            current_app.logger.info('%s logged in successfully!', username)
            return response
        else:
            current_app.logger.info('%s entered incorrect password!', username)

            return jsonify(error='Incorrect login or password.'), 401

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/auth/login module: {e}")

        return jsonify(error='An error occured while logging you in! Try again later.'), 500

    finally:
        sql.session.close()
        