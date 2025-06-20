from flask import jsonify
from ...models.questions import Questions

def user_fetch_all_questions():
    questions = Questions.query.order_by(Questions.date.desc()).all()
    formatted_questions = []

    if questions:
        for question in questions:
            if not question.hidden:
                formatted_questions.append({
                    'id': question.id,
                    'date': question.date.strftime("%Y-%m-%d %H:%M:%S"),
                    'question': question.question,
                    'answer': question.answer
                })

    if formatted_questions == []:
        return jsonify(message='No questions yet!'), 200
                
    return jsonify(formatted_questions), 200
