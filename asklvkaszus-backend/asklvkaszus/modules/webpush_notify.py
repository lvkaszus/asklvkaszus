from flask import current_app
from ..extensions import sql
from ..models.registered_users import RegisteredUsers
from ..models.push_notifications_keys import PushNotificationsKeys
from ..models.push_notifications_subscribers import PushNotificationsSubscribers
from pywebpush import webpush, WebPushException
import json
import threading
import traceback

def send_notification_request_thread(subscription, payload, private_key):
    try:
        server_url = current_app.config['SERVER_URL']
    
        webpush(
            subscription_info={
                "endpoint": subscription.endpoint,
                "keys": {
                    "p256dh": subscription.keys_p256dh,
                    "auth": subscription.keys_auth,
                },
            },
            data=json.dumps(payload),
            vapid_private_key=private_key,
            vapid_claims={
                "sub": server_url,
            },
            timeout=10
        )

        return {"subscription_id": subscription.id, "status": "success"}

    except WebPushException as e:
        current_app.logger.error(f"asklvkaszus/modules/webpush_notify module - send_notification_request_thread: Failed to send notification to Subscription ID {subscription.id}: {e}")

        if "410 Gone" in str(e):
            return {"subscription_id": subscription.id, "status": "remove"}
        
        return {"subscription_id": subscription.id, "status": "failed", "error": str(e)}

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/webpush_notify module - send_notification_request_thread: {e}")
        traceback.print_exc()

        return {'error': 'An error occurred while sending Push notification!'}

def send_notifications_sequentially(subscribers, payload, private_key):
    try:
        results = []

        for subscriber in subscribers:
            result = send_notification_request_thread(subscriber, payload, private_key)
            results.append(result)

        return results
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/webpush_notify module - send_notifications_sequentially: {e}")
        traceback.print_exc()

        return {'error': 'An error occurred while sending Push notification!'}

def handle_results(results):
    try:
        for result in results:
            if result["status"] == "remove":
                subscription = sql.session.get(PushNotificationsSubscribers, result["subscription_id"])

                if subscription:
                    sql.session.delete(subscription)
                    sql.session.commit()
                    
                    current_app.logger.warning(f"asklvkaszus/modules/webpush_notify module - handle_results: Subscription ID {result['subscription_id']} has expired and has been removed from the database.")
            
            elif result["status"] == "failed":
                current_app.logger.error(f"asklvkaszus/modules/webpush_notify module - handle_results: Notification failed for subscription ID {result['subscription_id']}: {result.get('error')}")
        
        current_app.logger.info("asklvkaszus/modules/webpush_notify module - handle_results: Successfully sent Push notifications!")
    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/webpush_notify module - handle_results: {e}")
        traceback.print_exc()

        return {'error': 'An error occurred while sending Push notification!'}

def send_push_notification(recipient, question, now, senders_ip_address):
    try:
        vapid_key = PushNotificationsKeys.query.first()
        
        if not vapid_key:
            current_app.logger.warning("asklvkaszus/modules/webpush_notify module - send_push_notification: VAPID Keypair not found!")
            return

        if not recipient:
            current_app.logger.error("asklvkaszus/modules/webpush_notify module - send_push_notification: Recipient is missing!")
            return

        user = RegisteredUsers.query.filter_by(username=recipient).first()

        if not user:
            current_app.logger.error(f"asklvkaszus/modules/webpush_notify module - send_push_notification: Recipient {recipient} not found!")
            return

        if not user.push_enabled:
            current_app.logger.warning(f"asklvkaszus/modules/telegram_notify module - send_push_notification: Recipient {recipient} has Push notifications disabled!")
            return

        subscribers = PushNotificationsSubscribers.query.all()
        
        if not subscribers:
            current_app.logger.warning("asklvkaszus/modules/webpush_notify module - send_push_notification: No notification subscribers found!")

        message = f"❓: {question}\n🕒: {now}\n\n🌐️: {senders_ip_address}"
        payload = {
            "title": f"Ask {current_app.config['YOUR_NICKNAME']}!",
            "body": message
        }

        app = current_app._get_current_object()

        def task(app, subscribers, payload, private_key):
            with app.app_context():
                results = send_notifications_sequentially(subscribers, payload, private_key)
                handle_results(results)

        thread = threading.Thread(target=task, args=(app, subscribers, payload, vapid_key.private_key), daemon=True)
        thread.start()

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/modules/webpush_notify module - send_push_notification: {e}")
        traceback.print_exc()

        return {'error': 'An error occurred while sending Push notification!'}
