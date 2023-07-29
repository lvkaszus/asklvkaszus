###############################
#   Ask @lvkaszus! Back-end   #
# --------------------------- #
#     Python Flask Engine     #
# --------------------------- #
#          WARNING!           #
#  It may not work properly   #
#   if it's not in a Docker   #
#         container!          #
###############################

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random
import string
import os
import mysql.connector
from bleach import clean
from html import escape
import urllib.parse
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)


# BEGIN CONFIGURATION

main_url = os.environ.get('YOUR_MAIN_FRONTEND')
admin_url = os.environ.get('YOUR_ADMIN_FRONTEND')

if not main_url or not admin_url:
    origins = "*"
else:
    origins = [main_url, admin_url]

CORS(app, origins=origins)


API_KEY = os.environ.get('AUTH_KEY', 'changeme')

def get_database_connection():
    host = os.environ.get('MYSQL_HOST', 'localhost')
    port = int(os.environ.get('MYSQL_PORT', '3306'))
    user = os.environ.get('MYSQL_USER', 'asklvkaszus')
    password = os.environ.get('MYSQL_PASSWORD', 'changeme')
    database = os.environ.get('MYSQL_DATABASE', 'asklvkaszus')

    return mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database
    )

redisurl = os.environ.get('REDIS_URL', 'redis://localhost:6379')

# END CONFIGURATION


def get_remote_address():
    forwarded_for = request.headers.get('X-Forwarded-For')
    if forwarded_for:
        client_ip = forwarded_for.split(',')[0].strip()
        return client_ip

    return request.remote_addr

limiter = Limiter(get_remote_address, app=app, storage_uri=redisurl, storage_options={"socket_connect_timeout": 30}, strategy="fixed-window")


def create_questions_table():
    conn = get_database_connection()
    cursor = conn.cursor()

    create_table_query = '''
    CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(4) NOT NULL,
        date DATETIME NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        PRIMARY KEY (id)
    )
    '''

    cursor.execute(create_table_query)
    conn.commit()
    conn.close()

def generate_id():
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(4))

def requires_auth(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Ask-lvkaszus-Auth-Key: '):
            return jsonify(message='Unauthorized'), 403
        _, provided_api_key = auth_header.split(' ')
        if provided_api_key != API_KEY:
            return jsonify(message='Incorrect API Key'), 403
        return f(*args, **kwargs)

    decorated.__name__ = f.__name__
    return decorated


@app.route('/api/v1/submit_question', methods=['POST'])
@limiter.limit("30 per hour")
def submit_question():
    question = request.headers.get('Question', '')
    if not question.strip():
        return jsonify(message='Sending question failed. Empty questions not allowed'), 400

    # Decode the question from UTF-8 encoding
    decoded_question = urllib.parse.unquote(question)

    # Sanitize the decoded question
    sanitized_question = clean(decoded_question)

    # Escape the sanitized question
    escaped_question = escape(sanitized_question)

    if escaped_question.strip():
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry_id = generate_id()
        create_questions_table()
        conn = get_database_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO questions (id, date, question, answer) VALUES (%s, %s, %s, %s)",
            (entry_id, now, escaped_question, 'TODO')
        )
        conn.commit()
        conn.close()
        return jsonify(message='Question has been sent successfully'), 200
    else:
        return jsonify(message='Sending question failed. Check your question and try again'), 400


@app.route('/api/v1/fetch_all_questions', methods=['GET'])
def get_questions():
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, date, question, answer FROM questions ORDER BY date DESC")
    rows = cursor.fetchall()
    questions = []
    for row in rows:
        entry_id = row[0]
        date_str = row[1]
        question_str = row[2]
        answer_str = row[3] if len(row) == 4 else None

        if isinstance(date_str, str):
            date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        else:
            date = date_str

        questions.append({
            'id': entry_id,
            'date': date.strftime("%Y-%m-%d %H:%M:%S"),
            'question': question_str,
            'answer': answer_str
        })

    conn.close()

    if questions:
        return jsonify(questions)
    else:
        return jsonify(message='No questions yet'), 200


@app.route('/api/v1/secure/reply_to_question/<question_id>', methods=['POST'])
@limiter.limit("30 per hour")
@requires_auth
def reply_to_question(question_id):
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions WHERE id=%s", (question_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify(message='Question with selected ID does not exist'), 404

    answer = request.headers.get('Answer', '')
    if not answer:
        return jsonify(message='No answer to selected question'), 400

    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE questions SET answer=%s WHERE id=%s", (answer, question_id))
    conn.commit()
    conn.close()

    return jsonify(message='Answer has been updated successfully')


@app.route('/api/v1/secure/purge_all_questions', methods=['POST'])
@limiter.limit("30 per hour")
@requires_auth
def purge_all_questions():
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions")
    conn.commit()
    conn.close()

    return jsonify(message='Successfully purged all questions'), 200


@app.route('/api/v1/secure/purge_question/<question_id>', methods=['POST'])
@limiter.limit("30 per hour")
@requires_auth
def purge_question(question_id):
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions WHERE id=%s", (question_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify(message='Question with selected ID does not exist'), 404

    cursor.execute("DELETE FROM questions WHERE id=%s", (question_id,))
    conn.commit()
    conn.close()

    return jsonify(message='Question has been purged successfully')

if __name__ == '__main__':
    app.run()