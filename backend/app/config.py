from functools import lru_cache
from typing import List, Optional, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_uri: str = Field(
        default="",
        validation_alias="MONGODB_URI",
        description="MongoDB Atlas connection URI"
    )
    mongodb_database: str = Field(
        default="adaptive_learning",
        validation_alias="MONGODB_DATABASE",
        description="MongoDB Database name"
    )
    firebase_credentials_path: Optional[str] = Field(
        default=None,
        validation_alias="FIREBASE_CREDENTIALS_PATH",
        description="Path to Firebase service account JSON key file"
    )
    environment: str = Field(
        default="development",
        validation_alias="ENVIRONMENT",
        description="Application environment: development, staging, production"
    )
    cors_origins: Union[List[str], str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173"],
        validation_alias="CORS_ORIGINS",
        description="Allowed CORS origins"
    )
    port: int = Field(default=8000, validation_alias="PORT")
    host: str = Field(default="0.0.0.0", validation_alias="HOST")

    # Gemini Multimodal Live Voice API
    gemini_api_key: Optional[str] = Field(
        default=None,
        validation_alias="GEMINI_API_KEY",
        description="Google Gemini API key for Live Voice Tutor"
    )
    gemini_voice_model: str = Field(
        default="gemini-2.5-flash-native-audio-latest",
        validation_alias="GEMINI_VOICE_MODEL",
        description="Gemini Live model with native bidirectional audio"
    )

    gemini_voice_name: str = Field(
        default="Puck",
        validation_alias="GEMINI_VOICE_NAME",
        description="Prebuilt voice name: Puck, Charon, Kore, Fenrir, Aoede"
    )

    # Groq Cloud API for Chat Bot Dashboard
    groq_api_key: Optional[str] = Field(
        default=None,
        validation_alias="GROQ_API_KEY",
        description="Groq API key for Chat Bot Dashboard"
    )
    groq_model: str = Field(
        default="qwen/qwen3.8-27b",
        validation_alias="GROQ_MODEL",
        description="Default Groq chat model"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("cors_origins", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v



@lru_cache()
def get_settings() -> Settings:
    return Settings()
