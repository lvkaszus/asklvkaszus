import os
from flask import Flask
from .config import Config
import logging
from logging.handlers import TimedRotatingFileHandler
from .errors import register_error_handlers
from .extensions import sql, csrf, limiter, cors
from flask_migrate import Migrate
from .models.app_settings import AppSettings
from .models.blocked_senders import BlockedSenders
from .models.notifications_subscribers import NotificationsSubscribers
from .models.notifications_vapid_keys import NotificationsVapidKeys
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

    # Setup logger
    log_level = logging.DEBUG if app.config['DEBUG'] else logging.INFO
    app.logger.setLevel(log_level)

    log_format = "[Ask @lvkaszus! - Backend] - %(asctime)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d | %H:%M:%S"
    formatter = logging.Formatter(fmt=log_format, datefmt=date_format)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    app.logger.addHandler(console_handler)

    if app.config['LOGFILE']:
        log_file = app.config['LOGFILE']

        if not os.path.isabs(log_file):
            log_file = os.path.join(os.getcwd(), log_file)

        log_dir = os.path.dirname(log_file)
        os.makedirs(log_dir, exist_ok=True)

        file_handler = TimedRotatingFileHandler(log_file, when='W0', backupCount=1)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(log_level)
        app.logger.addHandler(file_handler)
    # End of logger setup

    register_error_handlers(app)
    
    sql.init_app(app)
    migrate = Migrate(app, sql)

    csrf.init_app(app)
    limiter.init_app(app)

    cors_resources = {
        "/api/app/admin/*": {"origins": Config.SERVER_URL},
        "/api/app/user/*": {"origins": Config.SERVER_URL},
        "/api/v3/*": {"origins": Config.API_ALLOWED_CLIENTS_URL},
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

        if not AppSettings.query.filter_by(username="asklvkaszus").first():
            default_global_settings = AppSettings(username="asklvkaszus")
            sql.session.add(default_global_settings)
            sql.session.commit()
            sql.session.close()
    
    return app
