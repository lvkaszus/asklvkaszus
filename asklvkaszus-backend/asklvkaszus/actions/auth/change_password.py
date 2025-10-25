from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import current_app, request
from ...modules.response_handler import jsonify_on_steroids
import bcrypt
import re
from ...models.registered_users import RegisteredUsers
from datetime import datetime, timezone

def change_password(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    data = request.get_json()

    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    old_password = safe_get(data, 'old_password', str)
    new_password = safe_get(data, 'new_password', str)
    confirm_new_password = safe_get(data, 'confirm_new_password', str)

    if not old_password or not new_password or not confirm_new_password:
        return jsonify_on_steroids(error="Old Password, New Password and Confirm New Password is required!", headers=response_headers), 400


    if len(new_password) < 12:
        return jsonify_on_steroids(error='New password must be at least 12 characters long!', headers=response_headers), 400

    elif len(new_password) > 100:
        return jsonify_on_steroids(error="New password must be less than 100 characters long!", headers=response_headers), 400

    elif not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", new_password):
        return jsonify_on_steroids(error="New password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!", headers=response_headers), 400

    elif not re.search("[A-Z]", new_password):
        return jsonify_on_steroids(error='New password must contain at least one uppercase letter!', headers=response_headers), 400

    elif not re.search("[0-9]", new_password):
        return jsonify_on_steroids(error='New password must contain at least one number!', headers=response_headers), 400

    elif not re.search("[!@#$%^&*]", new_password):
        return jsonify_on_steroids(error='New password must contain at least one special character like: !, @, #, $, %, ^, &, *!', headers=response_headers), 400

    elif new_password == old_password:
        return jsonify_on_steroids(error="New password must not be the same as old password!", headers=response_headers), 400

    elif new_password != confirm_new_password:
        return jsonify_on_steroids(error='Confirmed password is not the same as new password!', headers=response_headers), 400


    user = RegisteredUsers.query.filter_by(username=identity).first()

    if user and bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        salt = bcrypt.gensalt(rounds=14)
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

        user.password = hashed_new_password
        
        user.last_password_change = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        user.password_change_count += 1

        sql.session.commit()

        current_app.logger.info('%s changed password successfully!', user.username)

        return jsonify_on_steroids(success='Password change successful!', headers=response_headers), 200

    else:
        current_app.logger.info('%s entered an incorrect password while changing current password!', user.username)

        return jsonify_on_steroids(error='Incorrect old password!', headers=response_headers), 401
