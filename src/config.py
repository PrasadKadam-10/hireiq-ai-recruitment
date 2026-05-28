"""
Configuration Management - HireIQ
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""

    # ========================================================================
    # ASI1 CONFIGURATION (Primary LLM - Reasoning)
    # ========================================================================
    ASI1_API_KEY: str = os.getenv("ASI1_API_KEY", "")
    ASI1_BASE_URL: str = "https://api.asi1.ai/v1"
    ASI1_MODEL: str = "asi1-mini"

    # ========================================================================
    # GROQ CONFIGURATION (Fast LLM - Extraction)
    # ========================================================================
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # OpenAI-compatible settings (for LangChain)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "asi1-mini")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.asi1.ai/v1")

    # ========================================================================
    # EXA CONFIGURATION (Web Search)
    # ========================================================================
    EXA_API_KEY: str = os.getenv("EXA_API_KEY", "")

    # ========================================================================
    # QDRANT CONFIGURATION (Vector DB)
    # ========================================================================
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = "hireiq_candidates"

    # ========================================================================
    # MONGODB CONFIGURATION
    # ========================================================================
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB: str = "hireiq"

    # ========================================================================
    # FASTAPI CONFIGURATION
    # ========================================================================
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    RELOAD: bool = os.getenv("RELOAD", "false").lower() == "true"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    WORKERS: int = int(os.getenv("WORKERS", "1"))

    # ========================================================================
    # LLM TEMPERATURE SETTINGS
    # ========================================================================
    EXTRACTION_TEMP: float = float(os.getenv("EXTRACTION_TEMP", "0.1"))
    SUMMARY_TEMP: float = float(os.getenv("SUMMARY_TEMP", "0.5"))
    EVALUATION_TEMP: float = float(os.getenv("EVALUATION_TEMP", "0.3"))

    # ========================================================================
    # VALIDATION
    # ========================================================================
    @classmethod
    def validate(cls) -> bool:
        missing = []
        if not cls.ASI1_API_KEY:
            missing.append("ASI1_API_KEY")
        if not cls.GROQ_API_KEY:
            missing.append("GROQ_API_KEY")
        if not cls.EXA_API_KEY:
            missing.append("EXA_API_KEY")
        if not cls.QDRANT_URL:
            missing.append("QDRANT_URL")
        if missing:
            import warnings
            warnings.warn(f"Missing config: {', '.join(missing)}")
        return True

    @classmethod
    def get_provider_info(cls) -> dict:
        return {
            "reasoning_llm": f"ASI1 ({cls.ASI1_MODEL})",
            "extraction_llm": f"Groq ({cls.GROQ_MODEL})",
            "web_search": "Exa",
            "vector_db": "Qdrant",
            "database": "MongoDB"
        }


# Validate on import
try:
    Config.validate()
    print(f"✅ HireIQ Config loaded - ASI1 + Groq + Exa + Qdrant + MongoDB")
except Exception as e:
    import warnings
    warnings.warn(f"Config warning: {e}")