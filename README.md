# SkillBridge: AI-Powered Career Intelligence & Academia–Industry Collaboration Platform

> **Bridging the Great Divide Between Academic Curricula, Student Competencies, and Modern Industry Demands.**

SkillBridge is an enterprise-grade, multi-stakeholder Career Intelligence and Academia–Industry Collaboration Platform designed to transform campus placements, skill verification, curriculum alignment, and joint university–industry research into a unified, transparent, and data-driven ecosystem.

---

## 📌 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Platform Architecture & Multi-Stakeholder Ecosystem](#-platform-architecture--multi-stakeholder-ecosystem)
3. [Key Personas & User Journeys](#-key-personas--user-journeys)
4. [Explainable Matching Engine (Mathematical Formulation)](#-explainable-matching-engine-mathematical-formulation)
5. [Living Career Passport & Cryptographic/Verifiable Credentialing](#-living-career-passport--cryptographicverifiable-credentialing)
6. [Interactive Capability Assessments](#-interactive-capability-assessments)
7. [Curriculum Gap & Macro Institutional Analytics](#-curriculum-gap--macro-institutional-analytics)
8. [Generative AI Capabilities & Endpoints](#-generative-ai-capabilities--endpoints)
9. [Technology Stack](#-technology-stack)
10. [API Reference & Data Contracts](#-api-reference--data-contracts)
11. [Setup, Installation & Running the Platform](#-setup-installation--running-the-platform)
12. [Demo Scenarios & Walkthrough](#-demo-scenarios--walkthrough)

---

## 🎯 Executive Summary & Problem Statement

### The Tripartite Problem in Higher Technical Education:
1. **Students Face Unexplainable Rejections & Opaque Hiring**: Traditional campus placement portals rely on keyword matching without context. Students receive binary rejections without actionable feedback on why they were passed over or which specific capabilities were lacking.
2. **Industry Recruiters Sift Through Unverified Resumes**: Recruiters receive thousands of self-reported resumes containing inflated buzzwords, forcing costly multiple-round screening to evaluate foundational technical competencies.
3. **Academic Institutions Suffer From Curricular Lag**: Universities update syllabi every 3 to 5 years, lagging behind high-growth technical domains (Cloud-Native computing, Generative AI, Distributed Systems). Placement cells lack real-time visibility into recruiter skill demand versus student supply.
4. **Faculty Isolation**: Academicians remain disconnected from modern industrial R&D, lacking structured pathways for corporate sabbaticals, consultancy retainers, and industry-sponsored lab collaborations.

### The SkillBridge Solution:
SkillBridge provides an end-to-end platform where:
- Every student's skill is evaluated through **verified evidence** (standardized assessments, GitHub repositories, peer-reviewed projects, and certified lab work).
- Campus opportunities are paired with students through a **100% transparent, explainable matching engine** with radar breakdowns and gap diagnostics.
- Academic institutions gain **macro real-time demand vs. supply analytics** to overhaul curricula and conduct placement audits.
- Faculty engage in **corporate fellowships, sponsored research grants, and student co-mentorship**.

---

## 🏛️ Platform Architecture & Multi-Stakeholder Ecosystem

```
                                  ┌───────────────────────────────┐
                                  │      SkillBridge Core UI      │
                                  │  (React 18 + Tailwind CSS)    │
                                  └──────────────┬────────────────┘
                                                 │
            ┌───────────────────┬────────────────┴───────────────────┬───────────────────┐
            │                   │                                    │                   │
     ▼             ▼                                    ▼             ▼
┌───────────────┐  ┌──────────────────┐               ┌──────────────────┐  ┌─────────────────┐
│ Student Hub   │  │ Industry Hub     │               │ Faculty Hub      │  │ Institution Hub │
│ • Passport    │  │ • Job Posting    │               │ • FDP Immersion  │  │ • Macro KPIs    │
│ • Assessments │  │ • ATS Pipeline   │               │ • Consultancy    │  │ • Skill Audits  │
│ • AI Roadmap  │  │ • Candidate Pool │               │ • Student Labs   │  │ • Gap Analytics │
└───────┬───────┘  └────────┬─────────┘               └────────┬─────────┘  └────────┬────────┘
        │                   │                                  │                     │
        └───────────────────┼──────────────────────────────────┼─────────────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Explainable Match Engine  │
              │ • 6-Factor Compatibility  │
              │ • Hard Academic Filtering │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │   Express.js API Layer    │
              │  (Port 3000 + ESM Bundle) │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Gemini 3.8 Flash AI Core  │
              │ • Resume Extraction       │
              │ • 30/60/90-Day Roadmaps   │
              │ • Interview Synthesis     │
              └───────────────────────────┘
```

---

## 👥 Key Personas & User Journeys

### 1. Student Persona (*Arjun Sharma — Final Year CSE, Apex Institute of Technology*)
- **Career Intelligence Dashboard**: Track profile completeness, verified skill badges, target roles, and pending applications.
- **Living Career Passport**: Public/private verifiable portfolio displaying confirmed competencies, verified certification seals, academic metrics, and shareable QR code for recruiter access.
- **AI-Powered Resume Parser**: Upload or paste resume text to automatically parse technical skills, degree information, and project summaries into standardized canonical capabilities.
- **Explainable Job Matching**: Real-time compatibility scores for internships and full-time jobs with detailed skill breakdowns (Matched vs Missing skills, proficiency delta, and eligibility compliance).
- **Interactive Capability Assessment**: Take timed technical assessments (e.g., *Backend Engineering & API Design*, *Cloud Native & DevOps*) with instant scoring, skill level updates, and automated digital certificate generation upon passing ($\ge 70\%$).
- **AI 30/60/90-Day Career Roadmap**: Generate personalized 3-month action plans targeting aspirational roles (e.g., *Cloud Backend Engineer*).
- **Interactive Technical Interview Coach**: Practice role-specific architectural and coding questions with hints powered by Gemini.
- **Application Stage Tracker**: Real-time status pipeline (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected`) with event timelines.

### 2. Industry Recruiter Persona (*Sarah Jenkins — Lead Technical Recruiter, Novatech Systems*)
- **Campus Opportunity Creator**: Create job, internship, apprenticeship, and live capstone postings with required vs. preferred skills, minimum proficiency bars, work modes, and academic eligibility criteria.
- **Candidate Review & Talent Pool**: Search, filter, and inspect applicants sorted by compatibility scores.
- **ATS Stage Management**: Transition candidates across hiring stages with internal audit notes and instant student notifications.
- **Explainability Inspector**: Deep-dive into candidate profiles to review why a candidate scored 92% vs 64%, inspecting missing skills and verified certifications.
- **Academic Joint Collaborations**: Manage student capstone projects and track milestones.

### 3. Academician / Faculty Persona (*Dr. Ramesh Kumar — Head of Distributed Systems Lab*)
- **Industry Immersion Programs**: Discover and apply for industrial sabbaticals, AICTE-recognized Faculty Development Programs (FDPs), and corporate internships.
- **Industry Consultancy Retainers**: Review corporate technical problems and submit consultancy proposals.
- **Sponsored Research Grants**: Explore enterprise R&D grants with milestone tracking.
- **Capstone Project Co-Mentorship**: Supervise student deliverables alongside industry co-mentors.

### 4. Institutional Admin / Placement Cell Persona (*Dr. Meenakshi Sundaram — Apex Placement Cell*)
- **Macro Cohort Readiness Analytics**: Track total enrollment (4,820 students), verified capability rates, placed percentages, and active company engagements.
- **Curriculum Gap Diagnostic (Demand vs. Supply)**: Identify fast-growing industry demands (e.g., Docker, Kubernetes, Generative AI) lagging behind campus curriculum supply.
- **Verifiable Credential Audit Desk**: Review student-uploaded certifications, verify credential IDs, and approve or reject submissions with tamper-proof timestamps.
- **Canonical Skill Taxonomy Manager**: Create standardized skills, categories, and industry aliases.
- **Placement Export**: Download full institutional readiness reports as CSV.

---

## 🧮 Explainable Matching Engine (Mathematical Formulation)

The SkillBridge Matching Engine eliminates black-box hiring by employing a deterministic, multi-factor scoring model coupled with hard academic eligibility checks.

### Mathematical Formula:
$$\text{Overall Compatibility Score} = 0.55 \cdot S_{\text{required}} + 0.15 \cdot S_{\text{proficiency}} + 0.10 \cdot S_{\text{preferred}} + 0.10 \cdot S_{\text{role}} + 0.05 \cdot S_{\text{work\_mode}} + 0.05 \cdot S_{\text{completeness}}$$

### Component Breakdowns:
1. **Required Skills Coverage ($S_{\text{required}}$) — 55% Weight**:
   $$S_{\text{required}} = \left( \frac{\sum_{i=1}^{N} \mathbb{I}(\text{skill}_i \in \text{StudentSkills})}{N} \right) \times 100$$
   Where $N$ is the total count of mandatory required skills.

2. **Proficiency Alignment ($S_{\text{proficiency}}$) — 15% Weight**:
   For each matched skill $i$:
   $$\text{Fit}_i = \begin{cases} 1.0 & \text{if } P_{\text{student}} \ge P_{\text{required}} \\ \frac{P_{\text{student}}}{P_{\text{required}}} & \text{if } P_{\text{student}} < P_{\text{required}} \end{cases}$$
   $$S_{\text{proficiency}} = \left( \frac{\sum_{i=1}^{N} \text{Fit}_i}{N} \right) \times 100$$

3. **Preferred Skills Bonus ($S_{\text{preferred}}$) — 10% Weight**:
   $$S_{\text{preferred}} = \left( \frac{\text{Matched Preferred Skills}}{\text{Total Preferred Skills}} \right) \times 100$$

4. **Role Interest Alignment ($S_{\text{role}}$) — 10% Weight**:
   Evaluates student career aspiration keywords against the job's title and category (100% if exact match; 60% baseline).

5. **Work Mode / Flexibility Fit ($S_{\text{work\_mode}}$) — 5% Weight**:
   Remote = 100%, Hybrid = 90%, On-site = 75%.

6. **Profile Completeness & Verification ($S_{\text{completeness}}$) — 5% Weight**:
   Calculated dynamically based on resume link (+15%), GitHub integration (+15%), $\ge 2$ verified projects (+10%), and $\ge 1$ verified credential (+10%).

### Hard Academic Eligibility Gating:
Before scoring, candidate profiles are checked against hard requirements:
- $\text{Student CGPA} \ge \text{Minimum Opportunity CGPA}$
- $\text{Student Engineering Branch} \in \text{Allowed Branches}$
- $\text{Student Graduation Year} \in \text{Eligible Batches}$

*Transparency Rule*: If a candidate fails any hard academic constraint, their overall score is capped at **48%**, accompanied by clear explanatory diagnostic notes in the UI.

---

## 🪪 Living Career Passport & Cryptographic/Verifiable Credentialing

SkillBridge replaces outdated PDF resumes with a dynamic, living web portfolio:
- **Unique Credential Identifiers**: E.g., `SB-VERIFIED-948201` issued by the *Apex Academic & Skill Council*.
- **Direct Skill Verification Links**: Links verified skills directly to assessment scores and GitHub project repositories.
- **Shareable QR Verification**: Dynamic QR code rendering allows campus recruiters at job fairs to scan and view the verified candidate passport instantly.
- **Granular Privacy Controls**: One-click toggle between Publicly Discoverable and Private Access.

---

## 🧪 Interactive Capability Assessments

To prevent resume puffery, SkillBridge includes standardized in-app technical assessments:
- **Timed Question Engine**: Multiple-choice domain challenges covering architecture, edge cases, and best practices.
- **Adaptive Scoring**: Questions test theoretical grasp and real-world trade-offs (e.g., Redis caching strategies, connection pooling, Docker layer optimization).
- **Automated Capability Endorsement**: Scoring $\ge 70\%$ automatically updates the student's proficiency level in that skill and appends a verified credential to their Career Passport.

---

## 📊 Curriculum Gap & Macro Institutional Analytics

The Institutional Admin Dashboard provides actionable intelligence to academic leadership:
- **Demanded vs. Taught Matrix**: Compares employer-requested capabilities against current engineering syllabi.
- **Departmental Employability Benchmarks**: Tracks placement statistics across CSE, ECE, AI&DS, and Mechanical Engineering.
- **Audit Logging**: Tracks verification requests, reviewer approvals, and historical placement conversion rates.
- **CSV Data Export**: Instant one-click export for National Institutional Ranking Framework (NIRF) and accreditation audits.

---

## 🤖 Generative AI Capabilities & Endpoints

SkillBridge integrates with **Gemini 3.8 Flash** via the official Google Gen AI SDK (`@google/genai`):

| Endpoint | Method | Purpose | Input Payload | Output Format |
|---|---|---|---|---|
| `/api/v1/ai/resume/parse` | `POST` | Ingests unformatted resume text and extracts structured skills, education, and projects | `{ "resumeText": string }` | Structured JSON with skills array, degrees, and project cards |
| `/api/v1/ai/roadmap` | `POST` | Synthesizes an actionable 30/60/90-day learning journey addressing missing job requirements | `{ "currentSkills": [], "targetRole": string, "gaps": [] }` | JSON with Day 30, Day 60, Day 90 themes and milestones |
| `/api/v1/ai/interview` | `POST` | Generates role-tailored technical interview questions with hints | `{ "roleName": string, "skills": [] }` | JSON array of questions, categories, and system hints |
| `/api/health` | `GET` | Service health check and AI client status verification | None | `{ "status": "ok", "hasGeminiKey": boolean }` |

*Deterministic Fallback Architecture*: Every AI route features a deterministic fallback engine. If an API key is unconfigured or a network anomaly occurs, high-fidelity structured data is returned seamlessly without crashing or stalling the user interface.

---

## 💻 Technology Stack

- **Client Framework**: React 18 with Vite
- **Programming Language**: TypeScript (strict type safety throughout)
- **Styling & UI**: Tailwind CSS utility design system with refined neutral palettes
- **Icons**: `lucide-react`
- **Animations**: `motion` layout and micro-interactions
- **Visualizations**: D3.js and SVG-based custom radar/bar analytics
- **Backend Service**: Express.js with Vite development middleware integration
- **AI Integration**: `@google/genai` TypeScript SDK (model: `gemini-3.8-flash`)
- **Build & Bundle**: `esbuild` compiling `server.ts` into a CommonJS production bundle (`dist/server.cjs`)

---

## 📦 API Reference & Data Contracts

### 1. Resume Parsing Request
```bash
POST /api/v1/ai/resume/parse
Content-Type: application/json

{
  "resumeText": "Arjun Sharma. B.Tech Computer Science student at Apex Institute of Technology, CGPA 8.85. Proficient in Python, Node.js, SQL, and Docker. Built a Distributed Key-Value Store with Raft consensus."
}
```

### 2. Career Roadmap Request
```bash
POST /api/v1/ai/roadmap
Content-Type: application/json

{
  "targetRole": "Cloud Backend Engineer",
  "currentSkills": ["Python", "Node.js", "SQL"],
  "gaps": ["Kubernetes", "Docker", "Redis"]
}
```

---

## 🚀 Setup, Installation & Running the Platform

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or Bun

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd skillbridge
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Optional: Provide your Google Gemini API Key for dynamic AI responses
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If omitted, the built-in deterministic fallback engine ensures 100% functionality).*

### 3. Development Mode
```bash
npm run dev
```
The application boots on `http://localhost:3000` with hot-reloading and integrated Vite middleware.

### 4. Production Build
```bash
npm run build
npm start
```
This builds static assets to `dist/` and bundles `server.ts` into `dist/server.cjs` via `esbuild`.

---

## 🎬 Demo Scenarios & Walkthrough

1. **Explore as Student**:
   - Inspect Arjun's living profile and skill scores.
   - Click **"Living Career Passport"** to view verifiable credentials and the shareable QR code.
   - Navigate to the **"Capability Assessments"** tab and click **"Start Assessment"** on *Backend Engineering & API Design*. Complete the 5 questions, score $\ge 70\%$, and notice the new verified badge and certificate.
   - Click on any job card's **"Why this match?"** button to view the radar breakdown and skill gap diagnostics.
   - Click **"Apply"** on *Cloud Backend Engineer Intern* and track it in the **"My Applications"** pipeline.

2. **Switch to Recruiter**:
   - In the top navigation bar, change the persona to **Recruiter (Sarah Jenkins)**.
   - Access the **"Applicant Review Pipeline"** to see Arjun's application. Advance his status from `Applied` to `Shortlisted`.
   - Post a new campus opening via **"Post Campus Opportunity"** and specify required proficiencies.

3. **Switch to Institution Admin**:
   - Switch persona to **Institution Admin (Dr. Meenakshi Sundaram)**.
   - Inspect the **Curriculum Gap Analysis** showing industry demand vs student supply.
   - Review pending student credentials at the **Verification Audit Desk** and approve credentials with verifiable timestamps.
   - Click **"Export Placement Report"** to download the CSV report.

4. **Switch to Faculty**:
   - Switch persona to **Faculty (Dr. Ramesh Kumar)**.
   - Review corporate research fellowships, submit an industrial consulting proposal, and supervise student capstone deliverables.

---

## 📄 License
SkillBridge is licensed under the MIT License. Built for academic excellence, recruiter transparency, and student empowerment.
