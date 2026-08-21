"""Leave iş mantığı servisi."""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.enums import LeaveStatus
from app.models.leave import Leave
from app.models.user import User
from app.schemas.leave import LeaveCreate, LeaveManagementResponse, LeaveResponse
from app.schemas.user import EmployeeSummary


class LeaveNotFoundError(Exception):
    """İzin talebi bulunamadığında veya erişim yetkisi olmadığında fırlatılır."""


class InvalidLeaveStatusTransitionError(Exception):
    """Geçersiz izin durumu geçişinde fırlatılır."""


class LeaveDateOverlapError(Exception):
    """Onaylanacak izin tarihleri mevcut onaylı izinle çakıştığında fırlatılır."""


class LeaveService:
    """İzin talebi işlemlerini yönetir."""

    def create_leave(
        self,
        db: Session,
        user: User,
        leave_data: LeaveCreate,
    ) -> LeaveResponse:
        """Giriş yapmış kullanıcı için yeni izin talebi oluşturur."""
        leave = Leave(
            user_id=user.id,
            leave_type=leave_data.leave_type,
            start_date=leave_data.start_date,
            end_date=leave_data.end_date,
            reason=leave_data.reason,
            status=LeaveStatus.PENDING,
        )
        db.add(leave)
        db.commit()
        db.refresh(leave)

        return LeaveResponse.model_validate(leave)

    def get_user_leaves(self, db: Session, user: User) -> list[LeaveResponse]:
        """Giriş yapmış kullanıcının kendi izin taleplerini listeler."""
        leaves = db.scalars(
            select(Leave)
            .where(Leave.user_id == user.id)
            .order_by(Leave.created_at.desc())
        ).all()
        return [LeaveResponse.model_validate(leave) for leave in leaves]

    def get_management_leaves(
        self,
        db: Session,
        status: LeaveStatus | None = None,
    ) -> list[LeaveManagementResponse]:
        """Manager/HR için izin taleplerini çalışan bilgisiyle listeler."""
        stmt = (
            select(Leave)
            .options(selectinload(Leave.user))
            .order_by(Leave.created_at.desc())
        )
        if status is not None:
            stmt = stmt.where(Leave.status == status)

        leaves = db.scalars(stmt).all()
        return [self._to_management_response(leave) for leave in leaves]

    def _to_management_response(self, leave: Leave) -> LeaveManagementResponse:
        """Leave kaydını yönetim response şemasına dönüştürür."""
        return LeaveManagementResponse(
            id=leave.id,
            user_id=leave.user_id,
            employee=EmployeeSummary.model_validate(leave.user),
            leave_type=leave.leave_type,
            start_date=leave.start_date,
            end_date=leave.end_date,
            reason=leave.reason,
            status=leave.status,
            created_at=leave.created_at,
        )

    def get_user_leave_by_id(
        self,
        db: Session,
        user: User,
        leave_id: uuid.UUID,
    ) -> LeaveResponse:
        """Giriş yapmış kullanıcının kendi izin talebinin detayını döndürür."""
        leave = db.get(Leave, leave_id)

        if leave is None or leave.user_id != user.id:
            raise LeaveNotFoundError()

        return LeaveResponse.model_validate(leave)

    def approve_leave(self, db: Session, leave_id: uuid.UUID) -> LeaveResponse:
        """Pending durumundaki izin talebini onaylar."""
        return self._transition_pending_status(
            db=db,
            leave_id=leave_id,
            new_status=LeaveStatus.APPROVED,
        )

    def reject_leave(self, db: Session, leave_id: uuid.UUID) -> LeaveResponse:
        """Pending durumundaki izin talebini reddeder."""
        return self._transition_pending_status(
            db=db,
            leave_id=leave_id,
            new_status=LeaveStatus.REJECTED,
        )

    def _transition_pending_status(
        self,
        db: Session,
        leave_id: uuid.UUID,
        new_status: LeaveStatus,
    ) -> LeaveResponse:
        """Pending izin talebinin durumunu günceller."""
        leave = self._get_leave_or_raise(db, leave_id)

        if leave.status != LeaveStatus.PENDING:
            raise InvalidLeaveStatusTransitionError()

        if new_status == LeaveStatus.APPROVED:
            self._check_date_overlap(db, leave)

        leave.status = new_status
        db.commit()
        db.refresh(leave)

        return LeaveResponse.model_validate(leave)

    def _get_leave_or_raise(self, db: Session, leave_id: uuid.UUID) -> Leave:
        """İzin talebini getirir; yoksa hata fırlatır."""
        leave = db.get(Leave, leave_id)
        if leave is None:
            raise LeaveNotFoundError()
        return leave

    def _check_date_overlap(self, db: Session, leave: Leave) -> None:
        """Aynı kullanıcının onaylı izinleriyle tarih çakışmasını kontrol eder."""
        overlapping = db.scalar(
            select(Leave).where(
                Leave.user_id == leave.user_id,
                Leave.id != leave.id,
                Leave.status == LeaveStatus.APPROVED,
                Leave.start_date <= leave.end_date,
                Leave.end_date >= leave.start_date,
            )
        )
        if overlapping is not None:
            raise LeaveDateOverlapError()


def get_leave_service() -> LeaveService:
    """LeaveService örneğini dependency injection için döndürür."""
    return LeaveService()
