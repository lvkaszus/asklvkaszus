from flask import current_app, jsonify
from flask_wtf.csrf import CSRFError
from sqlalchemy.exc import ProgrammingError, OperationalError, IntegrityError
import traceback

def register_error_handlers(app):
    # Handler for SQLAlchemy ProgrammingError exceptions.
    # This error typically occurs when there is a problem with the database schema,
    # such as a missing table or an invalid SQL statement.
    # If the error message indicates that a table does not exist, an explicit error
    # is logged to help the administrator quickly identify the cause (usually missing migrations).
    # The full traceback is also printed for detailed diagnostics.
    # Regardless of the cause, the API returns a generic "Internal Server Error" message
    # to the client, ensuring that sensitive backend details are not exposed.
    @app.errorhandler(ProgrammingError)
    def handle_programming_error(e):
        if "doesn't exist" in str(e):
            current_app.logger.error("Some of the database tables are missing! Please run `flask db upgrade`!")
            traceback.print_exc()
        return jsonify(error="Internal Server Error!"), 500

    # Handler for SQLAlchemy OperationalError exceptions.
    # This error typically indicates a problem with the database connection or network issues,
    # such as a lost connection, timeout, or inability to establish a new connection.
    # We log the specific database error message for administrator diagnostics and print
    # the full traceback to aid in troubleshooting.
    # The client receives a generic "Internal Server Error" response to prevent exposure
    # of sensitive database infrastructure details.
    @app.errorhandler(OperationalError)
    def handle_operational_error(e):
        current_app.logger.error(f"Database operational error: {e}")
        traceback.print_exc()
        return jsonify(error="Internal Server Error!"), 500

    # Handler for SQLAlchemy IntegrityError exceptions.
    # This error occurs when a database operation violates data integrity constraints,
    # such as unique constraints, foreign key violations, or NOT NULL constraints.
    # While this is typically a client-side data issue, we treat it as a server error
    # in our API responses to avoid exposing database schema details to potential attackers.
    # The specific error is logged at warning level for administrator review,
    # and the full traceback is printed for diagnostics.
    # The client receives a generic "Internal Server Error" response.
    @app.errorhandler(IntegrityError)
    def handle_integrity_error(e):
        current_app.logger.warning(f"Database integrity error: {e}")
        traceback.print_exc()
        return jsonify(error="Internal Server Error!"), 500


    # Handler for CSRF (Cross-Site Request Forgery) errors.
    # Triggered when a request is missing a valid CSRF token or the token is invalid.
    # Returns a generic "Internal Server Error" response to prevent exposure
    # of sensitive details that may be used by attacker to try to exploit the application.
    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return jsonify(error="CSRF Validation Failed!"), 403


    # Handler for HTTP 400 Bad Request errors.
    # Returned when the client sends malformed or invalid data in the request.
    # Responds with a generic "Bad Request!" message and HTTP 400 status.
    @app.errorhandler(400)
    def bad_request_error(e):
        return jsonify(error="Bad Request!"), 400

    # Handler for HTTP 401 Unauthorized errors.
    # Returned when authentication is required and has failed or not been provided.
    # Responds with a generic "Unauthorized!" message and HTTP 401 status.
    @app.errorhandler(401)
    def unauthorized_error(e):
        return jsonify(error="Unauthorized!"), 401

    # Handler for HTTP 403 Forbidden errors.
    # Returned when the client does not have permission to access the requested resource.
    # Responds with a generic "Forbidden!" message and HTTP 403 status.
    @app.errorhandler(403)
    def forbidden_error(e):
        return jsonify(error="Forbidden!"), 403

    # Handler for HTTP 404 Not Found errors.
    # Returned when the requested resource or endpoint does not exist.
    # Responds with a generic "Not Found!" message and HTTP 404 status.
    @app.errorhandler(404)
    def page_not_found_error(e):
        return jsonify(error="Not Found!"), 404

    # Handler for HTTP 405 Method Not Allowed errors.
    # Returned when the client uses an HTTP method that is not supported by the requested resource.
    # For example, sending a POST request to an endpoint that only allows GET.
    # Responds with a generic "Method Not Allowed!" message and HTTP 405 status.
    @app.errorhandler(405)
    def page_not_found_error(e):
        return jsonify(error="Method Not Allowed!"), 405

    # Handler for HTTP 415 Unsupported Media Type errors.
    # Returned when the request has a Content-Type that the server does not support.
    # Responds with a generic "Unsupported Media Type" message and HTTP 415 status.
    @app.errorhandler(415)
    def unsupported_media_type_error(e):
        return jsonify(error="Unsupported Media Type"), 415

    # Handler for HTTP 429 Too Many Requests errors.
    # Triggered when the client exceeds the allowed rate limit for requests.
    # Responds with a clear rate-limit message and HTTP 429 status.
    @app.errorhandler(429)
    def ratelimit_error(e):
        return jsonify(error="Rate-limit exceeded! Try again later."), 429

    # Handler for HTTP 500 Internal Server Error.
    # Returned when an unexpected error occurs on the server side.
    # The full traceback is printed for administrator diagnostics.
    # Responds with a generic "Internal Server Error!" message and HTTP 500 status.
    @app.errorhandler(500)
    def internal_server_error(e):
        traceback.print_exc()
        return jsonify(error="Internal Server Error!"), 500


    # Global handler for all uncaught exceptions.
    # Logs the full exception and traceback for administrator review.
    # Responds with a generic "Internal Server Error!" message and HTTP 500 status.
    @app.errorhandler(Exception)
    def unknown_exception_error(e):
        current_app.logger.exception("Unhandled Exception!")
        return jsonify(error="Internal Server Error!"), 500