from flask import jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_purge_all_questions():
    Questions.query.delete()
    sql.session.commit()

    return jsonify(success="All questions have been successfully purged!"), 200