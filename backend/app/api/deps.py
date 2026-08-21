"""FastAPI dependency fonksiyonları."""

from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.jwt import TokenDecodeError, decode_access_token
from app.models.user import User
from app.services.auth_service import InactiveUserError
from app.services.role_service import RoleService, get_role_service
from app.services.user_service import UserNotFoundError, UserService, get_user_service

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
) -> User:
    """Bearer token'dan mevcut kullanıcıyı çözer ve döndürür."""
    try:
        payload = decode_access_token(credentials.credentials)
    except TokenDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz token payload.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return user_service.get_active_user_by_id(db=db, user_id=user_id)
    except UserNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı.",
        ) from exc
    except InactiveUserError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesap aktif değil.",
        ) from exc


def require_roles(*allowed_role_names: str) -> Callable[..., User]:
    """Belirtilen rollerden en az birine sahip kullanıcıyı zorunlu kılar."""
    allowed_roles = set(allowed_role_names)

    def role_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
        role_service: RoleService = Depends(get_role_service),
    ) -> User:
        user_roles = role_service.get_user_role_names(db=db, user=current_user)
        if not allowed_roles.intersection(user_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu işlem için yetkiniz yok.",
            )
        return current_user

    return role_checker


def get_leave_approver(
    current_user: User = Depends(require_roles("manager", "hr")),
) -> User:
    """İzin onay/red işlemleri için yetkili kullanıcıyı döndürür."""
    return current_user


def get_overtime_approver(
    current_user: User = Depends(require_roles("manager", "hr")),
) -> User:
    """Fazla mesai onay/red işlemleri için yetkili kullanıcıyı döndürür."""
    return current_user
