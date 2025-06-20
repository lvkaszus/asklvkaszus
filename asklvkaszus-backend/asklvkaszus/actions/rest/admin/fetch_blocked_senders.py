from flask import jsonify
from ....models.blocked_senders import BlockedSenders

def api_admin_fetch_blocked_senders():
    blocked_senders = BlockedSenders.query.order_by(BlockedSenders.date.desc()).all()
    formatted_blocked_senders = []

    if blocked_senders:
        for sender in blocked_senders:
            formatted_blocked_senders.append({
                'id': sender.id,
                'ip_address': sender.ip_address,
                'last_question': sender.last_question,
                'date': sender.date,
            })

        return jsonify(formatted_blocked_senders), 200
                
    if formatted_blocked_senders == []:
        return jsonify(message='No blocked senders yet!'), 200
