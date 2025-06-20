from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import request, jsonify
from ...models.questions import Questions

def admin_purge_question(identity):
    csrf.protect()

    data = request.get_json()

    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    question_id = safe_get(data, 'question_id', str)

    if not question_id:
        return jsonify(error='Please provide a Question ID!'), 400

    question = Questions.query.get(question_id)

    if not question:
        return jsonify(error='Question with selected ID does not exist.'), 404

    sql.session.delete(question)
    sql.session.commit()

    return jsonify(success='Question has been purged successfully!'), 200
