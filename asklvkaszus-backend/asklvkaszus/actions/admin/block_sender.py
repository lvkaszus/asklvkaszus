from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.blocked_senders import BlockedSenders
from ...models.questions import Questions
from datetime import datetime

def admin_block_sender(identity):
    data = request.get_json()
    sender_ip = data.get('sender_ip')

    csrf.protect()

    try:
        if not sender_ip:
            return jsonify(error="Sender IP Address cannot be empty!"), 400

        if BlockedSenders.query.filter_by(ip_address=sender_ip).first():
            return jsonify(error=f"Sender with IP Address {sender_ip} is already banned!"), 400


        last_question_entry = Questions.query.filter_by(ip_address=sender_ip).order_by(Questions.date.desc()).first()

        last_question = last_question_entry.question if last_question_entry else None

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        new_blocked_sender = BlockedSenders(ip_address=sender_ip, last_question=last_question, date=now)
        sql.session.add(new_blocked_sender)
        sql.session.commit()

        return jsonify(success=f"Sender with IP Address {sender_ip} banned successfully!"), 200

    except Exception as e:
        current_app.logger.error(f"An error occurred inside asklvkaszus/actions/admin/block_sender module: {e}")

        return jsonify(error='An error occurred while blocking sender! Try again later.'), 500

    finally:
        sql.session.close()