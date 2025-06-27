import jwt
from datetime import datetime, timedelta
import bcrypt

def create_jwt_token(data: dict) -> str:
    payload = {
        "email": data.get("email"),
        "exp": datetime.utcnow() + timedelta(seconds=15)
    }
    token = jwt.encode(payload, "STUDENT_COLLABORATION_APP_KEY", algorithm="HS256")
    return token


def decode_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, "STUDENT_COLLABORATION_APP_KEY", algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
    
def validate_jwt_token(token: str) -> bool:
    try:
        jwt.decode(token, "STUDENT_COLLABORATION_APP_KEY", algorithms=["HS256"])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

def get_hashed_password(password: str) -> str:
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytes, salt)
    return hashed_password.decode('utf-8')

def check_password(hashed_password: str, password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))