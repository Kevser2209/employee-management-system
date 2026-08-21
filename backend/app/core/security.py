"""Kimlik doğrulama güvenlik yardımcıları."""

from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT sabitleri — token üretimi bir sonraki aşamada eklenecek
JWT_SECRET_KEY: str = settings.secret_key
JWT_ALGORITHM: str = settings.algorithm
JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = settings.access_token_expire_minutes


def hash_password(plain_password: str) -> str:
    """Düz metin şifreyi bcrypt ile hash'ler."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Düz metin şifreyi mevcut hash ile karşılaştırır."""
    return pwd_context.verify(plain_password, hashed_password)
