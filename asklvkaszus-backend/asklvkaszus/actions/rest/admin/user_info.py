from flask import g
from ....modules.response_handler import jsonify_on_steroids
from ....models.registered_users import RegisteredUsers

def api_admin_user_info():
    api_key_result = getattr(g, 'api_key_result', {})

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if "error" in api_key_result:
        return jsonify_on_steroids(api_key_result, headers=response_headers), 400

    username = api_key_result.get("username", "")

    if not username:
        return jsonify_on_steroids(error="Invalid session username!", headers=response_headers), 400

    user = RegisteredUsers.query.filter_by(username=identity).first()
    
    if not user:
        return jsonify_on_steroids(error="User not found!", headers=response_headers), 404

    user_info_json = {
        'username': user.username,
        'last_password_change': user.last_password_change,
        'password_change_count': user.password_change_count,
        'api_admin_enabled': user.api_admin_enabled,
        'api_user_enabled': user.api_user_enabled,
        'api_key': user.api_key,
        'push_notifications_enabled': user.push_enabled,
        'telegram_enabled': user.telegram_enabled,
        'telegram_bot_token': user.telegram_bot_token,
        'telegram_bot_chat_id': user.telegram_bot_chat_id
    }

    return jsonify_on_steroids(user_info_json, headers=response_headers), 200
