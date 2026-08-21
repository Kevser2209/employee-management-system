"""Overtime request/response şemaları."""

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OvertimeStatus
from app.schemas.user import EmployeeSummary


class OvertimeCreate(BaseModel):
    """Yeni fazla mesai talebi oluşturma şeması."""

    date: date
    hours: float = Field(gt=0, le=24, description="Fazla mesai saati (0 < hours <= 24)")
    description: str | None = Field(default=None, max_length=500)


class OvertimeResponse(BaseModel):
    """Fazla mesai talebi response şeması."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    date: date
    hours: float
    description: str | None
    status: OvertimeStatus
    created_at: datetime
    updated_at: datetime


class OvertimeManagementResponse(BaseModel):
    """Yönetim paneli için fazla mesai response şeması."""

    id: uuid.UUID
    user_id: uuid.UUID
    employee: EmployeeSummary
    date: date
    hours: float
    description: str | None
    status: OvertimeStatus
    created_at: datetime
    updated_at: datetime
