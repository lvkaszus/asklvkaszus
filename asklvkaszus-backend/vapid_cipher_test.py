import base64
from ecdsa import VerifyingKey, SigningKey, NIST256p

def is_valid_vapid_key(key, key_type="public"):
    """
    Is your VAPID key pair syntactically and mathematically correct? :D

    :param key: Str - VAPID Key (Base64URL)
    :param key_type: Str - "public" lub "private"
    :return: True - Working!, but if it isn't valid, then it will return..... FALSE! >:(!
    """
    try:
        key_bytes = base64.urlsafe_b64decode(key + "==" if len(key) % 4 else key)

        if key_type == "public":
            if len(key_bytes) == 65 and key_bytes[0] == 0x04:
                VerifyingKey.from_string(key_bytes[1:], curve=NIST256p)
                return True
        elif key_type == "private":
            if len(key_bytes) == 32:
                SigningKey.from_string(key_bytes, curve=NIST256p)
                return True

        return False

    except (ValueError, TypeError):
        return False

public_key = "BE-F5yk7CJABA5IKiH_kccldx7ThUAilq9OjYALPSyciinLCLukT6PMbt-78RvbK3HWmyS0Sx5cqkemx51FtdNk"
private_key = "fHZ09JOBZ6e4eKOCO4csuztxUC7DDVnEvpwsHrORax8"

print(f"Is the VAPID Public Key valid? - {is_valid_vapid_key(public_key, key_type="public")}")
print(f"Is the VAPID Private Key valid? - {is_valid_vapid_key(private_key, key_type="private")}")
print(f"Is the VAPID Invalid (!) Key valid? - {is_valid_vapid_key("INVALID_KEY", key_type="public")}")
