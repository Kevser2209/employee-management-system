"""Kimlik doğrulama iş mantığı servisi."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse
from app.services.role_service import RoleService


class InvalidCredentialsError(Exception):
    """E-posta veya şifre hatalı olduğunda fırlatılır."""


class InactiveUserError(Exception):
    """Kullanıcı hesabı aktif olmadığında fırlatılır."""


class EmailAlreadyRegisteredError(Exception):
    """E-posta adresi zaten kayıtlı olduğunda fırlatılır."""


class AuthService:
    """Login ve kimlik doğrulama işlemlerini yönetir."""

    def register_user(
        self,
        db: Session,
        register_data: RegisterRequest,
    ) -> RegisterResponse:
        """Yeni kullanıcı kaydı oluşturur."""
        email = str(register_data.email)

        existing_user = db.scalar(select(User).where(User.email == email))
        if existing_user is not None:
            raise EmailAlreadyRegisteredError()

        user = User(
            first_name=register_data.first_name,
            last_name=register_data.last_name,
            email=email,
            password_hash=hash_password(register_data.password),
            is_active=True,
            is_superuser=False,
        )
        db.add(user)
        db.flush()
        RoleService().assign_default_employee_role(db=db, user=user)
        db.commit()
        db.refresh(user)

        return RegisterResponse.model_validate(user)

    def login(self, db: Session, login_data: LoginRequest) -> TokenResponse:
        """Kullanıcıyı doğrular ve access token üretir."""
        user = self._authenticate_user(
            db=db,
            email=str(login_data.email),
            password=login_data.password,
        )
        access_token = create_access_token(data={"sub": str(user.id)})
        return TokenResponse(access_token=access_token)

    def _authenticate_user(self, db: Session, email: str, password: str) -> User:
        """E-posta ve şifreye göre kullanıcıyı doğrular."""
        user = db.scalar(select(User).where(User.email == email))

        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError()

        if not user.is_active:
            raise InactiveUserError()

        return user


def get_auth_service() -> AuthService:
    """AuthService örneğini dependency injection için döndürür."""
    return AuthService()
