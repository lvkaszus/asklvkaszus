from ...modules.response_handler import jsonify_on_steroids
from ...models.questions import Questions
from ...modules.text_escape import escape_for_output

def user_fetch_all_questions():
    questions = Questions.query.order_by(Questions.date.desc()).all()
    formatted_questions = []

    if questions:
        for question in questions:
            if not question.hidden:
                formatted_questions.append({
                    'id': question.id,
                    'date': question.date,
                    'question': escape_for_output(question.question),
                    'answer': escape_for_output(question.answer),
                })

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    if not formatted_questions:
        return jsonify_on_steroids(message='No questions yet!', headers=response_headers), 200

    return jsonify_on_steroids(formatted_questions, headers=response_headers), 200
