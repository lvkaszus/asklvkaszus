from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import request
from ...modules.response_handler import jsonify_on_steroids
import ipaddress
from ...models.blocked_senders import BlockedSenders

def admin_unblock_sender(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    data = request.get_json()

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    sender_ip = safe_get(data, 'sender_ip', str)

    if not sender_ip:
        return jsonify_on_steroids(error="Sender IP Address cannot be empty!", headers=response_headers), 400

    try:
        ipaddress.ip_address(sender_ip)
    except ValueError:
        return jsonify_on_steroids(error="Invalid Sender IP address format!", headers=response_headers), 400
        
    blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

    if blocked_sender:
        sql.session.delete(blocked_sender)
        sql.session.commit()

        return jsonify_on_steroids(success=f"Sender with IP Address {sender_ip} unbanned successfully!", headers=response_headers), 200

    else:
        return jsonify_on_steroids(error=f"Sender with IP Address {sender_ip} not found!", headers=response_headers), 404
