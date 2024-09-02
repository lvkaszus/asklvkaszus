from flask import request
import ipaddress
from ..extensions import sql
from ..models.blocked_senders import BlockedSenders

def is_blocked(ip):
    is_sender_blocked = BlockedSenders.query.filter_by(ip_address=ip).first()

    if is_sender_blocked:
        return True

    else:
        return False
