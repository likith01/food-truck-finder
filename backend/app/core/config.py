from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Food Truck Finder API"
    app_version: str = "1.0.0"
    debug: bool = False
    datasf_api_url: str = (
        "https://data.sfgov.org/resource/e7vf-2mda.json"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()