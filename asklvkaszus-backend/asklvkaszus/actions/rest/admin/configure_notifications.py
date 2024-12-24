from flask import current_app, request, jsonify, g
from ....extensions import sql
from ....models.registered_users import RegisteredUsers
from ....modules.vapid_core import generate_vapid_keys
from ....models.push_notifications_keys import PushNotificationsKeys
from ....models.push_notifications_subscribers import PushNotificationsSubscribers
import traceback

def api_admin_configure_notifications():
    api_key_result = getattr(g, 'api_key_result', {})

    if "error" in api_key_result:
        return jsonify(api_key_result)

    username = api_key_result.get("username", "")

    data = request.get_json()
    
    try:
        user = RegisteredUsers.query.filter_by(username=username).first()

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

        # Web Push Notifications

        if 'webpush_enabled' in data:
            if data['webpush_enabled'] == False:
                PushNotificationsSubscribers.query.delete()
                
            user.push_enabled = data['webpush_enabled']

        # Telegram

        if 'telegram_enabled' in data:
            user.telegram_enabled = data['telegram_enabled']

        if 'telegram_bot_token' in data:
            provided_telegram_bot_token = data['telegram_bot_token']

            if data.get('telegram_enabled', user.telegram_enabled) and not provided_telegram_bot_token:
                return jsonify(error="telegram_bot_token cannot be empty!"), 400

            user.telegram_bot_token = provided_telegram_bot_token

        if 'telegram_bot_chat_id' in data:
            provided_telegram_bot_chat_id = data['telegram_bot_chat_id']

            if data.get('telegram_enabled', user.telegram_enabled) and not provided_telegram_bot_chat_id:
                return jsonify(error="telegram_bot_chat_id cannot be empty!"), 400

            user.telegram_bot_chat_id = provided_telegram_bot_chat_id

        sql.session.commit()

        return jsonify(success="Notifications Settings have been updated.")

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/configure_notifications module: {e}")
        traceback.print_exc()

        return jsonify(error='An error occured while updating notifications configuration! Try again later.'), 500

    finally:
        sql.session.close()
        