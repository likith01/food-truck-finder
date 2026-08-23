from collections.abc import AsyncGenerator

import httpx

from app.clients.datasf_client import DataSFClient
from app.services.food_truck_service import FoodTruckService


async def get_food_truck_service() -> AsyncGenerator[
    FoodTruckService,
    None,
]:
    async with httpx.AsyncClient() as http_client:
        client = DataSFClient(http_client)

        yield FoodTruckService(client)