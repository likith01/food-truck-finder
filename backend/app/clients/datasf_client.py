import logging

import httpx

from app.core.config import settings


logger = logging.getLogger(__name__)


class DataSFClient:
    """Client responsible for communicating with DataSF."""

    def __init__(
        self,
        http_client: httpx.AsyncClient,
    ) -> None:
        self.http_client = http_client

    async def get_food_trucks(self) -> list[dict]:
        logger.info("Fetching food trucks from DataSF")

        try:
            response = await self.http_client.get(
                settings.datasf_api_url,
                timeout=10.0,
            )

            response.raise_for_status()

        except httpx.TimeoutException:
            logger.exception("DataSF API request timed out")
            raise

        except httpx.HTTPStatusError as exc:
            logger.error(
                "DataSF API returned HTTP %s",
                exc.response.status_code,
            )
            raise

        except httpx.RequestError:
            logger.exception("DataSF API request failed")
            raise

        try:
            data = response.json()

        except ValueError:
            logger.exception(
                "DataSF API returned invalid JSON"
            )
            raise

        if not isinstance(data, list):
            logger.error(
                "Unexpected DataSF response format. "
                "Expected list, received %s",
                type(data).__name__,
            )
            raise ValueError(
                "Unexpected response format from DataSF API"
            )

        logger.info(
            "Successfully fetched %d records from DataSF",
            len(data),
        )

        return data