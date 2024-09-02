from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.blocked_senders import BlockedSenders

def admin_unblock_sender(identity):
    data = request.get_json()
    sender_ip = data.get('sender_ip')

    csrf.protect()

    try:
        if not sender_ip:
            return jsonify(error="Sender IP Address cannot be empty!"), 400
            
        blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

        if blocked_sender:
            sql.session.delete(blocked_sender)
            sql.session.commit()

            return jsonify(success=f"Sender with IP Address {sender_ip} unbanned successfully!"), 200

        else:
            return jsonify(error=f"Sender with IP Address {sender_ip} not found!"), 404

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/unblock_sender module: {e}")

        return jsonify(error='An error occurred while unbanning sender! Try again later.'), 500

    finally:
        sql.session.close()
