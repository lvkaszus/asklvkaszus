from flask import request, jsonify
from ....modules.fields import safe_get
from ....extensions import sql
from ....models.questions import Questions

def api_admin_answer_question():
    data = request.get_json()

    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    question_id = safe_get(data, 'question_id', str)

    if not question_id:
        return jsonify(error='Please provide a Question ID!'), 400

    question = Questions.query.filter_by(id=question_id).first()

    if not question:
        return jsonify(error='Question with selected ID does not exist.'), 404

    question_answer = safe_get(data, 'question_answer', str)

    if not question_answer:
        return jsonify(error='Sending question reply failed. Empty replies are not allowed!'), 400

    if len(question_answer) > 5000:
        return jsonify(error='Sending question reply failed. Message is too long (maximum of 5000 characters)!'), 400

    question.answer = question_answer
    sql.session.commit()

    return jsonify(success='Your answer has been updated successfully!'), 200