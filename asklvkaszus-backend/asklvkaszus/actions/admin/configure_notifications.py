from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.registered_users import RegisteredUsers
from ...modules.telegram_notify import send_test_telegram_notification

def admin_configure_notifications(identity):
    data = request.get_json()
    
    csrf.protect()

    try:
        user = RegisteredUsers.query.filter_by(username=identity).first()

        toggle_telegram_enabled = False

        if 'telegram_enabled' in data:
            toggle_telegram_enabled = data['telegram_enabled']

        user.telegram_enabled = toggle_telegram_enabled

        if 'telegram_bot_token' in data:
            provided_telegram_bot_token = data['telegram_bot_token']

            if toggle_telegram_enabled and provided_telegram_bot_token == "":
                return jsonify(error="telegram_bot_token cannot be empty!"), 400

            user.telegram_bot_token = provided_telegram_bot_token

        if 'telegram_bot_chat_id' in data:
            provided_telegram_bot_chat_id = data['telegram_bot_chat_id']

            if toggle_telegram_enabled and provided_telegram_bot_chat_id == "":
                return jsonify(error="telegram_bot_chat_id cannot be empty!"), 400

            user.telegram_bot_chat_id = provided_telegram_bot_chat_id

        sql.session.commit()

        if user.telegram_enabled:
            send_test_telegram_notification(user.username)

        return jsonify(success='Notifications Settings have been updated.'), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/configure_notifications module: {e}")

        return jsonify(error='An error occured while updating notifications configuration! Try again later.'), 500

    finally:
        sql.session.close()
        