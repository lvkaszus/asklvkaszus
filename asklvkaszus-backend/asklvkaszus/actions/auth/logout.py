from ...extensions import csrf
from ...config import Config
from flask import current_app, request, make_response
from ...modules.response_handler import jsonify_on_steroids
from ...modules.jwt_core import revoke_tokens
from flask_wtf.csrf import CSRFError

# Ask @lvkaszus! - Auth System REST API: User Logout

def logout(identity):
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

    # Then, it retrieves the access_token and refresh_token from the client's cookies
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    # If both tokens are present, invokes the revocation mechanism to
    # invalidate them on the server side. This prevents token reuse after logout.
    # If the both tokens are NOT present, nothing is done.
    if access_token and refresh_token:
        revoke_tokens(access_token, refresh_token)

    # Prepare a JSON response indicating successful logout with HTTP 200 (OK) status code..
    response = make_response(jsonify_on_steroids(success="Logged out successfully!", headers=response_headers), 200)

    # Clears the authentication cookies by setting:
    # - Empty values
    # - Immediate expiration (expires=0)
    # - Security flags (HttpOnly, SameSite, Secure) matching configuration
    # in the application configuration file (config.yml: cookies_secure).
    response.set_cookie('access_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
    response.set_cookie('refresh_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

    # Log the successful logout event with the username.
    current_app.logger.info('%s logged out successfully!', identity)

    # Return the prepared response to the client.
    return response
