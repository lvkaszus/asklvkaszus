from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.push_notifications_subscribers import PushNotificationsSubscribers

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

        subscription = PushNotificationsSubscribers(endpoint=endpoint, keys_auth=auth, keys_p256dh=p256dh)
        
        db.session.add(subscription)
        db.session.commit()

        return jsonify(success="Subscribed successfully!"), 201

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/subscribe_to_push_notifications module: {e}")

        return jsonify(error='An error occurred while subscribing to push notifications channel! Try again later.'), 500
            
    finally:
        sql.session.close()
