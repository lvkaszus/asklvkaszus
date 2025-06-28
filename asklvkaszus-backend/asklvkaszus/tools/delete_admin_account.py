import os
import sys
import yaml
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
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


def main():
    try:
        config = load_config()

        engine, Session = connect_to_database(config)
        session = Session()

        username = input("Enter the username to delete: ").strip()

        if not username:
            logger.error("Username cannot be empty.")
            sys.exit(4)

        user = session.query(RegisteredUsers).filter_by(username=username).first()

        if not user:
            logger.error(f"User '{username}' does not exist.")
            sys.exit(5)

        logger.info(f"User '{username}' found. Proceeding with account removal.")

        logger.warning(f"ARE YOU SURE you want to delete user with username '{username}'?")
        confirmation = input(f"Type '{username}' to confirm account removal: ").strip()

        if confirmation != username:
            logger.error("Confirmation failed. Account removal aborted.")
            sys.exit(6)

        session.delete(user)
        session.commit()

        logger.info(f"User '{username}' has been deleted.")

    except SQLAlchemyError as e:
        logger.critical(f"Database error: {e}")
        sys.exit(7)

    except KeyboardInterrupt:
        logger.info("Interrupted! Exiting...")
        sys.exit(8)

    except Exception as e:
        logger.critical(f"Error while performing operation: {e}")
        sys.exit(9)

    finally:
        session.close()
        engine.dispose()


if __name__ == "__main__":
    main()
