from flask import current_app, request, jsonify
from ....extensions import sql
from ....models.blocked_senders import BlockedSenders
from ....models.app_settings import AppSettings
from ....models.questions import Questions
from ....models.registered_users import RegisteredUsers
from ....modules.get_remote_address import get_remote_address
from ....modules.check_sender_block import is_blocked
import uuid
from datetime import datetime
import urllib.parse
from ....modules.telegram_notify import send_telegram_notification

def api_user_submit_question():
    data = request.get_json()
    question = data.get('question')

    try:
        if not question:
            return jsonify(error='Sending question failed. Empty messages are not allowed!'), 400

        senders_ip_address = get_remote_address()
        is_senders_ip_blocked = is_blocked(senders_ip_address)

        if is_senders_ip_blocked == True:
            return jsonify(error='Sending question failed. You have been blocked!'), 403


        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_id = str(uuid.uuid4())

        existing_question = Questions.query.filter_by(id=new_id).first()
        while existing_question:
            new_id = str(uuid.uuid4())
            existing_question = Questions.query.filter_by(id=new_id).first()


        app_settings = AppSettings.query.get(1)

        if app_settings.approve_questions_first == True:
            new_question = Questions(id=new_id, question=question, date=now, answer='Not answered yet!', hidden=True, ip_address=senders_ip_address)
            response_text = "Your message has been sent successfully, but administrator needs to approve it before it will be visible!"
        else:
            new_question = Questions(id=new_id, question=question, date=now, answer='Not answered yet!', hidden=False, ip_address=senders_ip_address)
            response_text = "Your message has been sent successfully!"


        sql.session.add(new_question)
        sql.session.commit()

        notify_user = RegisteredUsers.query.filter_by(telegram_enabled=True).first()
        if notify_user:
            send_telegram_notification(notify_user.username, question, now, senders_ip_address)

        current_app.logger.info("asklvkaszus/actions/rest/user/submit_question module: Some user sent an anonymous message!")

        return jsonify(success=response_text), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/user/submit_question module: {e}")

        return jsonify(error='An error occurred while sending your message! Try again later.'), 500
    finally:
        sql.session.close()