from flask import current_app, request, jsonify
from ....extensions import sql
from ....models.blocked_senders import BlockedSenders

def api_admin_unblock_sender():
    data = request.get_json()
    sender_ip = data.get('sender_ip')

    try:
        if not sender_ip:
            return jsonify(error="Sender IP Address cannot be empty!"), 400
            
        blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

        if blocked_sender:
            sql.session.delete(blocked_sender)
            sql.session.commit()

            return jsonify(success=f"Sender with IP Address {sender_ip} unbanned successfully!")

        else:
            return jsonify(error=f"Sender with IP Address {sender_ip} not found!"), 404

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/unblock_sender module: {e}")

        return jsonify(error='An error occurred while unbanning sender! Try again later.'), 500

    finally:
        sql.session.close()