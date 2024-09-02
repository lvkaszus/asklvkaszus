from flask import Blueprint, jsonify
from ..config import Config
from ..extensions import limiter
from ..version import backend_version

root_bp = Blueprint('root', __name__)

def generate_root_endpoint_response():
    return jsonify(
        application_name=f"Ask {Config.YOUR_NICKNAME}! - Backend",
        version=f"{backend_version}",
        repository_url="https://github.com/lvkaszus/asklvkaszus-react"
    ), 200

@root_bp.route('/', methods=['GET'])
@root_bp.route('/api', methods=['GET'])
@root_bp.route('/api/', methods=['GET'])
@limiter.limit('1000 per hour')
def root_endpoint():
    return generate_root_endpoint_response()
