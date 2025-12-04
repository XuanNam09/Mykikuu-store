import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException

SECRET = "MYSECRET"
ALGO = "HS256"

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
