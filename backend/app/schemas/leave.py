"""Leave request/response şemaları."""

import uuid
from datetime import date, datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.enums import LeaveStatus, LeaveType
from app.schemas.user import EmployeeSummary


class LeaveCreate(BaseModel):
    """Yeni izin talebi oluşturma şeması."""

    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str | None = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_date_range(self) -> Self:
        """Bitiş tarihinin başlangıç tarihinden önce olmasını engeller."""
        if self.end_date < self.start_date:
            raise ValueError("Bitiş tarihi başlangıç tarihinden önce olamaz.")
        return self


class LeaveResponse(BaseModel):
    """İzin talebi response şeması."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str | None
    status: LeaveStatus
    created_at: datetime


class LeaveManagementResponse(BaseModel):
    """Yönetim paneli için izin talebi response şeması."""

    id: uuid.UUID
    user_id: uuid.UUID
    employee: EmployeeSummary
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str | None
    status: LeaveStatus
    created_at: datetime
