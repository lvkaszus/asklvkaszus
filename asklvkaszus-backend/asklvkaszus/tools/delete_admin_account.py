import os
import sys
import yaml
import mysql.connector
import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(name)s] - %(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger("Ask @lvkaszus! - Backend: Tools")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONFIG_PATH = os.path.join(BASE_DIR, 'config/config.yml')

def load_config():
    if not os.path.exists(CONFIG_PATH):
        logger.critical(f"Configuration file not found: {CONFIG_PATH}")
        sys.exit(1)

    try:
        with open(CONFIG_PATH, 'r') as file:
            return yaml.safe_load(file)
    except yaml.YAMLError as e:
        logger.critical(f"Error in configuration file syntax: {e}")
        sys.exit(2)

def connect_to_database(config):
    try:
        db_connection = mysql.connector.connect(
            host=config['mysql'].get('host', 'localhost'),
            port=config['mysql'].get('port', 3306),
            user=config['mysql'].get('username', 'root'),
            password=config['mysql'].get('password', ''),
            database=config['mysql'].get('database', 'test'),
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        return db_connection
    except Exception as e:
        logger.critical(f"Failed to connect to MySQL database: {e}")
        sys.exit(3)

def main():
    config = load_config()

    db_connection = connect_to_database(config)
    cursor = db_connection.cursor()

    username = input("Enter the username to delete: ")
    if not username:
        logger.error("Username cannot be empty.")
        sys.exit(4)

    try:
        cursor.execute("SELECT * FROM registered_users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            logger.error(f"User '{username}' does not exist.")
            sys.exit(5)

        logger.info(f"User '{username}' found. Proceeding with account removal.")

        logger.warning(f"ARE YOU SURE you want to delete user with username '{username}'?")
        confirmation = input(f"Type '{username}' to confirm account removal: ")

        if confirmation != username:
            logger.error("Confirmation failed. Account removal aborted.")
            sys.exit(6)

        cursor.execute("DELETE FROM registered_users WHERE username = %s", (username,))
        db_connection.commit()

        logger.info(f"User '{username}' has been deleted.")
    except Exception as e:
        logger.critical(f"Error during MySQL database operation: {e}")
        sys.exit(7)

    finally:
        cursor.close()
        db_connection.close()

if __name__ == "__main__":
    main()
