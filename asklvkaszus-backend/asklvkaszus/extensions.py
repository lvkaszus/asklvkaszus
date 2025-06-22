from .config import Config
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
import time
from redis import Redis
from redis.exceptions import RedisError
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from flask_limiter import Limiter
from .modules.get_remote_address import get_remote_address
from flask_cors import CORS

def wait_for_db(db_uri, max_retries=60, retry_interval=1, logger=None):
    if logger is None:
        import logging

        logger = logging.getLogger("asklvkaszus")

    current_retry = 0

    sql_connection = None

    try:
        while current_retry < max_retries:
            try:
                if sql_connection is None:
                    sql_connection = create_engine(db_uri)

                with sql_connection.connect() as conn:
                    logger.info(f"Successfully connected to Application SQL Database after {current_retry+1} of {max_retries} attempts!")

                    return True

            except OperationalError as e:
                logger.warning(f"Application SQL Database is not ready yet! Retrying in {retry_interval}s... - Attempt {current_retry+1}/{max_retries}")

                time.sleep(retry_interval)

                current_retry += 1

    finally:
        if sql_connection is not None:
            sql_connection.dispose()

    logger.error(f"Could not connect to the Application SQL Database after {max_retries} attempts!")

    return False

def wait_for_redis(redis_uri, max_retries=60, retry_interval=1, logger=None):
    if logger is None:
        import logging

        logger = logging.getLogger("asklvkaszus")

    current_retry = 0

    # Always create a new Redis client to ensure a fresh connection instead of
    # defining it once and reusing it like in the `wait_for_db()` function,
    # because using a stale client may keep a broken TCP connection and cause `.ping()`
    # to completely freeze or fail silently.
    while current_retry < max_retries:
        try:
            redis_connection = Redis.from_url(redis_uri)

            redis_connection.ping()

            logger.info(f"Successfully connected to Application Redis Database after {current_retry+1} of {max_retries} attempts!")

            return True

        except RedisError as e:
            logger.warning(f"Application Redis Database is not ready yet! Retrying in {retry_interval}s... - Attempt {current_retry+1}/{max_retries}")

            time.sleep(retry_interval)

            current_retry += 1

    logger.error(f"Could not connect to the Application Redis Database after {max_retries} attempts!")

    return False


sql = SQLAlchemy()

csrf = CSRFProtect()

limiter = Limiter(key_func=get_remote_address, storage_uri=Config.REDIS_LIMITER_URI, storage_options={"socket_connect_timeout": 30}, strategy="fixed-window")

cors = CORS()

jwt_blacklist_redis_client = Redis.from_url(Config.REDIS_BLACKLISTED_TOKENS_URI, decode_responses=True)