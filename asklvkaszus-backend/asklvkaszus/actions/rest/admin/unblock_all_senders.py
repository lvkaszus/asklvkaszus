from flask import current_app, jsonify
from ....extensions import sql
from ....models.blocked_senders import BlockedSenders

def api_admin_unblock_all_senders():
    try:
        BlockedSenders.query.delete()
        sql.session.commit()

        return jsonify(success="All senders have been successfully unbanned!")

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/unblock_all_senders module: {e}")

        return jsonify(error='An error occurred while unbanning all senders! Try again later.'), 500

    finally:
        sql.session.close()