from ...extensions import csrf, sql
from flask import jsonify
from ...models.blocked_senders import BlockedSenders

def admin_unblock_all_senders(identity):
    csrf.protect()

    BlockedSenders.query.delete()
    sql.session.commit()

    return jsonify(success="All senders have been successfully unbanned!"), 200
