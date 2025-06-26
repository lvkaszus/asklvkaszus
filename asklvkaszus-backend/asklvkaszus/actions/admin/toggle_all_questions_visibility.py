from ...extensions import csrf, sql
from ...modules.response_handler import jsonify_on_steroids
from ...models.questions import Questions

def admin_toggle_all_questions_visibility(identity):
    csrf.protect()

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    all_questions = Questions.query.all()

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
