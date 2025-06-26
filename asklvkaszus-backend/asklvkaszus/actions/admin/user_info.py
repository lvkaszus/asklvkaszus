from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids
from ...models.registered_users import RegisteredUsers

def admin_user_info(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

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
