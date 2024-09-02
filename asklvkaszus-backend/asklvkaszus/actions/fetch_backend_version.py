from flask import current_app, jsonify
from ..version import backend_version

def fetch_backend_version():
    try:
        return jsonify(backend_version=backend_version)
    
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/fetch_backend_version: {e}")

        return jsonify(error='An error occurred while fetching currently running backend version! Try again later.'), 500
