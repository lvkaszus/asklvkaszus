from flask import current_app, request, jsonify
from ....extensions import sql
from ....models.app_settings import AppSettings

def api_admin_app_settings():
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

                return jsonify(app_settings_json)

            else:
                return jsonify(error="App Settings are not set yet!"), 404

        except Exception as e:
            current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/app_settings module - request type GET: {e}")

            return jsonify(error='An error occured while loading application settings! Try again later.'), 500

        finally:
            sql.session.close()


    elif request.method == 'POST':
        data = request.get_json()

        try:
            app_settings = AppSettings.query.get(1)

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

            return jsonify(success='App Settings has been updated.')

        except Exception as e:
            current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/admin/app_settings module - request type POST: {e}")

            return jsonify(error='An error occurred while updating application settings! Try again later.'), 500

        finally:
            sql.session.close()
            