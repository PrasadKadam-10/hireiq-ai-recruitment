'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ── Logo mark ── */
function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <div className="hiq-brand-mark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.4" /><circle cx="5" cy="19" r="2.4" /><circle cx="19" cy="19" r="2.4" />
        <path d="M12 7.4V13M9.6 17.4 12 13l2.4 4.4" />
      </svg>
    </div>
  );
}

/* ── Reusable shape illustration ── */
function ShapeFrame({ className = '' }: { className?: string }) {
  return (
    <div className={`hiq-shape-frame ${className}`} aria-hidden="true">
      <div className="hiq-shape hiq-shape-square" />
      <div className="hiq-shape hiq-shape-diamond" />
      <div className="hiq-shape hiq-shape-circle" />
    </div>
  );
}

/* ── Nav ── */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Overview', href: '/', active: true },
    { label: 'Resume Analyzer', href: '/submit' },
    { label: 'Candidates', href: '/candidates' },
    { label: 'Jobs', href: '/jobs' },
  ];

  return (
    <nav className="hiq-navbar">
      <div className="hiq-brand">
        <LogoMark size={34} />
        <span className="hiq-brand-name">HireIQ</span>
      </div>

      <div className={`hiq-nav-links ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`hiq-nav-link ${l.active ? 'active' : ''}`} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/dashboard" className="hiq-btn-ghost hiq-nav-only-mobile" onClick={() => setOpen(false)}>Log In</Link>
        <Link href="/submit" className="hiq-btn-primary hiq-nav-only-mobile" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
          Analyze Resume
        </Link>
      </div>

      <div className="hiq-nav-right">
        <Link href="/dashboard" className="hiq-btn-ghost">Log In</Link>
        <Link href="/submit" className="hiq-btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
          Analyze Resume
        </Link>
      </div>

      <button className="hiq-nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
      </button>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="hiq-hero-section">
      <div className="hiq-hero-card">
        <div>
          <span className="hiq-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
            LangGraph orchestration · multi-agent reasoning
          </span>
          <h1>Hire with reasoning your team can actually <em>see</em>.</h1>
          <p>HireIQ replaces keyword filters with a graph of specialized AI agents — parsing resumes, matching skills by meaning, researching public footprints, and scoring candidates with a reasoning trail behind every decision.</p>
          <div className="hiq-hero-ctas">
            <Link href="/submit" className="hiq-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              Analyze a Resume
            </Link>
            <a href="#capabilities" className="hiq-btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
              See how it works
            </a>
          </div>
        </div>
        <ShapeFrame className="hiq-hero-shapes" />
      </div>
    </section>
  );
}

/* ── Feature / text + shape ── */
function FeatureSection() {
  const agents = [
    'Resume Parsing', 'Candidate Intelligence', 'Skills Matching', 'AI Evaluation',
    'Web Research', 'Hiring Decision', 'Candidate Ranking', 'Memory Retrieval', 'Report Generation',
  ];
  return (
    <section className="hiq-feature-section">
      <div className="hiq-feature-card">
        <div className="hiq-feature-text">
          <h2>Every hiring decision, backed by an agent that can explain itself.</h2>
          <p>Instead of one model guessing at fit, HireIQ runs a coordinated pipeline: a Resume Parsing Agent structures the document, a Skills Matching Agent compares it against the role by meaning rather than keywords, a Web Research Agent enriches it with public technical footprint, and an Evaluation Agent reasons through technical capability, role alignment, and hiring confidence.</p>
          <p>The result reaches your dashboard as a ranked, explainable shortlist — not a black-box number.</p>
          <div className="hiq-agent-flow">
            {agents.map((a, i) => (
              <span key={a} className="hiq-agent-chip"><span className="n">{String(i + 1).padStart(2, '0')}</span> {a}</span>
            ))}
          </div>
        </div>
        <ShapeFrame className="hiq-feature-shapes" />
      </div>
    </section>
  );
}

/* ── Capabilities ── */
function Capabilities() {
  const items = [
    { title: 'Resume Intelligence', desc: 'Parses PDFs into structured JSON — experience, skills, education, and recruiter-ready summaries.', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15l2 2 4-4" /> },
    { title: 'Semantic Skills Matching', desc: 'Embeddings and vector similarity find strong matches, partial overlap, and missing skills — not just keywords.', icon: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></> },
    { title: 'AI Candidate Evaluation', desc: 'Reasoning-based LLM workflows score technical capability, role alignment, and hiring confidence.', icon: <path d="M18 20V10M12 20V4M6 20v-6" /> },
    { title: 'Web Intelligence', desc: 'Real-time enrichment via Exa AI — GitHub, LinkedIn, and portfolio discovery for a public technical footprint.', icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" /></> },
    { title: 'HR Dashboard', desc: 'A Next.js frontend for recruiter workflows, job creation, candidate tracking, and hiring insights.', icon: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></> },
    { title: 'LangGraph Orchestration', desc: 'Specialized agents coordinate through a graph-based workflow, from parsing to final report generation.', icon: <><path d="M12 2 21 7 21 17 12 22 3 17 3 7Z" /><path d="M12 8v8M8 10l8 4M16 10l-8 4" /></> },
  ];

  return (
    <section className="hiq-cap-section" id="capabilities">
      <div className="hiq-section-head">
        <div className="kicker">Capabilities</div>
        <h2>What&rsquo;s running behind this dashboard</h2>
        <p>A production-style AI recruitment platform combining LLM reasoning, vector retrieval, live web research, and persistent memory.</p>
      </div>
      <div className="hiq-capability-grid">
        {items.map(({ title, desc, icon }) => (
          <div key={title} className="hiq-cap-card">
            <div className="hiq-cap-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <div className="hiq-cap-title">{title}</div>
            <div className="hiq-cap-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Tech stack ── */
function Stack() {
  const items = [
    { title: 'LangGraph', desc: 'Graph-based orchestration coordinating every specialized agent in the pipeline.', icon: <><path d="M12 2 21 7 21 17 12 22 3 17 3 7Z" /><path d="M12 8v8M8 10l8 4M16 10l-8 4" /></> },
    { title: 'LLM Reasoning', desc: 'Chain-of-thought evaluation for technical capability and role alignment.', icon: <path d="M9.5 2a2.5 2.5 0 0 0-2.45 3H5a2 2 0 0 0-2 2v1.55A2.5 2.5 0 0 0 2 10.5 2.5 2.5 0 0 0 3 12.95V15a2 2 0 0 0 2 2h1.55A2.5 2.5 0 0 0 9.5 22a2.5 2.5 0 0 0 2.45-3H14a2 2 0 0 0 2-2v-1.55a2.5 2.5 0 0 0 0-4.9V7a2 2 0 0 0-2-2h-2.05A2.5 2.5 0 0 0 9.5 2Z" /> },
    { title: 'Vector Retrieval', desc: 'Embedding search powers semantic skill matching beyond simple keywords.', icon: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></> },
    { title: 'Exa AI', desc: 'Live web research for GitHub, LinkedIn, and portfolio enrichment.', icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" /></> },
  ];

  return (
    <section className="hiq-stack-section">
      <div className="kicker">The stack behind HireIQ</div>
      <h2>Built on a reasoning-first AI stack</h2>
      <div className="hiq-stack-grid">
        {items.map(({ title, desc, icon }) => (
          <div key={title}>
            <div className="hiq-stack-card-tile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <div className="hiq-stack-title">{title}</div>
            <div className="hiq-stack-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section className="hiq-cta-section">
      <div className="hiq-cta-card">
        <h2>See a candidate reasoned through, end to end.</h2>
        <p>Upload a resume and watch the agent pipeline turn it into a ranked, explainable decision.</p>
        <div className="hiq-cta-row">
          <Link href="/submit" className="hiq-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            Analyze a Resume
          </Link>
          <Link href="/candidates" className="hiq-btn-outline">View Candidates</Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return <footer className="hiq-footer">© 2026 HireIQ — Multi-agent AI hiring, built on LangGraph.</footer>;
}

/* ── Page ── */
export default function LandingPage() {
  return (
    <div>
      <Nav />
      <div className="hiq-wrap">
        <Hero />
        <FeatureSection />
        <Capabilities />
        <Stack />
        <CTA />
      </div>
      <Footer />

      <style>{`
        .hiq-wrap{max-width:1280px;margin:0 auto;padding:0 40px;}

        .hiq-brand-mark{border-radius:10px;background:linear-gradient(150deg,var(--violet-400,#9c82df),var(--violet-700,#5030b3));display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(100,64,221,0.30);flex-shrink:0;}
        .hiq-brand-mark svg{width:18px;height:18px;color:#fff;}

        .hiq-navbar{display:flex;align-items:center;gap:10px;padding:16px 40px;border-bottom:1px solid var(--border-subtle,#e7e0f5);position:sticky;top:0;z-index:40;background:rgba(255,255,255,0.86);backdrop-filter:blur(14px);}
        .hiq-brand{display:flex;align-items:center;gap:10px;margin-right:18px;}
        .hiq-brand-name{font-weight:800;font-size:16px;letter-spacing:-0.02em;font-family:var(--font-display,'Sora',sans-serif);}

        .hiq-nav-links{display:flex;align-items:center;gap:4px;}
        .hiq-nav-link{padding:9px 16px;border-radius:999px;font-size:13.5px;font-weight:600;color:var(--text-secondary,#5b5568);text-decoration:none;transition:background .15s,color .15s;}
        .hiq-nav-link:hover{background:var(--violet-50,#f6f4fc);color:var(--text-primary,#1f1b2e);}
        .hiq-nav-link.active{background:var(--violet-100,#ede8fa);color:var(--violet-700,#5030b3);}

        .hiq-nav-only-mobile{display:none;}
        .hiq-nav-toggle{display:none;margin-left:auto;width:38px;height:38px;border-radius:10px;border:1px solid var(--border-subtle,#e7e0f5);background:#fff;align-items:center;justify-content:center;color:var(--text-primary,#1f1b2e);}
        .hiq-nav-toggle svg{width:19px;height:19px;}

        .hiq-nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
        .hiq-btn-primary{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(150deg,var(--violet-500,#7c5cf0),var(--violet-700,#5030b3));color:#fff;font-weight:700;font-size:13.5px;padding:10px 20px;border-radius:999px;border:none;text-decoration:none;box-shadow:0 8px 20px rgba(100,64,221,0.30);transition:transform .15s,box-shadow .15s;}
        .hiq-btn-primary:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(100,64,221,0.4);}
        .hiq-btn-primary svg{width:14px;height:14px;}
        .hiq-btn-ghost{font-size:13.5px;font-weight:700;color:var(--text-secondary,#5b5568);padding:10px 14px;border-radius:999px;text-decoration:none;transition:background .15s;}
        .hiq-btn-ghost:hover{background:var(--violet-50,#f6f4fc);color:var(--text-primary,#1f1b2e);}

        .hiq-shape-frame{position:relative;border-radius:32px;background:var(--violet-50,#f6f4fc);aspect-ratio:1/0.82;overflow:hidden;width:100%;}
        .hiq-shape{position:absolute;}
        .hiq-shape-square{border-radius:26%;}
        .hiq-shape-diamond{border-radius:22%;transform:rotate(45deg);}
        .hiq-shape-circle{border-radius:50%;}

        .hiq-hero-section{padding:56px 0 24px;}
        .hiq-hero-card{background:linear-gradient(180deg,var(--violet-50,#f6f4fc) 0%,#faf9fd 100%);border-radius:32px;padding:56px 56px 52px;display:grid;grid-template-columns:1.15fr 0.85fr;gap:48px;align-items:center;}
        .hiq-eyebrow{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:700;letter-spacing:0.02em;color:var(--violet-700,#5030b3);background:#fff;border:1px solid var(--border-subtle,#e7e0f5);padding:7px 14px;border-radius:999px;margin-bottom:22px;}
        .hiq-eyebrow svg{width:12px;height:12px;}
        .hiq-hero-card h1{font-size:44px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin:0 0 18px;font-family:var(--font-display,'Sora',sans-serif);}
        .hiq-hero-card h1 em{font-style:normal;color:var(--violet-600,#6440dd);}
        .hiq-hero-card p{font-size:16px;color:var(--text-secondary,#5b5568);max-width:480px;margin:0 0 30px;line-height:1.65;}
        .hiq-hero-ctas{display:flex;gap:12px;flex-wrap:wrap;}
        .hiq-btn-outline{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--text-primary,#1f1b2e);font-weight:700;font-size:13.5px;padding:11px 20px;border-radius:999px;border:1.5px solid var(--border-default,#d6cbef);text-decoration:none;transition:all .15s;}
        .hiq-btn-outline:hover{border-color:var(--violet-500,#7c5cf0);color:var(--violet-700,#5030b3);background:var(--violet-50,#f6f4fc);}
        .hiq-btn-outline svg{width:11px;height:11px;}

        .hiq-hero-shapes .hiq-shape-square{width:34%;height:34%;top:6%;left:16%;background:linear-gradient(150deg,var(--plum-500,#a95bc4),#7a3a63);}
        .hiq-hero-shapes .hiq-shape-diamond{width:32%;height:32%;top:32%;left:44%;background:var(--violet-200,#dad0f4);opacity:0.85;}
        .hiq-hero-shapes .hiq-shape-circle{width:30%;height:30%;bottom:8%;right:10%;background:linear-gradient(150deg,var(--violet-600,#6440dd),var(--violet-800,#3c258a));}

        .hiq-feature-section{padding:36px 0;}
        .hiq-feature-card{background:var(--surface-tint,#f6f4fc);border-radius:32px;padding:52px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;}
        .hiq-feature-text h2{font-size:28px;font-weight:700;letter-spacing:-0.02em;line-height:1.25;margin:0 0 18px;max-width:440px;font-family:var(--font-display,'Sora',sans-serif);}
        .hiq-feature-text p{font-size:14.5px;color:var(--text-secondary,#5b5568);line-height:1.75;margin:0 0 14px;max-width:480px;}
        .hiq-agent-flow{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px;}
        .hiq-agent-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--violet-700,#5030b3);background:#fff;border:1px solid var(--border-subtle,#e7e0f5);padding:6px 12px;border-radius:999px;}
        .hiq-agent-chip .n{font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:10px;color:var(--violet-400,#9c82df);}
        .hiq-feature-shapes .hiq-shape-square{width:36%;height:36%;top:8%;left:10%;background:linear-gradient(150deg,var(--plum-500,#a95bc4),#7a3a63);}
        .hiq-feature-shapes .hiq-shape-diamond{width:34%;height:34%;top:34%;left:38%;background:var(--violet-200,#dad0f4);}
        .hiq-feature-shapes .hiq-shape-circle{width:32%;height:32%;bottom:6%;right:8%;background:linear-gradient(150deg,var(--violet-600,#6440dd),var(--violet-800,#3c258a));}
        .hiq-feature-shapes{background:#fff;}

        .hiq-cap-section{padding:60px 0 20px;}
        .hiq-section-head{max-width:560px;margin-bottom:34px;}
        .hiq-section-head .kicker{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--violet-600,#6440dd);margin-bottom:8px;}
        .hiq-section-head h2{font-size:28px;font-weight:700;letter-spacing:-0.02em;margin:0 0 10px;font-family:var(--font-display,'Sora',sans-serif);}
        .hiq-section-head p{margin:0;color:var(--text-secondary,#5b5568);font-size:14.5px;}
        .hiq-capability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .hiq-cap-card{background:#fff;border:1px solid var(--border-subtle,#e7e0f5);border-radius:16px;padding:22px 22px 20px;transition:box-shadow .2s,transform .2s;}
        .hiq-cap-card:hover{box-shadow:0 10px 28px rgba(36,21,83,0.10);transform:translateY(-2px);}
        .hiq-cap-icon{width:34px;height:34px;border-radius:10px;background:var(--violet-50,#f6f4fc);border:1px solid var(--border-subtle,#e7e0f5);display:flex;align-items:center;justify-content:center;margin-bottom:14px;color:var(--violet-600,#6440dd);}
        .hiq-cap-icon svg{width:16px;height:16px;}
        .hiq-cap-title{font-weight:700;font-size:14.5px;margin-bottom:6px;}
        .hiq-cap-desc{font-size:13px;color:var(--text-tertiary,#7a7389);line-height:1.6;}

        .hiq-stack-section{padding:64px 0 20px;text-align:center;}
        .hiq-stack-section .kicker{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--violet-600,#6440dd);margin-bottom:8px;}
        .hiq-stack-section h2{font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 36px;font-family:var(--font-display,'Sora',sans-serif);}
        .hiq-stack-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;text-align:left;}
        .hiq-stack-card-tile{background:linear-gradient(160deg,var(--ink-900,#1e1930),var(--ink-950,#171325));border-radius:22px;aspect-ratio:1/0.82;display:flex;align-items:center;justify-content:center;margin-bottom:16px;position:relative;overflow:hidden;}
        .hiq-stack-card-tile svg{width:34px;height:34px;color:#e6e1f7;position:relative;z-index:1;}
        .hiq-stack-title{font-weight:700;font-size:14.5px;margin-bottom:5px;}
        .hiq-stack-desc{font-size:12.5px;color:var(--text-tertiary,#7a7389);line-height:1.55;}

        .hiq-cta-section{padding:60px 0 80px;}
        .hiq-cta-card{background:linear-gradient(150deg,var(--violet-700,#5030b3),var(--violet-900,#241553));border-radius:32px;padding:52px 40px;text-align:center;color:#fff;position:relative;overflow:hidden;}
        .hiq-cta-card h2{font-size:26px;font-weight:700;margin:0 0 10px;position:relative;z-index:1;font-family:var(--font-display,'Sora',sans-serif);}
        .hiq-cta-card p{font-size:14.5px;color:rgba(255,255,255,0.78);margin:0 0 26px;position:relative;z-index:1;}
        .hiq-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}
        .hiq-cta-card .hiq-btn-primary{background:#fff;color:var(--violet-700,#5030b3);box-shadow:none;}
        .hiq-cta-card .hiq-btn-primary:hover{background:#f3f0fc;}
        .hiq-cta-card .hiq-btn-outline{background:transparent;border-color:rgba(255,255,255,0.4);color:#fff;}
        .hiq-cta-card .hiq-btn-outline:hover{background:rgba(255,255,255,0.1);border-color:#fff;}

        .hiq-footer{padding:28px 40px;text-align:center;color:var(--text-muted,#a49cb4);font-size:12.5px;border-top:1px solid var(--border-subtle,#e7e0f5);}

        @media (prefers-reduced-motion: reduce){*{transition-duration:0.01ms !important;}}

        @media (max-width:980px){
          .hiq-hero-card,.hiq-feature-card{grid-template-columns:1fr;padding:36px 28px;}
          .hiq-hero-shapes,.hiq-feature-shapes{order:-1;max-width:320px;margin:0 auto;aspect-ratio:1/0.75;}
          .hiq-capability-grid{grid-template-columns:1fr 1fr;}
          .hiq-stack-grid{grid-template-columns:1fr 1fr;}
          .hiq-hero-card h1{font-size:36px;}
        }
        @media (max-width:820px){
          .hiq-nav-links{position:fixed;top:0;right:0;height:100vh;width:min(78vw,320px);background:#fff;border-left:1px solid var(--border-subtle,#e7e0f5);box-shadow:0 20px 46px rgba(36,21,83,0.16);display:flex;flex-direction:column;align-items:stretch;gap:4px;padding:84px 20px 24px;transform:translateX(100%);transition:transform .28s cubic-bezier(0.22,1,0.36,1);z-index:39;}
          .hiq-nav-links.open{transform:translateX(0);}
          .hiq-nav-link{padding:12px 14px;border-radius:12px;}
          .hiq-nav-link.active{background:var(--violet-100,#ede8fa);}
          .hiq-nav-only-mobile{display:flex;justify-content:center;margin-top:10px;}
          .hiq-nav-right{display:none;}
          .hiq-nav-toggle{display:flex;}
        }
        @media (max-width:640px){
          .hiq-navbar{padding:14px 18px;}
          .hiq-wrap{padding:0 18px;}
          .hiq-hero-section{padding:32px 0 14px;}
          .hiq-hero-card{padding:28px 20px;border-radius:22px;}
          .hiq-hero-card h1{font-size:28px;line-height:1.18;}
          .hiq-hero-card p{font-size:14.5px;}
          .hiq-hero-ctas{flex-direction:column;align-items:stretch;}
          .hiq-hero-ctas .hiq-btn-primary,.hiq-hero-ctas .hiq-btn-outline{justify-content:center;}
          .hiq-hero-shapes{max-width:220px;}
          .hiq-feature-card{padding:28px 20px;border-radius:22px;}
          .hiq-feature-text h2{font-size:22px;}
          .hiq-feature-shapes{max-width:200px;}
          .hiq-section-head h2{font-size:22px;}
          .hiq-capability-grid{grid-template-columns:1fr;}
          .hiq-stack-section h2{font-size:22px;}
          .hiq-stack-grid{grid-template-columns:1fr 1fr;gap:12px;}
          .hiq-stack-card-tile{aspect-ratio:1/0.9;}
          .hiq-stack-title{font-size:13px;}
          .hiq-stack-desc{font-size:11.5px;}
          .hiq-cta-card{padding:36px 22px;border-radius:22px;}
          .hiq-cta-card h2{font-size:21px;}
          .hiq-cta-row{flex-direction:column;align-items:stretch;}
        }
        @media (max-width:400px){
          .hiq-stack-grid{grid-template-columns:1fr;}
          .hiq-brand-name{font-size:14.5px;}
        }
      `}</style>
    </div>
  );
}