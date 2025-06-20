from flask import request, jsonify
from ....extensions import sql
from ....models.app_settings import AppSettings

def api_admin_app_settings():
    if request.method == 'GET':
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        if app_settings is not None:
            app_settings_json = {
                'global_api_enabled': app_settings.global_api_enabled,
                'markdown_admin_enabled': app_settings.markdown_admin_enabled,
                'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
                'approve_questions_first': app_settings.approve_questions_first,
            }

            return jsonify(app_settings_json), 200

        else:
            return jsonify(error="App Settings are not set yet!"), 404

    elif request.method == 'POST':
        data = request.get_json()

        if not data:
            return jsonify(error="Invalid JSON payload!"), 400
        
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        if not app_settings:
            return jsonify(error="App Settings not found!"), 404

        if 'global_api_enabled' in data:
            toggle_api_value = data['global_api_enabled']

            if not isinstance(toggle_api_value, bool):
                return jsonify(error="global_api_enabled must be boolean!"), 400

            app_settings.global_api_enabled = toggle_api_value

        if 'markdown_frontend_enabled' in data:
            toggle_frontend_markdown_value = data['markdown_frontend_enabled']

            if not isinstance(toggle_frontend_markdown_value, bool):
                return jsonify(error="markdown_frontend_enabled must be boolean!"), 400

            app_settings.markdown_frontend_enabled = toggle_frontend_markdown_value

        if 'markdown_admin_enabled' in data:
            toggle_admin_markdown_value = data['markdown_admin_enabled']

            if not isinstance(toggle_admin_markdown_value, bool):
                return jsonify(error="markdown_admin_enabled must be boolean!"), 400

            app_settings.markdown_admin_enabled = toggle_admin_markdown_value

        if 'approve_questions_first' in data:
            toggle_approve_questions_first = data['approve_questions_first']

            if not isinstance(toggle_approve_questions_first, bool):
                return jsonify(error="approve_questions_first must be boolean!"), 400

            app_settings.approve_questions_first = toggle_approve_questions_first

        sql.session.commit()

        return jsonify(success='Application Settings have been updated.'), 200
