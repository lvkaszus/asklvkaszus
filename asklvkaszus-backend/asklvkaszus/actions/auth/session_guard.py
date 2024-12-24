from ...extensions import csrf
from flask import current_app, jsonify
import traceback

def session_guard(identity):
    csrf.protect()

    try:
        return jsonify(logged_in_as=identity), 200
    
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/auth/session_guard module: {e}")
        traceback.print_exc()

        return jsonify(error='An error occurred while checking your session! Try again later.'), 500
