import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.dependencies import get_food_truck_service
from app.schemas.food_truck import FoodTruck
from app.schemas.food_truck_query import FoodTruckQuery
from app.services.food_truck_service import FoodTruckService


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/food-trucks",
    tags=["Food Trucks"],
)


@router.get(
    "",
    response_model=list[FoodTruck],
)
async def get_food_trucks(
    latitude: float | None = Query(
        default=None,
        ge=-90,
        le=90,
    ),
    longitude: float | None = Query(
        default=None,
        ge=-180,
        le=180,
    ),
    radius_km: float | None = Query(
        default=None,
        gt=0,
        le=100,
    ),
    food_type: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    service: FoodTruckService = Depends(
        get_food_truck_service,
    ),
) -> list[FoodTruck]:

    query = FoodTruckQuery(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        food_type=food_type,
    )

    logger.info(
        "Received food truck search request: %s",
        query.model_dump(exclude_none=True),
    )

    try:
        return await service.get_food_trucks(query)

    except Exception:
        logger.exception(
            "Failed to retrieve food trucks",
        )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Food truck service is temporarily unavailable",
        )