from flask import current_app
from ..extensions import sql
from ..models.registered_users import RegisteredUsers
from ..models.push_notifications_keys import PushNotificationsKeys
from ..models.push_notifications_subscribers import PushNotificationsSubscribers
from pywebpush import webpush, WebPushException
import json

def send_notification_request(subscription, payload, private_key):
    try:
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
                "sub": current_app.config['SERVER_URL'],
            },
            timeout=10
        )

        return {"subscription_id": subscription.id, "status": "success"}

    except WebPushException as e:
        current_app.logger.error(f"An error occurred inside asklvkaszus/modules/push_notify module - function send_notification_core(): Failed to send notification to Subscription ID {subscription.id}: {e}")
        
        if "410 Gone" in str(e):
            return {"subscription_id": subscription.id, "status": "remove"}
        else:
            return {"subscription_id": subscription.id, "status": "failed", "error": str(e)}

def send_push_notification(question, now, senders_ip_address):
    vapid_key = PushNotificationsKeys.query.first()
    
    if not vapid_key:
        current_app.logger.warning("asklvkaszus/modules/push_notify module - send_push_notification: VAPID Keypair not found!")

    if not vapid_key.public_key or not vapid_key.private_key:
        current_app.logger.warning("asklvkaszus/modules/push_notify module - send_push_notification: VAPID Keypair exists, but one or both keys are missing!")


    subscribers = PushNotificationsSubscribers.query.all()

    if not subscribers:
        current_app.logger.warning("asklvkaszus/modules/push_notify module - send_push_notification: No notification subscribers found!")


    message = f"❓: {question}\n🕒: {now}\n\n🌐️: {senders_ip_address}"

    payload = {
        "title": current_app.config['YOUR_NICKNAME'],
        "body": message
    }


    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for subscriber in subscribers:
            future = executor.submit(send_notification_request, subscriber, payload, vapid_key.private_key)
            futures.append(future)

        results = [future.result() for future in concurrent.futures.as_completed(futures)]


    for result in results:
        if result["status"] == "remove":
            subscription = db.session.get(Subscription, result["subscription_id"])

            if subscription:
                db.session.delete(subscription)
                db.session.commit()

                current_app.logger.warning(f"asklvkaszus/modules/push_notify module - send_push_notification: Subscription ID {result['subscription_id']} has expired and has been removed from the database.")
        elif result["status"] == "failed":
            current_app.logger.error(f"asklvkaszus/modules/push_notify module - send_push_notification: Notification failed for subscription ID {result['subscription_id']}: {result.get('error')}")

    current_app.logger.success(f"asklvkaszus/modules/push_notify module - send_push_notification: Successfully sent Push notifications!")