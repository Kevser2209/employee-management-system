"""Kullanıcı iş mantığı servisi."""

import uuid

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserResponse
from app.services.auth_service import InactiveUserError
from app.services.role_service import RoleService, get_role_service


class UserNotFoundError(Exception):
    """Kullanıcı bulunamadığında fırlatılır."""


class UserService:
    """Kullanıcı sorgulama ve profil işlemlerini yönetir."""

    def get_by_id(self, db: Session, user_id: str | uuid.UUID) -> User | None:
        """UUID ile kullanıcıyı veritabanından getirir."""
        return db.get(User, uuid.UUID(str(user_id)))

    def get_active_user_by_id(self, db: Session, user_id: str | uuid.UUID) -> User:
        """Aktif kullanıcıyı getirir; bulunamazsa veya pasifse hata fırlatır."""
        user = self.get_by_id(db, user_id)

        if user is None:
            raise UserNotFoundError()

        if not user.is_active:
            raise InactiveUserError()

        return user

    def get_profile(
        self,
        db: Session,
        user: User,
        role_service: RoleService | None = None,
    ) -> UserResponse:
        """Kullanıcı profil bilgilerini response şemasına dönüştürür."""
        service = role_service or get_role_service()
        role_names = sorted(service.get_user_role_names(db=db, user=user))

        return UserResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            roles=role_names,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )


def get_user_service() -> UserService:
    """UserService örneğini dependency injection için döndürür."""
    return UserService()
