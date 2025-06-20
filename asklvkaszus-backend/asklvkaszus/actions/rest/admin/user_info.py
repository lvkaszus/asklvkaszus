from flask import jsonify, g
from ....models.registered_users import RegisteredUsers

def api_admin_user_info():
    api_key_result = getattr(g, 'api_key_result', {})

    if "error" in api_key_result:
        return jsonify(api_key_result)

    username = api_key_result.get("username", "")

    if not username:
        return jsonify(error="Invalid session username!"), 400

    user = RegisteredUsers.query.filter_by(username=identity).first()
    
    if not user:
        return jsonify(error="User not found!"), 404

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

    return jsonify(user_info_json), 200
