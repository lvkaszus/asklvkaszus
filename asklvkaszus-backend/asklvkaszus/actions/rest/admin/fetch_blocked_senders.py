from ....modules.response_handler import jsonify_on_steroids
from ....models.blocked_senders import BlockedSenders

def api_admin_fetch_blocked_senders():
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

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

    if formatted_blocked_senders == []:
        return jsonify_on_steroids(message='No blocked senders yet!', headers=response_headers), 200

    return jsonify_on_steroids(formatted_blocked_senders, headers=response_headers), 200
