from ..extensions import sql

class PushNotificationsKeys(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    enabled = sql.Column(sql.Boolean, default=False, nullable=False)
    public_key = sql.Column(sql.Text, default="", nullable=False)
    private_key = sql.Column(sql.Text, default="", nullable=False)