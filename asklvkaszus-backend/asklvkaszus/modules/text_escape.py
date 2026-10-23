import html

def escape_for_output(value):
    """
    Returns the value as HTML-escaped text, escaped exactly once.

    Questions and answers are stored already cleaned by bleach, which keeps
    special characters as HTML entities (for example "<3" is stored as "&lt;3").
    Escaping that again would double-encode it ("&amp;lt;3"), so the stored value
    is unescaped first and escaped again in one step. This way the result is the
    same for rows saved by older versions of the app.

    Clients should decode the entities once to get plain text, or print the value
    directly into HTML.
    """
    return html.escape(html.unescape(value or ''))
