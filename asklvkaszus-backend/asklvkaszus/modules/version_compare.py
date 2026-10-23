def parse_version(version):
    """
    Turns a version like "3.2.10" into a tuple of numbers (3, 2, 10) that can be compared.

    Versions must not be compared as strings, because then "3.2.9" would be greater than
    "3.2.10". Trailing zeros are removed, so "3.3" and "3.3.0" give the same result.

    Returns None when the version is not made of numbers separated by dots.
    """
    if not isinstance(version, str):
        return None

    parts = version.split('.')

    if not all(part.isascii() and part.isdigit() for part in parts):
        return None

    numbers = [int(part) for part in parts]

    while numbers and numbers[-1] == 0:
        numbers.pop()

    return tuple(numbers)
