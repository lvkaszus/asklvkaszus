from flask import current_app, jsonify
from ...extensions import sql
from ...models.app_settings import AppSettings

def user_app_settings():
    try:
        app_settings = AppSettings.query.get(1)

        if app_settings is not None:
            frontend_app_settings = {
                'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
                'markdown_admin_enabled': app_settings.markdown_admin_enabled,
                'approve_questions_first': app_settings.approve_questions_first
            }

            return jsonify(frontend_app_settings)

        else:
            return jsonify(error="App Settings are not set yet!"), 404

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/user/app_settings module: {e}")

        return jsonify(error='An error occured while loading application settings! Try again later.'), 500
    finally:
        sql.session.close()