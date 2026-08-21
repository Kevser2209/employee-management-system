"""Kullanıcı API route'ları."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.user_service import UserService, get_user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Mevcut kullanıcı profili",
    description="Bearer token ile kimliği doğrulanmış kullanıcının bilgilerini döndürür.",
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Mevcut kullanıcının profil bilgilerini döndürür."""
    return user_service.get_profile(db=db, user=current_user)
