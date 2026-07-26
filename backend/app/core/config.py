"""Uygulama yapılandırma ayarları."""

from functools import lru_cache

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Ortam değişkenlerinden okunan uygulama ayarları."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Employee Management System"
    app_description: str = (
        "Personel izin ve fazla mesai taleplerinin yönetildiği REST API."
    )
    app_version: str = "0.1.0"
    app_env: str = "development"
    debug: bool = True

    host: str = "0.0.0.0"
    port: int = 8000

    cors_origins: str = "http://localhost:5173"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def cors_origins_list(self) -> list[str]:
        """Virgülle ayrılmış CORS origin listesini döndürür."""
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    """Ayarları önbelleğe alarak döndürür (singleton)."""
    return Settings()
