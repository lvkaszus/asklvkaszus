from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...models.questions import Questions

def admin_toggle_all_questions_visibility(identity):
    csrf.protect()

    try:
        all_questions = Questions.query.all()

        if all(question.hidden for question in all_questions):
            for question in all_questions:
                question.hidden = False
                response = jsonify(success='All questions are now visible.')
                response.status_code = 200
        else:
            for question in all_questions:
                question.hidden = True
                response = jsonify(success='All questions are now hidden.')
                response.status_code = 200

        sql.session.commit()

        if not all_questions:
            return jsonify(error='There are no questions yet!'), 404

        return response

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/toggle_all_questions_visibility module: {e}")

        return jsonify(error='An error occurred while changing all questions visibility! Try again later.'), 500

    finally:
        sql.session.close()
