from flask import current_app, request, jsonify, make_response
from ..config import Config
from ..extensions import jwt_blacklist_redis_client
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps

def create_access_token(identity):
    try:
        expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return token

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/jwt_core module - function create_access_token(): {e}")

        return {"error":"An error occurred while generating Access Token!"}

def create_refresh_token(identity):
    try:
        expiry = datetime.now(timezone.utc) + timedelta(days=1)
        
        token = jwt.encode({'identity': identity, 'exp': expiry}, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return token

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/jwt_core module - function create_refresh_token(): {e}")

        return {"error":"An error occurred while generating Refresh Token!"}

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
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/jwt_core module - function verify_token(): {e}")

        return {"error":"An error occurred while verifying token!"}

def revoke_tokens(access_token, refresh_token):
    try:
        token_ttl = 30 * 24 * 60 * 60

        jwt_blacklist_redis_client.setex(access_token, token_ttl, "revoked")
        jwt_blacklist_redis_client.setex(refresh_token, token_ttl, "revoked")
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/jwt_core module - function revoke_tokens(): {e}")

        return {"error":"An error occurred while revoking tokens!"}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            access_token = request.cookies.get('access_token')

            if not access_token:
                return jsonify(error="Access Token is missing!"), 401

            identity, error = verify_token(access_token)

            if error:
                if error == 'Token expired!' and request.path != '/api/app/admin/logout':
                    refresh_token = request.cookies.get('refresh_token')

                    identity, refresh_error = verify_token(refresh_token)
                    if refresh_error:
                        return jsonify(error="Refresh Token expired. Please login again!"), 401

                    new_access_token = create_access_token(identity)

                    response = make_response(f(*args, **kwargs, identity=identity))
                    response.set_cookie('access_token', new_access_token, httponly=True, secure=Config.COOKIES_SECURE, samesite='Strict')
                    return response

                return jsonify(error=error), 401

            return f(*args, **kwargs, identity=identity)

        except Exception as e:
            current_app.logger.error(f"An error occured inside asklvkaszus/modules/jwt_core module - function token_required(): {e}")

            return {"error":"An error occurred while  authenticating with JWT tokens!"}
        
    return decorated
