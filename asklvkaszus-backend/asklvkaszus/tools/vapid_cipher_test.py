import os
import sys
import yaml
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from getpass import getpass
import base64
from ecdsa import VerifyingKey, SigningKey, NIST256p
import logging


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

from asklvkaszus.models.push_notifications_keys import PushNotificationsKeys


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


def is_valid_vapid_key(key, key_type="public"):
    try:
        key_bytes = base64.urlsafe_b64decode(key + "==" if len(key) % 4 else key)

        if key_type == "public":
            if len(key_bytes) == 65 and key_bytes[0] == 0x04:
                VerifyingKey.from_string(key_bytes[1:], curve=NIST256p)
                
                return True

        elif key_type == "private":
            if len(key_bytes) == 32:
                SigningKey.from_string(key_bytes, curve=NIST256p)
                
                return True

    except (ValueError, TypeError):
        pass

    return False


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


def get_vapid_keys_from_db(session):
    vapid_keys = session.query(PushNotificationsKeys).first()
    
    if vapid_keys:
        return vapid_keys.public_key, vapid_keys.private_key

    else:
        logger.warning("VAPID Keys do not exist in the application database!")
        return None, None


def display_keys(public_key, private_key):
    masked_private_key = private_key[:4] + '*' * (len(private_key) - 8) + private_key[-4:]
    
    logger.info("VAPID Keys:")
    logger.info(f"Public Key: {public_key}")
    logger.info(f"Private Key: {masked_private_key}")


def main():
    try:
        config = load_config()

        engine, Session = connect_to_database(config)
        session = Session()

        logger.info("Menu:")
        logger.info("1. Retrieve VAPID Keys from Database")
        logger.info("2. Enter VAPID Keys Manually")
        
        option = input("Choose an option (1/2): ")

        if option == "1":
            public_key, private_key = get_vapid_keys_from_db(session)

            if public_key and private_key:
                display_keys(public_key, private_key)

            else:
                logger.critical("Failed to retrieve VAPID keys.")
                sys.exit(4)

        elif option == "2":
            public_key = input("Enter VAPID Public Key: ").strip()
            private_key = getpass("Enter VAPID Private Key: ").strip()

        else:
            logger.error("Invalid option selected.")
            sys.exit(5)


        logger.info("Validating VAPID Public Key...")

        if is_valid_vapid_key(public_key, "public"):
            logger.info("Public Key is valid!")
        else:
            logger.critical("Public Key is invalid.")


        logger.info("Validating VAPID Private Key...")

        if is_valid_vapid_key(private_key, "private"):
            logger.info("Private Key is valid!")
        else:
            logger.critical("Private Key is invalid.")

    except SQLAlchemyError as e:
        logger.critical(f"Database error: {e}")
        sys.exit(6)

    except KeyboardInterrupt:
        logger.info("Interrupted! Exiting...")
        sys.exit(7)

    except Exception as e:
        logger.critical(f"Error while performing operation: {e}")
        sys.exit(8)

    finally:
        session.close()
        engine.dispose()


if __name__ == "__main__":
    main()
