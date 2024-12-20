from flask import current_app, jsonify
from ...extensions import csrf, sql
from ...models.push_notifications_keys import PushNotificationsKeys
from ...modules.vapid_core import check_vapid_keys

def admin_fetch_vapid_public_key(identity):
    csrf.protect()

    try:
        vapid_keys_entry = PushNotificationsKeys.query.first()

        if not vapid_keys_entry:
            check_result = check_vapid_keys()
            if "success" not in check_result:
                return jsonify(check_result), 500

            vapid_keys_entry = PushNotificationsKeys.query.first()

        if not vapid_keys_entry.enabled:
            return jsonify(message="Push Notifications are turned off."), 200

        if not vapid_keys_entry.public_key or not vapid_keys_entry.private_key:
            return jsonify(error="VAPID Keys are incomplete! Public or private key is missing."), 500

        return jsonify(public_key=vapid_keys_entry.public_key), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/fetch_vapid_public_key module: {e}")

        return jsonify(error='An unexpected error occurred while fetching VAPID public key.'), 500
        
    finally:
        sql.session.close()