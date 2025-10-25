from ...extensions import csrf
from ...modules.response_handler import jsonify_on_steroids
from flask import current_app
import requests
from ...version import backend_version

def admin_fetch_updates(identity):
    csrf.protect()

    error_response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    error_response = lambda: (jsonify_on_steroids(error="Failed to fetch data from the GitHub API! Try again later.", headers=error_response_headers), 500)

    try:
        current_app.logger.info("%s requested /api/app/admin/fetch_updates endpoint - Checking application updates...", identity)

        headers = {
            "User-Agent": f"Ask @lvkaszus! - Update Checker/{backend_version}",
            "Accept": "application/json"
        }

        # Send a GET request to the GitHub Published App Releases API that is hosted by me on my own server to
        # fetch the latest application release data with request timeout of 10 seconds maximum.
        response = requests.get("https://asklvkaszus.github-api.proxy.lvkasz.us", headers=headers, timeout=10)
        #
        #
        # Why it is hosted by me and not using GitHub Official API endpoint anymore? Good question!
        #
        # Because some of the requests to the plain GitHub API pointing to "Ask @lvkaszus!"
        # repository, available at:
        #
        #            https://api.github.com/repos/lvkaszus/asklvkaszus/releases/latest
        #
        # are often blocked, due to Server IP Address blacklisting, sending too many requests
        # in a short period of time, or even sometimes ban of entire ASN (Autonomous System 
        # Number) that causes failures when trying to fetch latest release data.
        #
        # I fixed this, by creating a small FastAPI application on my server, that actively
        # listens for a "signal" (hook) about new release published on GitHub, and then updates it's
        # version number every new release inside it's small database. This doesn't make tons of requests
        # to the GitHub API that very likely would cause a fast ratelimit for a very long period of time.
        #
        #
        #          Source Code of my GitHub Repository Release Tracker is available at:
        #
        #              https://github.com/lvkaszus/github-release-tracker-fastapi
        # 
        #

        logger_prefix = "Failed to fetch latest release data from GitHub API! -"

        if response.status_code == 200:
            try:
                data = response.json()
            except ValueError as e:
                current_app.logger.error(f"{logger_prefix} Response is not valid JSON: %s", str(e))
                return error_response()

            if not isinstance(data, dict):
                current_app.logger.error(f"{logger_prefix} Response JSON is not an object")
                return error_response()

            if "data" not in data:
                current_app.logger.error(f"{logger_prefix} Missing 'data' in response")
                return error_response()

            if not isinstance(data["data"], dict):
                current_app.logger.error(f"{logger_prefix} 'data' is not an object")
                return error_response()

            if "tag_name" not in data["data"]:
                current_app.logger.error(f"{logger_prefix} Missing 'tag_name' in data")
                return error_response()

            latest_version = data["data"]["tag_name"]

            if not isinstance(latest_version, str) or not latest_version.replace('.', '').isdigit():
                current_app.logger.error(f"{logger_prefix} Invalid version format: %s", latest_version)
                return error_response()

            success_response_headers = {
                "Cache-Control": "private, max-age=60, must-revalidate"
            }

            if latest_version > backend_version:
                warning_message = "A newer version of this application is available. Please upgrade!"

                current_app.logger.warning(warning_message)
                current_app.logger.warning("Latest version: %s", latest_version)
                current_app.logger.warning("Current version: %s", backend_version)

                return jsonify_on_steroids(warning=warning_message, latest_version=latest_version, current_version=backend_version, headers=success_response_headers), 200

            else:
                current_app.logger.info("No updates available! Backend is up to date.")

                return jsonify_on_steroids(success="You are running the latest version.", headers=success_response_headers), 200

        else:
            current_app.logger.error("Failed to fetch latest release data from the GitHub API! - HTTP Response Code: %s, HTTP Response Body: %s", response.status_code, response.text)


    except requests.exceptions.Timeout:
        current_app.logger.warning("Failed to fetch latest release data from GitHub API! - API Request timed out!")
        
    except requests.exceptions.SSLError:
        current_app.logger.error("Failed to fetch latest release data from GitHub API! - SSL/TLS Certificate verification failed!")
        
    except requests.exceptions.ConnectionError:
        current_app.logger.error("Failed to fetch latest release data from GitHub API! - Network connection error!")
        
    except requests.exceptions.RequestException as e:
        current_app.logger.error(f"Failed to fetch latest release data from GitHub API! - Request exception!: {str(e)}")

    return error_response()