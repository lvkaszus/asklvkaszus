from flask import jsonify, make_response

def jsonify_on_steroids(*args, http_status=200, headers=None, **kwargs):
    """
    Returns a JSON response with any headers that are specified.
    
    Usage:

        return jsonify_on_steroids(message='Some message...', headers=dcit), 200
    """
    response = make_response(jsonify(*args, **kwargs), http_status)
    if headers:
        for key, value in headers.items():
            response.headers[key] = value
    return response
