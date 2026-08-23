import logging
from typing import Any
from app.core.config import settings
import httpx


logger = logging.getLogger(__name__)


class DataSFClient:

    BASE_URL = (
        settings.datasf_api_url
    )
    logger.info(f"API URL Used: {BASE_URL}")

    def __init__(
        self,
        http_client: httpx.AsyncClient,
    ) -> None:
        self.http_client = http_client

    async def get_food_trucks(
        self,
        *,
        search: str | None = None,
        latitude: float | None = None,
        longitude: float | None = None,
        radius: float | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict[str, Any]]:

        params: dict[str, Any] = {
            "$limit": limit,
            "$offset": offset,
        }

        if search:
            params["$q"] = search.strip()

        if latitude is not None and longitude is not None:
            # DataSF expects radius in meters.
            radius_meters = (
                radius * 1000
                if radius is not None
                else None
            )

            if radius_meters is not None:
                params["$where"] = (
                    "within_circle("
                    "location,"
                    f"{latitude},"
                    f"{longitude},"
                    f"{radius_meters}"
                    ")"
                )

        logger.info(
            "Requesting food trucks from DataSF | "
            "search=%s latitude=%s longitude=%s "
            "radius_km=%s limit=%d offset=%d",
            search,
            latitude,
            longitude,
            radius,
            limit,
            offset,
        )

        try:
            response = await self.http_client.get(
                self.BASE_URL,
                params=params,
            )

            response.raise_for_status()

            data = response.json()

            if not isinstance(data, list):
                logger.error(
                    "Unexpected DataSF response type: %s",
                    type(data).__name__,
                )

                raise ValueError(
                    "Invalid response received from DataSF"
                )

            logger.info(
                "DataSF returned %d food truck records",
                len(data),
            )

            return data

        except httpx.HTTPStatusError:
            logger.exception(
                "DataSF returned HTTP error | status=%s",
                response.status_code,
            )
            raise

        except httpx.RequestError:
            logger.exception(
                "DataSF request failed"
            )
            raise

        except ValueError:
            logger.exception(
                "Invalid response received from DataSF"
            )
            raise

        except Exception:
            logger.exception(
                "Unexpected error while requesting DataSF"
            )
            raise