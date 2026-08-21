"""Uygulama yapılandırma ayarları."""

from functools import lru_cache

from pydantic import computed_field, model_validator
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

    database_url: str = (
        "postgresql+psycopg2://postgres:postgres@localhost:5432/employee_management"
    )

    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"

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

    @model_validator(mode="after")
    def validate_production_secret_key(self) -> "Settings":
        """Production ortamında varsayılan veya zayıf SECRET_KEY kullanımını engeller."""
        if self.app_env == "production":
            if (
                self.secret_key == "your-secret-key-change-in-production"
                or len(self.secret_key) < 32
            ):
                raise ValueError(
                    "Production ortamında en az 32 karakterlik güvenli bir "
                    "SECRET_KEY tanımlanmalıdır."
                )
        return self


@lru_cache
def get_settings() -> Settings:
    """Ayarları önbelleğe alarak döndürür (singleton)."""
    return Settings()
