from flask import jsonify
from ...config import Config

def main_endpoint():
    return jsonify(
        application_name=f"Ask {Config.YOUR_NICKNAME}! - Backend",
        repository_url="https://github.com/lvkaszus/asklvkaszus"
    ), 200