"""Kullanıcı response şemaları."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeeSummary(BaseModel):
    """Yönetim ekranlarında gösterilen çalışan özet bilgisi."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr


class UserResponse(BaseModel):
    """Kullanıcı bilgilerini döndüren response şeması."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    roles: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
