from ..extensions import sql

class RegisteredUsers(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    username = sql.Column(sql.String(32), unique=True, nullable=False)
    password = sql.Column(sql.String(100), nullable=False)
    last_password_change = sql.Column(sql.DateTime)
    password_change_count = sql.Column(sql.Integer, default=0)
    api_admin_enabled = sql.Column(sql.Boolean, default=False)
    api_user_enabled = sql.Column(sql.Boolean, default=False)
    api_key = sql.Column(sql.String(36))
    
    telegram_enabled = sql.Column(sql.Boolean, default=False)
    telegram_bot_token = sql.Column(sql.String(64))
    telegram_bot_chat_id = sql.Column(sql.String(64))