from flask import current_app, request, jsonify, make_response
from ..config import Config
from ..extensions import jwt_blacklist_redis_client
from ..models.registered_users import RegisteredUsers
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps

def create_access_token(identity):
    expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    return token


def create_refresh_token(identity):
    expiry = datetime.now(timezone.utc) + timedelta(days=1)
    
    token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    return token


def verify_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])

        if jwt_blacklist_redis_client.exists(token):
            return None, 'Token revoked!'
        
        return payload['identity'], None
    
    except jwt.ExpiredSignatureError:
        return None, 'Token expired!'
    
    except jwt.InvalidTokenError:
        return None, 'Invalid Token!'


def revoke_tokens(access_token, refresh_token):
    token_ttl = 30 * 24 * 60 * 60

    jwt_blacklist_redis_client.setex(access_token, token_ttl, "revoked")
    jwt_blacklist_redis_client.setex(refresh_token, token_ttl, "revoked")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        if not access_token:
            return jsonify(error="Access Token is missing!"), 401

        identity, error = verify_token(access_token)

        if error:
            if error == 'Token expired!' and request.path != '/api/app/admin/logout':
                identity, refresh_error = verify_token(refresh_token)
                if refresh_error:
                    return jsonify(error="Refresh Token expired. Please login again!"), 401

                new_access_token = create_access_token(identity)

                response = make_response(f(*args, **kwargs, identity=identity))

                response.set_cookie('access_token', new_access_token, httponly=True, secure=Config.COOKIES_SECURE, samesite='Strict')

                return response

            return jsonify(error=error), 401

        user = RegisteredUsers.query.filter_by(username=identity).first()
        if not user:
            current_app.logger.warning("User with username %s from JWT access token does not exist in the database! Deauthenticating...", identity)

            revoke_tokens(access_token, refresh_token)

            response = jsonify(error="User with this username does not exist! You have been logged out.")
            response.status_code = 401

            response.set_cookie('access_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)
            response.set_cookie('refresh_token', '', expires=0, httponly=True, samesite='Strict', secure=Config.COOKIES_SECURE)

            current_app.logger.warning("User with username %s has been deauthenticated!", identity)

            return response

        return f(*args, **kwargs, identity=identity)

    return decorated
