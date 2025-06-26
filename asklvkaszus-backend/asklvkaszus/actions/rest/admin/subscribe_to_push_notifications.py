from ....extensions import sql
from flask import current_app, request, g
from ....modules.response_handler import jsonify_on_steroids
from datetime import datetime, timezone
from ....models.push_notifications_subscribers import PushNotificationsSubscribers

def api_admin_subscribe_to_push_notifications():
    api_key_result = getattr(g, 'api_key_result', {})

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if "error" in api_key_result:
        return jsonify_on_steroids(api_key_result, headers=response_headers), 400

    username = api_key_result.get("username", "")

    if not username:
        return jsonify_on_steroids(error="Invalid session username!", headers=response_headers), 400

    data = request.get_json()

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    endpoint = data.get('endpoint')
    keys = data.get('keys', {})
    auth = keys.get('auth')
    p256dh = keys.get('p256dh')

    if not (isinstance(endpoint, str) and 0 < len(endpoint) <= 300):
        return jsonify_on_steroids(error="Invalid endpoint!", headers=response_headers), 400

    if not (isinstance(auth, str) and 0 < len(auth) <= 150):
        return jsonify_on_steroids(error="Invalid auth key!", headers=response_headers), 400
    
    if not (isinstance(p256dh, str) and 0 < len(p256dh) <= 150):
        return jsonify_on_steroids(error="Invalid p256dh key!", headers=response_headers), 400

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

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

    current_app.logger.info(f"User {identity} subscribed to push notifications: {endpoint}")

    return jsonify_on_steroids(success=message, headers=response_headers), 200
