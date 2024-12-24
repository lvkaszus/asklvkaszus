from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.blocked_senders import BlockedSenders
import traceback

def admin_unblock_all_senders(identity):
    csrf.protect()

    try:
        BlockedSenders.query.delete()
        sql.session.commit()

        return jsonify(success="All senders have been successfully unbanned!"), 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/admin/unblock_all_senders module: {e}")
        traceback.print_exc()

        return jsonify(error='An error occurred while unbanning all senders! Try again later.'), 500

    finally:
        sql.session.close()
