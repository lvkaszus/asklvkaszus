from .config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from redis import Redis
from flask_limiter import Limiter
from .modules.get_remote_address import get_remote_address
from flask_cors import CORS

sql = SQLAlchemy()

csrf = CSRFProtect()

limiter = Limiter(key_func=get_remote_address, storage_uri=Config.REDIS_LIMITER_URL, storage_options={"socket_connect_timeout": 30}, strategy="fixed-window")

cors = CORS()

jwt_blacklist_redis_client = Redis.from_url(Config.REDIS_BLACKLISTED_TOKENS_URL, decode_responses=True)