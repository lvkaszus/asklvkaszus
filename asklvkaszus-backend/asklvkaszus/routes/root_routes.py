from flask import Blueprint, jsonify
from ..config import Config
from ..extensions import limiter
from ..actions.rest.root import main_endpoint

root_bp = Blueprint('root', __name__)



@root_bp.route('/', methods=['GET'])
@root_bp.route('/api', methods=['GET'])
@root_bp.route('/api/', methods=['GET'])
@root_bp.route('/api/v3', methods=['GET'])
@root_bp.route('/api/v3/', methods=['GET'])
@limiter.limit('2000 per hour')
def root_main_route():
    return main_endpoint()
