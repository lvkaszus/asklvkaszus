from flask import current_app, jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_purge_all_questions():
    try:
        Questions.query.delete()
                    
        sql.session.commit()

        return jsonify(success="All questions have been successfully purged!")

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/purge_all_questions module: {e}")

        return jsonify(error='An error occurred while purging all questions! Try again later.'), 500

    finally:
        sql.session.close()