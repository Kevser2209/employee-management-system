"""Rol iş mantığı servisi."""

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.role import Role
from app.models.user import User

ROLE_EMPLOYEE = "employee"
ROLE_MANAGER = "manager"
ROLE_HR = "hr"

DEFAULT_ROLES: dict[str, str] = {
    ROLE_EMPLOYEE: "Standart çalışan",
    ROLE_MANAGER: "Ekip yöneticisi",
    ROLE_HR: "İnsan kaynakları",
}


class RoleService:
    """Rol sorgulama ve atama işlemlerini yönetir."""

    def get_or_create_role(
        self,
        db: Session,
        role_name: str,
        description: str | None = None,
    ) -> Role:
        """Rolü getirir; yoksa oluşturur."""
        role = db.scalar(select(Role).where(Role.name == role_name))
        if role is not None:
            return role

        role = Role(
            name=role_name,
            description=description or DEFAULT_ROLES.get(role_name),
        )
        db.add(role)
        db.flush()
        return role

    def assign_role_to_user(self, db: Session, user: User, role_name: str) -> None:
        """Kullanıcıya belirtilen rolü atar."""
        role = self.get_or_create_role(
            db=db,
            role_name=role_name,
            description=DEFAULT_ROLES.get(role_name),
        )
        if role not in user.roles:
            user.roles.append(role)

    def assign_default_employee_role(self, db: Session, user: User) -> None:
        """Yeni kayıt olan kullanıcıya varsayılan employee rolünü atar."""
        self.assign_role_to_user(db=db, user=user, role_name=ROLE_EMPLOYEE)

    def get_user_role_names(self, db: Session, user: User) -> set[str]:
        """Kullanıcının rol adlarını veritabanından döndürür."""
        user_with_roles = db.scalar(
            select(User)
            .where(User.id == user.id)
            .options(selectinload(User.roles))
        )
        if user_with_roles is None:
            return set()
        return {role.name for role in user_with_roles.roles}


def get_role_service() -> RoleService:
    """RoleService örneğini dependency injection için döndürür."""
    return RoleService()
