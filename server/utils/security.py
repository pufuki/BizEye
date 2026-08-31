import hashlib
import hmac
import os


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + '$' + pwd_hash.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt_hex, pwd_hash_hex = hashed_password.split('$')
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(pwd_hash_hex)
        actual_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False
