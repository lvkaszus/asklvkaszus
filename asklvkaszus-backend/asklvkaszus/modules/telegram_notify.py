from flask import current_app
import requests
from ..extensions import sql
from ..models.registered_users import RegisteredUsers
import threading
import traceback

def send_telegram_request_thread(app, telegram_api_url, telegram_url_params):
    with app.app_context():
        try:
            telegram_api_response = requests.get(telegram_api_url, params=telegram_url_params)
            telegram_api_response_data = telegram_api_response.json()

            if telegram_api_response_data['ok']:
                current_app.logger.info("asklvkaszus/modules/telegram_notify module - send_telegram_request_thread: Successfully sent Telegram notification!")
            
            else:
                current_app.logger.error("asklvkaszus/modules/telegram_notify module - send_telegram_request_thread: Failed to send Telegram notification!")
        
        except Exception as e:
            current_app.logger.error(f"An error occured inside asklvkaszus/modules/telegram_notify module - send_telegram_request_thread: {e}")
            traceback.print_exc()

            return {'error':'An error occurred while sending Telegram notification!'}
        finally:
            sql.session.close()

def send_test_telegram_notification(recipient):
    try:
        app = current_app._get_current_object()

        if not recipient:
            current_app.logger.error("asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient is missing!")
            return

        user = RegisteredUsers.query.filter_by(username=recipient).first()

        if not user:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient {recipient} not found!")
            return

        if not user.telegram_enabled:
            current_app.logger.warning(f"asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: Recipient {recipient} has Telegram notifications disabled!")
            return

        test_message = "✅️!"

        telegram_api_url = f"https://api.telegram.org/bot{user.telegram_bot_token}/sendMessage"
        telegram_api_params = {
            'chat_id': user.telegram_bot_chat_id,
            'text': message
        }

        thread = threading.Thread(target=send_telegram_request_thread, args=(app, telegram_api_url, telegram_api_params), daemon=True)
        thread.start()

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/telegram_notify module - send_test_telegram_notification: {e}")
        traceback.print_exc()

        return {'error':'An error occurred while sending test Telegram notification!'}
    finally:
        sql.session.close()


def send_telegram_notification(recipient, question, date, ip_address):
    try:
        app = current_app._get_current_object()

        if not recipient:
            current_app.logger.error("asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient is missing!")
            return

        user = RegisteredUsers.query.filter_by(username=recipient).first()

        if not user:
            current_app.logger.error(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient {recipient} not found!")
            return

        if not user.telegram_enabled:
            current_app.logger.warning(f"asklvkaszus/modules/telegram_notify module - send_telegram_notification: Recipient {recipient} has Telegram notifications disabled!")
            return

        message_lines = [
            f"❓: {question}",
            f"🕒: {date}",
            "",
            f"🌐️: {ip_address}"
        ]

        message = '\n'.join(message_lines)
        telegram_api_url = f"https://api.telegram.org/bot{user.telegram_bot_token}/sendMessage"
        telegram_api_params = {
            'chat_id': user.telegram_bot_chat_id,
            'text': message,
            'parse_mode': 'Markdown'
        }

        thread = threading.Thread(target=send_telegram_request_thread, args=(app, telegram_api_url, telegram_api_params), daemon=True)
        thread.start()

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/telegram_notify module - send_telegram_notification: {e}")
        traceback.print_exc()

        return {'error':'An error occurred while sending Telegram notification!'}
    finally:
        sql.session.close()
