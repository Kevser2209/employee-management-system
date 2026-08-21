"""Overtime API route'ları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_overtime_approver
from app.core.database import get_db
from app.models.enums import OvertimeStatus
from app.models.user import User
from app.schemas.overtime import OvertimeCreate, OvertimeManagementResponse, OvertimeResponse
from app.services.overtime_service import (
    InvalidOvertimeStatusTransitionError,
    OvertimeNotFoundError,
    OvertimeService,
    get_overtime_service,
)

router = APIRouter(prefix="/overtimes", tags=["Overtimes"])


@router.get(
    "",
    response_model=list[OvertimeResponse],
    summary="Kendi fazla mesai kayıtlarını listele",
    description="Giriş yapmış kullanıcının yalnızca kendi fazla mesai kayıtlarını döndürür.",
)
def list_overtimes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> list[OvertimeResponse]:
    """Kullanıcının kendi fazla mesai kayıtlarını listeleme endpoint'i."""
    return overtime_service.get_user_overtimes(db=db, user=current_user)


@router.get(
    "/management",
    response_model=list[OvertimeManagementResponse],
    summary="Yönetim için fazla mesai kayıtlarını listele",
    description="Manager ve HR rolleri için fazla mesai kayıtlarını çalışan bilgisiyle döndürür.",
)
def list_management_overtimes(
    status: OvertimeStatus | None = None,
    _manager: User = Depends(get_overtime_approver),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> list[OvertimeManagementResponse]:
    """Yönetim paneli fazla mesai listeleme endpoint'i."""
    return overtime_service.get_management_overtimes(db=db, status=status)


@router.get(
    "/{overtime_id}",
    response_model=OvertimeResponse,
    summary="Fazla mesai kaydı detayı",
    description="Giriş yapmış kullanıcının kendi fazla mesai kaydının detayını döndürür.",
)
def get_overtime(
    overtime_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> OvertimeResponse:
    """Tek fazla mesai kaydı detay endpoint'i."""
    try:
        return overtime_service.get_user_overtime_by_id(
            db=db,
            user=current_user,
            overtime_id=overtime_id,
        )
    except OvertimeNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fazla mesai kaydı bulunamadı.",
        ) from exc


@router.post(
    "",
    response_model=OvertimeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Fazla mesai talebi oluştur",
    description="Giriş yapmış kullanıcı kendi adına yeni fazla mesai talebi oluşturur.",
)
def create_overtime(
    overtime_data: OvertimeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> OvertimeResponse:
    """Yeni fazla mesai talebi oluşturma endpoint'i."""
    return overtime_service.create_overtime(
        db=db,
        user=current_user,
        overtime_data=overtime_data,
    )


@router.patch(
    "/{overtime_id}/approve",
    response_model=OvertimeResponse,
    summary="Fazla mesai talebini onayla",
    description="Pending durumundaki fazla mesai talebini approved durumuna geçirir.",
)
def approve_overtime(
    overtime_id: uuid.UUID,
    _approver: User = Depends(get_overtime_approver),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> OvertimeResponse:
    """Fazla mesai talebi onay endpoint'i."""
    try:
        return overtime_service.approve_overtime(db=db, overtime_id=overtime_id)
    except OvertimeNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fazla mesai kaydı bulunamadı.",
        ) from exc
    except InvalidOvertimeStatusTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Yalnızca pending durumundaki fazla mesai talepleri onaylanabilir.",
        ) from exc


@router.patch(
    "/{overtime_id}/reject",
    response_model=OvertimeResponse,
    summary="Fazla mesai talebini reddet",
    description="Pending durumundaki fazla mesai talebini rejected durumuna geçirir.",
)
def reject_overtime(
    overtime_id: uuid.UUID,
    _approver: User = Depends(get_overtime_approver),
    db: Session = Depends(get_db),
    overtime_service: OvertimeService = Depends(get_overtime_service),
) -> OvertimeResponse:
    """Fazla mesai talebi red endpoint'i."""
    try:
        return overtime_service.reject_overtime(db=db, overtime_id=overtime_id)
    except OvertimeNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fazla mesai kaydı bulunamadı.",
        ) from exc
    except InvalidOvertimeStatusTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Yalnızca pending durumundaki fazla mesai talepleri reddedilebilir.",
        ) from exc
