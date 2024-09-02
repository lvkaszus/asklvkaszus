from flask import current_app, request, jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_purge_question():
    data = request.get_json()
    question_id = data.get('question_id')

    try:
        question = Questions.query.get(question_id)

        if not question:
            return jsonify(error='Question with selected ID does not exist.'), 404

        sql.session.delete(question)
        sql.session.commit()

        return jsonify(success='Question has been purged successfully!')

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/purge_question module: {e}")

        return jsonify(error='An error occurred while purging specified question! Try again later.'), 500

    finally:
        sql.session.close()