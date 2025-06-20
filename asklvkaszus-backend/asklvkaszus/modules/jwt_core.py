from flask import current_app, request, jsonify, make_response
from ..config import Config
from ..extensions import jwt_blacklist_redis_client
from ..models.registered_users import RegisteredUsers
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps

# Ask @lvkaszus! - JWT Core for Auth System:
# - Creating access and refresh tokens
# - Verifying and revoking tokens
# - Providing a decorator for protecting API endpoints

def create_access_token(identity):
    # Generate the expiration time for the access token (15 minutes from now, in UTC).
    expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    # Encode a JWT with the user's identity and expiration time,
    # using the application's JWT secret key and the HS256 algorithm.
    token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    # Return the generated access token as a string.
    return token


def create_refresh_token(identity):
    # Generate the expiration time for the refresh token (1 day from now, in UTC).
    expiry = datetime.now(timezone.utc) + timedelta(days=1)
    
    # Encode a JWT with the user's identity and expiration time,
    # using the application's JWT secret key and the HS256 algorithm.
    token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    return token


def verify_token(token):
    try:
        # Attempt to decode the JWT using the application's secret key and HS256 algorithm.
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])

        # Check if the token is present in the blacklist (Redis).
        # If so, treat it as revoked and return an error.
        if jwt_blacklist_redis_client.exists(token):
            return None, 'Token revoked!'
        
        # If the token is valid and not revoked, return the user's identity.
        return payload['identity'], None
    
    except jwt.ExpiredSignatureError:
        # If the token has expired, return an appropriate error message.
        return None, 'Token expired!'
    
    except jwt.InvalidTokenError:
        # If the token is invalid (tampered, malformed, etc.), return an error message.
        return None, 'Invalid Token!'


def revoke_tokens(access_token, refresh_token):
    # Set the time-to-live (TTL) for revoked tokens in the blacklist (30 days).
    token_ttl = 30 * 24 * 60 * 60

    # Store the access token in the blacklist with the specified TTL.
    jwt_blacklist_redis_client.setex(access_token, token_ttl, "revoked")
    # Store the refresh token in the blacklist with the specified TTL.
    jwt_blacklist_redis_client.setex(refresh_token, token_ttl, "revoked")


def token_required(f):
    # Decorator for protecting application endpoints with JWT authentication.
    # Ensures that the request contains a valid (not expired, not revoked) access token.
    @wraps(f)
    def decorated(*args, **kwargs):
        # Retrieve the access token from the request's cookies.
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        # If the access token is missing, return an error with HTTP 401 (Unauthorized).
        if not access_token:
            return jsonify(error="Access Token is missing!"), 401

        # Verify the access token's validity and revocation status.
        identity, error = verify_token(access_token)

        if error:
            # If the access token has expired and the endpoint is not logout,
            # try to use the refresh token to issue a new access token.
            if error == 'Token expired!' and request.path != '/api/app/admin/logout':
                identity, refresh_error = verify_token(refresh_token)
                if refresh_error:
                    # If the refresh token is also invalid or expired, require re-login.
                    return jsonify(error="Refresh Token expired. Please login again!"), 401

                # Issue a new access token and set it in the response cookies.
                new_access_token = create_access_token(identity)

                # Prepare the response by executing the protected endpoint with the refreshed identity.
                response = make_response(f(*args, **kwargs, identity=identity))

                # Set the refresh token as an HttpOnly, SameSite and Secure cookie (if enabled
                # in the application configuration file (config.yml: cookies_secure)).
                response.set_cookie('access_token', new_access_token, httponly=True, secure=Config.COOKIES_SECURE, samesite='Strict')

                # Return the prepared response to the client.
                return response

            # For other token errors, return an error with HTTP 401 status code (Unauthorized).
            return jsonify(error=error), 401

        # Verify if the user exists with identity (username) from JWT access token
        user = RegisteredUsers.query.filter_by(username=identity).first()
        if not user:
            # Log a warning that the user from the JWT access token does not exist in the database.
            current_app.logger.warning("User with username %s from JWT access token does not exist in the database! Deauthenticating...", identity)

            # Revoke both access and refresh JWT tokens to prevent further use.
            revoke_tokens(access_token, refresh_token)

            # Prepare a JSON response indicating the user does not exist and has been logged out.
            response = jsonify(error="User with this username does not exist! You have been logged out.")
            response.status_code = 401

            # Clear the authentication cookies by setting empty values and immediate expiration.
            response.set_cookie('access_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
            response.set_cookie('refresh_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

            # Log that the user has been deauthenticated.
            current_app.logger.warning("User with username %s has been deauthenticated!", identity)

            # Return the prepared response to the client.
            return response

        # If the access token is valid, proceed to the protected endpoint,
        # passing the user's identity as a keyword argument.
        return f(*args, **kwargs, identity=identity)

    # Return the decorated function defined above, which enforces JWT authentication and mandatory checks
    # before allowing access to the protected endpoint.
    return decorated
