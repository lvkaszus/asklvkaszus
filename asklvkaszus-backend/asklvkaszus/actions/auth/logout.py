from ...extensions import csrf
from ...config import Config
from flask import current_app, request, jsonify
from ...modules.jwt_core import revoke_tokens
from flask_wtf.csrf import CSRFError

# Ask @lvkaszus! - Auth System REST API: User Logout

def logout(identity):
    # Check CSRF token and session cookie when HTTP request method is POST
    # as defined in the application configuration script (config.py: WTF_CSRF_METHODS)
    # by using function from Flask-WTF library.
    csrf.protect()

    # Then, it retrieves the access_token and refresh_token from the client's cookies
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    # If both tokens are present, invokes the revocation mechanism to
    # invalidate them on the server side. This prevents token reuse after logout.
    # If the both tokens are NOT present, nothing is done.
    if access_token and refresh_token:
        revoke_tokens(access_token, refresh_token)

    # Prepare a JSON response indicating successful logout.
    response = jsonify(success="Logged out successfully!")
    # Set HTTP status code 200 (OK) for the response.
    response.status_code = 200

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
