from ...extensions import csrf, sql
from flask import current_app, request, jsonify
from ...models.app_settings import AppSettings

def admin_app_settings(identity):
    if request.method == 'GET':
        try:
            app_settings = AppSettings.query.get(1)

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

        except Exception as e:
            current_app.logging.error(f"An error occured inside asklvkaszus/actions/admin/app_settings module - request type GET: {e}")

            return jsonify(error='An error occured while loading application settings! Try again later.'), 500

        finally:
            sql.session.close()


    elif request.method == 'POST':
        data = request.get_json()

        csrf.protect()
        
        try:
            app_settings = AppSettings.query.get(1)

            if 'global_api_enabled' in data:
                toggle_api_value = data['global_api_enabled']

                if toggle_api_value == "":
                    return jsonify(error="global_api_enabled cannot be empty!"), 400

                app_settings.global_api_enabled = toggle_api_value

            if 'markdown_frontend_enabled' in data:
                toggle_frontend_markdown_value = data['markdown_frontend_enabled']

                if toggle_frontend_markdown_value == "":
                    return jsonify(error="markdown_frontend_enabled cannot be empty!"), 400

                app_settings.markdown_frontend_enabled = toggle_frontend_markdown_value

            if 'markdown_admin_enabled' in data:
                toggle_admin_markdown_value = data['markdown_admin_enabled']

                if toggle_admin_markdown_value == "":
                    return jsonify(error="markdown_admin_enabled cannot be empty!"), 400

                app_settings.markdown_admin_enabled = toggle_admin_markdown_value

            if 'approve_questions_first' in data:
                toggle_approve_questions_first = data['approve_questions_first']

                if toggle_approve_questions_first == "":
                    return jsonify(error="approve_questions_first cannot be empty!"), 400

                app_settings.approve_questions_first = toggle_approve_questions_first

            sql.session.commit()

            return jsonify(success='Application Settings have been updated.'), 200

        except Exception as e:
            current_app.logging.error(f"An error occured inside asklvkaszus/actions/admin/app_settings module - request type POST: {e}")

            return jsonify(error='An error occurred while updating application settings! Try again later.'), 500

        finally:
            sql.session.close()
