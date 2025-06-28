import os
import sys
import yaml
from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from redis.exceptions import RedisError
from redis import Redis
import logging


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)


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


def connect_to_mysql_database(config):
    try:
        uri = (
            f"mysql+pymysql://{config['mysql'].get('username', 'root')}:"
            f"{config['mysql'].get('password', '')}@"
            f"{config['mysql'].get('host', 'localhost')}:"
            f"{config['mysql'].get('port', 3306)}/"
            f"{config['mysql'].get('database', 'test')}?charset=utf8mb4"
        )
        engine = create_engine(uri)

        return engine

    except Exception as e:
        logger.critical(f"Failed to connect to MySQL database using SQLAlchemy: {e}")
        sys.exit(3)


def connect_to_redis_databases(config):
    try:
        limiter_url = (
            f"redis://{config['redis'].get('username', 'asklvkaszus')}:"
            f"{config['redis'].get('password', 'asklvkaszus')}@"
            f"{config['redis'].get('host', 'localhost')}:"
            f"{config['redis'].get('port', '6379')}/"
            f"{config['redis'].get('rate_limiting_db', 0)}"
        )

        blacklisted_tokens_url = (
            f"redis://{config['redis'].get('username', 'asklvkaszus')}:"
            f"{config['redis'].get('password', 'asklvkaszus')}@"
            f"{config['redis'].get('host', 'localhost')}:"
            f"{config['redis'].get('port', '6379')}/"
            f"{config['redis'].get('blacklisted_tokens_db', 1)}"
        )

        return Redis.from_url(limiter_url), Redis.from_url(blacklisted_tokens_url, decode_responses=True)

    except Exception as e:
        logger.critical(f"Failed to connect to Redis databases: {e}")
        sys.exit(4)


def reset_mysql(engine):
    logger.warning("Clearing MySQL database tables...")

    metadata = MetaData()
    metadata.reflect(bind=engine)
    
    with engine.begin() as conn:
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        metadata.drop_all(bind=conn)
        
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    
    logger.info("All MySQL tables have been dropped successfully.")    


def reset_redis(redis_limiter, redis_blacklisted_tokens):
    logger.warning("Clearing Redis databases...")

    redis_limiter.flushdb()
    logger.info("Redis Rate Limiting database cleared.")
    
    redis_blacklisted_tokens.flushdb()
    logger.info("Redis Blacklisted Tokens database cleared.")


def main():
    try:
        config = load_config()

        engine = connect_to_mysql_database(config)

        redis_limiter, redis_blacklisted_tokens = connect_to_redis_databases(config)

        logger.warning("Restoring application to factory default settings will DELETE ALL of its data!")
        confirmation = input('TYPE "Yes" TO CONFIRM (case-sensitive): ')

        if confirmation != "Yes":
            logger.error("Confirmation failed. Reset to factory default settings aborted.")
            sys.exit(5)

        logger.info("Starting factory reset process...")

        reset_mysql(engine)
        reset_redis(redis_limiter, redis_blacklisted_tokens)

        logger.info("Factory reset process completed. Please restart the application!")

    except SQLAlchemyError as e:
        logger.critical(f"Database error: {e}")
        sys.exit(6)

    except RedisError as e:
        logger.critical(f"Redis error: {e}")
        sys.exit(7)

    except KeyboardInterrupt:
        logger.info("Interrupted! Exiting...")
        sys.exit(8)

    except Exception as e:
        logger.critical(f"Error while performing operation: {e}")
        sys.exit(9)

    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
