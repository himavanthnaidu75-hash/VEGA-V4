from fastapi import APIRouter, Request, HTTPException
from authlib.integrations.starlette_client import OAuth
from backend.config import settings
from .utils import create_access_token, get_password_hash
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

class SignupRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(req: SignupRequest):
    # In a real app, save to DB. For VEGA 2.0, we simulate success.
    # We use get_password_hash(req.password) for future-proofing.
    hashed = get_password_hash(req.password)
    return {"message": "Account created", "email": req.email}

@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = f"http://localhost:{settings.PORT}/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user = token.get('userinfo')
        if user:
            access_token = create_access_token({"sub": user['email']})
            return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    raise HTTPException(status_code=401)
