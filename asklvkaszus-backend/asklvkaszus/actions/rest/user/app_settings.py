from flask import jsonify
from ....models.app_settings import AppSettings

def api_user_app_settings():
    app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

    if app_settings is not None:
        frontend_app_settings = {
            'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
            'markdown_admin_enabled': app_settings.markdown_admin_enabled,
            'approve_questions_first': app_settings.approve_questions_first
        }

        return jsonify(frontend_app_settings)

    else:
        return jsonify(error="App Settings are not set yet!"), 404
