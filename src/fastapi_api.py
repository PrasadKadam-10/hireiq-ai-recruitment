# ============================================================================
# HireIQ - AI Recruitment Intelligence Agent
# FastAPI Backend with LangGraph Workflow
# ============================================================================

"""
FastAPI Backend for HireIQ
Handles job postings, candidate submissions, and CV processing
"""

from bson import ObjectId
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, EmailStr, Field, model_validator, ConfigDict, field_serializer, field_validator
from pydantic.alias_generators import to_camel

from typing import Dict, Any, List, Optional
from pathlib import Path
import os
import sys
import uvicorn
from dotenv import load_dotenv
import logging
from datetime import datetime
from contextlib import asynccontextmanager
import tempfile
import shutil
import re

from pymongo import AsyncMongoClient
from bs4 import BeautifulSoup
from src.config import Config
from src.utils.ulid_helper import generate_ulid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# MONGODB SETUP
# ============================================================================

MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncMongoClient(MONGODB_URL)
db = client.get_database("hireiq")

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ProcessingResult(BaseModel):
    """Model for processing result response"""
    success: bool
    message: str
    candidate_name: str
    candidate_email: str
    summary: str
    score: int
    reasoning: str
    cv_link: str
    timestamp: str
    errors: List[str] = []


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    service: str
    version: str = "1.0.0"
    config: Dict[str, str]


class User(BaseModel):
    id: str
    name: str
    email: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    @field_serializer('id')
    def serialize_id(self, value: Optional[str]) -> Optional[str]:
        if value and isinstance(value, ObjectId):
            return str(value)
        return value


class HRUser(User):
    role: Optional[str] = "hr manager"


class JobApplication(BaseModel):
    title: str
    description_html: str = Field(
        validation_alias="descriptionHTML",
        serialization_alias="descriptionHTML"
    )
    description: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    @model_validator(mode='after')
    def strip_html_and_assign(self) -> 'JobApplication':
        if self.description_html:
            soup = BeautifulSoup(self.description_html, "html.parser")
            block_elements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                              'ul', 'ol', 'blockquote', 'pre', 'hr']
            for tag in soup.find_all(block_elements):
                tag.insert_before('\n\n')
                tag.insert_after('\n\n')
            for li in soup.find_all('li'):
                li.insert_before('\n• ')
            for br in soup.find_all('br'):
                br.replace_with('\n')
            for strong in soup.find_all(['strong', 'b']):
                strong.insert_before('')
                strong.insert_after('')
            text = soup.get_text()
            text = re.sub(r'[ \t]+', ' ', text)
            text = re.sub(r'\n{3,}', '\n\n', text)
            text = '\n'.join(line.strip() for line in text.split('\n'))
            text = text.strip()
            self.description = text
        return self


class HRJobPost(BaseModel):
    id: Optional[str] = Field(
        default=None,
        validation_alias="_id",
        serialization_alias="id"
    )
    ulid: Optional[str] = Field(default_factory=generate_ulid)
    job_application: JobApplication = Field(
        validation_alias="jobApplication",
        serialization_alias="jobApplication"
    )
    hr: HRUser
    created_at: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    @field_serializer('id')
    def serialize_id(self, value: Optional[str]) -> Optional[str]:
        if value and isinstance(value, ObjectId):
            return str(value)
        return value

    @field_validator('ulid', mode='before')
    @classmethod
    def generate_ulid_if_missing(cls, v):
        if v is None or v == '':
            return generate_ulid()
        return v


class CandidateSubmittedApplication(BaseModel):
    job_id: str = Field(
        validation_alias="jobId",
        serialization_alias="jobId"
    )
    name: str
    email: EmailStr

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


# ============================================================================
# LIFESPAN EVENTS
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    logger.info("=" * 80)
    logger.info("🚀 Starting HireIQ API")
    logger.info("=" * 80)
    logger.info(f"Host: {Config.HOST}:{Config.PORT}")
    logger.info(f"Stack: ASI1 + Groq + Exa + Qdrant + MongoDB")
    logger.info("=" * 80)

    try:
        Config.validate()
        logger.info("✅ Configuration validated")
    except ValueError as e:
        logger.error(f"❌ Config failed: {e}")

    yield

    logger.info("👋 Shutting down HireIQ API")


# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="HireIQ - AI Recruitment Intelligence",
    description="Multi-agent AI recruitment system powered by ASI1, Groq, Exa and Qdrant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# ROOT + HEALTH ENDPOINTS
# ============================================================================

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "service": "HireIQ - AI Recruitment Intelligence",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health",
        "description": "Multi-agent AI recruitment powered by ASI1 + Groq + Exa"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        service="HireIQ",
        config={
            "reasoning_llm": "ASI1",
            "extraction_llm": "Groq",
            "web_search": "Exa",
            "vector_db": "Qdrant",
            "database": "MongoDB"
        }
    )


@app.get("/api/config")
async def get_config():
    """Get current configuration"""
    return {
        "reasoning_llm": f"ASI1 ({Config.ASI1_MODEL})",
        "extraction_llm": f"Groq ({Config.GROQ_MODEL})",
        "extraction_temp": Config.EXTRACTION_TEMP,
        "summary_temp": Config.SUMMARY_TEMP,
        "evaluation_temp": Config.EVALUATION_TEMP
    }


# ============================================================================
# JOB ENDPOINTS
# ============================================================================

@app.post("/api/jobs")
async def create_job(hr_job_post: HRJobPost):
    """Create a new job posting"""
    try:
        hr_job_post_data = hr_job_post.model_dump(
            by_alias=True,
            exclude={"id"}
        )
        hr_job_post_data["createdAt"] = datetime.now().isoformat()
        result = await db.hr_job_posts.insert_one(hr_job_post_data)
        job_id = str(result.inserted_id)
        logger.info(f"✅ Job created: {job_id}")
        return {"success": True, "jobId": job_id}
    except Exception as e:
        logger.error(f"❌ Job creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/jobs")
async def get_jobs():
    """Get all job postings"""
    try:
        jobs = await db.hr_job_posts.find().to_list(100)
        for job in jobs:
            job["_id"] = str(job["_id"])
        return {"success": True, "jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    """Get single job posting"""
    try:
        job = await db.hr_job_posts.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        job["_id"] = str(job["_id"])
        return {"success": True, "job": job}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a job posting"""
    try:
        result = await db.hr_job_posts.delete_one(
            {"_id": ObjectId(job_id)}
        )
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"success": True, "message": "Job deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# CANDIDATE ENDPOINTS
# ============================================================================

@app.post("/api/candidate-application-submit")
async def candidate_job_application_submit(
    job_id: str = Form(..., description="Job Id"),
    name: str = Form(..., description="Candidate full name"),
    email: EmailStr = Form(..., description="Candidate email"),
    cv_file: UploadFile = File(..., description="CV PDF file")
):
    """
    Submit candidate application with CV
    Triggers full LangGraph workflow:
    Upload → Extract → Skills → Summary → Evaluate → Web Research → Score → Save
    """
    tmp_path = None
    try:
        # Validate PDF
        if not cv_file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files accepted"
            )

       # Save CV to permanent location
        upload_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "temp_cvs"
        )
        os.makedirs(upload_dir, exist_ok=True)
        import uuid
        tmp_path = os.path.join(upload_dir, f"{uuid.uuid4()}.pdf")
        content = await cv_file.read()
        with open(tmp_path, "wb") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())

        logger.info(f"📄 CV saved: {tmp_path}")
        logger.info(f"👤 Processing: {name} → Job: {job_id}")
        
        # Get job from MongoDB
        job = await db.hr_job_posts.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        job["_id"] = str(job["_id"])
        hr_job_post = HRJobPost(**job)

        # Run LangGraph workflow
        from src.hr_automation import process_job_application_submission

        candidate_data = {
            "name": name,
            "email": email,
            "cv_file_path": tmp_path
        }

        result = await process_job_application_submission(
            candidate_data,
            hr_job_post
        )

        score = result.get("evaluation_score", 0)
        logger.info(f"✅ Done - Score: {score}/100")

        return {
            "success": True,
            "candidateName": result.get("candidate_name"),
            "candidateEmail": result.get("candidate_email"),
            "jobTitle": result.get("job_title"),
            "score": score,
            "tag": result.get("tag", ""),
            "summary": result.get("summary", ""),
            "evaluation": result.get("evaluation", {}),
            "skillsMatch": result.get("skills_match", {}),
            "webResearch": result.get("web_research", {}),
            "cvLink": result.get("cv_link", ""),
            "timestamp": result.get("timestamp", ""),
            "errors": result.get("errors", [])
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Submission failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        import threading
        def cleanup():
            import time
            time.sleep(120)
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)
                logger.info(f"🗑️ Temp file cleaned")
        threading.Thread(target=cleanup, daemon=True).start()

@app.get("/api/candidates")
async def get_candidates():
    """Get all evaluated candidates"""
    try:
        candidates = await db.candidates.find().to_list(100)
        for c in candidates:
            c["_id"] = str(c["_id"])
        return {"success": True, "candidates": candidates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    """Get single candidate result"""
    try:
        candidate = await db.candidates.find_one(
            {"_id": ObjectId(candidate_id)}
        )
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        candidate["_id"] = str(candidate["_id"])
        return {"success": True, "candidate": candidate}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/candidates/{candidate_id}")
async def delete_candidate(candidate_id: str):
    """Delete candidate"""
    try:
        result = await db.candidates.delete_one(
            {"_id": ObjectId(candidate_id)}
        )
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return {"success": True, "message": "Candidate deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "path": str(request.url),
            "timestamp": datetime.now().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if Config.DEBUG else "An error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    logger.info("🚀 Starting HireIQ API...")
    logger.info("📖 Docs: http://127.0.0.1:8000/docs")

    uvicorn.run(
        "src.fastapi_api:app",
        host=Config.HOST,
        port=Config.PORT,
        reload=Config.RELOAD,
        log_level="info"
    )