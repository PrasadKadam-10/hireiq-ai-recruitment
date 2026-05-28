<div align="center">

# HireIQ — AI Recruitment Intelligence Agent

### Multi-Agent AI Recruitment System powered by LangGraph, ASI1, Groq, Exa & Qdrant

<br>

<img src="https://img.shields.io/badge/Python-3.11+-blue?logo=python">
<img src="https://img.shields.io/badge/LangGraph-Agentic%20AI-blueviolet">
<img src="https://img.shields.io/badge/LangChain-Orchestration-blue">
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi">
<img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript">
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss">
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb">
<img src="https://img.shields.io/badge/Qdrant-VectorDB-red">
<img src="https://img.shields.io/badge/Groq-LLM-orange">
<img src="https://img.shields.io/badge/ASI1-Fetch.ai-purple">
<img src="https://img.shields.io/badge/Exa-Web%20Search-black">

<br><br>

<b>Enterprise-grade AI recruitment automation with Agentic AI workflows, semantic candidate intelligence, and multi-agent orchestration.</b>

</div>

---

# Agentic AI-Powered Recruitment Intelligence Platform

HireIQ is a modern multi-agent AI hiring system that automates candidate evaluation, semantic resume analysis, recruiter intelligence, and hiring workflows using LangGraph orchestration.

The platform combines:

- Multi-agent AI systems
- LLM reasoning pipelines
- semantic skill matching
- vector retrieval
- recruiter intelligence
- web research
- AI scoring systems
- persistent memory architecture

to create a production-style AI recruitment platform.

---

<br>

# Core Features

## Multi-Agent LangGraph Workflow

HireIQ uses graph-based AI orchestration with specialized agents:

- Resume Parsing Agent
- Candidate Intelligence Agent
- Skills Matching Agent
- AI Evaluation Agent
- Web Research Agent
- Hiring Decision Agent
- Candidate Ranking Agent
- Memory Retrieval Agent
- Report Generation Agent

---

## Resume Intelligence System

- PDF Resume Parsing
- Candidate Data Extraction
- Experience Detection
- Skills Normalization
- Education Parsing
- Recruiter Summaries
- Structured JSON Outputs

---

## AI Candidate Evaluation

The system evaluates:

- technical capability
- role alignment
- skill depth
- experience quality
- semantic relevance
- hiring confidence

using reasoning-based LLM workflows.

---

## Semantic Skills Matching

Using embeddings + vector similarity search:

- strong skill matching
- partial overlap detection
- missing skills analysis
- semantic scoring

instead of simple keyword matching.

---

## Web Intelligence

Real-time candidate enrichment via Exa AI:

- GitHub profile discovery
- LinkedIn discovery
- portfolio lookup
- public technical footprint analysis
- candidate enrichment

---

## HR Dashboard

Modern Next.js frontend dashboard for:

- recruiter workflow management
- job creation
- candidate tracking
- AI score visualization
- hiring insights
- candidate review system

---

<br>

# System Architecture

```text
Resume Upload
      ↓
┌────────────────────────────────────────────┐
│          LangGraph Agent Workflow          │
│                                            │
│  1. Resume Parsing Agent                   │
│  2. Candidate Extraction Agent             │
│  3. Skills Matching Agent                  │
│  4. AI Summary Agent                       │
│  5. Candidate Evaluation Agent             │
│  6. Web Intelligence Agent                 │
│  7. Scoring & Ranking Agent                │
│  8. Vector Memory Storage                  │
│  9. MongoDB Persistence                    │
│ 10. Recruiter Report Generation            │
└────────────────────────────────────────────┘
      ↓
Next.js HR Dashboard

Tech Stack
<table> <tr> <th>Category</th> <th>Technologies</th> </tr> <tr> <td><b>Agent Framework</b></td> <td>LangGraph + LangChain</td> </tr> <tr> <td><b>Backend</b></td> <td>FastAPI + Python</td> </tr> <tr> <td><b>Frontend</b></td> <td>Next.js 16 + TypeScript + TailwindCSS</td> </tr> <tr> <td><b>LLM Providers</b></td> <td>ASI1 + Groq</td> </tr> <tr> <td><b>Web Intelligence</b></td> <td>Exa AI</td> </tr> <tr> <td><b>Vector Database</b></td> <td>Qdrant</td> </tr> <tr> <td><b>Database</b></td> <td>MongoDB</td> </tr> <tr> <td><b>Deployment</b></td> <td>Docker + Docker Compose</td> </tr> <tr> <td><b>Package Manager</b></td> <td>uv</td> </tr> </table>
Why HireIQ Stands Out
<table> <tr> <th>Feature</th> <th>HireIQ</th> <th>Typical Projects</th> </tr> <tr> <td>LangGraph Agent Orchestration</td> <td>✅</td> <td>❌</td> </tr> <tr> <td>Semantic Skills Matching</td> <td>✅</td> <td>❌</td> </tr> <tr> <td>Vector Memory Systems</td> <td>✅</td> <td>Rare</td> </tr> <tr> <td>Multi-LLM Architecture</td> <td>✅</td> <td>Rare</td> </tr> <tr> <td>Web Intelligence Research</td> <td>✅</td> <td>❌</td> </tr> <tr> <td>Production-style AI Workflow</td> <td>✅</td> <td>❌</td> </tr> <tr> <td>AI Evaluation Pipelines</td> <td>✅</td> <td>Rare</td> </tr> </table>
Dashboard Preview
<p align="center"> <img width="1700" alt="HireIQ Dashboard" src="YOUR_SCREENSHOT_URL"> </p> <br>
Agent Workflow Visualization
<p align="center"> <img width="1700" alt="LangGraph Workflow" src="YOUR_WORKFLOW_IMAGE_URL"> </p>
Project Structure
hireiq/
│
├── src/
│   ├── fastapi_api.py
│   ├── hr_automation.py
│   ├── nodes.py
│   ├── llm_provider.py
│   ├── config.py
│   ├── data_models.py
│   ├── skills_match.py
│   ├── exa_client.py
│   └── vector_store.py
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── jobs/
│   │   ├── submit/
│   │   └── candidates/
│   │
│   └── lib/
│       ├── api.ts
│       └── types.ts
│
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml
├── uv.lock
└── README.md
Quick Start
Clone Repository
git clone https://github.com/YOUR_USERNAME/hireiq-ai-recruitment.git

cd hireiq-ai-recruitment
Backend Setup
uv sync

uv run uvicorn src.fastapi_api:app --reload --port 8000
Backend URL
http://localhost:8000
Swagger API Docs
http://localhost:8000/docs
Frontend Setup
cd frontend

npm install

npm run dev
Frontend URL
http://localhost:3000
Docker Deployment
docker-compose up -d
API Features
Job Creation API
recruiter job creation
dynamic HTML job descriptions
MongoDB persistence
HR workflow support
Candidate Submission API

Supports:

multipart PDF uploads
automated AI evaluation
semantic scoring
recruiter intelligence generation
structured candidate analysis
Future Enterprise Features

Planned upgrades:

Redis memory systems
Human-in-the-loop workflows
LangSmith observability
WebSocket live updates
voice interview analysis
recruiter memory systems
ATS integrations
background task queues
RAG-based candidate memory
Deployment Targets

Deployable on:

Railway
Render
VPS
AWS
Azure
DigitalOcean
Google Cloud
Learning Focus

This project demonstrates:

Agentic AI Engineering
LangGraph Orchestration
Multi-Agent Systems
Semantic Retrieval
Vector Databases
AI Workflow Engineering
Production AI Architecture
FastAPI Backend Systems
Recruiter Intelligence Systems
License

MIT License