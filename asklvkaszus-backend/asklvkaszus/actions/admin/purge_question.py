from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import request
from ...modules.response_handler import jsonify_on_steroids
from ...models.questions import Questions

def admin_purge_question(identity):
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
        return jsonify_on_steroids(error='Please provide a Question ID!', headers=response_headers), 400

    question = Questions.query.get(question_id)

    if not question:
        return jsonify_on_steroids(error='Question with selected ID does not exist.', headers=response_headers), 404

    sql.session.delete(question)
    sql.session.commit()

    return jsonify_on_steroids(success='Question has been purged successfully!', headers=response_headers), 200
