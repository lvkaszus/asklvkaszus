from flask import current_app, request, jsonify
from ...extensions import csrf, sql
from ...models.registered_users import RegisteredUsers
from ...models.push_notifications_keys import PushNotificationsKeys
from ...models.push_notifications_subscribers import PushNotificationsSubscribers
from ...modules.telegram_notify import send_test_telegram_notification
from ...modules.vapid_core import check_vapid_keys

def admin_configure_notifications(identity):
    data = request.get_json()

    csrf.protect()

    try:
        user = RegisteredUsers.query.filter_by(username=identity).first()

        vapid_entry = PushNotificationsKeys.query.first()

        if not vapid_entry:
            vapid_entry = PushNotificationsKeys()
            sql.session.add(vapid_entry)

        if not vapid_entry.public_key or not vapid_entry.private_key:
            result = generate_vapid_keys()
            if "error" in result:
                return jsonify(error=result["error"]), 500

            private_key, public_key = result
            vapid_entry.public_key = public_key
            vapid_entry.private_key = private_key

            PushNotificationsSubscribers.query.delete()

        sql.session.commit()

        # Web Push Notifications

        toggle_webpush_enabled = False

        if 'webpush_enabled' in data:
            toggle_webpush_enabled = data['webpush_enabled']

        user.push_enabled = toggle_webpush_enabled

        # Telegram

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

        if user.telegram_enabled:
            send_test_telegram_notification(user.username)

        sql.session.commit()

        return jsonify(success="Notifications Settings have been updated."), 200

    except Exception as e:
        current_app.logger.error(
            f"An error occurred in 'admin_configure_notifications': {type(e).__name__} - {e}"
        )
        return jsonify(error="An error occurred while updating notifications configuration! Try again later."), 500

    finally:
        sql.session.close()
