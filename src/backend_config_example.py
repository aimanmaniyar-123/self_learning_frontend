"""
Configuration for Self-Evolving AI Agent Platform Backend
Copy this to your backend as config.py
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Configuration
    # ⚠️ IMPORTANT: Add your frontend's port here!
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",     # React default
        "http://localhost:5173",     # Vite default (YOUR FRONTEND)
        "http://localhost:8501",     # Streamlit
        "http://localhost:8080",     # Alternative
        "*",                         # Allow all (dev only!)
    ]
    
    # Database Configuration (if needed)
    DATABASE_URL: str = "sqlite:///./agent_system.db"
    
    # API Configuration
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Self-Evolving AI Agent Platform"
    VERSION: str = "2.0.0"
    
    # Agent Configuration
    MAX_AGENTS: int = 1000
    DEFAULT_AGENT_TYPE: str = "Classification"
    
    # Training Configuration
    DEFAULT_EPOCHS: int = 10
    DEFAULT_BATCH_SIZE: int = 32
    
    # Anomaly Detection Configuration
    ANOMALY_THRESHOLD_SIGMA: float = 3.0
    BASELINE_WINDOW_SIZE: int = 100
    
    # Goal Configuration
    DEFAULT_GOAL_PRIORITY: int = 5
    MAX_GOALS_PER_AGENT: int = 50
    
    # Checkpoint Configuration
    MAX_CHECKPOINTS_PER_AGENT: int = 10
    CHECKPOINT_STORAGE_PATH: str = "./checkpoints"
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Singleton instance
_settings = None


def get_settings() -> Settings:
    """Get settings singleton"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


# For backward compatibility
settings = get_settings()


# Alternative: Simple settings without pydantic
class SimpleSettings:
    """Simple settings without pydantic dependency"""
    HOST = "0.0.0.0"
    PORT = 8000
    DEBUG = True
    
    # ⚠️ IMPORTANT: Include your frontend port!
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",  # ← YOUR FRONTEND PORT
        "http://localhost:8501",
        "*",  # Allow all for development
    ]
    
    DATABASE_URL = "sqlite:///./agent_system.db"
    API_V1_PREFIX = "/api"
    PROJECT_NAME = "Self-Evolving AI Agent Platform"
    VERSION = "2.0.0"


# Use this if you don't have pydantic installed
def get_simple_settings():
    return SimpleSettings()
