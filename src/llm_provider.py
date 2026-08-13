"""
LLM Provider - HireIQ
Using ASI1 for ALL tasks (Groq backup)
"""

from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel
from src.config import Config
import logging

logger = logging.getLogger(__name__)


def get_asi1_llm(temperature: float = 0.3) -> BaseChatModel:
    """ASI1 LLM"""
    return ChatOpenAI(
        model=Config.ASI1_MODEL,
        api_key=Config.ASI1_API_KEY,
        base_url=Config.ASI1_BASE_URL,
        temperature=temperature,
        max_tokens=1000
    )


# ALL functions use ASI1 now
def create_extraction_llm() -> BaseChatModel:
    return get_asi1_llm(temperature=0.1)

def create_job_skills_llm() -> BaseChatModel:
    return get_asi1_llm(temperature=0.0)

def create_summary_llm() -> BaseChatModel:
    return get_asi1_llm(temperature=0.5)

def create_evaluation_llm() -> BaseChatModel:
    return get_asi1_llm(temperature=0.3)

def get_groq_llm(temperature: float = 0.1) -> BaseChatModel:
    return get_asi1_llm(temperature=temperature)