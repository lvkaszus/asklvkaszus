from ...extensions import csrf
from flask import jsonify
from ...models.registered_users import RegisteredUsers

def admin_user_info(identity):
    csrf.protect()

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
