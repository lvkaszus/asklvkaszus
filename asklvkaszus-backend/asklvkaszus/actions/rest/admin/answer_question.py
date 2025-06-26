from flask import request
from ....modules.response_handler import jsonify_on_steroids
from ....modules.fields import safe_get
from ....extensions import sql
from ....models.questions import Questions
import bleach

# Ask @lvkaszus! - Administrator REST API: Answer a single question

def api_admin_answer_question():
    # Defining the response headers to be added every JSON response return.
    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    # Attempt to parse the response body as JSON if the CSRF validation passed.
    data = request.get_json()

    # When request has been sent without any JSON data, then we return an error about
    # invalid JSON payload.
    if not data:
        return jsonify_on_steroids(error="Invalid JSON payload!", headers=response_headers), 400

    # Exctracting requested Question ID to reply to
    question_id = safe_get(data, 'question_id', str)

    # If the Question ID is missing, return an error.
    if not question_id:
        return jsonify_on_steroids(error="Please provide a Question ID!", headers=response_headers), 400

    # Check if question with specified ID exists in the database by fetching the first
    # matching record.
    question = Questions.query.filter_by(id=question_id).first()

    # If question with specified ID doesn't exist, return an error.
    if not question:
        return jsonify_on_steroids(error="Question with selected ID does not exist.", headers=response_headers), 400

    # But when the question exist, we are extracting specified answer to this question.
    question_answer = safe_get(data, 'question_answer', str)

    # If question answer is empty, return an error.
    if not question_answer:
        return jsonify_on_steroids(error="Sending question reply failed. Empty replies are not allowed!", headers=response_headers), 400

    # If question answer is longer than 5000 characters, return an error.
    if len(question_answer) > 5000:
        return jsonify_on_steroids(error="Sending question reply failed. Message is too long (maximum of 5000 characters)!", headers=response_headers), 400

    # When all of the necessary checks has passed, we need to clean up the provided
    # question answer because it may contain some dangerous XSS code that we
    # don't want in our database.
    sanitized_answer = bleach.clean(
        question_answer,
        tags=[],
        attributes={},
        strip=True
    )

    # After cleaning up the question answer, pass the clean answer to the selected
    # question and commit the changes in application database.
    question.answer = sanitized_answer
    sql.session.commit()

    # Return a JSON success message with HTTP status 200 (OK).
    return jsonify_on_steroids(success="Your answer has been updated successfully!", headers=response_headers), 200
