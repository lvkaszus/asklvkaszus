from ..extensions import sql

class BlockedSenders(sql.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    ip_address = sql.Column(sql.String(128), nullable=False)
    last_question = sql.Column(sql.Text, nullable=False)
    date = sql.Column(sql.DateTime, nullable=False)