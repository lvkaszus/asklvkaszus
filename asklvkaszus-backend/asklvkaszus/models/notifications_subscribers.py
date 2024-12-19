from ..extensions import sql

class NotificationsSubscribers(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    endpoint = sql.Column(sql.Text, nullable=False)
    keys_auth = sql.Column(sql.Text, nullable=False)
    keys_p256dh = sql.Column(sql.Text, nullable=False)