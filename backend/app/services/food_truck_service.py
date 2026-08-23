import logging

from app.clients.datasf_client import DataSFClient
from app.schemas.food_truck import FoodTruck
from app.schemas.food_truck_query import FoodTruckQuery


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
            "Getting food trucks | "
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

            raw_food_trucks = (
                await self.client.get_food_trucks(
                    search=query.search,
                    latitude=query.latitude,
                    longitude=query.longitude,
                    radius=query.radius,
                    limit=query.limit,
                    offset=query.offset,
                )
            )

            food_trucks: list[FoodTruck] = []

            for item in raw_food_trucks:

                try:

                    food_truck = FoodTruck.model_validate(
                        item
                    )

                    food_trucks.append(food_truck)

                except Exception:
                    logger.exception(
                        "Failed to validate food truck | "
                        "objectid=%s",
                        item.get("objectid"),
                    )

            logger.info(
                "Successfully processed %d/%d food trucks",
                len(food_trucks),
                len(raw_food_trucks),
            )

            return food_trucks

        except Exception:
            logger.exception(
                "Failed to retrieve food trucks"
            )
            raise