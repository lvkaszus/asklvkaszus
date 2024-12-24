from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from datetime import datetime
from ...models.push_notifications_subscribers import PushNotificationsSubscribers
import traceback

def admin_subscribe_to_push_notifications(identity):
    data = request.get_json()
    endpoint = data.get('endpoint')
    keys = data.get('keys', {})
    auth = keys.get('auth')
    p256dh = keys.get('p256dh')

    csrf.protect()

    try:
        if not endpoint or not auth or not p256dh:
            return jsonify(error="Invalid subscription data!"), 400

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        existing_subscription = sql.session.query(PushNotificationsSubscribers).filter(
            (PushNotificationsSubscribers.endpoint == endpoint) |
            (PushNotificationsSubscribers.keys_auth == auth) |
            (PushNotificationsSubscribers.keys_p256dh == p256dh)
        ).first()

        if existing_subscription:
            existing_subscription.subscribed_date = now
            message = "Subscription updated successfully!"
        else:
            new_subscription = PushNotificationsSubscribers(
                endpoint=endpoint,
                keys_auth=auth,
                keys_p256dh=p256dh,
                subscribed_date=now
            )
            sql.session.add(new_subscription)
            message = "Subscribed successfully!"

        subscribers_count = sql.session.query(PushNotificationsSubscribers).count()

        if subscribers_count > 25:
            oldest_subscriber = sql.session.query(PushNotificationsSubscribers).order_by(PushNotificationsSubscribers.subscribed_date.asc()).first()
            if oldest_subscriber:
                sql.session.delete(oldest_subscriber)

        sql.session.commit()

        return jsonify(success=message), 200

    except Exception as e:
        current_app.logger.error(f"An error occurred inside asklvkaszus/actions/admin/subscribe_to_push_notifications module: {e}")
        traceback.print_exc()

        return jsonify(error='An error occurred while subscribing to push notifications channel! Try again later.'), 500

    finally:
        sql.session.close()
