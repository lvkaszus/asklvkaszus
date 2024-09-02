from ...extensions import csrf, sql
from flask import current_app, jsonify
from ...modules.check_for_updates import check_for_updates

def admin_fetch_updates(identity):
    csrf.protect()

    try:
        update_checker = check_for_updates()

        if 'error' in update_checker:
            return update_checker, 500

        if 'success' in update_checker:
            return update_checker, 200

        if 'warning' in update_checker:
            return update_checker, 200

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/app/admin/fetch_updates module: {e}")

        return jsonify(error='An error occurred while fetching available updates! Try again later.'), 500
