from ...extensions import csrf, sql
from ...modules.response_handler import jsonify_on_steroids
from flask import request
from ...models.app_settings import AppSettings

def admin_app_settings(identity):
    csrf.protect()

    get_response_headers = {
        "Cache-Control": "private, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if request.method == 'GET':
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        if app_settings is None:
            app_settings = AppSettings(username="asklvkaszus")
            sql.session.add(app_settings)
            sql.session.commit()

        app_settings_json = {
            'global_api_enabled': app_settings.global_api_enabled,
            'markdown_admin_enabled': app_settings.markdown_admin_enabled,
            'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
            'approve_questions_first': app_settings.approve_questions_first,
            'captcha_enabled': app_settings.captcha_enabled,
            'captcha_provider': app_settings.captcha_provider,
            'captcha_site_key': app_settings.captcha_site_key
        }

        return jsonify_on_steroids(app_settings_json, headers=get_response_headers), 200

    elif request.method == 'POST':
        post_response_headers = {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        }

        data = request.get_json()

        if not data:
            return jsonify_on_steroids(error="Invalid JSON payload!", headers=post_response_headers), 400
        
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        if not app_settings:
            app_settings = AppSettings(username="asklvkaszus")
            sql.session.add(app_settings)
            sql.session.commit()


        if 'global_api_enabled' in data:
            toggle_api_value = data['global_api_enabled']

            if not isinstance(toggle_api_value, bool):
                return jsonify_on_steroids(error="global_api_enabled must be boolean!", headers=post_response_headers), 400

            app_settings.global_api_enabled = toggle_api_value

        if 'markdown_frontend_enabled' in data:
            toggle_frontend_markdown_value = data['markdown_frontend_enabled']

            if not isinstance(toggle_frontend_markdown_value, bool):
                return jsonify_on_steroids(error="markdown_frontend_enabled must be boolean!", headers=post_response_headers), 400

            app_settings.markdown_frontend_enabled = toggle_frontend_markdown_value

        if 'markdown_admin_enabled' in data:
            toggle_admin_markdown_value = data['markdown_admin_enabled']

            if not isinstance(toggle_admin_markdown_value, bool):
                return jsonify_on_steroids(error="markdown_admin_enabled must be boolean!", headers=post_response_headers), 400

            app_settings.markdown_admin_enabled = toggle_admin_markdown_value

        if 'approve_questions_first' in data:
            toggle_approve_questions_first = data['approve_questions_first']

            if not isinstance(toggle_approve_questions_first, bool):
                return jsonify_on_steroids(error="approve_questions_first must be boolean!", headers=post_response_headers), 400

            app_settings.approve_questions_first = toggle_approve_questions_first

        sql.session.commit()

        return jsonify_on_steroids(success="Application Settings have been updated.", headers=post_response_headers), 200
