from flask import current_app, request, jsonify, g
from functools import wraps
from ..extensions import sql
from ..models.app_settings import AppSettings
from ..models.registered_users import RegisteredUsers
import uuid


def regenerate_api_key(username):
    try:
        app_settings = AppSettings.query.get(1)
        user = RegisteredUsers.query.filter_by(username=username).first()


        if not app_settings.global_api_enabled:
            return {"error":"Cannot regenerate API Key while Global API is disabled!"}

        if not user.api_admin_enabled:
            return {"error":"Cannot regenerate API Key while your Admin API is disabled!"}
        
        new_api_key = str(uuid.uuid4())

        existing_user_with_this_api_key = RegisteredUsers.query.filter_by(api_key=new_api_key).first()
        while existing_user_with_this_api_key:
            new_api_key = str(uuid.uuid4())
            existing_user_with_this_api_key = RegisteredUsers.query.filter_by(api_key=new_api_key).first()

        user.api_key = new_api_key
        sql.session.commit()

        return {"generated_api_key": new_api_key}

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/functions/rest_core module - function regenerate_api_key(): {e}")

        return {"error":"An error occured while regenerating Admin API Key!"}
    finally:
        sql.session.close()


def toggle_admin_api(username):
    try:
        app_settings = AppSettings.query.get(1)

        if not app_settings.global_api_enabled:
            return {"error":"Cannot toggle Admin API while Global API is disabled!"}

        user = RegisteredUsers.query.filter_by(username=username).first()

        if user.api_admin_enabled:
            user.api_admin_enabled = False
            user.api_key = None

            response_message = {"success": f"Admin API Access for user {username} has been disabled!"}

        else:
            user.api_admin_enabled = True
            user_regenerated_api_key = regenerate_api_key(username)

            if "error" in user_regenerated_api_key:
                return {user_regenerated_api_key}

            response_message = {"success": f"Admin API Access for user {username} has been enabled!"}

        sql.session.commit()
        return response_message

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/functions/rest_core module - function toggle_admin_api(): {e}")

        return {"error":"An error occurred while changing Admin API state! Try again later."}

    finally:
        sql.session.close()


def toggle_user_api(username):
    try:
        app_settings = AppSettings.query.get(1)

        if not app_settings.global_api_enabled:
            return {"error":"Cannot toggle User API while Global API is disabled!"}

        user = RegisteredUsers.query.filter_by(username=username).first()

        if user.api_user_enabled:
            user.api_user_enabled = False

            response_message = {"success": f"User API Access has been disabled!"}

        else:
            user.api_user_enabled = True

            response_message = {"success": f"User API Access has been enabled!"}

        sql.session.commit()
        return response_message

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/functions/rest_core module - function toggle_user_api(): {e}")

        return {"error":"An error occurred while changing User API state! Try again later."}

    finally:
        sql.session.close()


def verify_api_key(api_key):
    try:
        app_settings = AppSettings.query.get(1)
        admin_api_user = RegisteredUsers.query.filter_by(api_admin_enabled=True).first()
        user = RegisteredUsers.query.filter_by(api_key=api_key).first()


        if not app_settings.global_api_enabled:
            return {"error":"REST API Endpoints have been turned off by administrator."}

        if not admin_api_user:
            return {"error":"Admin API Endpoints have been turned off by administrator."}

        if user and user.username:
            return {"username": user.username}

        return {"error":"Incorrect Admin API Key!"}

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/functions/rest_core module - function verify_api_key(): {e}")

        return {"error":"An error occured while verifying Admin API Key!"}
    finally:
        sql.session.close()



def require_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify(error="Admin API Key is missing!"), 400

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != 'Ask-lvkaszus-API-Key:':
            return jsonify(error="Incorrect Admin API Key Format!"), 400

        api_key = parts[1]

        verify_api_key_result = verify_api_key(api_key)
        if "error" in verify_api_key_result:
            return jsonify(verify_api_key_result), 403
        
        g.api_key_result = verify_api_key_result

        return func(*args, **kwargs)

    return wrapper


def require_user_api_enabled(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        app_settings = AppSettings.query.get(1)
        user_api_user = RegisteredUsers.query.filter_by(api_user_enabled=True).first()

        if not app_settings.global_api_enabled:
            return jsonify(error="REST API Endpoints have been turned off by administrator."), 403

        if not user_api_user:
            return jsonify(error="User API Endpoints have been turned off by administrator."), 403

        return func(*args, **kwargs)

    return wrapper