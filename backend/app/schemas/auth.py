"""Kimlik doğrulama request/response şemaları."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    """Login isteği için giriş verileri."""

    email: EmailStr
    password: str = Field(min_length=1)


class RegisterRequest(BaseModel):
    """Kullanıcı kayıt isteği için giriş verileri."""

    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    """Başarılı login sonrası dönen token yanıtı."""

    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    """Başarılı kayıt sonrası dönen kullanıcı bilgileri."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
