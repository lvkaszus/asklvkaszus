from flask import jsonify
from ....extensions import sql
from ....models.blocked_senders import BlockedSenders

def api_admin_unblock_all_senders():
    BlockedSenders.query.delete()
    sql.session.commit()

    return jsonify(success="All senders have been successfully unbanned!"), 200
