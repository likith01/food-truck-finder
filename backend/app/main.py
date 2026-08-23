from fastapi import FastAPI

from app.api.routes.food_trucks import router as food_trucks_router
from app.api.routes.health import router as health_router
from app.core.config import settings
from app.core.logging import configure_logging


configure_logging()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)


app.include_router(
    health_router,
)


app.include_router(
    food_trucks_router,
    prefix="/api/v1",
)