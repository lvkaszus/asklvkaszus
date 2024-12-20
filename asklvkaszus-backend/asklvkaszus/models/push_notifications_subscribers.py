from ..extensions import sql

class PushNotificationsSubscribers(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    endpoint = sql.Column(sql.Text, default="", nullable=False)
    keys_auth = sql.Column(sql.Text, default="", nullable=False)
    keys_p256dh = sql.Column(sql.Text, default="", nullable=False)
    subscribed_date = sql.Column(sql.DateTime, nullable=False)