from flask import jsonify
from ....extensions import sql
from ....models.questions import Questions

def api_admin_toggle_all_questions_visibility():
    all_questions = Questions.query.all()

    if not all_questions:
        return jsonify(error='There are no questions yet!'), 404

    if all(question.hidden for question in all_questions):
        for question in all_questions:
            question.hidden = False
        message = 'All questions are now visible.'
    else:
        for question in all_questions:
            question.hidden = True
        message = 'All questions are now hidden.'

    sql.session.commit()
    
    return jsonify(success=message), 200
