from flask import current_app ,request
from ...modules.response_handler import jsonify_on_steroids
import bleach
from ...modules.fields import safe_get
from ...extensions import csrf, sql
from ...models.blocked_senders import BlockedSenders
from ...models.app_settings import AppSettings
from ...models.questions import Questions
from ...models.registered_users import RegisteredUsers
from ...modules.get_remote_address import get_remote_address
import uuid
from datetime import datetime, timezone
import urllib.parse
from ...modules.telegram_notify import send_telegram_notification
from ...modules.webpush_notify import send_push_notification

def user_submit_question():
    csrf.protect()

    data = request.get_json()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400


    question = safe_get(data, 'question', str)

    if not question:
        return jsonify_on_steroids(error='Sending question failed. Empty messages are not allowed!', headers=response_headers), 400

    if len(question) > 5000:
        return jsonify_on_steroids(error='Sending question failed. Message is too long (maximum of 5000 characters)!', headers=response_headers), 400


    senders_ip_address = get_remote_address()
    is_senders_ip_blocked = BlockedSenders.query.filter_by(ip_address=senders_ip_address).first()

    if is_senders_ip_blocked:
        return jsonify_on_steroids(error='Sending question failed. You have been blocked!', headers=response_headers), 403


    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    new_id = str(uuid.uuid4())

    existing_question = Questions.query.filter_by(id=new_id).first()
    while existing_question:
        new_id = str(uuid.uuid4())
        existing_question = Questions.query.filter_by(id=new_id).first()


    app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

    sanitized_question = bleach.clean(
        question,
        tags=[],
        attributes={},
        strip=True
    )

    if app_settings.approve_questions_first == True:
        new_question = Questions(id=new_id, question=sanitized_question, date=now, answer='Not answered yet!', hidden=True, ip_address=senders_ip_address)
        response_text = "Your message has been sent successfully, but administrator needs to approve it before it will be visible!"
    else:
        new_question = Questions(id=new_id, question=sanitized_question, date=now, answer='Not answered yet!', hidden=False, ip_address=senders_ip_address)
        response_text = "Your message has been sent successfully!"



    sql.session.add(new_question)
    sql.session.commit()


    notify_user = RegisteredUsers.query.first()

    if notify_user:
        send_push_notification(notify_user.username, sanitized_question, now, senders_ip_address)
        send_telegram_notification(notify_user.username, sanitized_question, now, senders_ip_address)


    current_app.logger.info("asklvkaszus/functions/submit_question module: Some user sent an anonymous message!")

    return jsonify_on_steroids(success=response_text, headers=response_headers), 200
