from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.questions import Questions

def admin_purge_question(identity):
    data = request.get_json()
    question_id = data.get('question_id')

    csrf.protect()

    try:
        question = Questions.query.get(question_id)

        if not question:
            return jsonify(error='Question with selected ID does not exist.'), 404

        sql.session.delete(question)
        sql.session.commit()

        return jsonify(success='Question has been purged successfully!'), 200

    except Exception as e:
        current_app.logger.error("An error occured inside asklvkaszus/actions/admin/purge_question module: {e}")

        return jsonify(error='An error occurred while purging specified question! Try again later.'), 500

    finally:
        sql.session.close()
