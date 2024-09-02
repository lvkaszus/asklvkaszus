import os
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'config/config.yml')

def load_config():
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError(f"Application initialization failed! Configuration file {CONFIG_PATH} was not found inside root application folder.")
    
    try:
        with open(CONFIG_PATH, 'r') as file:
            config = yaml.safe_load(file)
            return config
    except yaml.YAMLError as e:
        raise ValueError(f"Application initialization failed! Configuration file {CONFIG_PATH} contains syntax errors: {e}")

config = load_config()


class Config:
    DEBUG = config.get('debug', True)
    DEBUG = DEBUG if isinstance(DEBUG, bool) else DEBUG.lower() == 'true'
    LOGFILE = config.get('logfile', '')

    SECRET_KEY = config.get('secret_key', 'ChangeMeAsSoonAsPossible')
    JWT_SECRET_KEY = config.get('jwt_secret_key', 'ChangeMeAsSoonAsPossible')

    MYSQL_HOST = config['mysql'].get('host', 'localhost')
    MYSQL_PORT = config['mysql'].get('port', '3306')
    MYSQL_USERNAME = config['mysql'].get('username', 'asklvkaszus')
    MYSQL_PASSWORD = config['mysql'].get('password', 'asklvkaszus')
    MYSQL_DATABASE = config['mysql'].get('database', 'asklvkaszus')

    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    REDIS_HOST = config['redis'].get('host', 'localhost')
    REDIS_PORT = config['redis'].get('port', '6379')
    REDIS_USERNAME = config['redis'].get('username', 'asklvkaszus')
    REDIS_PASSWORD = config['redis'].get('password', 'asklvkaszus')
    REDIS_RATE_LIMITING_DB = config['redis'].get('rate_limiting_db')
    REDIS_BLACKLISTED_TOKENS_DB = config['redis'].get('blacklisted_tokens_db')

    REDIS_LIMITER_URL = f'redis://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_RATE_LIMITING_DB}'
    REDIS_BLACKLISTED_TOKENS_URL = f'redis://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_BLACKLISTED_TOKENS_DB}'

    YOUR_NICKNAME = config.get('your_nickname', '@me')

    SERVER_URL = config.get('server_url')
    API_ALLOWED_CLIENTS_URL = config.get('api_allowed_clients_url', '*')

    WTF_CSRF_CHECK_DEFAULT = False
    WTF_CSRF_METHODS = {'POST', 'PUT', 'DELETE'}
    SESSION_COOKIE_SAMESITE = "Strict"
    SESSION_COOKIE_SECURE = config.get('cookies_secure', True)
    SESSION_COOKIE_SECURE = SESSION_COOKIE_SECURE if isinstance(SESSION_COOKIE_SECURE, bool) else SESSION_COOKIE_SECURE.lower() == 'true'

    COOKIES_SECURE = config.get('cookies_secure', True)
    COOKIES_SECURE = COOKIES_SECURE if isinstance(COOKIES_SECURE, bool) else COOKIES_SECURE.lower() == 'true'

    AUTH_RATELIMIT = config['rate_limits'].get('auth', '35 per hour')
    ADMIN_RATELIMIT = config['rate_limits'].get('admin', '250 per hour')
    API_ADMIN_RATELIMIT = config['rate_limits'].get('api_admin', '250 per hour')
    USER_RATELIMIT = config['rate_limits'].get('user', '10 per hour')
    API_USER_RATELIMIT = config['rate_limits'].get('api_user', '10 per hour')
