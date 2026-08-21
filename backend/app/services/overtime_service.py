"""Overtime iş mantığı servisi."""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.enums import OvertimeStatus
from app.models.overtime import Overtime
from app.models.user import User
from app.schemas.overtime import OvertimeCreate, OvertimeManagementResponse, OvertimeResponse
from app.schemas.user import EmployeeSummary


class OvertimeNotFoundError(Exception):
    """Fazla mesai kaydı bulunamadığında veya erişim yetkisi olmadığında fırlatılır."""


class InvalidOvertimeStatusTransitionError(Exception):
    """Geçersiz fazla mesai durumu geçişinde fırlatılır."""


class OvertimeService:
    """Fazla mesai talebi işlemlerini yönetir."""

    def create_overtime(
        self,
        db: Session,
        user: User,
        overtime_data: OvertimeCreate,
    ) -> OvertimeResponse:
        """Giriş yapmış kullanıcı için yeni fazla mesai talebi oluşturur."""
        overtime = Overtime(
            user_id=user.id,
            date=overtime_data.date,
            hours=overtime_data.hours,
            description=overtime_data.description,
            status=OvertimeStatus.PENDING,
        )
        db.add(overtime)
        db.commit()
        db.refresh(overtime)

        return OvertimeResponse.model_validate(overtime)

    def get_user_overtimes(self, db: Session, user: User) -> list[OvertimeResponse]:
        """Giriş yapmış kullanıcının kendi fazla mesai kayıtlarını listeler."""
        overtimes = db.scalars(
            select(Overtime)
            .where(Overtime.user_id == user.id)
            .order_by(Overtime.created_at.desc())
        ).all()
        return [OvertimeResponse.model_validate(overtime) for overtime in overtimes]

    def get_management_overtimes(
        self,
        db: Session,
        status: OvertimeStatus | None = None,
    ) -> list[OvertimeManagementResponse]:
        """Manager/HR için fazla mesai kayıtlarını çalışan bilgisiyle listeler."""
        stmt = (
            select(Overtime)
            .options(selectinload(Overtime.user))
            .order_by(Overtime.created_at.desc())
        )
        if status is not None:
            stmt = stmt.where(Overtime.status == status)

        overtimes = db.scalars(stmt).all()
        return [self._to_management_response(overtime) for overtime in overtimes]

    def _to_management_response(self, overtime: Overtime) -> OvertimeManagementResponse:
        """Overtime kaydını yönetim response şemasına dönüştürür."""
        return OvertimeManagementResponse(
            id=overtime.id,
            user_id=overtime.user_id,
            employee=EmployeeSummary.model_validate(overtime.user),
            date=overtime.date,
            hours=overtime.hours,
            description=overtime.description,
            status=overtime.status,
            created_at=overtime.created_at,
            updated_at=overtime.updated_at,
        )

    def get_user_overtime_by_id(
        self,
        db: Session,
        user: User,
        overtime_id: uuid.UUID,
    ) -> OvertimeResponse:
        """Giriş yapmış kullanıcının kendi fazla mesai kaydının detayını döndürür."""
        overtime = db.get(Overtime, overtime_id)

        if overtime is None or overtime.user_id != user.id:
            raise OvertimeNotFoundError()

        return OvertimeResponse.model_validate(overtime)

    def approve_overtime(self, db: Session, overtime_id: uuid.UUID) -> OvertimeResponse:
        """Pending durumundaki fazla mesai talebini onaylar."""
        return self._transition_pending_status(
            db=db,
            overtime_id=overtime_id,
            new_status=OvertimeStatus.APPROVED,
        )

    def reject_overtime(self, db: Session, overtime_id: uuid.UUID) -> OvertimeResponse:
        """Pending durumundaki fazla mesai talebini reddeder."""
        return self._transition_pending_status(
            db=db,
            overtime_id=overtime_id,
            new_status=OvertimeStatus.REJECTED,
        )

    def _transition_pending_status(
        self,
        db: Session,
        overtime_id: uuid.UUID,
        new_status: OvertimeStatus,
    ) -> OvertimeResponse:
        """Pending fazla mesai talebinin durumunu günceller."""
        overtime = self._get_overtime_or_raise(db, overtime_id)

        if overtime.status != OvertimeStatus.PENDING:
            raise InvalidOvertimeStatusTransitionError()

        overtime.status = new_status
        db.commit()
        db.refresh(overtime)

        return OvertimeResponse.model_validate(overtime)

    def _get_overtime_or_raise(self, db: Session, overtime_id: uuid.UUID) -> Overtime:
        """Fazla mesai kaydını getirir; yoksa hata fırlatır."""
        overtime = db.get(Overtime, overtime_id)
        if overtime is None:
            raise OvertimeNotFoundError()
        return overtime


def get_overtime_service() -> OvertimeService:
    """OvertimeService örneğini dependency injection için döndürür."""
    return OvertimeService()
