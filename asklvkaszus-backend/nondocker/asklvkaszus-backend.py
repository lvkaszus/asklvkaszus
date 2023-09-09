#################################
#         Ask @lvkaszus!        #
# ============================= #
#      Python Flask Engine      #
# ----------------------------- #
#            WARNING!           #
#    It may not work properly   #
#      if it's in a Docker      #
#           container!          #
# ============================= #
#     Written by @lvkaszus      #
#################################

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from datetime import datetime
from bleach import clean
from html import escape
import mysql.connector
import redis
import random
import string
import urllib.parse
import sys

# ----- BEGINNING OF CONFIGURATION -----

FRONTEND_HOST = "https://your-frontend.host"        # Domain Name of your Frontend part of this application (Example: "ask.lvkasz.us" or "ask.lvkasz.us:3100")
ADMIN_HOST    = "https://your-backend.host"         # Domain Name of your Admin Panel part of this application (Example: "admin-ask.lvkasz.us" or "admin-ask.lvkasz.us:3200")

SENDMSG_LIMIT = "10 per hour"                       # Send Question Rate-limiting: How many requests are allowed in what period of time for sending questions? - '10 per hour' is default.
ADMIN_LIMIT   = "50 per hour"                       # Admin Rate-limiting: How many requests are allowed in what period of time for an administrator? - '50 per hour' is default.

API_KEY       = "changeme"                          # Your secret API Authentication Key for Authorization by using API or Admin Panel (replying to questions, deleting them etc.) Please change it from 'changeme' and set it to something that has ideally +24 characters.

SQL_HOST      = 'localhost'                         # Hostname or IP Address to your MySQL/MariaDB Server where your Q&A data will be saved (questions, answers) - 'localhost' is default.
SQL_PORT      = 3306                                # Port number of your MySQL/MariaDB Server. - 3306 is default.
SQL_USER      = 'asklvkaszus'                       # Username in your MySQL/MariaDB Server for this application. If you didn't created a new user yet, please do this.
SQL_PASSWORD  = 'admin'                             # Password of your MySQL/MariaDB User that you provided above. Please change it from 'admin' and set it to something that has ideally +16 characters.
SQL_DATABASE  = 'asklvkaszus'                       # Database name that will be used by your selected MySQL/MariaDB User. - If you didn't created a new database yet, please do this.

# !DEPRECATED! : redisurl = "redis://localhost:6379"
# FROM NOW, PLEASE USE THIS VARIABLES BELOW!
REDIS_HOST    = 'localhost'                         # Hostname or IP Address to your Redis Server where rate-limiting and temporary data will be stored. 'localhost' is default.
REDIS_PORT    = 6379                                # Port number of your Redis Server - 6379 is default.
REDIS_DBS     = [0, 1]                              # Database numbers in your Redis Server. Number '0' is for rate-limiting data, and '1' is for temporary data (only for storing generated ID's temporarily for now)

# ----- END OF CONFIGURATION -----



app = Flask(__name__)

# Configuring CORS Headers to make API a little bit more secure
CORS(app, origins = ["https://" + host for host in [FRONTEND_HOST, ADMIN_HOST]])

# Configuring Redis Database URL and Redis Database IDs
redis_limiter_db = "redis://" + REDIS_HOST + ":" + str(REDIS_PORT) + "/" + str(REDIS_DBS[0])
redis_idgen_db = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DBS[1])

# Global ANSI Color Codes for colorful warning/error messages
C_CYAN = "\033[36m"
C_RED = "\033[91m"
C_RESET = "\033[0m"

# Getting User IP Address to make rate-limiting working by fetching X-Forwarded-For Header (nginx)
def get_client_ip():
    forwarded_for = request.headers.get('X-Forwarded-For')
    if forwarded_for:
        client_ip = forwarded_for.split(',')[0].strip()
        return client_ip

    return request.remote_addr
    
# Configuring Flask Limiter as a rate-limiter
limiter = Limiter(get_client_ip, app=app, storage_uri=redis_limiter_db, storage_options={"socket_connect_timeout": 30}, strategy="fixed-window")

# Configuring MySQL/MariaDB Database connection to put Q&A Data in it
def get_database_connection():
    return mysql.connector.connect(host=SQL_HOST, port=SQL_PORT, user=SQL_USER, password=SQL_PASSWORD, database=SQL_DATABASE)

# Creating "questions" database table if it does not exist (maybe fresh database or deleted table)
def create_questions_table():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(8) NOT NULL,
        date DATETIME NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        PRIMARY KEY (id)
    )
    ''')
    conn.commit()
    conn.close()

# Generate 8 characters long ID for every submitted question and make them unique by reading them from already generated IDs in Redis
def generate_id():
    while True:
        new_id = ''.join(random.choice(string.ascii_uppercase) for _ in range(8))
        if not redis_idgen_db.sismember("used_ids", new_id):
            redis_idgen_db.sadd("used_ids", new_id)
            return new_id

# Make API Endpoints authenticated by reading "Authorization: Ask-lvkaszus-Auth-Key: <your_api_key>" and your provided API Key from configuration
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


# Detect if user has changed API Authorization and Database credentials in defined variables or not - and also if they are minimum 16 and 24 characters

# PLEASE DO NOT REMOVE OR COMMENT THOSE LINES BELOW UNLESS YOU KNOW WHAT YOU ARE DOING!
# THEY ARE FOR YOUR SECURITY!
if API_KEY == "changeme":
    print('')
    print('[' + C_CYAN + 'Ask @lvkaszus! - Backend' + C_RESET + '] ' + C_RED + 'ERROR! ' + C_RESET + 'API_KEY has default value! Please change this from "changeme" to something more secure!')
    print('')
    sys.exit(1)

if SQL_PASSWORD == "admin":
    print('')
    print('[' + C_CYAN + 'Ask @lvkaszus! - Backend' + C_RESET + '] ' + C_RED + 'ERROR! ' + C_RESET + 'SQL_PASSWORD has default value! Please change this from "admin" to something more secure!')
    print('')
    sys.exit(2)

if len(API_KEY) < 24:
    print('')
    print('[' + C_CYAN + 'Ask @lvkaszus! - Backend' + C_RESET + '] ' + C_RED + 'ERROR! ' + C_RESET + 'API_KEY is less than 24 characters! Please fix this by providing more secure authorization key!')
    print('')
    sys.exit(3)

if len(SQL_PASSWORD) < 16:
    print('')
    print('[' + C_CYAN + 'Ask @lvkaszus! - Backend' + C_RESET + '] ' + C_RED + 'ERROR! ' + C_RESET + 'SQL_PASSWORD is less than 24 characters! Please fix this by providing more secure password!')
    print('')
    sys.exit(4)

# API Endpoint: For submitting questions by POST requests
@app.route('/api/v1/submit_question', methods=['POST'])
@limiter.limit(SENDMSG_LIMIT)
def submit_question():
    # Get submitted question from "Question: <something>" HTTP Header
    question = request.headers.get('Question', '')

    # If submitted question is empty, throw an error
    if not question.strip():
        return jsonify(message='Sending question failed. Empty questions not allowed'), 400

    # Decode the received question from UTF-8 encoding
    decoded_question = urllib.parse.unquote(question)

    # Sanitize the decoded question
    sanitized_question = clean(decoded_question)

    # Escape the sanitized question
    escaped_question = escape(sanitized_question)

    # Encode the question back to UTF-8 (This may be a vulnerability, but it is for React Frontend & Admin Panel to display it properly - without this, when emoji was submitted for example, then Axios from React was returning some errors)
    encoded_question = urllib.parse.quote(escaped_question)

    # Put everything in MySQL/MariaDB Database
    if question.strip():
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry_id = generate_id()
        create_questions_table()
        conn = get_database_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO questions (id, date, question, answer) VALUES (%s, %s, %s, %s)",
            (entry_id, now, encoded_question, 'TODO')
        )
        conn.commit()
        conn.close()
        return jsonify(message='Question has been sent successfully')
    else:
        return jsonify(message='Sending question failed. Check your question and try again'), 400


# API Endpoint: For fetching all questions by GET requests
@app.route('/api/v1/fetch_all_questions', methods=['GET'])
def get_questions():
    # Fetch everything from MySQL/MariaDB Database
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, date, question, answer FROM questions ORDER BY date DESC")
    rows = cursor.fetchall()
    questions = []

    # Format and put everything to JSON format
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

    # If there are questions in the database, display them - if not, throw message about no questions found
    if questions:
        return jsonify(questions)
    else:
        return jsonify(message='No questions yet')

# API Endpoint: For replying to asked questions by question IDs and POST requests
@app.route('/api/v1/secure/reply_to_question/<question_id>', methods=['POST'])
@limiter.limit(ADMIN_LIMIT)
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
    # If submitted reply is empty, throw an error
    if not answer:
        return jsonify(message='No answer to selected question'), 400

    # Decode the answer from UTF-8 encoding
    decoded_rep = urllib.parse.unquote(answer)

    # Sanitize the decoded answer
    sanitized_rep = clean(decoded_rep)

    # Escape the sanitized answer
    escaped_rep = escape(sanitized_rep)

    # Encode the answer back to UTF-8 (This may be a vulnerability, but it is for React Frontend & Admin Panel to display it properly - without this, when emoji was submitted for example, then Axios from React was returning some errors)
    encoded_rep = urllib.parse.quote(escaped_rep)

    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE questions SET answer=%s WHERE id=%s", (encoded_rep, question_id))
    conn.commit()
    conn.close()

    return jsonify(message='Answer has been updated successfully')


# API Endpoint: For purging all of submitted questions from database by POST requests
@app.route('/api/v1/secure/purge_all_questions', methods=['POST'])
@limiter.limit(ADMIN_LIMIT)
@requires_auth
def purge_all_questions():
    create_questions_table()
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions")
    redis_idgen_db.flushdb()
    conn.commit()
    conn.close()

    return jsonify(message='Successfully purged all questions')


# API Endpoint: For purging one of submitted questions from database by POST requests
@app.route('/api/v1/secure/purge_question/<question_id>', methods=['POST'])
@limiter.limit(ADMIN_LIMIT)
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
    redis_idgen_db.srem("used_ids", (question_id))
    conn.commit()
    conn.close()

    return jsonify(message='Question has been purged successfully')


# Finally, start the backend!
if __name__ == '__main__':
    app.run()
