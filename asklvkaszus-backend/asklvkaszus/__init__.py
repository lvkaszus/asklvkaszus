import os
from flask import Flask, request
from .config import Config
from .logger import setup_main_logger, main_logger
from .extensions import wait_for_db, wait_for_redis, sql, csrf, limiter, cors
from .errors import register_error_handlers
from flask_migrate import Migrate
from .models.app_settings import AppSettings
from .models.blocked_senders import BlockedSenders
from .models.push_notifications_keys import PushNotificationsKeys
from .models.push_notifications_subscribers import PushNotificationsSubscribers
from .models.questions import Questions
from .models.registered_users import RegisteredUsers

from .routes.root_routes import root_bp

from .routes.user_routes import user_bp

from .routes.auth_routes import auth_bp
from .routes.admin_routes import admin_bp

from .routes.rest_routes import rest_bp

from .modules.vapid_core import check_vapid_keys

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    setup_main_logger(Config.LOGFILE, Config.DEBUG)

    if not wait_for_db(db_uri=Config.SQLALCHEMY_DATABASE_URI, logger=main_logger()):
        main_logger.error("Application SQL Database initialization failed! Aborting application startup...")

        raise ConnectionError("Application SQL Database does not respond after attempting to connect to it for 60 seconds!")

    if not wait_for_redis(redis_uri=Config.REDIS_SERVER_URI, logger=main_logger()):
        main_logger.error(f"Application Redis Database initialization failed! Aborting application startup...")

        raise ConnectionError("Application Redis Database does not respond after attempting to connect to it for 60 seconds!")

    register_error_handlers(app)
    
    sql.init_app(app)
    migrate = Migrate(app, sql)

    csrf.init_app(app)
    limiter.init_app(app)

    cors_resources = {
        r"/api/app/admin/*": {
            "origins": Config.SERVER_URL,
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "X-CSRFToken"],
            "expose_headers": ["X-CSRFToken"]
        },
        r"/api/app/user/*": {
            "origins": Config.SERVER_URL,
            "methods": ["GET", "POST"],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "X-CSRFToken"],
            "expose_headers": ["X-CSRFToken"]
        },
        r"/api/v3/*": {
            "origins": Config.API_ALLOWED_CLIENTS_URL,
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "supports_credentials": False,
            "allow_headers": ["Content-Type", "Authorization"]
        },
    }

    cors.init_app(app, resources=cors_resources)

    app.register_blueprint(root_bp, url_prefix='/')

    app.register_blueprint(user_bp, url_prefix='/api/app/user/')

    app.register_blueprint(auth_bp, url_prefix='/api/app/admin/')
    app.register_blueprint(admin_bp, url_prefix='/api/app/admin/')

    app.register_blueprint(rest_bp, url_prefix='/api/v3/')


    with app.app_context():
        sql.create_all()

        check_vapid_keys()

        sql.session.commit()
        sql.session.close()

    @app.after_request
    def add_vary_header(response):
        if 'Origin' in request.headers:
            if 'Vary' in response.headers:
                vary = response.headers['Vary']
                if 'Origin' not in vary.split(', '):
                    response.headers['Vary'] = f"{vary}, Origin"
            else:
                response.headers['Vary'] = 'Origin'
        
        if 'Set-Cookie' in response.headers:
            if 'Vary' in response.headers:
                if 'Cookie' not in response.headers['Vary']:
                    response.headers['Vary'] += ', Cookie'
            else:
                response.headers['Vary'] = 'Cookie'
        
        # sensitive_paths = [
        #     '/api/app/user',
        #     '/api/app/admin',
        #     '/api/v3'
        # ]
        
        # if any(request.path.startswith(path) for path in sensitive_paths):
        #     response.headers['Cache-Control'] = 'no-store, max-age=0'
        #     response.headers['Pragma'] = 'no-cache'
        #     response.headers['Expires'] = '0'

        return response

    return app
