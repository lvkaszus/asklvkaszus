from flask import current_app, request, jsonify, g
from ....extensions import sql
from ....models.registered_users import RegisteredUsers

def api_admin_configure_notifications():
    api_key_result = getattr(g, 'api_key_result', {})

    if "error" in api_key_result:
        return jsonify(api_key_result)

    username = api_key_result.get("username", "")

    data = request.get_json()
    
    try:
        user = RegisteredUsers.query.filter_by(username=username).first()

        if 'telegram_enabled' in data:
            toggle_telegram_enabled = data['telegram_enabled']

            if toggle_telegram_enabled == "":
                return jsonify(error="telegram_enabled cannot be empty!"), 400

            user.telegram_enabled = toggle_telegram_enabled

        if 'telegram_bot_token' in data:
            provided_telegram_bot_token = data['telegram_bot_token']

            if provided_telegram_bot_token == "":
                return jsonify(error="telegram_bot_token cannot be empty!"), 400

            user.telegram_bot_token = provided_telegram_bot_token

        if 'telegram_bot_chat_id' in data:
            provided_telegram_bot_chat_id = data['telegram_bot_chat_id']

            if provided_telegram_bot_chat_id == "":
                return jsonify(error="telegram_bot_chat_id cannot be empty!"), 400

            user.telegram_bot_chat_id = provided_telegram_bot_chat_id

        sql.session.commit()

        return jsonify(success='Notifications settings have been updated.')

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/configure_notifications module: {e}")

        return jsonify(error='An error occured while updating notifications configuration! Try again later.'), 500

    finally:
        sql.session.close()
        