import logging

from pydantic import ValidationError

from app.clients.datasf_client import DataSFClient
from app.schemas.food_truck import FoodTruck
from app.schemas.food_truck_query import FoodTruckQuery
from app.services.geo_service import calculate_distance_km


logger = logging.getLogger(__name__)


class FoodTruckService:

    def __init__(
        self,
        client: DataSFClient,
    ) -> None:
        self.client = client

    async def get_food_trucks(
        self,
        query: FoodTruckQuery,
    ) -> list[FoodTruck]:

        logger.info(
            "Fetching food trucks with filters: %s",
            query.model_dump(exclude_none=True),
        )

        data = await self.client.get_food_trucks()

        food_trucks: list[FoodTruck] = []

        for item in data:

            try:
                food_truck = FoodTruck.model_validate(item)

            except ValidationError as exc:
                logger.warning(
                    "Skipping invalid food truck record: %s",
                    exc,
                )
                continue

            if not self._has_valid_coordinates(food_truck):
                logger.warning(
                    "Skipping food truck '%s' due to invalid coordinates",
                    food_truck.name,
                )
                continue

            if not self._matches_food_type(
                food_truck,
                query.food_type,
            ):
                continue

            if not self._matches_radius(
                food_truck,
                query,
            ):
                continue

            food_trucks.append(food_truck)

        logger.info(
            "Returning %d food trucks",
            len(food_trucks),
        )

        return food_trucks

    @staticmethod
    def _has_valid_coordinates(
        food_truck: FoodTruck,
    ) -> bool:
        return (
            -90 <= food_truck.latitude <= 90
            and -180 <= food_truck.longitude <= 180
            and not (
                food_truck.latitude == 0
                and food_truck.longitude == 0
            )
        )

    @staticmethod
    def _matches_food_type(
        food_truck: FoodTruck,
        food_type: str | None,
    ) -> bool:

        if not food_type:
            return True

        if not food_truck.food_items:
            return False

        return food_type.lower() in food_truck.food_items.lower()

    @staticmethod
    def _matches_radius(
        food_truck: FoodTruck,
        query: FoodTruckQuery,
    ) -> bool:

        if (
            query.latitude is None
            or query.longitude is None
            or query.radius_km is None
        ):
            return True

        distance = calculate_distance_km(
            query.latitude,
            query.longitude,
            food_truck.latitude,
            food_truck.longitude,
        )

        return distance <= query.radius_km