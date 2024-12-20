from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...models.notifications_vapid_keys import NotificationsVapidKeys

def admin_fetch_vapid_public_key(identity):
    csrf.protect()

    try:
        keys = NotificationsVapidKeys.query.first()
        
        if keys:
            return jsonify(public_key=keys.public_key), 200

        return jsonify(error="VAPID Keys cannot be found!"), 404

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/admin_fetch_vapid_public_key module: {e}")

        return jsonify(error='An error occurred while fetching VAPID public key! Try again later.'), 500
            
    finally:
        sql.session.close()
