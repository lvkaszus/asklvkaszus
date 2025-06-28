from flask import request
from ....modules.response_handler import jsonify_on_steroids
from ....extensions import csrf, sql
from ....modules.fields import safe_get
from ....models.app_settings import AppSettings

def api_admin_configure_captcha():
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
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
            'captcha_enabled': app_settings.captcha_enabled,
            'captcha_provider': app_settings.captcha_provider,
            'captcha_site_key': app_settings.captcha_site_key,
            'captcha_secret_key': app_settings.captcha_secret_key
        }

        return jsonify_on_steroids(app_settings_json, headers=response_headers), 200

    elif request.method == 'PUT':
        data = request.get_json()

        if not data:
            return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        if app_settings is None:
            app_settings = AppSettings(username="asklvkaszus")
            sql.session.add(app_settings)
            sql.session.commit()


        supported_providers = [
            "cf-turnstile",
            "google-recaptcha-v2",
        ]


        if 'captcha_enabled' in data:
            captcha_enabled = data['captcha_enabled']

            if not isinstance(captcha_enabled, bool):
                return jsonify_on_steroids(error="captcha_enabled must be boolean!", headers=response_headers), 400

            if captcha_enabled is True:
                provider = safe_get(data, 'captcha_provider', str) or app_settings.captcha_provider
                site_key = safe_get(data, 'captcha_site_key', str) or app_settings.captcha_site_key
                secret_key = safe_get(data, 'captcha_secret_key', str) or app_settings.captcha_secret_key
                
                if not all([provider, site_key, secret_key]):
                    return jsonify_on_steroids(
                        error="All CAPTCHA fields are required when enabling!",
                        headers=response_headers
                    ), 400
                
                if provider not in supported_providers:
                    return jsonify_on_steroids(error=f"Unsupported CAPTCHA Provider!", headers=response_headers), 400

            app_settings.captcha_enabled = captcha_enabled

        if 'captcha_provider' in data:
            captcha_provider = data['captcha_provider']

            if not isinstance(captcha_provider, str):
                return jsonify_on_steroids(error="captcha_provider must be string!", headers=response_headers), 400

            if captcha_provider not in supported_providers:
                return jsonify_on_steroids(error=f"Unsupported CAPTCHA Provider!", headers=response_headers), 400
                
            app_settings.captcha_provider = captcha_provider

        if 'captcha_site_key' in data:
            captcha_site_key = data['captcha_site_key']

            if not isinstance(captcha_site_key, str):
                return jsonify_on_steroids(error="captcha_site_key must be string!", headers=response_headers), 400

            app_settings.captcha_site_key = captcha_site_key

        if 'captcha_secret_key' in data:
            captcha_secret_key = data['captcha_secret_key']

            if not isinstance(captcha_secret_key, str):
                return jsonify_on_steroids(error="captcha_secret_key must be string!", headers=response_headers), 400

            app_settings.captcha_secret_key = captcha_secret_key


        sql.session.commit()

        return jsonify_on_steroids(success="CAPTCHA Settings have been updated.", headers=response_headers), 200
