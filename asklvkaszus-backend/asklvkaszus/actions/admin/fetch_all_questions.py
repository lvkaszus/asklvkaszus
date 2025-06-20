from ...extensions import csrf
from flask import jsonify
from ...models.questions import Questions

def admin_fetch_all_questions(identity):
    csrf.protect()

    questions = Questions.query.order_by(Questions.date.desc()).all()
    formatted_questions = []

    if questions:
        for question in questions:
            formatted_questions.append({
                'id': question.id,
                'date': question.date,
                'question': question.question,
                'answer': question.answer,
                'hidden': question.hidden,
                'ip_address': question.ip_address
            })
                
    if formatted_questions == []:
        return jsonify(message='No questions yet!'), 200
                
    return jsonify(formatted_questions), 200
