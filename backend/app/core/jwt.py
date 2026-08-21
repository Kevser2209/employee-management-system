"""JWT access token oluşturma ve doğrulama servisi."""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()


class TokenDecodeError(Exception):
    """Token çözümlenemediğinde fırlatılır."""


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Verilen payload ile imzalı JWT access token oluşturur.

    Args:
        data: Token payload'ına eklenecek veriler (ör. user id, email).
        expires_delta: Özel geçerlilik süresi. Verilmezse config'deki dakika kullanılır.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode["exp"] = expire

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """
    JWT access token'ı çözer ve payload döndürür.

    Raises:
        TokenDecodeError: Token geçersiz, süresi dolmuş veya imza hatalıysa.
    """
    try:
        return jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError as exc:
        raise TokenDecodeError("Geçersiz veya süresi dolmuş token.") from exc
