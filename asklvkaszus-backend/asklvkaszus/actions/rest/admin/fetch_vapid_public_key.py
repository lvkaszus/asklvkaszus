from ....modules.response_handler import jsonify_on_steroids
from ....models.push_notifications_keys import PushNotificationsKeys
from ....modules.vapid_core import check_vapid_keys

def api_admin_fetch_vapid_public_key():
    vapid_keys_entry = PushNotificationsKeys.query.first()

    error_response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if not vapid_keys_entry:
        check_result = check_vapid_keys()
        if "success" not in check_result:
            return jsonify_on_steroids(check_result, headers=error_response_headers), 500

        vapid_keys_entry = PushNotificationsKeys.query.first()

    if not vapid_keys_entry.public_key or not vapid_keys_entry.private_key:
        return jsonify_on_steroids(error="VAPID Keys are incomplete! Public or private key is missing.", headers=error_response_headers), 500

    success_response_headers = {
        "Cache-Control": "public, max-age=86400, must-revalidate"
    }

    return jsonify_on_steroids(public_key=vapid_keys_entry.public_key, headers=success_response_headers), 200
