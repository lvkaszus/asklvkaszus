from ....extensions import sql
from flask import request, jsonify
from ....modules.fields import safe_get
import ipaddress
from ....models.blocked_senders import BlockedSenders
from ....models.questions import Questions
from datetime import datetime

def api_admin_block_sender():
    data = request.get_json()

    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    sender_ip = safe_get(data, 'sender_ip', str)

    if not sender_ip:
        return jsonify(error="Sender IP Address cannot be empty!"), 400

    try:
        ipaddress.ip_address(sender_ip)
    except ValueError:
        return jsonify(error="Invalid Sender IP Address format!"), 400

    blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

    if blocked_sender:
        return jsonify(error=f"Sender with IP Address {sender_ip} is already banned!"), 400

    last_question_entry = Questions.query.filter_by(ip_address=sender_ip).order_by(Questions.date.desc()).first()

    last_question = last_question_entry.question if last_question_entry else None

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_blocked_sender = BlockedSenders(ip_address=sender_ip, last_question=last_question, date=now)
    sql.session.add(new_blocked_sender)
    sql.session.commit()

    return jsonify(success=f"Sender with IP Address {sender_ip} banned successfully!"), 200
