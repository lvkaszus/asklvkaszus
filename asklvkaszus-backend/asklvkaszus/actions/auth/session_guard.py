from ...extensions import csrf
from flask import current_app, jsonify

def session_guard(identity):
    # Check CSRF token and session cookie when HTTP request method is POST
    # as defined in the application configuration script (config.py: WTF_CSRF_METHODS)
    # by using function from Flask-WTF library.
    csrf.protect()

    # Return a JSON response indicating the currently authenticated user.
    # The 'logged_in_as' field contains the identity (username) of the user associated with the current JWT token.
    return jsonify(logged_in_as=identity), 200
