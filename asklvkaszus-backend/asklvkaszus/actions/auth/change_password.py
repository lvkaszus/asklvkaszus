from ...extensions import csrf, sql
from flask import current_app, request, jsonify
import bcrypt
import re
from ...models.registered_users import RegisteredUsers
from datetime import datetime

def change_password(identity):
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_new_password = data.get('confirm_new_password')

    csrf.protect()

    if len(new_password) < 12:
        return jsonify(error='New password must be at least 12 characters long!'), 400
    elif not re.search("[A-Z]", new_password):
        return jsonify(error='New password must contain at least one uppercase letter!'), 400
    elif not re.search("[0-9]", new_password):
        return jsonify(error='New password must contain at least one number!'), 400
    elif not re.search("[!@#$%^&*]", new_password):
        return jsonify(error='Password must contain at least one special character like: !, @, #, $, %, ^, &, *'), 400
    elif new_password == old_password:
        return jsonify(error="New password must not be the same as old password!"), 400
    elif new_password != confirm_new_password:
        return jsonify(error='Confirmed password is not the same as new password!'), 400

    try:
        user = RegisteredUsers.query.filter_by(username=identity).first()

        if user and bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
            salt = bcrypt.gensalt(rounds=14)

            hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

            user.password = hashed_new_password
            
            user.last_password_change = datetime.now()
            user.password_change_count += 1

            sql.session.commit()

            current_app.logger.info('%s changed password successfully!', user.username)

            response = jsonify(success='Password change successful!')
            response.status_code = 200

        else:
            current_app.logger.info('%s entered an incorrect password while changing current password!', user.username)

            response = jsonify(error='Incorrect old password!')
            response.status_code = 401

        return response

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/auth/change_password module: {e}")

        return jsonify(error='An error occured while changing your password! Try again later.'), 500

    finally:
        sql.session.close()