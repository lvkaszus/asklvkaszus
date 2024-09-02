from flask import jsonify
from flask_wtf.csrf import CSRFError

def register_error_handlers(app):
    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return jsonify(error=e.description), 400

    @app.errorhandler(404)
    def page_not_found_error(e):
        return jsonify(error="Not found!"), 404

    @app.errorhandler(429)
    def ratelimit_error(e):
        return jsonify(error="Rate-limit exceeded! Try again later."), 429

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify(error="Internal Server Error!"), 500
