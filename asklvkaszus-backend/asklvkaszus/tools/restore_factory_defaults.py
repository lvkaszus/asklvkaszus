import os
import sys
import yaml
import mysql.connector
from redis import Redis
import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(name)s] - %(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger("Ask @lvkaszus! - Backend: Tools")

def load_config():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    config_path = os.path.join(base_dir, 'config/config.yml')

    if not os.path.exists(config_path):
        logger.critical(f"Configuration file {config_path} not found.")
        sys.exit(1)

    try:
        with open(config_path, 'r') as file:
            return yaml.safe_load(file)
    except yaml.YAMLError as e:
        logger.critical(f"Error in configuration file syntax: {e}")
        sys.exit(2)

def connect_to_mysql_database(config):
    try:
        connection = mysql.connector.connect(
            host=config['mysql'].get('host', 'localhost'),
            port=config['mysql'].get('port', 3306),
            user=config['mysql'].get('username', 'asklvkaszus'),
            password=config['mysql'].get('password', 'asklvkaszus'),
            database=config['mysql'].get('database', 'asklvkaszus'),
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        return connection, connection.cursor()
    except Exception as e:
        logger.critical(f"Failed to connect to MySQL database: {e}")
        sys.exit(3)

def connect_to_redis_databases(config):
    try:
        limiter_url = f"redis://{config['redis'].get('username', 'asklvkaszus')}:{config['redis'].get('password', 'asklvkaszus')}@{config['redis'].get('host', 'localhost')}:{config['redis'].get('port', '6379')}/{config['redis'].get('rate_limiting_db', 0)}"
        blacklisted_tokens_url = f"redis://{config['redis'].get('username', 'asklvkaszus')}:{config['redis'].get('password', 'asklvkaszus')}@{config['redis'].get('host', 'localhost')}:{config['redis'].get('port', '6379')}/{config['redis'].get('blacklisted_tokens_db', 1)}"

        return Redis.from_url(limiter_url), Redis.from_url(blacklisted_tokens_url, decode_responses=True)
    except Exception as e:
        logger.critical(f"Failed to connect to Redis databases: {e}")
        sys.exit(4)

def reset_mysql(cursor):
    tables = [
        "alembic_version", "app_settings", "blocked_senders", "push_notifications_keys",
        "push_notifications_subscribers", "questions", "registered_users"
    ]

    for table in tables:
        logger.warning(f"Dropping table: {table}...")
        cursor.execute(f"DROP TABLE IF EXISTS {table}")
        logger.info(f"Table {table} dropped successfully.")

def reset_redis(redis_limiter, redis_blacklisted_tokens):
    logger.warning("Clearing Redis databases...")
    redis_limiter.flushdb()
    logger.info("Redis Rate Limiting database cleared.")
    redis_blacklisted_tokens.flushdb()
    logger.info("Redis Blacklisted Tokens database cleared.")

def main():
    config = load_config()

    db_connection, cursor = connect_to_mysql_database(config)
    redis_limiter, redis_blacklisted_tokens = connect_to_redis_databases(config)

    logger.warning("Restoring application to factory default settings will DELETE ALL of its data!")
    confirmation = input('TYPE "Yes" TO CONFIRM (case-sensitive): ')

    if confirmation != "Yes":
        logger.error("Confirmation failed. Reset to factory default settings aborted.")
        sys.exit(5)

    try:
        logger.info("Starting factory reset process...")

        reset_mysql(cursor)
        db_connection.commit()
        cursor.close()
        db_connection.close()

        reset_redis(redis_limiter, redis_blacklisted_tokens)

        logger.info("Factory reset process completed. Please restart the application!")

    except Exception as e:
        logger.critical(f"Error during factory reset: {e}")
        sys.exit(6)
    finally:
        cursor.close()
        db_connection.close()

if __name__ == "__main__":
    main()
