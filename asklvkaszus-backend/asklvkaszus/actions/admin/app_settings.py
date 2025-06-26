from ...extensions import csrf, sql
from ...modules.response_handler import jsonify_on_steroids
from flask import request
from ...models.app_settings import AppSettings

# Ask @lvkaszus! - Administrator Application API: Get or update application settings

def admin_app_settings(identity):
    # Check CSRF token and session cookie for each HTTP request,
    # as defined in the application configuration (config.py: WTF_CSRF_METHODS)
    # using the Flask-WTF library function.
    csrf.protect()

    # Defining the response headers to be added every JSON GET response return.
    get_response_headers = {
        "Cache-Control": "private, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    # Handle GET request - retrieve current application settings
    if request.method == 'GET':
        # Fetch global application settings from the database (named "asklvkaszus" by default)
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        # If settings exist, prepare and return them as a JSON response
        if app_settings is not None:
            app_settings_json = {
                'global_api_enabled': app_settings.global_api_enabled,
                'markdown_admin_enabled': app_settings.markdown_admin_enabled,
                'markdown_frontend_enabled': app_settings.markdown_frontend_enabled,
                'approve_questions_first': app_settings.approve_questions_first,
            }

            # Return application settings with HTTP 200 (OK)
            return jsonify_on_steroids(app_settings_json, headers=get_response_headers), 200

        else:
            # If settings are not yet configured, return a 404 error
            return jsonify_on_steroids(error="App Settings are not set yet!", headers=get_response_headers), 404

    # Handle POST request - update application settings
    elif request.method == 'POST':
        # Defining the response headers to be added every JSON POST response return.
        post_response_headers = {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        }

        # Attempt to parse the request body as JSON after successful CSRF validation
        data = request.get_json()

        # If no JSON data was sent, return an error about invalid payload
        if not data:
            return jsonify_on_steroids(error="Invalid JSON payload!", headers=post_response_headers), 400
        
        # Fetch global application settings from the database (named "asklvkaszus" by default)
        app_settings = AppSettings.query.filter_by(username="asklvkaszus").first()

        # If settings do not exist, return a 404 error
        if not app_settings:
            return jsonify_on_steroids(error="App Settings not found!", headers=post_response_headers), 404


        # Update settings based on the provided JSON data
        # Each option is checked for presence and correct boolean type

        # Global API toggle
        if 'global_api_enabled' in data:
            toggle_api_value = data['global_api_enabled']

            # If the value is not a boolean, return an error
            if not isinstance(toggle_api_value, bool):
                return jsonify_on_steroids(error="global_api_enabled must be boolean!", headers=post_response_headers), 400

            # Assign the new value to the model
            app_settings.global_api_enabled = toggle_api_value

        # Frontend Markdown toggle
        if 'markdown_frontend_enabled' in data:
            toggle_frontend_markdown_value = data['markdown_frontend_enabled']

            if not isinstance(toggle_frontend_markdown_value, bool):
                return jsonify_on_steroids(error="markdown_frontend_enabled must be boolean!", headers=post_response_headers), 400

            app_settings.markdown_frontend_enabled = toggle_frontend_markdown_value

        # Admin panel Markdown toggle
        if 'markdown_admin_enabled' in data:
            toggle_admin_markdown_value = data['markdown_admin_enabled']

            if not isinstance(toggle_admin_markdown_value, bool):
                return jsonify_on_steroids(error="markdown_admin_enabled must be boolean!", headers=post_response_headers), 400

            app_settings.markdown_admin_enabled = toggle_admin_markdown_value

        # Approve questions before publishing toggle
        if 'approve_questions_first' in data:
            toggle_approve_questions_first = data['approve_questions_first']

            if not isinstance(toggle_approve_questions_first, bool):
                return jsonify_on_steroids(error="approve_questions_first must be boolean!", headers=post_response_headers), 400

            app_settings.approve_questions_first = toggle_approve_questions_first

        # After all updates, commit changes to the database
        sql.session.commit()

        # Return a success message with HTTP 200 (OK)
        return jsonify_on_steroids(success="Application Settings have been updated.", headers=post_response_headers), 200
