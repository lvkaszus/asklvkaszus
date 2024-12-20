from flask import current_app
from pywebpush import webpush, WebPushException
import json

def send_notification(subscription, payload, private_key):
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
        current_app.logger.error(f"An error occurred inside asklvkaszus/modules/push_notify module - function send_notification(): Failed to send notification to Subscription ID {subscription.id}: {e}")
        
        if "410 Gone" in str(e):
            return {"subscription_id": subscription.id, "status": "remove"}
        else:
            return {"subscription_id": subscription.id, "status": "failed", "error": str(e)}