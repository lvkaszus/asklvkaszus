from ..extensions import sql

class Questions(sql.Model):
    id = sql.Column(sql.String(36), primary_key=True)
    date = sql.Column(sql.DateTime, nullable=False)
    question = sql.Column(sql.Text, nullable=False)
    answer = sql.Column(sql.Text, nullable=False)
    hidden = sql.Column(sql.Boolean, default=False)
    ip_address = sql.Column(sql.String(128), nullable=False)
