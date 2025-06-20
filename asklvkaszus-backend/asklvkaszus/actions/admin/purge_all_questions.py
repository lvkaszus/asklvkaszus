from ...extensions import csrf, sql
from flask import jsonify
from ...models.questions import Questions

def admin_purge_all_questions(identity):
    csrf.protect()

    Questions.query.delete()
    sql.session.commit()

    return jsonify(success="All questions have been successfully purged!"), 200
