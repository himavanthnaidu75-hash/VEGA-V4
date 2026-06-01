from datetime import datetime, timedelta
from jose import jwt
from backend.config import settings
def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(hours=24)})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
