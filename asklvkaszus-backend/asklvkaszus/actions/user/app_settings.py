from flask import jsonify
from ...models.app_settings import AppSettings
from ...modules.response_handler import jsonify_on_steroids

def user_app_settings():
    app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

    if app_settings is not None:
        frontend_app_settings = {
            'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
            'markdown_admin_enabled': app_settings.markdown_admin_enabled,
            'approve_questions_first': app_settings.approve_questions_first
        }

        success_response_headers = {
            "Cache-Control": "public, max-age=300, must-revalidate"
        }

        return jsonify_on_steroids(frontend_app_settings, headers=success_response_headers), 200

    else:
        error_response_headers = {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        }

        return jsonify_on_steroids(error="App Settings are not set yet!", headers=error_response_headers), 404
