from flask import jsonify
from ....modules.response_handler import jsonify_on_steroids
from ....extensions import sql
from ....models.questions import Questions

def api_admin_toggle_all_questions_visibility():
    all_questions = Questions.query.all()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if not all_questions:
        return jsonify_on_steroids(error='There are no questions yet!', headers=response_headers), 404

    if all(question.hidden for question in all_questions):
        for question in all_questions:
            question.hidden = False
        message = 'All questions are now visible.'
    else:
        for question in all_questions:
            question.hidden = True
        message = 'All questions are now hidden.'

    sql.session.commit()
    
    return jsonify_on_steroids(success=message, headers=response_headers), 200
