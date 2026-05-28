"""
LLM Provider - HireIQ
ASI1 for reasoning + Groq for fast extraction
"""

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.language_models import BaseChatModel
from src.config import Config


# ============================================================================
# ASI1 LLM (Reasoning - Evaluation, Summary, Decision)
# ============================================================================

def get_asi1_llm(temperature: float = 0.3) -> BaseChatModel:
    """ASI1 LLM for reasoning tasks"""
    return ChatOpenAI(
        model=Config.ASI1_MODEL,
        api_key=Config.ASI1_API_KEY,
        base_url=Config.ASI1_BASE_URL,
        temperature=temperature,
        max_tokens=1000
    )


# ============================================================================
# GROQ LLM (Fast - Extraction, Parsing)
# ============================================================================

def get_groq_llm(temperature: float = 0.1) -> BaseChatModel:
    """Groq LLM for fast extraction tasks"""
    return ChatGroq(
        model=Config.GROQ_MODEL,
        api_key=Config.GROQ_API_KEY,
        temperature=temperature,
        max_tokens=1000
    )


# ============================================================================
# TASK-SPECIFIC LLM FACTORIES
# ============================================================================

def create_extraction_llm() -> BaseChatModel:
    """Fast extraction → Groq"""
    return get_groq_llm(temperature=Config.EXTRACTION_TEMP)


def create_job_skills_llm() -> BaseChatModel:
    """Job skills extraction → Groq"""
    return get_groq_llm(temperature=0.0)


def create_summary_llm() -> BaseChatModel:
    """Summary generation → ASI1"""
    return get_asi1_llm(temperature=Config.SUMMARY_TEMP)


def create_evaluation_llm() -> BaseChatModel:
    """Candidate evaluation → ASI1"""
    return get_asi1_llm(temperature=Config.EVALUATION_TEMP)