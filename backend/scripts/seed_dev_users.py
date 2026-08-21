"""Development ortamı için test kullanıcıları oluşturur.

Kullanım:
    cd backend
    source venv/bin/activate
    python -m scripts.seed_dev_users

Yalnızca APP_ENV=development ortamında çalıştırılmalıdır.
"""

from __future__ import annotations

from sqlalchemy import select

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService
from app.services.role_service import ROLE_EMPLOYEE, ROLE_HR, ROLE_MANAGER, RoleService

DEV_USERS: tuple[tuple[str, str, str, str, str], ...] = (
    ("Test", "Employee", "employee@example.com", "employee", ROLE_EMPLOYEE),
    ("Test", "Manager", "manager@example.com", "manager", ROLE_MANAGER),
    ("Test", "HR", "hr@example.com", "hr", ROLE_HR),
)

DEFAULT_DEV_PASSWORD = "TestPass123!"


def seed_dev_users() -> None:
    settings = get_settings()
    if settings.app_env != "development":
        raise RuntimeError("Seed script yalnızca development ortamında çalıştırılabilir.")

    db = SessionLocal()
    auth_service = AuthService()
    role_service = RoleService()

    try:
        for first_name, last_name, email, _label, role_name in DEV_USERS:
            existing_user = db.scalar(select(User).where(User.email == email))
            if existing_user is not None:
                user = existing_user
            else:
                user_response = auth_service.register_user(
                    db=db,
                    register_data=RegisterRequest(
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        password=DEFAULT_DEV_PASSWORD,
                    ),
                )
                user = db.scalar(select(User).where(User.email == user_response.email))
                if user is None:
                    raise RuntimeError(f"Kullanıcı oluşturulamadı: {email}")

            if role_name != ROLE_EMPLOYEE:
                role_service.assign_role_to_user(db=db, user=user, role_name=role_name)

            db.commit()
            roles = role_service.get_user_role_names(db=db, user=user)
            print(f"seeded: {email} roles={sorted(roles)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_dev_users()
