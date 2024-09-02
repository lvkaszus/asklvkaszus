from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...models.registered_users import RegisteredUsers

def admin_user_info(identity):
    csrf.protect()

    try:
        user = RegisteredUsers.query.filter_by(username=identity).first()
        
        user_info_json = {
            'username': user.username,
            'last_password_change': user.last_password_change,
            'password_change_count': user.password_change_count,
            'api_admin_enabled': user.api_admin_enabled,
            'api_user_enabled': user.api_user_enabled,
            'api_key': user.api_key,
            'telegram_enabled': user.telegram_enabled,
            'telegram_bot_token': user.telegram_bot_token,
            'telegram_bot_chat_id': user.telegram_bot_chat_id
        }

        return jsonify(user_info_json), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/user_info module: {e}")

        return jsonify(error='An error occurred while fetching user info! Try again later.'), 500

    finally:
        sql.session.close()
