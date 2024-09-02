from flask import Blueprint, jsonify
from ..config import Config
from ..extensions import limiter
from ..modules.jwt_core import token_required
from ..actions.fetch_backend_version import fetch_backend_version
from ..actions.auth.fetch_csrf_token import fetch_csrf_token

from ..actions.admin.answer_question import admin_answer_question
from ..actions.admin.app_settings import admin_app_settings
from ..actions.admin.block_sender import admin_block_sender
from ..actions.admin.configure_notifications import admin_configure_notifications
from ..actions.admin.fetch_all_questions import admin_fetch_all_questions
from ..actions.admin.fetch_blocked_senders import admin_fetch_blocked_senders
from ..actions.admin.fetch_updates import admin_fetch_updates
from ..actions.admin.purge_all_questions import admin_purge_all_questions
from ..actions.admin.purge_question import admin_purge_question
from ..actions.admin.refresh_api_token import admin_refresh_api_token
from ..actions.admin.toggle_admin_api import admin_toggle_admin_api
from ..actions.admin.toggle_all_questions_visibility import admin_toggle_all_questions_visibility
from ..actions.admin.toggle_question_visibility import admin_toggle_question_visibility
from ..actions.admin.toggle_user_api import admin_toggle_user_api
from ..actions.admin.unblock_all_senders import admin_unblock_all_senders
from ..actions.admin.unblock_sender import admin_unblock_sender
from ..actions.admin.user_info import admin_user_info

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/fetch_backend_version', methods=['GET'])
@limiter.limit('50 per hour')
def admin_fetch_backend_version_route():
    return fetch_backend_version()


@admin_bp.route('/fetch_csrf_token', methods=['GET'])
@limiter.limit('2000 per hour')
def admin_fetch_csrf_token_route():
    return fetch_csrf_token()


@admin_bp.route('/answer_question', methods=['PUT'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_answer_question_route(identity):
    return admin_answer_question(identity)

@admin_bp.route('/app_settings', methods=['GET'])
@limiter.limit(Config.ADMIN_RATELIMIT)
def admin_get_app_settings_route():
    return admin_app_settings(identity=None)

@admin_bp.route('/app_settings', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_update_app_settings_route(identity):
    return admin_app_settings(identity)

@admin_bp.route('/block_sender', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_block_sender_route(identity):
    return admin_block_sender(identity)

@admin_bp.route('/configure_notifications', methods=['PUT'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_configure_notifications_route(identity):
    return admin_configure_notifications(identity)

@admin_bp.route('/fetch_all_questions', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_fetch_all_questions_route(identity):
    return admin_fetch_all_questions(identity)

@admin_bp.route('/fetch_blocked_senders', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_fetch_blocked_senders_route(identity):
    return admin_fetch_blocked_senders(identity)

@admin_bp.route('/fetch_updates', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_fetch_updates_route(identity):
    return admin_fetch_updates(identity)

@admin_bp.route('/purge_all_questions', methods=['DELETE'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_purge_all_questions_route(identity):
    return admin_purge_all_questions(identity)

@admin_bp.route('/purge_question', methods=['DELETE'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_purge_question_route(identity):
    return admin_purge_question(identity)

@admin_bp.route('/refresh_api_token', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_refresh_api_token_route(identity):
    return admin_refresh_api_token(identity)

@admin_bp.route('/toggle_admin_api', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_toggle_admin_api_route(identity):
    return admin_toggle_admin_api(identity)

@admin_bp.route('/toggle_all_questions_visibility', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_toggle_all_questions_visibility_route(identity):
    return admin_toggle_all_questions_visibility(identity)

@admin_bp.route('/toggle_question_visibility', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_toggle_question_visibility_route(identity):
    return admin_toggle_question_visibility(identity)

@admin_bp.route('/toggle_user_api', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_toggle_user_api_route(identity):
    return admin_toggle_user_api(identity)

@admin_bp.route('/unblock_all_senders', methods=['DELETE'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_unblock_all_senders_route(identity):
    return admin_unblock_all_senders(identity)

@admin_bp.route('/unblock_sender', methods=['DELETE'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_unblock_sender_route(identity):
    return admin_unblock_sender(identity)

@admin_bp.route('/user_info', methods=['POST'])
@limiter.limit(Config.ADMIN_RATELIMIT)
@token_required
def admin_user_info_route(identity):
    return admin_user_info(identity)
