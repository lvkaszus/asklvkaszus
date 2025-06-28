from ....extensions import sql
from ....models.app_settings import AppSettings
from ....modules.response_handler import jsonify_on_steroids

def api_user_app_settings():
    app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

    if app_settings is None:
        app_settings = AppSettings(username="asklvkaszus")
        sql.session.add(app_settings)
        sql.session.commit()

    frontend_app_settings = {
        'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
        'markdown_admin_enabled': app_settings.markdown_admin_enabled,
        'approve_questions_first': app_settings.approve_questions_first,
        'captcha_enabled': app_settings.captcha_enabled,
        'captcha_provider': app_settings.captcha_provider,
        'captcha_site_key': app_settings.captcha_site_key
    }

    success_response_headers = {
        "Cache-Control": "public, max-age=300, must-revalidate"
    }

    return jsonify_on_steroids(frontend_app_settings, headers=success_response_headers), 200
