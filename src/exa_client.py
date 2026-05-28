"""
Exa Web Search Client - HireIQ
Searches web for candidate intelligence
GitHub profiles, LinkedIn, portfolio, etc.
"""

import logging
from exa_py import Exa
from src.config import Config

logger = logging.getLogger(__name__)

# Initialize Exa client
exa = Exa(api_key=Config.EXA_API_KEY)


def search_candidate_online(
    candidate_name: str,
    candidate_email: str = None,
    job_title: str = None
) -> dict:
    """
    Search web for candidate information

    Args:
        candidate_name: Full name of candidate
        candidate_email: Email (optional, for better search)
        job_title: Job title being applied for

    Returns:
        Dict with github, linkedin, portfolio, news findings
    """
    results = {
        "github": [],
        "linkedin": [],
        "portfolio": [],
        "other": [],
        "summary": ""
    }

    try:
        # Search GitHub profile
        github_results = exa.search_and_contents(
            f"{candidate_name} github developer portfolio",
            num_results=3,
            use_autoprompt=True,
            include_domains=["github.com"],
            text={"max_characters": 500}
        )

        for r in github_results.results:
            results["github"].append({
                "title": r.title,
                "url": r.url,
                "snippet": r.text[:200] if r.text else ""
            })

        logger.info(f"✅ Found {len(results['github'])} GitHub results")

    except Exception as e:
        logger.warning(f"⚠️ GitHub search failed: {e}")

    try:
        # Search LinkedIn profile
        linkedin_results = exa.search_and_contents(
            f"{candidate_name} linkedin professional",
            num_results=2,
            use_autoprompt=True,
            include_domains=["linkedin.com"],
            text={"max_characters": 300}
        )

        for r in linkedin_results.results:
            results["linkedin"].append({
                "title": r.title,
                "url": r.url,
                "snippet": r.text[:200] if r.text else ""
            })

        logger.info(f"✅ Found {len(results['linkedin'])} LinkedIn results")

    except Exception as e:
        logger.warning(f"⚠️ LinkedIn search failed: {e}")

    try:
        # General web search
        if job_title:
            general_results = exa.search_and_contents(
                f"{candidate_name} {job_title} developer engineer",
                num_results=3,
                use_autoprompt=True,
                text={"max_characters": 300}
            )

            for r in general_results.results:
                if "github.com" not in r.url and "linkedin.com" not in r.url:
                    results["other"].append({
                        "title": r.title,
                        "url": r.url,
                        "snippet": r.text[:200] if r.text else ""
                    })

    except Exception as e:
        logger.warning(f"⚠️ General search failed: {e}")

    # Generate summary
    total_found = (
        len(results["github"]) +
        len(results["linkedin"]) +
        len(results["other"])
    )

    if total_found > 0:
        results["summary"] = (
            f"Found {len(results['github'])} GitHub profiles, "
            f"{len(results['linkedin'])} LinkedIn profiles, "
            f"{len(results['other'])} other web mentions"
        )
    else:
        results["summary"] = "No significant web presence found"

    logger.info(f"🌐 Web search complete: {results['summary']}")
    return results


def search_company_info(company_name: str) -> dict:
    """
    Search for company information
    Used for market intelligence

    Args:
        company_name: Name of company

    Returns:
        Dict with company news and info
    """
    results = {"news": [], "summary": ""}

    try:
        company_results = exa.search_and_contents(
            f"{company_name} company news hiring 2026",
            num_results=3,
            use_autoprompt=True,
            text={"max_characters": 400}
        )

        for r in company_results.results:
            results["news"].append({
                "title": r.title,
                "url": r.url,
                "snippet": r.text[:200] if r.text else ""
            })

        results["summary"] = f"Found {len(results['news'])} news items about {company_name}"

    except Exception as e:
        logger.warning(f"⚠️ Company search failed: {e}")
        results["summary"] = "Company search unavailable"

    return results