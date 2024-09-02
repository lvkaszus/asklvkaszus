from flask import current_app, jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_toggle_all_questions_visibility():
    try:
        all_questions = Questions.query.all()

        if not all_questions:
            return jsonify(error='There are no questions yet!'), 404

        if all(question.hidden for question in all_questions):
            for question in all_questions:
                question.hidden = False
                sql.session.commit()
                return jsonify(success='All questions are now visible.')
        else:
            for question in all_questions:
                question.hidden = True
                sql.session.commit()
                return jsonify(success='All questions are now hidden.')

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/toggle_all_questions_visibility module: {e}")

        return jsonify(error='An error occurred while changing all questions visibility! Try again later.'), 500

    finally:
        sql.session.close()