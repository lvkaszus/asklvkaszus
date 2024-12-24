import os
import sys
import yaml
import mysql.connector
import getpass
import bcrypt
import re
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

def validate_password(password):
    if len(password) < 12:
        logger.error("Password must be at least 12 characters long.")
        return False
    if not re.search("[A-Z]", password):
        logger.error("Password must contain at least one uppercase letter.")
        return False
    if not re.search("[0-9]", password):
        logger.error("Password must contain at least one number.")
        return False
    if not re.search("[!@#$%^&*]", password):
        logger.error("Password must contain at least one special character (!, @, #, $, %, ^, &, *).")
        return False
    return True

def main():
    config = load_config()

    db_connection = connect_to_database(config)
    cursor = db_connection.cursor()

    username = input("Enter the username: ")

    if not username:
        logger.error("Username cannot be empty.")
        sys.exit(4)

    try:
        cursor.execute("SELECT * FROM registered_users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            logger.error(f"User '{username}' does not exist.")
            sys.exit(5)

        logger.info(f"User '{username}' found. Proceeding with password change.")

        confirmation = input(f"Type '{username}' to confirm password change: ")
        if confirmation != username:
            logger.error("Confirmation failed. Password change aborted.")
            sys.exit(6)

        new_password = getpass.getpass("Enter new password: ")
        if not validate_password(new_password):
            sys.exit(7)

        confirm_password = getpass.getpass("Confirm new password: ")
        if new_password != confirm_password:
            logger.error("Passwords do not match.")
            sys.exit(8)

        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("UPDATE registered_users SET password = %s WHERE username = %s", (hashed_password, username))
        db_connection.commit()

        logger.info(f"Password for user '{username}' changed successfully.")

    except Exception as e:
        logger.critical(f"Error during MySQL database operation: {e}")
        sys.exit(9)

    finally:
        cursor.close()
        db_connection.close()

if __name__ == "__main__":
    main()
