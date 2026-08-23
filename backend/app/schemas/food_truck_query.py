from pydantic import BaseModel, Field


class FoodTruckQuery(BaseModel):
    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180,
    )

    radius_km: float | None = Field(
        default=None,
        gt=0,
        le=100,
    )

    food_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )