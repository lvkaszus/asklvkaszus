from ..models.app_settings import AppSettings
from ..extensions import sql
import requests
from flask import current_app
from ..version import backend_version

def verify_captcha(received_token):
    app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

    if app_settings is None:
        app_settings = AppSettings(username="asklvkaszus")
        sql.session.add(app_settings)
        sql.session.commit()

        return False

    if not app_settings.captcha_enabled:
        return True

    if not app_settings.captcha_secret_key:
        current_app.logger.error("CAPTCHA Secret Key is not configured!")
        return False

    if not received_token:
        return False

    captcha_api_request_headers = {
        "User-Agent": f"Ask @lvkaszus! - Backend/{backend_version} (https://github.com/lvkaszus/asklvkaszus)",
        "Accept": "application/json"
    }

    try:
        if app_settings.captcha_provider == "cf-turnstile":
            captcha_api_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

            response = requests.post(captcha_api_url,
                data={
                    "secret": app_settings.captcha_secret_key,
                    "response": received_token
                },
                headers=captcha_api_request_headers,
                timeout=10
            )

            response.raise_for_status()

            result = response.json()

            return result.get("success", False)

        elif app_settings.captcha_provider == "google-recaptcha-v2":
            captcha_api_url = "https://www.google.com/recaptcha/api/siteverify"

            response = requests.post(captcha_api_url,
                data={
                    "secret": app_settings.captcha_secret_key,
                    "response": received_token
                },
                headers=captcha_api_request_headers,
                timeout=10
            )

            response.raise_for_status()

            result = response.json()

            return result.get("success", False)

        else:
            return False

    except requests.exceptions.Timeout:
        current_app.logger.error("Request to the CAPTCHA API has timed out!")
        
    except requests.exceptions.RequestException as e:
        current_app.logger.error(f"Failed to verify CAPTCHA result because CAPTCHA API returned an error: {str(e)}")

    except Exception as e:
        current_app.logger.error(f"Failed to verify CAPTCHA result because of unknown error: {str(e)}")

    return False