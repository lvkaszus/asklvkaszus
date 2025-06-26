from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids

def session_guard(identity):
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

    # Return a JSON response indicating the currently authenticated user.
    # The 'logged_in_as' field contains the identity (username) of the user associated with the current JWT token.
    return jsonify_on_steroids(logged_in_as=identity, headers=response_headers), 200
