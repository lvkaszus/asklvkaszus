from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.blocked_senders import BlockedSenders

def admin_fetch_blocked_senders(identity):
    csrf.protect()

    try:
        blocked_senders = BlockedSenders.query.order_by(BlockedSenders.date.desc()).all()
        formatted_blocked_senders = []

        if blocked_senders:
            for sender in blocked_senders:
                formatted_blocked_senders.append({
                    'id': sender.id,
                    'ip_address': sender.ip_address,
                    'last_question': sender.last_question,
                    'date': sender.date.strftime("%Y-%m-%d %H:%M:%S"),
                })

            return jsonify(formatted_blocked_senders), 200
                    
        if formatted_blocked_senders == []:
            return jsonify(message='No blocked senders yet!'), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/fetch_blocked_senders module: {e}")

        return jsonify(error='An error occurred while fetching blocked senders list! Try again later.'), 500
            
    finally:
        sql.session.close()