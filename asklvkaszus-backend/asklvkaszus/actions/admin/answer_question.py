from ...extensions import csrf, sql
from flask import request
from ...modules.response_handler import jsonify_on_steroids
from ...modules.fields import safe_get
from ...models.questions import Questions
import bleach

def admin_answer_question(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    data = request.get_json()

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    question_id = safe_get(data, 'question_id', str)

    if not question_id:
        return jsonify_on_steroids(error="Please provide a Question ID!", headers=response_headers), 400

    question = Questions.query.filter_by(id=question_id).first()

    if not question:
        return jsonify_on_steroids(error="Question with selected ID does not exist.", headers=response_headers), 400

    question_answer = safe_get(data, 'question_answer', str)

    if not question_answer:
        return jsonify_on_steroids(error="Sending question reply failed. Empty replies are not allowed!", headers=response_headers), 400

    if len(question_answer) > 5000:
        return jsonify_on_steroids(error="Sending question reply failed. Message is too long (maximum of 5000 characters)!", headers=response_headers), 400

    sanitized_answer = bleach.clean(
        question_answer,
        tags=[],
        attributes={},
        strip=True
    )

    question.answer = sanitized_answer
    sql.session.commit()

    return jsonify_on_steroids(success="Your answer has been updated successfully!", headers=response_headers), 200
