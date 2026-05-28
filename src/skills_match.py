"""
Skills Matching - HireIQ
Matches candidate skills against job requirements
Returns: strong match, partial match, missing skills
"""

import logging
from src.data_models import SkillsMatch, JobSkills

logger = logging.getLogger(__name__)


def normalize(skill: str) -> str:
    """Normalize skill name for comparison"""
    return skill.lower().strip().replace("-", " ").replace("_", " ")


def map_job_to_candidate_skills(
    job_skills: JobSkills,
    candidate_skills: list[str]
) -> SkillsMatch:
    """
    Match candidate skills against job requirements

    Args:
        job_skills: Required skills from job description
        candidate_skills: Skills extracted from candidate CV

    Returns:
        SkillsMatch with strong/partial/missing categories
    """

    # Normalize all skills
    candidate_normalized = {normalize(s): s for s in candidate_skills}
    all_job_skills = job_skills.tech_skills + job_skills.soft_skills

    strong = []
    partial = []
    missing = []

    for job_skill in all_job_skills:
        job_norm = normalize(job_skill)
        matched = False

        # Check exact match
        if job_norm in candidate_normalized:
            strong.append(job_skill)
            matched = True
            continue

        # Check partial match (job skill words appear in candidate skills)
        job_words = set(job_norm.split())
        for cand_norm in candidate_normalized:
            cand_words = set(cand_norm.split())
            # If more than half the words match
            common = job_words & cand_words
            if common and len(common) / len(job_words) >= 0.5:
                partial.append(job_skill)
                matched = True
                break

        if not matched:
            missing.append(job_skill)

    # Calculate match score
    total = len(all_job_skills)
    if total > 0:
        score = (len(strong) + len(partial) * 0.5) / total
    else:
        score = 0.0

    logger.info(f"✅ Skills match: {len(strong)} strong, {len(partial)} partial, {len(missing)} missing")
    logger.info(f"📊 Match score: {score:.2f}")

    return SkillsMatch(
        strong=strong,
        partial=partial,
        missing=missing
    )


def calculate_match_score(skills_match: SkillsMatch, total_skills: int) -> float:
    """
    Calculate overall skills match score (0.0 - 1.0)

    Args:
        skills_match: SkillsMatch object
        total_skills: Total number of required skills

    Returns:
        Float score between 0.0 and 1.0
    """
    if total_skills == 0:
        return 0.0

    score = (
        len(skills_match.strong) * 1.0 +
        len(skills_match.partial) * 0.5
    ) / total_skills

    return round(min(score, 1.0), 2)