from ..extensions import sql
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from redis import Redis
from ..config import Config
from redis.exceptions import RedisError
from flask import current_app
from ..modules.response_handler import jsonify_on_steroids

def health_check():
    db_status = None
    db_error = None
    redis_status = None
    redis_error = None

    try:
        sql.session.execute(text("SELECT 1"))

        db_status = "ok"
        db_error = None

    except SQLAlchemyError as e:
        db_status = "error"
        db_error = str(e)

    try:
        client = Redis.from_url(Config.REDIS_SERVER_URI)

        client.ping()
        
        redis_status = "ok"
        redis_error = None

    except (RedisError) as e:
        redis_status = "error"
        redis_error = str(e)


    overall_status = "ok" if db_status == "ok" and redis_status == "ok" else "error"
    http_status = 200 if overall_status == "ok" else 503

    if db_status != "ok":
        current_app.logger.critical(f"Application SQL Database Error: {db_error}")

    if redis_status != "ok":
        current_app.logger.critical(f"Application Redis Database Error: {redis_error}")

    response_headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    return jsonify_on_steroids(status=overall_status, headers=response_headers), http_status
