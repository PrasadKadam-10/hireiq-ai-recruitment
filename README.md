<div align="center">

# HireIQ — AI Recruitment Intelligence Agent

### Multi-Agent AI Recruitment System powered by LangGraph, ASI1, Groq, Exa & MongoDB

<br>

<img src="https://img.shields.io/badge/Python-3.11+-blue?logo=python">
<img src="https://img.shields.io/badge/LangGraph-Agentic%20AI-blueviolet">
<img src="https://img.shields.io/badge/LangChain-Orchestration-blue">
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi">
<img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript">
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss">
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb">
<img src="https://img.shields.io/badge/Qdrant-VectorDB-red">
<img src="https://img.shields.io/badge/ASI1-Fetch.ai-purple">
<img src="https://img.shields.io/badge/Exa-Web%20Search-black">
<img src="https://img.shields.io/badge/GSSoC-2026-orange">

<br><br>

**Production-grade AI recruitment automation with a 9-node LangGraph pipeline, semantic candidate intelligence, and real-time web research.**

> Built for [GSSoC 2026](https://gssoc.girlscript.tech/) — Fetch.ai Innovation Lab contribution

</div>

---

## What HireIQ Actually Does

HireIQ automates resume screening using a **9-node LangGraph pipeline** that processes a PDF resume end-to-end and outputs a structured candidate evaluation report with a score from 1–100.

The system **only evaluates what is explicitly present** in the uploaded resume — it does not infer or hallucinate candidate qualifications. Each evaluation node uses Chain-of-Thought (CoT) prompting with strict grounding instructions.

PDF Upload → Text Extraction → CV Parsing → JD Skill Extraction
→ AI Summary → Candidate Evaluation → Skills Matching
→ Web Research → Score Decision → MongoDB Storage


**Real outputs include:**
- AI match score (1–100) based on CV vs JD comparison
- Strengths and gaps grounded in resume text only
- Skills snapshot: Strong Match / Partial Match / Missing
- Web intelligence: GitHub and LinkedIn discovery via Exa
- 200-word professional candidate summary

---

## System Architecture

User (Next.js Frontend)
↓
FastAPI Backend (Python)
↓
LangGraph 9-Node Pipeline
├── Node 1: CV Upload Handler
├── Node 2: PDF Text Extraction (pdfplumber)
├── Node 3: JD Skills Extraction (ASI1)
├── Node 4: Candidate Summary (ASI1)
├── Node 5: AI Evaluation & Scoring (ASI1)
├── Node 6: Semantic Skills Matching
├── Node 7: Web Intelligence (Exa API)
├── Node 8: Score Decision & Routing
└── Node 9: MongoDB Persistence
↓
Results → Next.js HR Dashboard


---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Agent Framework** | LangGraph + LangChain | 9-node pipeline orchestration |
| **LLM Provider** | ASI1 (Fetch.ai) | All reasoning, evaluation, summary |
| **Backend** | FastAPI + Python | REST API + file handling |
| **Frontend** | Next.js 16 + TypeScript + TailwindCSS | HR Dashboard |
| **Web Intelligence** | Exa AI | GitHub + LinkedIn candidate research |
| **Vector Database** | Qdrant Cloud | Candidate embedding storage |
| **Database** | MongoDB | Candidate + job persistence |
| **PDF Processing** | pdfplumber | Resume text extraction |
| **Deployment** | Docker + Docker Compose | Containerized deployment |
| **Package Manager** | uv | Fast Python dependency management |

---

## Anti-Hallucination Design

HireIQ uses **Chain-of-Thought (CoT) prompting** with strict grounding rules across all evaluation nodes:

GROUNDING: Use ONLY information explicitly stated in the CV
HONESTY: Mark skills as "Missing" if not mentioned
NO GUESSING: Never infer experience not stated
REASONING: Step-by-step analysis before scoring


This means:
- A candidate missing FastAPI will always be marked as "Missing FastAPI" — not "likely knows FastAPI"
- Scores reflect actual CV content, not assumptions
- Reasoning is limited to 5 sentences, grounded in evidence

---

## Core Features

### 9-Node LangGraph Pipeline
Each node is a specialized agent with retry policies, error handling, and structured JSON outputs.

### PDF Resume Processing
Uses `pdfplumber` for reliable text extraction from standard Word-to-PDF resumes. Text is passed directly to LLM nodes — no OCR or image processing.

### AI Candidate Evaluation
ASI1 (Fetch.ai) evaluates candidates against the job description using CoT reasoning. Output includes score, reasoning, strengths, gaps, and a one-line hiring decision.

### Semantic Skills Matching
Candidate skills are matched against extracted JD requirements using exact + partial matching logic:
- **Strong Match** — exact skill found in CV
- **Partial Match** — related skill found
- **Missing** — skill explicitly required but absent

### Web Intelligence via Exa
Real-time search for candidate's GitHub profiles, LinkedIn presence, and portfolio — enriching the evaluation beyond the resume.

### HR Dashboard
Next.js frontend with:
- Overview with live stats (jobs, candidates, avg score, strong fits)
- Candidate list with score gauges and filter tabs
- Detailed candidate report with skills snapshot
- Job creation and CV submission flow

---

## Why HireIQ Stands Out

| Feature | HireIQ | Typical Projects |
|---|---|---|
| LangGraph 9-Node Pipeline | ✅ Implemented | ❌ |
| Anti-Hallucination CoT Prompting | ✅ Implemented | ❌ |
| Real PDF Text Extraction | ✅ pdfplumber | ❌ |
| ASI1 (Fetch.ai) Integration | ✅ GSSoC exclusive | ❌ |
| Web Intelligence (Exa) | ✅ GitHub + LinkedIn | ❌ |
| Semantic Skills Matching | ✅ Strong/Partial/Missing | Rare |
| MongoDB Persistence | ✅ Full candidate history | Some |
| Docker Ready | ✅ docker-compose | Some |
| 100% Free Stack | ✅ No paid APIs required | Rare |

---

## Project Structure

hireiq/
│
├── src/
│ ├── fastapi_api.py # FastAPI backend + all endpoints
│ ├── hr_automation.py # LangGraph workflow definition
│ ├── nodes.py # 9 LangGraph node implementations
│ ├── llm_provider.py # ASI1 LLM factory functions
│ ├── config.py # Environment configuration
│ ├── data_models.py # Pydantic models + AgentState
│ ├── data_extraction.py # PDF text extraction (pdfplumber)
│ ├── skills_match.py # Skills matching logic
│ └── exa_client.py # Exa web search integration
│
├── frontend/
│ ├── app/
│ │ ├── page.tsx # Overview dashboard
│ │ ├── jobs/ # Job management
│ │ ├── submit/ # CV submission + results
│ │ └── candidates/ # Candidate list + detail
│ └── lib/
│ ├── api.ts # FastAPI client
│ └── types.ts # TypeScript interfaces
│
├── temp_cvs/ # Uploaded PDF storage
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml
├── uv.lock
├── CLAUDE.md # AI coding assistant instructions
├── MEMORY.md # Project memory and decisions
└── README.md


---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running locally
- Free API keys (all zero cost)

### Get Free API Keys

| Service | Link | Cost |
|---|---|---|
| ASI1 (Fetch.ai) | [asi1.ai](https://asi1.ai) | ✅ Free (GSSoC 2026) |
| Exa | [exa.ai](https://exa.ai) | ✅ Free tier |
| Qdrant | [cloud.qdrant.io](https://cloud.qdrant.io) | ✅ Free tier |
| Groq | [console.groq.com](https://console.groq.com) | ✅ Free tier |

### 1. Clone

```bash
git clone https://github.com/PrasadKadam-10/hireiq-ai-recruitment.git
cd hireiq-ai-recruitment
```

### 2. Configure

```bash
cp env.example .env
# Add your API keys to .env
```

Required `.env` values:

ASI1_API_KEY=your_asi1_key
OPENAI_API_KEY=your_asi1_key # same key, OpenAI-compatible
OPENAI_BASE_URL=https://api.asi1.ai/v1
OPENAI_MODEL_NAME=asi1-mini
EXA_API_KEY=your_exa_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_key
MONGODB_URL=mongodb://localhost:27017


### 3. Backend

```bash
pip install uv
uv sync
uv run uvicorn src.fastapi_api:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard: `http://localhost:3000`

### 5. Docker

```bash
docker-compose up -d
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Create job posting |
| `GET` | `/api/jobs` | List all jobs |
| `GET` | `/api/jobs/{id}` | Get single job |
| `POST` | `/api/candidate-application-submit` | Submit CV + trigger pipeline |
| `GET` | `/api/candidates` | List all evaluated candidates |
| `GET` | `/api/candidates/{id}` | Get candidate report |
| `DELETE` | `/api/candidates/{id}` | Delete candidate |

---

## Known Limitations

- PDF must be text-based (Word-to-PDF). Scanned/image PDFs are not supported.
- Web intelligence depends on Exa API availability and free tier limits.
- Qdrant free tier clusters may be suspended after inactivity — recreate cluster if needed.
- ASI1 responses can be slow (5–15 seconds per evaluation).
- Score reflects CV content only — not verified work experience.

---

## GSSoC 2026 Contribution

This project is built as a contribution to the **Fetch.ai Innovation Lab** under GSSoC 2026.

It demonstrates practical usage of:
- **ASI1 (Fetch.ai)** as the primary LLM for all agent nodes
- **Agentic AI** patterns with LangGraph
- **Production-style** AI engineering practices

---

## Learning Focus

This project demonstrates:
- LangGraph node-based agent orchestration
- Multi-agent AI pipeline design
- Anti-hallucination prompting techniques
- FastAPI async backend patterns
- PDF processing and text extraction
- Semantic skill matching algorithms
- Real-time web intelligence integration
- MongoDB async operations
- Next.js + TypeScript frontend
- Docker containerization

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ using ASI1 (Fetch.ai) + LangGraph + FastAPI + Next.js
<br>
<b>GSSoC 2026 — Fetch.ai Innovation Lab</b>
</div>
