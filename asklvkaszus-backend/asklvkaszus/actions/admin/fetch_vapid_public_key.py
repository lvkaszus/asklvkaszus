from flask import jsonify
from ...models.push_notifications_keys import PushNotificationsKeys
from ...modules.vapid_core import check_vapid_keys

def admin_fetch_vapid_public_key():
    vapid_keys_entry = PushNotificationsKeys.query.first()

    if not vapid_keys_entry:
        check_result = check_vapid_keys()
        if "success" not in check_result:
            return jsonify(check_result), 500

        vapid_keys_entry = PushNotificationsKeys.query.first()

    if not vapid_keys_entry.public_key or not vapid_keys_entry.private_key:
        return jsonify(error="VAPID Keys are incomplete! Public or private key is missing."), 500

    return jsonify(public_key=vapid_keys_entry.public_key), 200
