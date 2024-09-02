from ..extensions import sql

class AppSettings(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    username = sql.Column(sql.String(32))
    global_api_enabled = sql.Column(sql.Boolean, default=False)
    markdown_frontend_enabled = sql.Column(sql.Boolean, default=True)
    markdown_admin_enabled = sql.Column(sql.Boolean, default=True)

    approve_questions_first = sql.Column(sql.Boolean, default=False)