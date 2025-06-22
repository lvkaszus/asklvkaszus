def safe_get(data, key, expected_type=str, strip_strings=True):
    value = data.get(key)

    if value is None:
        return None

    if expected_type == str:
        if not isinstance(value, str):
            return None
        return value.strip() if strip_strings else value

    try:
        return expected_type(value)
    except (ValueError, TypeError):
        return None
