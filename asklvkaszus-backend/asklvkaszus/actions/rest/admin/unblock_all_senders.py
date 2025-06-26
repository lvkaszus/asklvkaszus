from ....extensions import sql
from ....modules.response_handler import jsonify_on_steroids
from ....models.blocked_senders import BlockedSenders

def api_admin_unblock_all_senders():
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    BlockedSenders.query.delete()
    sql.session.commit()

    return jsonify_on_steroids(success="All senders have been successfully unbanned!", headers=response_headers), 200
