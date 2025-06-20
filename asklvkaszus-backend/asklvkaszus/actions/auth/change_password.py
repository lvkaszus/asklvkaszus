from ...extensions import csrf, sql
from ...modules.fields import safe_get
from flask import current_app, request, jsonify
import bcrypt
import re
from ...models.registered_users import RegisteredUsers
from datetime import datetime, timezone

# Ask @lvkaszus! - Auth System REST API: Change current user password

def change_password(identity):
    # Check CSRF token and session cookie when HTTP request method is POST
    # as defined in the application configuration script (config.py: WTF_CSRF_METHODS)
    # by using function from Flask-WTF library.
    csrf.protect()

    # If the CSRF validation passed, this API route expects a request with JSON
    # data as a payload.
    data = request.get_json()

    # When request has been sent without any JSON data, then we return an error about
    # invalid JSON payload.
    if not data:
        return jsonify(error="Invalid JSON payload!"), 400

    # Next, extract old_password, new_password, and confirm_new_password fields from the JSON data.
    old_password = safe_get(data, 'old_password', str)
    new_password = safe_get(data, 'new_password', str)
    confirm_new_password = safe_get(data, 'confirm_new_password', str)

    # If any required field is missing, return an error.
    if not old_password or not new_password or not confirm_new_password:
        return jsonify(error="Old Password, New Password and Confirm New Password is required!"), 400


    # Now, validate the password according to security requirements:
    # - New password must have minimum of 12 characters
    # - New password must have maximum of 100 characters
    # - New password may contain only Latin letters, digits and special characters
    # - New password must have at least one uppercase letter
    # - New password must have at least one number
    # - New password must have at least one special character
    # - New password must match the confirmation password
    if len(new_password) < 12:
        return jsonify(error='New password must be at least 12 characters long!'), 400

    elif len(new_password) > 100:
        return jsonify(error="New password must be less than 100 characters long!"), 400

    elif not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", new_password):
        return jsonify(error="New password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!"), 400

    elif not re.search("[A-Z]", new_password):
        return jsonify(error='New password must contain at least one uppercase letter!'), 400

    elif not re.search("[0-9]", new_password):
        return jsonify(error='New password must contain at least one number!'), 400

    elif not re.search("[!@#$%^&*]", new_password):
        return jsonify(error='New password must contain at least one special character like: !, @, #, $, %, ^, &, *!'), 400

    elif new_password == old_password:
        return jsonify(error="New password must not be the same as old password!"), 400

    elif new_password != confirm_new_password:
        return jsonify(error='Confirmed password is not the same as new password!'), 400


    # If all checks pass, we check if a user account with the provided username exists
    # in the database by fetching the first matching record.
    user = RegisteredUsers.query.filter_by(username=identity).first()

    # If an user with the provided username exists in the database and the provided
    # old password matches the stored (hashed) password, proceed with password change
    if user and bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        # If all checks pass, generate a secure salt and hash the password using bcrypt.
        salt = bcrypt.gensalt(rounds=14)
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

        # Update the user's password in the database with the new hashed password.
        user.password = hashed_new_password
        
        # Update the timestamp of the last password change to the current time.
        user.last_password_change = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        # Increment the password change counter for auditing purposes.
        user.password_change_count += 1

        # Commit the changes to the database to persist the new password and metadata.
        sql.session.commit()

        # Log the successful password change event with the username.
        current_app.logger.info('%s changed password successfully!', user.username)

        # Return a success message in JSON format with HTTP status 200 (OK).
        return jsonify(success='Password change successful!'), 200

    else:
        # Log the failed password change attempt due to incorrect old password.
        current_app.logger.info('%s entered an incorrect password while changing current password!', user.username)

        # Return a JSON error message with HTTP status 401 (Unauthorized).
        return jsonify(error='Incorrect old password!'), 401
