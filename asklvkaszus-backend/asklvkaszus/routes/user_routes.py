from flask import Blueprint, jsonify
from ..config import Config
from ..extensions import limiter
from ..actions.fetch_backend_version import fetch_backend_version
from ..actions.auth.fetch_csrf_token import fetch_csrf_token
from ..actions.user.app_settings import user_app_settings
from ..actions.user.fetch_all_questions import user_fetch_all_questions
from ..actions.user.submit_question import user_submit_question

user_bp = Blueprint('user', __name__)

@user_bp.route('/fetch_backend_version', methods=['GET'])
@limiter.limit('50 per hour')
def user_fetch_backend_version_route():
    return fetch_backend_version()


@user_bp.route('/fetch_csrf_token', methods=['GET'])
@limiter.limit('500 per hour')
def user_fetch_csrf_token_route():
    return fetch_csrf_token()


@user_bp.route('/app_settings', methods=['GET'])
@limiter.limit('50 per hour')
def user_app_settings_route():
    return user_app_settings()


@user_bp.route('/fetch_all_questions', methods=['POST'])
@limiter.limit('500 per hour')
def user_fetch_all_questions_route():
    return user_fetch_all_questions()

@user_bp.route('/submit_question', methods=['POST'])
@limiter.limit(Config.USER_RATELIMIT)
def user_submit_question_route():
    return user_submit_question()