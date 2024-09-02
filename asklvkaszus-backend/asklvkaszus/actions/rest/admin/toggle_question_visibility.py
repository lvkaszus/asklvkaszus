from flask import current_app, request, jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_toggle_question_visibility():
    data = request.get_json()
    question_id = data.get('question_id')

    try:
        question = Questions.query.get(question_id)

        if not question:
            return jsonify(error='Question with selected ID does not exist.'), 404

        if question.hidden == True:
            question.hidden = False
            sql.session.commit()
            return jsonify(success='Question is now visible.')
        else:
            question.hidden = True
            sql.session.commit()
            return jsonify(success='Question is now hidden.')

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/toggle_question_visibility module: {e}")

        return jsonify(error='An error occurred while changing question visibility! Try again later.'), 500

    finally:
        sql.session.close()