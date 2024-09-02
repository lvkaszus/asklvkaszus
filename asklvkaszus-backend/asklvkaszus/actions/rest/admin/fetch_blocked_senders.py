from flask import current_app, jsonify
from ....extensions import sql
from ....models.blocked_senders import BlockedSenders

def api_admin_fetch_blocked_senders():
    try:
        blocked_senders = BlockedSenders.query.order_by(BlockedSenders.date.desc()).all()
        formatted_blocked_senders = []

        if blocked_senders:
            for ip_address in blocked_senders:
                formatted_blocked_senders.append({
                    'id': ip_address.id,
                    'date': ip_address.date.strftime("%Y-%m-%d %H:%M:%S"),
                    'ip_address': ip_address.ip_address
                })
                    
        if formatted_blocked_senders == []:
            return jsonify(message='No blocked senders yet!'), 200
                    
        return jsonify(formatted_blocked_senders)

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/fetch_blocked_senders module: {e}")

        return jsonify(error='An error occurred while fetching blocked senders list! Try again later.'), 500
            
    finally:
        sql.session.close()