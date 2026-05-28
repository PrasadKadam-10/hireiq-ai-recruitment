"""
LangGraph Nodes - HireIQ
All node implementations for the HR automation workflow
"""

import os
import logging
import tempfile
from datetime import datetime
from pathlib import Path

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser

from src.data_models import (
    AgentState, CandidateEvaluation,
    JobSkills, SkillsMatch, PersonalData
)
from src.llm_provider import (
    create_extraction_llm,
    create_job_skills_llm,
    create_summary_llm,
    create_evaluation_llm
)
from src.data_extraction import extract_cv_data
from src.skills_match import map_job_to_candidate_skills
from src.exa_client import search_candidate_online
from src.config import Config

logger = logging.getLogger(__name__)


# ============================================================================
# NODE 1: UPLOAD CV
# ============================================================================

async def upload_cv_node(state: AgentState) -> dict:
    """
    Node 1: Handle CV file
    Saves uploaded CV locally (no Google Cloud needed)
    """
    logger.info("📄 Node 1: Processing CV upload")

    try:
        cv_file_path = state.get("cv_file_path", "")

        if not cv_file_path or not Path(cv_file_path).exists():
            return {
                "errors": state.get("errors", []) + ["CV file not found"],
                "cv_link": ""
            }

        # Use local path as CV link
        cv_link = f"file://{cv_file_path}"
        logger.info(f"✅ CV file ready: {cv_file_path}")

        return {"cv_link": cv_link}

    except Exception as e:
        logger.error(f"❌ CV upload failed: {e}")
        return {"errors": state.get("errors", []) + [str(e)]}


# ============================================================================
# NODE 2: EXTRACT CV DATA
# ============================================================================

async def extract_cv_data_node(state: AgentState) -> dict:
    """
    Node 2: Extract structured data from CV
    Uses Groq (fast) + pdfplumber
    """
    logger.info("🔍 Node 2: Extracting CV data")

    try:
        cv_text = extract_cv_data(state["cv_file_path"])

        llm = create_extraction_llm()

        prompt = ChatPromptTemplate.from_template("""
You are an expert CV parser. Extract information from this CV.

GUIDELINES:
- Extract ONLY information explicitly stated in the CV
- Use "Not provided" for missing fields
- Never infer or guess information

CV TEXT:
{cv_text}

Respond with ONLY a valid JSON object, no other text:
{{
    "fullName": "<full name>",
    "phoneNumber": "<phone or Not provided>",
    "githubUrl": "<github url or Not provided>",
    "linkedinUrl": "<linkedin url or Not provided>",
    "city": "<city or Not provided>",
    "technicalSkills": ["<skill1>", "<skill2>", "<skill3>"]
}}
""")

        chain = prompt | llm | StrOutputParser()
        raw_response = await chain.ainvoke({
            "cv_text": cv_text[:3000],
        })

        # Clean and parse JSON
        import json
        import re
        clean = re.sub(r'```json\s*', '', raw_response)
        clean = re.sub(r'```\s*', '', clean)
        clean = clean.strip()

        json_match = re.search(r'\{.*\}', clean, re.DOTALL)
        if json_match:
            extracted_data = json.loads(json_match.group())
        else:
            extracted_data = json.loads(clean)

        extracted_data["raw_text"] = cv_text
        logger.info(f"✅ CV extracted for: {extracted_data.get('fullName', 'Unknown')}")

        return {"extracted_cv_data": extracted_data}

    except Exception as e:
        logger.error(f"❌ CV extraction failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"CV extraction: {str(e)}"],
            "extracted_cv_data": {
                "raw_text": "",
                "fullName": state.get("candidate_name", ""),
                "technicalSkills": []
            }
        }

# ============================================================================
# NODE 3: EXTRACT JOB SKILLS
# ============================================================================

async def extract_job_skills_node(state: AgentState) -> dict:
    """
    Node 3: Extract required skills from job description
    Uses Groq (fast, deterministic)
    """
    logger.info("💼 Node 3: Extracting job skills")

    try:
        llm = create_job_skills_llm()

        prompt = ChatPromptTemplate.from_template("""
Extract all required skills from this job description.

JOB TITLE: {job_title}
JOB DESCRIPTION: {job_description}

Respond with ONLY a valid JSON object, no other text:
{{
    "tech_skills": ["<skill1>", "<skill2>", "<skill3>"],
    "soft_skills": ["<skill1>", "<skill2>"]
}}
""")

        chain = prompt | llm | StrOutputParser()
        raw_response = await chain.ainvoke({
            "job_title": state["job_title"],
            "job_description": state["job_description"][:2000],
        })

        import json
        import re
        clean = re.sub(r'```json\s*', '', raw_response)
        clean = re.sub(r'```\s*', '', clean)
        clean = clean.strip()

        json_match = re.search(r'\{.*\}', clean, re.DOTALL)
        if json_match:
            job_skills = json.loads(json_match.group())
        else:
            job_skills = json.loads(clean)

        logger.info(f"✅ Extracted {len(job_skills.get('tech_skills', []))} tech skills")
        return {"job_skills": job_skills}

    except Exception as e:
        logger.error(f"❌ Job skills extraction failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"Job skills: {str(e)}"],
            "job_skills": {"tech_skills": [], "soft_skills": []}
        }

# ============================================================================
# NODE 4: GENERATE SUMMARY
# ============================================================================

async def generate_summary_node(state: AgentState) -> dict:
    """
    Node 4: Generate candidate summary
    Uses ASI1 (better reasoning)
    """
    logger.info("📝 Node 4: Generating candidate summary")

    try:
        llm = create_summary_llm()
        parser = StrOutputParser()

        prompt = ChatPromptTemplate.from_template("""
You are an expert HR recruiter. Write a professional 200-word summary of this candidate.

GUIDELINES:
- Be objective and factual
- Highlight key strengths
- Mention relevant experience
- Keep it professional

CANDIDATE NAME: {candidate_name}
JOB TITLE: {job_title}
CV DATA: {cv_text}
""")

        chain = prompt | llm | parser
        summary = await chain.ainvoke({
            "candidate_name": state["candidate_name"],
            "job_title": state["job_title"],
            "cv_text": state["extracted_cv_data"].get("raw_text", "")[:2000]
        })

        logger.info("✅ Summary generated")
        return {"summary": summary}

    except Exception as e:
        logger.error(f"❌ Summary generation failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"Summary failed: {str(e)}"],
            "summary": f"Candidate: {state['candidate_name']} applied for {state['job_title']}"
        }


# ============================================================================
# NODE 5: EVALUATE CANDIDATE
# ============================================================================

async def evaluate_candidate_node(state: AgentState) -> dict:
    """
    Node 5: Evaluate candidate with score 1-100
    Uses ASI1 (best reasoning)
    Anti-hallucination CoT prompting
    """
    logger.info("⭐ Node 5: Evaluating candidate")

    try:
        llm = create_evaluation_llm()

        prompt = ChatPromptTemplate.from_template("""
You are an Expert Technical Recruiter. Evaluate this candidate objectively.

ANTI-HALLUCINATION GUIDELINES:
- Use ONLY information from the CV text
- State "Missing" for skills not explicitly mentioned
- Never infer experience not stated
- Always provide step-by-step reasoning before scoring

EVALUATION PROCESS:
Step 1: Extract technical skills from CV
Step 2: Cross-reference with job requirements
Step 3: Analyze years of experience
Step 4: Identify skill gaps
Step 5: Provide final score (1-100) with justification

CANDIDATE: {candidate_name}
JOB TITLE: {job_title}
JOB DESCRIPTION: {job_description}
CV TEXT: {cv_text}

Respond with ONLY a valid JSON object in this exact format, no other text:
{{
    "score": <integer between 1 and 100>,
    "reasoning": "<detailed reasoning>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "gaps": ["<gap 1>", "<gap 2>"],
    "decision": "<one line hiring decision>"
}}
""")

        chain = prompt | llm | StrOutputParser()
        raw_response = await chain.ainvoke({
            "candidate_name": state["candidate_name"],
            "job_title": state["job_title"],
            "job_description": state["job_description"][:1500],
            "cv_text": state["extracted_cv_data"].get("raw_text", "")[:2000],
        })

        logger.info(f"Raw evaluation response: {raw_response[:200]}")

        # Clean and parse JSON
        import json
        import re

        # Remove markdown code blocks if present
        clean = re.sub(r'```json\s*', '', raw_response)
        clean = re.sub(r'```\s*', '', clean)
        clean = clean.strip()

        # Find JSON object
        json_match = re.search(r'\{.*\}', clean, re.DOTALL)
        if json_match:
            evaluation = json.loads(json_match.group())
        else:
            evaluation = json.loads(clean)

        score = int(evaluation.get("score", 0))
        logger.info(f"✅ Evaluation complete - Score: {score}/100")

        return {
            "evaluation": evaluation,
            "evaluation_score": score
        }

    except Exception as e:
        logger.error(f"❌ Evaluation failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"Evaluation failed: {str(e)}"],
            "evaluation": {
                "score": 0,
                "reasoning": f"Evaluation failed: {str(e)}",
                "strengths": [],
                "gaps": [],
                "decision": "Unable to evaluate"
            },
            "evaluation_score": 0
        }

# ============================================================================
# NODE 6: SKILLS MATCH
# ============================================================================

async def skills_match_node(state: AgentState) -> dict:
    """
    Node 6: Match candidate skills against job requirements
    """
    logger.info("🎯 Node 6: Matching skills")

    try:
        job_skills = state.get("job_skills", {})
        cv_data = state.get("extracted_cv_data", {})

        # Get candidate skills
        candidate_skills = cv_data.get("technicalSkills", [])
        if not candidate_skills:
            # Extract from raw text if structured skills not available
            raw_text = cv_data.get("raw_text", "")
            candidate_skills = extract_skills_from_text(raw_text)

        # Create JobSkills object
        from src.data_models import JobSkills as JobSkillsModel
        job_skills_obj = JobSkillsModel(
            tech_skills=job_skills.get("tech_skills", []),
            soft_skills=job_skills.get("soft_skills", [])
        )

        # Match skills
        skills_match = map_job_to_candidate_skills(
            job_skills_obj,
            candidate_skills
        )

        logger.info(f"✅ Skills matched")
        return {"skills_match": skills_match.model_dump()}

    except Exception as e:
        logger.error(f"❌ Skills match failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"Skills match failed: {str(e)}"],
            "skills_match": {"strong": [], "partial": [], "missing": []}
        }


def extract_skills_from_text(text: str) -> list[str]:
    """Extract common tech skills from raw text"""
    common_skills = [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
        "React", "Next.js", "Vue", "Angular", "Node.js", "FastAPI", "Django", "Flask",
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "Qdrant", "Pinecone",
        "LangChain", "LangGraph", "CrewAI", "RAG", "LLM", "Machine Learning",
        "TensorFlow", "PyTorch", "Pandas", "NumPy", "SQL"
    ]

    found_skills = []
    text_lower = text.lower()

    for skill in common_skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    return found_skills


# ============================================================================
# NODE 7: WEB RESEARCH (EXA)
# ============================================================================

async def web_research_node(state: AgentState) -> dict:
    """
    Node 7: Research candidate online using Exa
    Our unique differentiator!
    """
    logger.info("🌐 Node 7: Researching candidate online")

    try:
        web_results = search_candidate_online(
            candidate_name=state["candidate_name"],
            candidate_email=state.get("candidate_email", ""),
            job_title=state["job_title"]
        )

        logger.info(f"✅ Web research: {web_results['summary']}")
        return {"web_research": web_results}

    except Exception as e:
        logger.error(f"❌ Web research failed: {e}")
        return {
            "errors": state.get("errors", []) + [f"Web research failed: {str(e)}"],
            "web_research": {"summary": "Web research unavailable", "github": [], "linkedin": [], "other": []}
        }


# ============================================================================
# NODE 8: SCORE DECISION
# ============================================================================

def score_decision_node(state: AgentState) -> dict:
    """
    Node 8: Make hiring decision based on score
    """
    logger.info("🎯 Node 8: Making score decision")

    score = state.get("evaluation_score", 0)

    if score >= 75:
        tag = "Strong Fit ✅"
        notify_hr = True
    elif score >= 50:
        tag = "Potential Fit 🟡"
        notify_hr = True
    else:
        tag = "Not a Fit ❌"
        notify_hr = False

    message = f"""
🤖 HireIQ Candidate Report
─────────────────────────
Candidate: {state['candidate_name']}
Email: {state.get('candidate_email', 'N/A')}
Role: {state['job_title']}
Score: {score}/100
Decision: {tag}
─────────────────────────
{state.get('summary', '')[:200]}
"""

    logger.info(f"✅ Decision: {tag}")
    return {
        "tag": tag,
        "notify_hr": notify_hr,
        "notification_message": message
    }


# ============================================================================
# NODE 9: SAVE TO MONGODB
# ============================================================================

async def save_to_mongodb_node(state: AgentState) -> dict:
    """
    Node 9: Save results to MongoDB
    """
    logger.info("💾 Node 9: Saving to MongoDB")

    try:
        from src.fastapi_api import db
        from datetime import datetime

        result_doc = {
            "candidateName": state.get("candidate_name"),
            "candidateEmail": state.get("candidate_email"),
            "jobTitle": state.get("job_title"),
            "score": state.get("evaluation_score", 0),
            "tag": state.get("tag", ""),
            "summary": state.get("summary", ""),
            "evaluation": state.get("evaluation", {}),
            "skillsMatch": state.get("skills_match", {}),
            "webResearch": state.get("web_research", {}),
            "cvLink": state.get("cv_link", ""),
            "timestamp": datetime.now().isoformat(),
            "errors": state.get("errors", [])
        }

        await db.candidates.insert_one(result_doc)
        logger.info("✅ Results saved to MongoDB")

        return {}

    except Exception as e:
        logger.error(f"❌ MongoDB save failed: {e}")
        return {"errors": state.get("errors", []) + [f"MongoDB save failed: {str(e)}"]}


# ============================================================================
# ROUTING FUNCTION
# ============================================================================

def route_on_score(state: AgentState) -> str:
    """Route based on score decision"""
    if state.get("notify_hr", False):
        return "notify_hr"
    return "end"