"""
AI-Powered HR Automation with LangGraph - HireIQ
Complete CV Review to Candidate Evaluation System
"""

import os
import logging
from datetime import datetime
from langgraph.graph import StateGraph, END
from langgraph.types import RetryPolicy

from src.data_models import AgentState
from src.nodes import (
    upload_cv_node,
    extract_cv_data_node,
    extract_job_skills_node,
    generate_summary_node,
    evaluate_candidate_node,
    skills_match_node,
    web_research_node,
    score_decision_node,
    save_to_mongodb_node,
    route_on_score
)
from src.fastapi_api import HRJobPost

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============================================================================
# LANGGRAPH WORKFLOW
# ============================================================================

def create_hr_workflow():
    """Create the LangGraph workflow"""

    graph = StateGraph(AgentState)

    # Add all nodes
    graph.add_node("upload_cv", upload_cv_node)
    graph.add_node("extract_cv_data_node", extract_cv_data_node)
    graph.add_node("extract_job_skills_node", extract_job_skills_node)
    graph.add_node("generate_summary", generate_summary_node)
    graph.add_node("evaluate", evaluate_candidate_node,
                   retry_policy=RetryPolicy(max_attempts=2))
    graph.add_node("skills_match_node", skills_match_node)
    graph.add_node("web_research_node", web_research_node)
    graph.add_node("score_decision", score_decision_node)
    graph.add_node("save_results", save_to_mongodb_node)

    # Define flow
    graph.set_entry_point("upload_cv")
    graph.add_edge("upload_cv", "extract_cv_data_node")
    graph.add_edge("extract_cv_data_node", "extract_job_skills_node")
    graph.add_edge("extract_job_skills_node", "generate_summary")
    graph.add_edge("generate_summary", "evaluate")
    graph.add_edge("evaluate", "skills_match_node")
    graph.add_edge("skills_match_node", "web_research_node")
    graph.add_edge("web_research_node", "score_decision")
    graph.add_edge("score_decision", "save_results")
    graph.add_edge("save_results", END)

    return graph.compile()


# ============================================================================
# MAIN PROCESS FUNCTION
# ============================================================================

async def process_candidate(candidate_data: dict, hr_job_post: HRJobPost):
    """
    Main function to process a candidate application

    Args:
        candidate_data: Dict with name, email, cv_file_path
        hr_job_post: Job post Pydantic model

    Returns:
        Final state with all results
    """
    if not candidate_data.get("cv_file_path"):
        raise ValueError("cv_file_path is required")

    logger.info(f"🚀 Processing candidate: {candidate_data.get('name')}")
    logger.info(f"📋 Job: {hr_job_post.job_application.title}")

    # Initialize state
    initial_state = AgentState(
        candidate_name=candidate_data["name"],
        candidate_email=candidate_data["email"],
        cv_file_url="",
        cv_file_path=candidate_data["cv_file_path"],
        extracted_cv_data={},
        cv_link="",
        summary="",
        job_title=hr_job_post.job_application.title,
        job_description=hr_job_post.job_application.description or "",
        job_description_html=hr_job_post.job_application.description_html or "",
        job_skills={},
        hr_email=hr_job_post.hr.email if hasattr(hr_job_post, 'hr') else "",
        evaluation={},
        skills_match={},
        web_research={},
        tag="",
        evaluation_score=0,
        notification_message="",
        notify_hr=False,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        errors=[],
        messages=[]
    )

    # Run workflow
    app = create_hr_workflow()
    final_state = await app.ainvoke(initial_state)

    logger.info(f"✅ Processing complete - Score: {final_state.get('evaluation_score', 0)}/100")
    return final_state


async def process_job_application_submission(
    candidate_data: dict,
    hr_job_post: HRJobPost
):
    """Wrapper for FastAPI endpoint"""
    return await process_candidate(candidate_data, hr_job_post)