import logging

from fastapi import APIRouter, Depends, HTTPException

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
    query: FoodTruckQuery = Depends(),
    service: FoodTruckService = Depends(
        get_food_truck_service
    ),
) -> list[FoodTruck]:

    logger.info(
        "Food truck API request received | "
        "search=%s latitude=%s longitude=%s "
        "radius=%s limit=%d offset=%d",
        query.search,
        query.latitude,
        query.longitude,
        query.radius,
        query.limit,
        query.offset,
    )

    try:

        return await service.get_food_trucks(
            query
        )

    except Exception as exc:

        logger.exception(
            "Food truck API request failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to retrieve food truck data "
                "from the external service."
            ),
        ) from exc
        
# search = chai
# latitude = 37.7879
# longitude = -122.4005
# radius = 5
# limit = 50
# offset = 0