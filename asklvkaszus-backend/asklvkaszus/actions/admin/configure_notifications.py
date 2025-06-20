from flask import current_app, request, jsonify
from ...extensions import csrf, sql
from ...modules.fields import safe_get
from ...models.registered_users import RegisteredUsers
from ...modules.vapid_core import generate_vapid_keys
from ...models.push_notifications_keys import PushNotificationsKeys
from ...models.push_notifications_subscribers import PushNotificationsSubscribers
import requests
from ...version import backend_version

def admin_configure_notifications(identity):
    csrf.protect()

    data = request.get_json()

    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    user = RegisteredUsers.query.filter_by(username=identity).first()

    if not user:
        return jsonify(error="User not found!"), 404

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
        webpush_enabled = data['webpush_enabled']

        if not isinstance(webpush_enabled, bool):
            return jsonify(error="webpush_enabled must be boolean!"), 400

        if webpush_enabled == False:
            PushNotificationsSubscribers.query.delete()
            
        user.push_enabled = webpush_enabled


    # Telegram

    if 'telegram_enabled' in data:
        telegram_enabled = data['telegram_enabled']

        if not isinstance(telegram_enabled, bool):
            return jsonify(error="telegram_enabled must be boolean!"), 400

        user.telegram_enabled = telegram_enabled



    if 'telegram_bot_token' in data:
        provided_telegram_bot_token = safe_get(data, 'telegram_bot_token', str)

        if data.get('telegram_enabled', user.telegram_enabled) and not provided_telegram_bot_token:
            return jsonify(error="telegram_bot_token cannot be empty!"), 400

        try:
            telegram_bot_api_url = f"https://api.telegram.org/bot{provided_telegram_bot_token}/getMe"
            telegram_bot_api_request_headers = {
                "User-Agent": f"Ask @lvkaszus! - Backend/{backend_version} (https://github.com/lvkaszus/asklvkaszus)",
                "Accept": "application/json"
            }

            telegram_bot_api_response = requests.get(telegram_bot_api_url, headers=telegram_bot_api_request_headers, timeout=10)

            telegram_bot_api_result = telegram_bot_api_response.json()

            if not telegram_bot_api_result.get("ok"):
                return jsonify(error="Invalid Telegram Bot Token!"), 400

        except requests.exceptions.Timeout:
            current_app.logger.error("Request to the Telegram Bot API while validating provided Telegram Bot Token has timed out!")

            return jsonify(error="Failed to verify provided Telegram Bot Token because of Telegram API Timeout Error!"), 504
            
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Failed to verify provided Telegram Bot Token because Telegram API returned an error: {str(e)}")

            return jsonify(error=f"Failed to verify provided Telegram Bot Token because Telegram API returned an error!"), 502

        except Exception as e:
            current_app.logger.error(f"Failed to verify provided Telegram Bot Token because of unknown error: {str(e)}")

            return jsonify(error="Failed to verify provided Telegram Bot Token! Try again later."), 400

        user.telegram_bot_token = provided_telegram_bot_token


    if 'telegram_bot_chat_id' in data:
        provided_telegram_bot_chat_id = safe_get(data, 'telegram_bot_chat_id', str)

        if data.get('telegram_enabled', user.telegram_enabled) and not provided_telegram_bot_chat_id:
            return jsonify(error="telegram_bot_chat_id cannot be empty!"), 400

        try:
            chat_id = int(provided_telegram_bot_chat_id)
        except (ValueError, TypeError):
            return jsonify(error="telegram_bot_chat_id must be a number!"), 400

        if chat_id == 0:
            return jsonify(error="telegram_bot_chat_id cannot be zero!"), 400
        if len(str(abs(chat_id))) > 20:
            return jsonify(error="telegram_bot_chat_id cannot be longer than 20 characters!"), 400

        user.telegram_bot_chat_id = provided_telegram_bot_chat_id


    sql.session.commit()

    return jsonify(success="Notifications Settings have been updated."), 200
