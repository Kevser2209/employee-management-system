"""Leave API route'ları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_leave_approver
from app.core.database import get_db
from app.models.enums import LeaveStatus
from app.models.user import User
from app.schemas.leave import LeaveCreate, LeaveManagementResponse, LeaveResponse
from app.services.leave_service import (
    InvalidLeaveStatusTransitionError,
    LeaveDateOverlapError,
    LeaveNotFoundError,
    LeaveService,
    get_leave_service,
)

router = APIRouter(prefix="/leaves", tags=["Leaves"])


@router.get(
    "",
    response_model=list[LeaveResponse],
    summary="Kendi izin taleplerini listele",
    description="Giriş yapmış kullanıcının yalnızca kendi izin taleplerini döndürür.",
)
def list_leaves(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> list[LeaveResponse]:
    """Kullanıcının kendi izin taleplerini listeleme endpoint'i."""
    return leave_service.get_user_leaves(db=db, user=current_user)


@router.get(
    "/management",
    response_model=list[LeaveManagementResponse],
    summary="Yönetim için izin taleplerini listele",
    description="Manager ve HR rolleri için izin taleplerini çalışan bilgisiyle döndürür.",
)
def list_management_leaves(
    status: LeaveStatus | None = None,
    _manager: User = Depends(get_leave_approver),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> list[LeaveManagementResponse]:
    """Yönetim paneli izin listeleme endpoint'i."""
    return leave_service.get_management_leaves(db=db, status=status)


@router.get(
    "/{leave_id}",
    response_model=LeaveResponse,
    summary="İzin talebi detayı",
    description="Giriş yapmış kullanıcının kendi izin talebinin detayını döndürür.",
)
def get_leave(
    leave_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> LeaveResponse:
    """Tek izin talebi detay endpoint'i."""
    try:
        return leave_service.get_user_leave_by_id(
            db=db,
            user=current_user,
            leave_id=leave_id,
        )
    except LeaveNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="İzin talebi bulunamadı.",
        ) from exc


@router.patch(
    "/{leave_id}/approve",
    response_model=LeaveResponse,
    summary="İzin talebini onayla",
    description="Pending durumundaki izin talebini approved durumuna geçirir.",
)
def approve_leave(
    leave_id: uuid.UUID,
    _approver: User = Depends(get_leave_approver),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> LeaveResponse:
    """İzin talebi onay endpoint'i."""
    try:
        return leave_service.approve_leave(db=db, leave_id=leave_id)
    except LeaveNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="İzin talebi bulunamadı.",
        ) from exc
    except InvalidLeaveStatusTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Yalnızca pending durumundaki izin talepleri onaylanabilir.",
        ) from exc
    except LeaveDateOverlapError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Onaylanacak izin tarihleri mevcut onaylı izinle çakışıyor.",
        ) from exc


@router.patch(
    "/{leave_id}/reject",
    response_model=LeaveResponse,
    summary="İzin talebini reddet",
    description="Pending durumundaki izin talebini rejected durumuna geçirir.",
)
def reject_leave(
    leave_id: uuid.UUID,
    _approver: User = Depends(get_leave_approver),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> LeaveResponse:
    """İzin talebi red endpoint'i."""
    try:
        return leave_service.reject_leave(db=db, leave_id=leave_id)
    except LeaveNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="İzin talebi bulunamadı.",
        ) from exc
    except InvalidLeaveStatusTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Yalnızca pending durumundaki izin talepleri reddedilebilir.",
        ) from exc


@router.post(
    "",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="İzin talebi oluştur",
    description="Giriş yapmış kullanıcı kendi adına yeni izin talebi oluşturur.",
)
def create_leave(
    leave_data: LeaveCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    leave_service: LeaveService = Depends(get_leave_service),
) -> LeaveResponse:
    """Yeni izin talebi oluşturma endpoint'i."""
    return leave_service.create_leave(
        db=db,
        user=current_user,
        leave_data=leave_data,
    )
