from ..extensions import sql
from sqlalchemy import false, true

class AppSettings(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    username = sql.Column(sql.String(32))

    global_api_enabled = sql.Column(sql.Boolean, default=False, server_default=false())
    
    markdown_frontend_enabled = sql.Column(sql.Boolean, default=True, server_default=true())
    markdown_admin_enabled = sql.Column(sql.Boolean, default=True, server_default=true())

    approve_questions_first = sql.Column(sql.Boolean, default=False, server_default=false())

    captcha_enabled = sql.Column(sql.Boolean, default=False, server_default=false())
    captcha_provider = sql.Column(sql.String(32))
    captcha_site_key = sql.Column(sql.String(128))
    captcha_secret_key = sql.Column(sql.String(128))
