from flask import current_app
import requests
from ..extensions import sql
from ..models.registered_users import RegisteredUsers

def send_test_telegram_notification(recipient):
    try:
        if not recipient:
            current_app.logger.error("asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient is missing!")

        user = RegisteredUsers.query.filter_by(username=recipient).first()

        if not user:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient {recipient} not found!")

        if user.telegram_enabled == False:
            current_app.logger.warning(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient {recipient} has Telegram notifications disabled!")


        test_message = "✅️!"

        telegram_api_url = f"https://api.telegram.org/bot{user.telegram_bot_token}/sendMessage"
        telegram_api_params = {'chat_id': user.telegram_bot_chat_id, 'text': test_message}

        telegram_api_response = requests.get(telegram_api_url, params=telegram_api_params)
        telegram_api_response_data = telegram_api_response.json()

        if telegram_api_response_data['ok']:
            current_app.logger.info(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Successfully sent test Telegram notification for user {recipient}!")
        else:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Failed to send test Telegram notification for user {recipient}!")

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: {e}")

        return {'error':'An error occurred while sending test Telegram notification!'}
    finally:
        sql.session.close()


def send_telegram_notification(recipient, question, date, ip_address):
    try:
        if not recipient:
            current_app.logger.error("asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient is missing!")

        user = RegisteredUsers.query.filter_by(username=recipient).first()

        if not user:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient {recipient} not found!")

        if user.telegram_enabled == False:
            current_app.logger.warning(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient {recipient} has Telegram notifications disabled!")


        message_lines = [
            f"❓: {question}",
            f"🕒: {date}",
            "",
            f"🌐️: {ip_address}"
        ]

        message = '\n'.join(message_lines)
        telegram_api_url = f"https://api.telegram.org/bot{user.telegram_bot_token}/sendMessage"
        telegram_api_params = {'chat_id': user.telegram_bot_chat_id, 'text': message, 'parse_mode': 'Markdown'}

        telegram_api_response = requests.get(telegram_api_url, params=telegram_api_params)
        telegram_api_response_data = telegram_api_response.json()

        if telegram_api_response_data['ok']:
            current_app.logger.info(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Successfully sent Telegram notification for user {recipient}!")
        else:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Failed to send Telegram notification for user {recipient}!")

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/telegram_notify module - send_telegram_notification: {e}")

        return {'error':'An error occurred while sending Telegram notification!'}
    finally:
        sql.session.close()
