from pydantic import BaseModel, Field, model_validator


class FoodTruckQuery(BaseModel):
    search: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

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

    radius: float | None = Field(
        default=None,
        gt=0,
        le=100,
        description="Search radius in kilometers",
    )

    limit: int = Field(
        default=50,
        ge=1,
        le=100,
    )

    offset: int = Field(
        default=0,
        ge=0,
    )

    @model_validator(mode="after")
    def validate_location(self) -> "FoodTruckQuery":

        latitude_provided = self.latitude is not None
        longitude_provided = self.longitude is not None

        if latitude_provided != longitude_provided:
            raise ValueError(
                "latitude and longitude must be provided together"
            )

        if self.radius is not None:
            if self.latitude is None or self.longitude is None:
                raise ValueError(
                    "latitude and longitude are required "
                    "when radius is provided"
                )

        return self