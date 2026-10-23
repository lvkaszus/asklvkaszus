from flask import request

def get_remote_address():
    # ProxyFix (see asklvkaszus/__init__.py) already sets request.remote_addr from the LAST address
    # in X-Forwarded-For, which is the one added by the trusted reverse proxy. The first address can
    # be set by the client itself, so X-Forwarded-For must not be read manually here.
    return request.remote_addr or '127.0.0.1'
