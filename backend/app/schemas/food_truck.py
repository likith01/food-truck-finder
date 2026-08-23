from pydantic import BaseModel, Field


class FoodTruck(BaseModel):
    id: str = Field(alias="objectid")
    name: str = Field(alias="applicant")
    location_description: str | None = Field(
        default=None,
        alias="locationdescription",
    )
    address: str | None = None
    permit: str | None = None
    food_items: str | None = Field(
        default=None,
        alias="fooditems",
    )
    latitude: float
    longitude: float
    days_hours: str | None = Field(
        default=None,
        alias="dayshours",
    )

    model_config = {
        "populate_by_name": True,
    }