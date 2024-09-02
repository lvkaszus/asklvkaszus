from flask import current_app, jsonify, g
from ....extensions import sql
from ....models.registered_users import RegisteredUsers

def api_admin_user_info():
    api_key_result = getattr(g, 'api_key_result', {})

    if "error" in api_key_result:
        return jsonify(api_key_result)

    username = api_key_result.get("username", "")

    try:
        if username:
            user = RegisteredUsers.query.filter_by(username=username).first()
        
            user_info_json = {
                'username': user.username,
                'last_password_change': user.last_password_change,
                'password_change_count': user.password_change_count,
                'api_admin_enabled': user.api_admin_enabled,
                'api_key': user.api_key,
                'telegram_enabled': user.telegram_enabled,
                'telegram_bot_token': user.telegram_bot_token,
                'telegram_bot_chat_id': user.telegram_bot_chat_id
            }

            return jsonify(user_info_json)

        else:
            return jsonify(error="No username was provided!"), 400

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/user_info module: {e}")

        return jsonify(error='An error occurred while fetching user info! Try again later.'), 500

    finally:
        sql.session.close()