from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.questions import Questions

def admin_answer_question(identity):
    data = request.get_json()
    question_id = data.get('question_id')
    question_answer = data.get('question_answer')

    csrf.protect()

    try:
        question = Questions.query.filter_by(id=question_id).first()

        if not question:
            return jsonify(error='Question with selected ID does not exist.'), 404

        if not question_answer:
            return jsonify(error='Sending question reply failed. Empty replies are not allowed!'), 400

        question.answer = question_answer
        sql.session.commit()

        return jsonify(success='Your answer has been updated successfully!'), 200

    except Exception as e:
        current_app.logging.error(f"An error occured inside asklvkaszus/actions/admin/answer_question module: {e}")
        
        return jsonify(error='An error occurred while updating answer to selected question! Try again later.'), 500

    finally:
        sql.session.close()
