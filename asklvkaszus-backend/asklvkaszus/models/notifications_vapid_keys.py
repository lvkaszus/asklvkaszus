from ..extensions import sql

class NotificationsVapidKeys(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    public_key = sql.Column(sql.Text, nullable=False)
    private_key = sql.Column(sql.Text, nullable=False)