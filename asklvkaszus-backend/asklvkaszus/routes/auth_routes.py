from flask import Blueprint, request, jsonify
from ..config import Config
from ..extensions import limiter
from ..modules.jwt_core import token_required

from ..actions.auth.login import login
from ..actions.auth.register import register
from ..actions.auth.change_password import change_password
from ..actions.auth.logout import logout
from ..actions.auth.session_guard import session_guard

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@limiter.limit(Config.AUTH_RATELIMIT)
def auth_login_route():
    return login()

@auth_bp.route('/register', methods=['GET', 'POST'])
@limiter.limit(Config.AUTH_RATELIMIT)
def auth_register_route():
    return register()

@auth_bp.route('/change_password', methods=['PUT'])
@limiter.limit(Config.AUTH_RATELIMIT)
@token_required
def auth_change_password_route(identity):
    return change_password(identity)

@auth_bp.route('/logout', methods=['POST'])
@limiter.limit(Config.AUTH_RATELIMIT)
def auth_logout_route():
    return logout()

@auth_bp.route('/session_guard', methods=['POST'])
@limiter.limit('1000 per hour')
@token_required
def auth_session_guard_route(identity):
    return session_guard(identity)
