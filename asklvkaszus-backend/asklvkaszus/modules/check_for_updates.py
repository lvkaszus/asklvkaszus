import requests
from ..version import backend_version
from flask import current_app

def check_for_updates():
    appRepositoryApiUrl = "https://api.github.com/repos/lvkaszus/asklvkaszus/releases/latest"

    try:
        response = requests.get(appRepositoryApiUrl)

        if response.status_code == 200:
            data = response.json()
            latest_version = data["tag_name"]

            if latest_version > backend_version:
                return {
                    "warning": "A newer version of this application is available. Please upgrade!",
                    "latest_version": latest_version,
                    "current_version": backend_version
                }

            else:
                return {"success": "You are running the latest version."}

        else:
            return {"error": "Failed to fetch data from the GitHub API! Try again later."}

    except Exception as e:
        current_app.logging.error(f"An error occured inside asklvkaszus/modules/check_for_updates module: {e}")

        return {"error": "Failed to check for application updates! Try again later."}
