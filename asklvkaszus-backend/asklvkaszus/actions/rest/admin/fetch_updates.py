from flask import current_app, jsonify
import requests
from ....version import backend_version

# Ask @lvkaszus! - Administrator REST API: Fetch Updates

def api_admin_fetch_updates():
    # Defining a reusable generic error response for API failures.
    error_response = lambda: (jsonify(error="Failed to fetch data from the GitHub API! Try again later."), 500)

    try:
        # Log that the currently logged in user initiated an update check.
        current_app.logger.info("%s requested /api/app/admin/fetch_updates endpoint - Checking application updates...", identity)

        # Prepare HTTP headers for the GitHub API request, including a custom User-Agent and JSON response format.
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

        # Prefix for consistent error logging.
        logger_prefix = "Failed to fetch latest release data from GitHub API! -"

        # If the API response is successful (HTTP 200), process the response.
        if response.status_code == 200:
            try:
                # Attempt to parse the response body as JSON.
                data = response.json()
            except ValueError as e:
                # Log and return an error if the response is not valid JSON.
                current_app.logger.error(f"{logger_prefix} Response is not valid JSON: %s", str(e))
                return error_response()

            # Validate that the JSON response is an object (dict).
            if not isinstance(data, dict):
                current_app.logger.error(f"{logger_prefix} Response JSON is not an object")
                return error_response()

            # Ensure the response contains the 'data' field in the API response.
            if "data" not in data:
                current_app.logger.error(f"{logger_prefix} Missing 'data' in response")
                return error_response()

            # Validate that 'data' is an object.
            if not isinstance(data["data"], dict):
                current_app.logger.error(f"{logger_prefix} 'data' is not an object")
                return error_response()

            # Check for the presence of the 'tag_name' field, which contains the version string.
            if "tag_name" not in data["data"]:
                current_app.logger.error(f"{logger_prefix} Missing 'tag_name' in data")
                return error_response()

            # Extract the latest version string from the API response.
            latest_version = data["data"]["tag_name"]

            # Validate the format of the version string (must be a string of digits and dots).
            if not isinstance(latest_version, str) or not latest_version.replace('.', '').isdigit():
                current_app.logger.error(f"{logger_prefix} Invalid version format: %s", latest_version)
                return error_response()


            # Compare the latest version with the current backend version.
            if latest_version > backend_version:
                warning_message = "A newer version of this application is available. Please upgrade!"

                # Log a warning about the available update.
                current_app.logger.warning(warning_message)
                current_app.logger.warning("Latest version: %s", latest_version)
                current_app.logger.warning("Current version: %s", backend_version)

                # Return a JSON response with a warning message and update details 
                return jsonify(warning=warning_message, latest_version=latest_version, current_version=backend_version), 200

            else:
                # Log that the application is up to date.
                current_app.logger.info("No updates available! Backend is up to date.")

                # Return a JSON response confirming the backend is up to date.
                return jsonify(success="You are running the latest version."), 200

        else:
            # Log an error if the API response is not successful, including HTTP code and body.
            current_app.logger.error("Failed to fetch latest release data from the GitHub API! - HTTP Response Code: %s, HTTP Response Body: %s", response.status_code, response.text)


    # Handle specific exceptions for robust error management.
    except requests.exceptions.Timeout:
        # Log a warning if the request to API server times out.
        current_app.logger.warning("Failed to fetch latest release data from GitHub API! - API Request timed out!")
        
    except requests.exceptions.SSLError:
        # Log an error if there is an SSL/TLS certificate verification failure.
        current_app.logger.error("Failed to fetch latest release data from GitHub API! - SSL/TLS Certificate verification failed!")
        
    except requests.exceptions.ConnectionError:
        # Log an error if there is a network connection error.
        current_app.logger.error("Failed to fetch latest release data from GitHub API! - Network connection error!")
        
    except requests.exceptions.RequestException as e:
        # Log any other request-related exception.
        current_app.logger.error(f"Failed to fetch latest release data from GitHub API! - Request exception!: {str(e)}")

    # Return a generic error response if any error occurred during the process.
    return error_response()