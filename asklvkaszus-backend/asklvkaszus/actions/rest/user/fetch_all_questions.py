from flask import current_app, jsonify
from ....extensions import csrf, sql
from ....models.questions import Questions

def api_user_fetch_all_questions():
    csrf.protect()

    try:
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

    except Exception as e:
        current_app.logger.error(f"An error occured inside asklvkaszus/actions/rest/user/fetch_all_questions module: {e}")

        return jsonify(error='An error occurred while fetching questions list! Try again later.'), 500
        
    finally:
        sql.session.close()