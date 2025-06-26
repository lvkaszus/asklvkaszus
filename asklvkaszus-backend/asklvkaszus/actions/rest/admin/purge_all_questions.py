from ....modules.response_handler import jsonify_on_steroids
from ....extensions import sql
from ....models.questions import Questions

def api_admin_purge_all_questions():
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    Questions.query.delete()
    sql.session.commit()

    return jsonify_on_steroids(success="All questions have been successfully purged!", headers=response_headers), 200
