from ...extensions import csrf, sql
from flask import request
from ...modules.response_handler import jsonify_on_steroids
from ...modules.fields import safe_get
import ipaddress
from ...models.blocked_senders import BlockedSenders
from ...models.questions import Questions
from datetime import datetime, timezone

def admin_block_sender(identity):
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
        return jsonify_on_steroids(error="Invalid Sender IP Address format!", headers=response_headers), 400

    blocked_sender = BlockedSenders.query.filter_by(ip_address=sender_ip).first()

    if blocked_sender:
        return jsonify_on_steroids(error=f"Sender with IP Address {sender_ip} is already banned!", headers=response_headers), 400

    last_question_entry = Questions.query.filter_by(ip_address=sender_ip).order_by(Questions.date.desc()).first()

    last_question = last_question_entry.question if last_question_entry else None

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    new_blocked_sender = BlockedSenders(ip_address=sender_ip, last_question=last_question, date=now)
    sql.session.add(new_blocked_sender)
    sql.session.commit()

    return jsonify_on_steroids(success=f"Sender with IP Address {sender_ip} banned successfully!", headers=response_headers), 200
