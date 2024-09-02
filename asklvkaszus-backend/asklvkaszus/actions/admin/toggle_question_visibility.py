from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.questions import Questions

def admin_toggle_question_visibility(identity):
    data = request.get_json()
    question_id = data.get('question_id')

    csrf.protect()

    try:
        question = Questions.query.get(question_id)

        if not question:
            return jsonify(error='Question with selected ID does not exist.'), 404

        if question.hidden == True:
            question.hidden = False
            response = jsonify(success='Question is now visible.')
        else:
            question.hidden = True
            response = jsonify(success='Question is now hidden.')

        response.status_code = 200
        sql.session.commit()

        return response

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/toggle_question_visibility module: {e}")

        return jsonify(error='An error occurred while changing question visibility! Try again later.'), 500

    finally:
        sql.session.close()
