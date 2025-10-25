from ...extensions import csrf
from ...config import Config
from flask import current_app, request, make_response
from ...modules.response_handler import jsonify_on_steroids
from ...modules.jwt_core import revoke_tokens
from flask_wtf.csrf import CSRFError

def logout(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    if access_token and refresh_token:
        revoke_tokens(access_token, refresh_token)

    response = make_response(jsonify_on_steroids(success="Logged out successfully!", headers=response_headers), 200)

    response.set_cookie('access_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
    response.set_cookie('refresh_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

    current_app.logger.info('%s logged out successfully!', identity)

    return response
