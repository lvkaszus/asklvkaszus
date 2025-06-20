from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import request, jsonify
import ipaddress
from ...models.blocked_senders import BlockedSenders

def admin_unblock_sender(identity):
    csrf.protect()

    data = request.get_json()

    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    sender_ip = safe_get(data, 'sender_ip', str)

    if not sender_ip:
        return jsonify(error="Sender IP Address cannot be empty!"), 400

    try:
        ipaddress.ip_address(sender_ip)
    except ValueError:
        return jsonify(error="Invalid Sender IP address format!"), 400
        
    blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

    if blocked_sender:
        sql.session.delete(blocked_sender)
        sql.session.commit()

        return jsonify(success=f"Sender with IP Address {sender_ip} unbanned successfully!"), 200

    else:
        return jsonify(error=f"Sender with IP Address {sender_ip} not found!"), 404
