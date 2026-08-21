"""Kimlik doğrulama API route'ları."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.services.auth_service import (
    AuthService,
    EmailAlreadyRegisteredError,
    InactiveUserError,
    InvalidCredentialsError,
    get_auth_service,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Kullanıcı kaydı",
    description="Yeni kullanıcı hesabı oluşturur.",
)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
) -> RegisterResponse:
    """Kullanıcı kayıt endpoint'i."""
    try:
        return auth_service.register_user(db=db, register_data=register_data)
    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu e-posta adresi zaten kayıtlı.",
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Kullanıcı girişi",
    description="E-posta ve şifre ile JWT access token alır.",
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    """Kullanıcı giriş endpoint'i."""
    try:
        return auth_service.login(db=db, login_data=login_data)
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except InactiveUserError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesap aktif değil.",
        ) from exc
