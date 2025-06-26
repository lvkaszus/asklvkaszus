from ...modules.response_handler import jsonify_on_steroids
from ...config import Config

def main_endpoint():
    response_headers = {
        "Cache-Control": "public, max-age=86400, must-revalidate"
    }

    return jsonify_on_steroids(
        application_name=f"Ask {Config.YOUR_NICKNAME}! - Backend",
        repository_url="https://github.com/lvkaszus/asklvkaszus",
    headers=response_headers), 200
