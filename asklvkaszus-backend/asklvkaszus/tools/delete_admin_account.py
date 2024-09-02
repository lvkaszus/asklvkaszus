import os
import yaml
import sys
import mysql.connector
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
    logger.error(f'An error occurred while connecting to "Ask @lvkaszus!" application SQL Database! {e}')
    sys.exit(1)

username = input('Username of the user to delete: ')

if username == "":
    logger.error('Username cannot be empty!')
    cursor.close()
    db_connection.close()
    sys.exit(2)

try:
    check_query = "SELECT * FROM registered_users WHERE username = %s"
    delete_query = "DELETE FROM registered_users WHERE username = %s"

    cursor.execute(check_query, (username,))
    existing_user = cursor.fetchone()

    if existing_user:
        logger.info(f'User with username "{username}" found as registered user!')

        logger.warning('ARE YOU SURE you want to delete user with username "{}"?'.format(username))
        username_confirm = input(f'TYPE "{username}" TO CONFIRM: ')

        if username_confirm == username:
            cursor.execute(delete_query, (username,))
            db_connection.commit()

            logger.info(f'User with username "{username}" has been successfully deleted!')
            cursor.close()
            db_connection.close()
            sys.exit(0)

        else:
            logger.error(f'Incorrect username confirmed. User with username "{username}" has not been deleted.')
            cursor.close()
            db_connection.close()
            sys.exit(4)

    else:
        logger.error(f'User with username {username} does not exist.')
        cursor.close()
        db_connection.close()
        sys.exit(3)

except Exception as e:
    logger.error(f'An error occurred while deleting user with username "{username}" from the database! {e}')
    cursor.close()
    db_connection.close()
    sys.exit(5)
