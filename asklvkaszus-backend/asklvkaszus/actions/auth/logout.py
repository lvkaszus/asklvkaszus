from ...extensions import csrf
from ...config import Config
from flask import current_app, request, jsonify
from ...modules.jwt_core import revoke_tokens

def logout():
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    csrf.protect()

    try:
        if access_token and refresh_token:
            revoke_tokens(access_token, refresh_token)

        response = jsonify(success="Logged out successfully!")
        response.status_code = 200

        response.set_cookie('access_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
        response.set_cookie('refresh_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

        return response

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/auth/logout module: {e}")

        return jsonify(error='An error occurred while logging you out!'), 500