from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...models.questions import Questions

def admin_purge_all_questions(identity):
    csrf.protect()

    try:
        Questions.query.delete()
        sql.session.commit()

        return jsonify(success="All questions have been successfully purged!"), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/purge_all_questions module: {e}")

        return jsonify(error='An error occurred while purging all questions! Try again later.'), 500

    finally:
        sql.session.close()
