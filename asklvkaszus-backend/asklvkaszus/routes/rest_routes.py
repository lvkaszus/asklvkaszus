from flask import Blueprint, jsonify
from ..config import Config
from ..extensions import limiter
from ..modules.rest_core import require_api_key, require_user_api_enabled

from ..actions.fetch_backend_version import fetch_backend_version
from ..actions.rest.admin.answer_question import api_admin_answer_question
from ..actions.rest.admin.app_settings import api_admin_app_settings
from ..actions.rest.admin.block_sender import api_admin_block_sender
from ..actions.rest.admin.configure_notifications import api_admin_configure_notifications
from ..actions.rest.admin.fetch_all_questions import api_admin_fetch_all_questions
from ..actions.rest.admin.fetch_blocked_senders import api_admin_fetch_blocked_senders
from ..actions.rest.admin.fetch_updates import api_admin_fetch_updates
from ..actions.rest.admin.purge_all_questions import api_admin_purge_all_questions
from ..actions.rest.admin.purge_question import api_admin_purge_question
from ..actions.rest.admin.toggle_all_questions_visibility import api_admin_toggle_all_questions_visibility
from ..actions.rest.admin.toggle_question_visibility import api_admin_toggle_question_visibility
from ..actions.rest.admin.unblock_all_senders import api_admin_unblock_all_senders
from ..actions.rest.admin.unblock_sender import api_admin_unblock_sender
from ..actions.rest.admin.user_info import api_admin_user_info

from ..actions.rest.user.app_settings import api_user_app_settings
from ..actions.rest.user.fetch_all_questions import api_user_fetch_all_questions
from ..actions.rest.user.submit_question import api_user_submit_question


rest_bp = Blueprint('rest', __name__)

@rest_bp.route('/fetch_backend_version', methods=['GET'])
@limiter.limit('50 per hour')
@require_api_key
def rest_fetch_backend_version_route():
    return fetch_backend_version()

@rest_bp.route('/admin/answer_question', methods=['PUT'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_answer_question_route():
    return api_admin_answer_question()

@rest_bp.route('/admin/app_settings', methods=['GET', 'POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_app_settings_route():
    return api_admin_app_settings()

@rest_bp.route('/admin/block_sender', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_block_sender_route():
    return api_admin_block_sender()

@rest_bp.route('/admin/configure_notifications', methods=['PUT'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_configure_notifications_route():
    return api_admin_configure_notifications()

@rest_bp.route('/admin/fetch_all_questions', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_fetch_all_questions_route():
    return api_admin_fetch_all_questions()

@rest_bp.route('/admin/fetch_blocked_senders', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_fetch_blocked_senders_route():
    return api_admin_fetch_blocked_senders()

@rest_bp.route('/admin/fetch_updates', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_fetch_updates_route():
    return api_admin_fetch_updates()

@rest_bp.route('/admin/purge_all_questions', methods=['DELETE'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_purge_all_questions_route():
    return api_admin_purge_all_questions()

@rest_bp.route('/admin/purge_question', methods=['DELETE'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_purge_question_route():
    return api_admin_purge_question()

@rest_bp.route('/admin/toggle_all_questions_visibility', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_toggle_all_questions_visibility_route():
    return api_admin_toggle_all_questions_visibility()

@rest_bp.route('/admin/toggle_question_visibility', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_toggle_question_visibility_route():
    return api_admin_toggle_question_visibility()

@rest_bp.route('/admin/unblock_all_senders', methods=['DELETE'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_unblock_all_senders_route():
    return api_admin_unblock_all_senders()

@rest_bp.route('/admin/unblock_sender', methods=['DELETE'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_unblock_sender_route():
    return api_admin_unblock_sender()

@rest_bp.route('/admin/user_info', methods=['GET'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_api_key
def rest_admin_user_info_route():
    return api_admin_user_info()



@rest_bp.route('/user/app_settings', methods=['GET'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_user_api_enabled
def rest_user_app_settings_route():
    return api_user_app_settings()

@rest_bp.route('/user/fetch_all_questions', methods=['GET'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_user_api_enabled
def rest_user_fetch_all_questions_route():
    return api_user_fetch_all_questions()

@rest_bp.route('/user/submit_question', methods=['POST'])
@limiter.limit(Config.API_ADMIN_RATELIMIT)
@require_user_api_enabled
def rest_user_submit_question_route():
    return api_user_submit_question()
