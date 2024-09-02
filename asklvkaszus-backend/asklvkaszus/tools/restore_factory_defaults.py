import os
import yaml
import sys
import mysql.connector
from redis import Redis
import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger("Ask @lvkaszus! - Backend: Tools")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONFIG_PATH = os.path.join(BASE_DIR, 'config/config.yml')

if not os.path.exists(CONFIG_PATH):
    logger.error(f"Application initialization failed! Configuration file {CONFIG_PATH} was not found inside root application folder.")
    sys.exit(1)

try:
    with open(CONFIG_PATH, 'r') as file:
        config = yaml.safe_load(file)
except yaml.YAMLError as e:
    logger.error(f"Application initialization failed! Configuration file {CONFIG_PATH} contains syntax errors: {e}")
    sys.exit(1)

MYSQL_HOST = config['mysql'].get('host', 'localhost')
MYSQL_PORT = config['mysql'].get('port', '3306')
MYSQL_USERNAME = config['mysql'].get('username', 'asklvkaszus')
MYSQL_PASSWORD = config['mysql'].get('password', 'asklvkaszus')
MYSQL_DATABASE = config['mysql'].get('database', 'asklvkaszus')

try:
    db_connection = mysql.connector.connect(
        host=MYSQL_HOST, port=MYSQL_PORT, user=MYSQL_USERNAME,
        password=MYSQL_PASSWORD, database=MYSQL_DATABASE,
        charset='utf8mb4', collation='utf8mb4_unicode_ci'
    )
    cursor = db_connection.cursor()
except Exception as e:
    logger.error(f'An error occurred while connecting to "Ask @lvkaszus!" application SQL database! {e}')
    sys.exit(1)

REDIS_HOST = config['redis'].get('host', 'localhost')
REDIS_PORT = config['redis'].get('port', '6379')
REDIS_USERNAME = config['redis'].get('username', 'asklvkaszus')
REDIS_PASSWORD = config['redis'].get('password', 'asklvkaszus')
REDIS_RATE_LIMITING_DB = config['redis'].get('rate_limiting_db')
REDIS_BLACKLISTED_TOKENS_DB = config['redis'].get('blacklisted_tokens_db')

REDIS_LIMITER_URL = f'redis://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_RATE_LIMITING_DB}'
REDIS_BLACKLISTED_TOKENS_URL = f'redis://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_BLACKLISTED_TOKENS_DB}'

try:
    redis_limiter = Redis.from_url(REDIS_LIMITER_URL)
    redis_blacklisted_tokens = Redis.from_url(REDIS_BLACKLISTED_TOKENS_URL, decode_responses=True)
except Exception as e:
    logger.error(f'An error occurred while connecting to "Ask @lvkaszus!" application Redis database(s)! {e}')
    sys.exit(2)

logger.warning('ARE YOU SURE that you want to restore "Ask @lvkaszus!" application to its factory default settings?')
logger.warning('THIS OPERATION WILL DELETE EVERYTHING IN THE "Ask @lvkaszus!" APPLICATION DATABASE: REGISTERED USERS, QUESTIONS / MESSAGES, ANSWERS AND USERS DATA!')
are_you_sure = input('TYPE Yes TO CONFIRM (with capital "Y"): ')

if not are_you_sure == "Yes":
    logger.error('Incorrect confirmation input! Application has NOT been restored to its factory default settings.')
    cursor.close()
    db_connection.close()
    sys.exit(3)

try:
    logger.warning('Please wait while "Ask @lvkaszus!" application is being restored to its factory default settings!')
    logger.warning('Attempting to delete SQL Database Tables...')

    sql_database_tables = ["app_settings", "registered_users", "blocked_senders", "questions"]

    for table in sql_database_tables:
        logger.warning(f'Attempting to delete SQL Database Table named "{table}"...')
        delete_table_query = f"DROP TABLE IF EXISTS {table}"
        cursor.execute(delete_table_query)
        logger.info(f'SQL Database Table named "{table}" has been deleted successfully!')

    db_connection.commit()
    cursor.close()
    db_connection.close()

    logger.info('All SQL Database Tables have been deleted!')

    logger.warning('Attempting to clear Redis Databases...')

    logger.warning(f'Attempting to clear Redis Database named "REDIS_RATE_LIMITING_DB"...')
    redis_limiter.flushdb()
    logger.info(f'Redis Database named "REDIS_RATE_LIMITING_DB" has been cleared successfully!')

    logger.warning(f'Attempting to clear Redis Database named "REDIS_BLACKLISTED_TOKENS_DB"...')
    redis_blacklisted_tokens.flushdb()
    logger.info(f'Redis Database named "REDIS_BLACKLISTED_TOKENS_DB" has been cleared successfully!')

    logger.info('All Redis Database Tables have been cleared!')
    logger.info('PLEASE RESTART "Ask @lvkaszus! - Backend" TO APPLY CHANGES!')

    sys.exit(4)

except Exception as e:
    logger.error(f'An error occurred while restoring "Ask @lvkaszus!" application to its factory default settings! {e}')
    cursor.close()
    db_connection.close()
    sys.exit(5)
