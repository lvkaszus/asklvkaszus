from flask import request

def get_remote_address():
    remote_addr = request.headers.get('X-Forwarded-For', request.remote_addr)
    remote_addr = remote_addr.split(',')[0].strip() if remote_addr else '127.0.0.1'
    return remote_addr
