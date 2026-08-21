"""FastAPI uygulama giriş noktası."""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.leaves import router as leaves_router
from app.api.routes.overtimes import router as overtimes_router
from app.api.routes.users import router as users_router
from app.core.config import get_settings
from app.core.database import check_database_connection

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(leaves_router)
app.include_router(overtimes_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Uygulamanın çalışır durumda olup olmadığını kontrol eder."""
    return {
        "status": "ok",
        "environment": settings.app_env,
        "version": settings.app_version,
    }


@app.get("/health/db", tags=["Health"])
def database_health_check() -> dict[str, str]:
    """PostgreSQL veritabanı bağlantısını kontrol eder."""
    if check_database_connection():
        return {"status": "ok", "database": "connected"}

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "status": "error",
            "database": "disconnected",
            "message": "PostgreSQL veritabanına bağlanılamadı.",
        },
    )

