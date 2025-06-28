import os
import sys
import yaml
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import getpass
import bcrypt
import re
import logging


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

from asklvkaszus.models.registered_users import RegisteredUsers


logging.basicConfig(
    level=logging.INFO,
    format='[%(name)s] - %(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger("Ask @lvkaszus! - Backend: Tools")

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
        uri = (
            f"mysql+pymysql://{config['mysql'].get('username', 'root')}:"
            f"{config['mysql'].get('password', '')}@"
            f"{config['mysql'].get('host', 'localhost')}:"
            f"{config['mysql'].get('port', 3306)}/"
            f"{config['mysql'].get('database', 'test')}?charset=utf8mb4"
        )
        engine = create_engine(uri)
        Session = sessionmaker(bind=engine)

        return engine, Session

    except Exception as e:
        logger.critical(f"Failed to connect to MySQL database using SQLAlchemy: {e}")
        sys.exit(3)


def validate_password(password):
    if len(password) < 12:
        logger.error("Password must be at least 12 characters long.")
        return False

    if len(password) > 100:
        logger.error("Password must be less than 100 characters long!")
        return False
    if not re.match(r"^[a-zA-Z0-9!@#$%^&*]+$", password):
        logger.error("Password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!")
        return False

    if not re.search("[A-Z]", password):
        logger.error("Password must contain at least one uppercase letter!")
        return False

    if not re.search("[0-9]", password):
        logger.error("Password must contain at least one number!")
        return False

    if not re.search("[!@#$%^&*]", password):
        logger.error("Password must contain at least one special character (!, @, #, $, %, ^, &, *)!")
        return False

    return True


def main():
    try:
        config = load_config()

        engine, Session = connect_to_database(config)
        session = Session()

        username = input("Enter the username: ").strip()

        if not username:
            logger.error("Username cannot be empty.")
            sys.exit(4)

        user = session.query(RegisteredUsers).filter_by(username=username).first()

        if not user:
            logger.error(f"User '{username}' does not exist.")
            sys.exit(5)

        logger.info(f"User '{username}' found. Proceeding with password change.")

        confirmation = input(f"Type '{username}' to confirm password change: ").strip()
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

        user.password = hashed_password
        session.commit()

        logger.info(f"Password for user '{username}' changed successfully.")

    except SQLAlchemyError as e:
        logger.critical(f"Database error: {e}")
        sys.exit(9)

    except KeyboardInterrupt:
        logger.info("Interrupted! Exiting...")
        sys.exit(10)

    except Exception as e:
        logger.critical(f"Error while performing operation: {e}")
        sys.exit(11)

    finally:
        session.close()
        engine.dispose()


if __name__ == "__main__":
    main()
