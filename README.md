# SkillBridge AI — Academia-Industry Collaboration Portal

> **A Smart India Hackathon Problem Statement Implementation**
> Portal for Academia-Industry Collaboration for Skill Mapping, Internships and Placement

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [User Roles & Personas](#5-user-roles--personas)
6. [Feature Modules](#6-feature-modules)
7. [Database Design](#7-database-design)
8. [API Reference](#8-api-reference)
9. [AI Matching Engine](#9-ai-matching-engine)
10. [Frontend Components](#10-frontend-components)
11. [Authentication Flow](#11-authentication-flow)
12. [Project Structure](#12-project-structure)
13. [Setup & Running Locally](#13-setup--running-locally)
14. [Seed Data](#14-seed-data)
15. [Testing](#15-testing)

---

## 1. Problem Statement

A significant gap exists between the skills acquired in academic institutions and the competencies expected by industries. Students struggle to identify career-relevant skills; industries struggle to find right-fit candidates; academicians have limited visibility into real-world industry exposure opportunities.

**SkillBridge AI** is the proposed unified platform that connects all four stakeholders — **Students**, **Industries (Recruiters)**, **Academicians (Faculty)**, and **Institutions (Admins)** — enabling seamless collaboration, verified skill development, and placement intelligence.

---

## 2. Solution Overview

SkillBridge AI is a full-stack, AI-native, role-based web platform that provides:

| Capability | Description |
|---|---|
| **Skill Assessment** | Students take objective in-app tests to build verified skill profiles |
| **AI Skill Matching** | Explainable AI (Gemini) matches students to job/internship opportunities with transparent scoring |
| **Digital Skill Passport** | A shareable, verifiable, living portfolio replacing PDF resumes |
| **Opportunity Portal** | Centralised internship, job, live-project, and mentorship board |
| **Industry Learning Programs** | Companies publish certification courses, bootcamps, and workshops |
| **Faculty Portal** | Dedicated panel for Faculty Internships, FDPs, Research Collaboration |
| **Institution Analytics** | Macro-level dashboards tracking placement rates, skill gaps, department benchmarks |
| **Credential Verification** | Institutions and recruiters verify student certifications and skills with audit logs |

---

## 3. Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 (served via Express middleware) |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Animations | motion (Framer Motion) |
| Data Fetching | TanStack React Query v5 + Axios |
| State Management | React Context API (AuthContext) |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js v24 |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma v5 |
| Database | PostgreSQL (Supabase Cloud) |
| Auth | Supabase Auth (JWT-based) |
| AI | Google Gen AI SDK — Gemini Flash |
| Email | Resend API |
| File Storage | Supabase Storage |
| Security | helmet, express-rate-limit, xss-clean, CORS |

### DevOps & Tooling
| Category | Technology |
|---|---|
| Testing | Vitest + supertest + React Testing Library |
| Containerisation | Docker (Dockerfile included) |
| Package Manager | npm |
| Build Bundler | esbuild (server), Vite rolldown (client) |

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                 │
│  Vite HMR ◄──── served as Express static middleware   │
└──────────────────────┬─────────────────────────────────┘
                       │  HTTP / REST  /api/v1
┌──────────────────────▼─────────────────────────────────┐
│              Express.js Server (server.ts)             │
│                                                        │
│  ┌────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Auth MW   │  │  RBAC MW │  │  Rate Limit / XSS │  │
│  └─────┬──────┘  └────┬─────┘  └───────────────────┘  │
│        │              │                                 │
│  ┌─────▼──────────────▼──────────────────────────────┐ │
│  │                   Route Handlers                  │ │
│  │  /auth  /students  /opportunities  /applications  │ │
│  │  /institutions  /ai  /storage  /notifications     │ │
│  └──────────────────────┬────────────────────────────┘ │
└─────────────────────────┼──────────────────────────────┘
                          │
         ┌────────────────┼─────────────────┐
         │                │                 │
┌────────▼───────┐  ┌─────▼──────┐  ┌──────▼───────┐
│  Prisma ORM    │  │  Supabase  │  │  Google      │
│  PostgreSQL DB │  │  Auth +    │  │  Gemini API  │
│  (Supabase)    │  │  Storage   │  │              │
└────────────────┘  └────────────┘  └──────────────┘
```

**Key architectural decision:** Vite runs in Express middleware mode during development, meaning a single `npm run dev` boots the full stack (API + HMR frontend) on **port 3000**.

---

## 5. User Roles & Personas

The platform implements strict **Role-Based Access Control (RBAC)**. Each role gets a completely different application shell and set of API permissions.

### 5.1 Student (`STUDENT`)
- Registers via email + password on the Landing Page
- Fills an onboarding profile (branch, degree, graduation year, CGPA, bio, target roles)
- Takes skill assessments → builds a verified skill profile
- Browses and applies for opportunities
- Tracks application statuses in real-time
- Maintains a public Digital Skill Passport (shareable via unique URL + QR code)
- Enrolls in industry Learning Programs

**Key data:** `StudentProfile`, `StudentSkill`, `Application`, `AssessmentAttempt`, `StudentCertification`, `StudentProject`

### 5.2 Industry / Recruiter (`RECRUITER`)
- Represents an `IndustryOrganization` (e.g., Novatech Systems)
- Posts job openings, internships, live projects, and apprenticeships as `Opportunity` records
- Publishes Learning Programs (workshops, bootcamps, mentorship)
- Reviews incoming applications, views AI match scores
- Advances candidate pipeline (Applied → Shortlisted → Interview → Selected/Rejected)
- Manages their tenant's application pipeline via `organizationId` scoping

**Key data:** `Opportunity`, `Application`, `LearningProgram`, `IndustryOrganization`

### 5.3 Academician / Faculty (`ACADEMICIAN`)
- Explores Faculty-specific opportunities: FDPs, Industrial Training, Consultancy, Research Collaborations
- Participates in and manages `CollaborationProject` records with industry partners
- Can verify student skills assigned to them by the institution
- Views industry-academia partnerships and tracks milestones

**Key data:** `FacultyProfile`, `FacultyOpportunity`, `CollaborationProject`

### 5.4 Institution Admin (`INSTITUTION_ADMIN`)
- Represents the academic institution (e.g., Apex Institute of Technology)
- Views macro analytics: placement rates, skill gap matrices, departmental breakdowns
- Operates the **Skill Verification Audit Desk** — approves/rejects student skill claims
- Tracks all enrolled students with their verification statuses
- Monitors corporate partners and active campus drives

**Key data:** `Institution`, `Department`, `AuditLog`, `StudentProfile` (institution-scoped)

### Dev Persona Switcher (Development Only)
A developer-only Navbar tool lets engineers instantly switch between the four roles by triggering a real Supabase `signInWithPassword` call using pre-seeded test accounts (`password123`). It does **not** bypass JWT authentication — it uses the real auth flow.

---

## 6. Feature Modules

### 6.1 Skill Assessment System
- Students take timed multiple-choice assessments (5–10 questions each)
- Each question maps to a `CanonicalSkill` from the taxonomy
- Scoring ≥ 70% → skill is automatically marked `ASSESSED` (verified via platform)
- `AssessmentAttempt` records the breakdown per skill
- Results propagate to the student's `StudentSkill` table and update their `proficiency` score

### 6.2 AI Match Scoring (Explainable AI)
A deterministic weighted formula calculates compatibility between a student and an opportunity:

```
Match Score = 0.55 × Required Skill Coverage
            + 0.15 × Proficiency Fit
            + 0.10 × Preferred Skill Coverage
            + 0.10 × Role Interest Alignment
            + 0.05 × Work Mode Fit
            + 0.05 × Profile Completeness
```

**Hard Eligibility Gates:**
- If student CGPA < minimum required → score capped at 48%
- If student branch not in allowed branches → score capped at 48%
- If graduation year not in eligible batches → score capped at 48%

The Gemini AI API is then called to generate a **plain-English explanation** of why a candidate is a good or poor fit, shown in the `MatchExplanationModal`.

### 6.3 Digital Skill Passport
- Every student gets a unique `portfolioSlug` (e.g., `arjun-sharma-apex-cse`)
- Publicly accessible at `/students/portfolio/:slug`
- Displays verified skills, projects, certifications, experience, and assessments
- Includes a QR code for on-site scanning at campus placement fairs
- Privacy toggle (Public / Private) controlled by `ConsentSettings`

### 6.4 Opportunity & Application Lifecycle

```
Industry posts Opportunity (DRAFT)
         ↓
     PUBLISHED (visible to students)
         ↓
  Student submits Application (APPLIED)
         ↓
Recruiter reviews → UNDER_REVIEW → SHORTLISTED
         ↓
     INTERVIEW
         ↓
  SELECTED  or  REJECTED
```

Every status transition creates an `ApplicationEvent` record for full auditability.

### 6.5 Industry-Academia Collaboration
- `CollaborationProject` supports: Live Projects, Industry Research, Innovation Hackathons, Guest Lecture Series
- Each project has `ProjectMilestone` records with due dates and completion tracking
- Faculty can propose and join collaborative research initiatives

### 6.6 Institution Analytics Dashboard
Real-time computed metrics:
- Total enrolled students / verified students ratio
- Placement rate (%) and number of placement offers
- Active internships and average stipend
- Corporate partner count and active campus drives
- **Skill Gap Matrix**: Top skills demanded by industry vs. student coverage %
- Department-wise placement benchmarks (CSE, ECE, AI&DS, etc.)
- Skill demand growth trends

### 6.7 Credential Verification Workflow
```
Student claims/uploads Certification → PENDING
         ↓
Institution Admin reviews at Audit Desk
         ↓
   VERIFIED  or  REJECTED (with reason)
```
All verification actions are recorded in `AuditLog` with actor ID, timestamp, and IP address.

---

## 7. Database Design

The Prisma schema uses **PostgreSQL** hosted on Supabase. All models use CUID primary keys.

### Core Enums

| Enum | Values |
|---|---|
| `UserRole` | `SUPER_ADMIN`, `INSTITUTION_ADMIN`, `ACADEMICIAN`, `STUDENT`, `RECRUITER` |
| `VerificationStatus` | `PENDING`, `VERIFIED`, `REJECTED` |
| `SkillSource` | `ASSESSED`, `VERIFIED`, `SELF_REPORTED`, `IMPORTED`, `AI_PARSED` |
| `OpportunityType` | `INTERNSHIP`, `JOB`, `LIVE_PROJECT`, `APPRENTICESHIP`, `MENTORSHIP` |
| `OpportunityStatus` | `DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`, `CLOSED`, `ARCHIVED` |
| `ApplicationStatus` | `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN` |
| `WorkMode` | `REMOTE`, `HYBRID`, `ON_SITE` |
| `CollaborationStatus` | `PLANNING`, `ACTIVE`, `UNDER_REVIEW`, `COMPLETED` |

### Entity Relationship Summary

```
Institution ──< Department
Institution ──< User
Institution ──< StudentProfile
Institution ──< FacultyProfile
Institution ──< Assessment
Institution ──< CollaborationProject

IndustryOrganization ──< User
IndustryOrganization ──< Opportunity
IndustryOrganization ──< CollaborationProject

User ──1── StudentProfile ──< StudentSkill >── CanonicalSkill
                           ──< StudentProject
                           ──< StudentCertification
                           ──< StudentExperience
                           ──< Application >── Opportunity
                           ──< AssessmentAttempt
                           ──< LearningEnrollment

User ──1── FacultyProfile

Opportunity ──< OpportunitySkill >── CanonicalSkill
Opportunity ──< Application ──< ApplicationEvent

Assessment ──< AssessmentQuestion >── CanonicalSkill
Assessment ──< AssessmentAttempt ──< AssessmentAnswer

CollaborationProject ──< ProjectMilestone

CanonicalSkill ──< CareerRoleSkill >── CareerRole
```

### Key Models at a Glance

| Model | Purpose |
|---|---|
| `User` | Core identity, linked 1:1 to Supabase Auth via `supabaseAuthId` |
| `StudentProfile` | Extended student data (CGPA, branch, degree, portfolio slug) |
| `CanonicalSkill` | Platform's master skill taxonomy (24 skills, categorised) |
| `StudentSkill` | Junction: student × canonical skill with proficiency 0–100 and verification status |
| `Opportunity` | Job/internship/project posting with eligibility constraints |
| `Application` | Student × opportunity link with status and match score |
| `ApplicationEvent` | Full audit trail of every status change |
| `Assessment` | Timed skill test with pass/fail threshold |
| `AssessmentAttempt` | Student's attempt record with per-skill score breakdown |
| `AuditLog` | Immutable log of all sensitive platform actions |
| `ConsentSettings` | GDPR-style privacy toggles per student |
| `CollaborationProject` | Industry-academia joint ventures with milestone tracking |

---

## 8. API Reference

All endpoints are prefixed with `/api/v1`. Authentication uses `Authorization: Bearer <supabase_jwt>`.

### Auth (`/api/v1/auth`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/sync` | Bearer JWT | Any | Creates/updates Prisma user from Supabase session |
| `GET` | `/me` | Bearer JWT | Any | Returns authenticated user's platform identity |

### Students (`/api/v1/students`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/portfolio/:slug` | Public | — | Fetch public student passport |
| `GET` | `/institutions` | Public | — | List all institutions |
| `GET` | `/me` | Required | STUDENT | Fetch my full profile |
| `POST` | `/me` | Required | STUDENT | Create student profile (onboarding) |
| `PUT` | `/me` | Required | STUDENT | Update student profile |
| `POST` | `/me/skills` | Required | STUDENT | Add/update a skill |
| `POST` | `/me/projects` | Required | STUDENT | Add a project |

### Opportunities (`/api/v1/opportunities`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | Public | — | List published opportunities (with filters) |
| `GET` | `/:id` | Public | — | Get single opportunity detail |
| `POST` | `/` | Required | RECRUITER | Create new opportunity |
| `PUT` | `/:id` | Required | RECRUITER | Update opportunity |

### Applications (`/api/v1/applications`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/` | Required | STUDENT | Submit application |
| `GET` | `/me` | Required | STUDENT | Get my applications |
| `GET` | `/organization` | Required | RECRUITER | Get org's incoming applications |
| `GET` | `/opportunity/:id` | Required | RECRUITER | Applications for a specific posting |
| `PUT` | `/:id/status` | Required | RECRUITER | Advance application stage |

### Institutions (`/api/v1/institutions`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/students` | Required | INSTITUTION_ADMIN / ACADEMICIAN | List all students in institution |
| `POST` | `/verify-skill` | Required | INSTITUTION_ADMIN / ACADEMICIAN | Approve or reject a student skill |

### AI (`/api/v1/ai`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/resume/parse` | Public | — | Parse raw resume text → structured skill JSON |
| `POST` | `/roadmap` | Public | — | Generate a 30/60/90-day personalised learning roadmap |
| `POST` | `/interview` | Public | — | Generate role-tailored technical interview questions |

### Storage (`/api/v1/storage`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/upload-url` | Required | Any | Get a signed URL to upload resume to Supabase Storage |

### Notifications (`/api/v1/notifications`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | Required | Any | Fetch user's notifications |
| `PUT` | `/:id/read` | Required | Any | Mark notification as read |

---

## 9. AI Matching Engine

The matching engine (`src/utils/matchingEngine.ts`) runs **entirely deterministically** on the frontend — no API call required for basic scoring. Gemini is only called for the plain-English explanation.

### Score Formula
```
Score = 0.55 × Required Skill Coverage Score
      + 0.15 × Proficiency Fit Score
      + 0.10 × Preferred Skill Coverage Score  
      + 0.10 × Role Interest Alignment Score
      + 0.05 × Work Mode / Location Score
      + 0.05 × Profile Completeness Score
```

### Component Definitions
| Component | How Calculated |
|---|---|
| **Required Skill Coverage** | `matched_required / total_required × 100` |
| **Proficiency Fit** | For each matched skill: `min(1, student_proficiency / required_proficiency)`, averaged |
| **Preferred Skill Coverage** | Fuzzy string match of student skills against preferred list |
| **Role Interest Alignment** | Student's `targetRoles` array vs. opportunity title/role slug |
| **Work Mode Fit** | Remote=100%, Hybrid=90%, On-site=75% |
| **Profile Completeness** | Resume link (+15), GitHub (+15), ≥2 projects (+10), ≥1 cert (+10). Base = 50 |

### Hard Gates (Eligibility)
If any hard constraint fails, the raw score is **capped at 48%** and the UI shows clear diagnostic notes:
- `Student CGPA < Minimum Required CGPA`
- `Student Branch not in Allowed Branches`
- `Student Graduation Year not in Eligible Batches`

Final score is bounded to `[15, 99]`.

---

## 10. Frontend Components

| Component | File | Purpose |
|---|---|---|
| `LandingPage` | `LandingPage.tsx` | Hero section, feature grid, CTA buttons triggering AuthModal |
| `AuthModal` | `AuthModal.tsx` | Login + Registration modal backed by Supabase Auth |
| `Navbar` | `Navbar.tsx` | Top navigation with notifications, sign out, dev role switcher |
| `StudentDashboard` | `StudentDashboard.tsx` | Full student workspace (Skills, Opportunities, Applications, Passport) |
| `IndustryDashboard` | `IndustryDashboard.tsx` | Recruiter workspace (Pipeline, Post Jobs, Learning Programs) |
| `FacultyDashboard` | `FacultyDashboard.tsx` | Faculty portal (Opportunities, Collaborations, Research) |
| `InstitutionDashboard` | `InstitutionDashboard.tsx` | Admin workspace (Analytics, Skill Verification, Taxonomy) |
| `MatchExplanationModal` | `MatchExplanationModal.tsx` | Radar chart + AI explanation of candidate-job fit |
| `AssessmentRunnerModal` | `AssessmentRunnerModal.tsx` | Timed assessment UI with question runner and scoring |
| `ApplyModal` | `ApplyModal.tsx` | Application form with cover note and consent |
| `PublicPortfolioModal` | `PublicPortfolioModal.tsx` | Shareable student career passport with QR code |
| `NotificationModal` | `NotificationModal.tsx` | Notification centre with read/unread management |
| `StudentOnboarding` | `StudentOnboarding.tsx` | New student profile creation wizard |
| `Toast` | `Toast.tsx` | Global toast notification system |
| `ConfirmModal` | `ConfirmModal.tsx` | Reusable destructive action confirmation dialog |

All dashboards use **TanStack React Query** for server-state management with targeted cache invalidation on mutations.

---

## 11. Authentication Flow

```
User visits localhost:3000
        ↓
LandingPage rendered (no auth required)
        ↓
User clicks "Get Started" / "Sign In"
        ↓
AuthModal opens
        ↓
Register:  supabase.auth.signUp({ email, password, options: { data: { role, full_name } } })
Login:     supabase.auth.signInWithPassword({ email, password })
        ↓
Supabase returns JWT session
        ↓
Frontend calls POST /api/v1/auth/sync
(Express verifies JWT → upserts User row in Postgres)
        ↓
Frontend calls GET /api/v1/auth/me
(Returns platform identity: id, email, role, institutionId, profile)
        ↓
AuthContext.currentUser is set
        ↓
App renders role-appropriate Dashboard
```

### Token Flow on Every Request
Every Axios request automatically injects the JWT via an interceptor:
```typescript
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
```

---

## 12. Project Structure

```
SkillBridge/
├── server.ts                   # Express entry point (Vite middleware + API routes)
├── vite.config.ts              # Vite config (React plugin, Tailwind)
├── vitest.config.ts            # Vitest config (node environment)
├── prisma/
│   ├── schema.prisma           # Full DB schema (20+ models)
│   └── seed.ts                 # Comprehensive seed script
├── src/
│   ├── main.tsx                # React entry point (AuthProvider + QueryClientProvider)
│   ├── App.tsx                 # Root app shell + routing logic + modal orchestration
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── index.css               # Global styles + Tailwind directives
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── IndustryDashboard.tsx
│   │   ├── FacultyDashboard.tsx
│   │   ├── InstitutionDashboard.tsx
│   │   ├── MatchExplanationModal.tsx
│   │   ├── AssessmentRunnerModal.tsx
│   │   ├── ApplyModal.tsx
│   │   ├── PublicPortfolioModal.tsx
│   │   ├── NotificationModal.tsx
│   │   ├── StudentOnboarding.tsx
│   │   ├── Toast.tsx
│   │   └── ConfirmModal.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Supabase session + /me identity provider
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client (dual-purpose: browser + Node)
│   │   ├── api.ts              # Axios client with JWT interceptors
│   │   └── db.ts               # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.ts             # requireAuth middleware (JWT verification)
│   │   ├── rbac.ts             # requireRole + requireTenant middlewares
│   │   └── errorHandler.ts     # Global Express error handler
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   ├── opportunity.controller.ts
│   │   ├── application.controller.ts
│   │   ├── institution.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── storage.controller.ts
│   │   └── notification.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── student.routes.ts
│   │   ├── opportunity.routes.ts
│   │   ├── application.routes.ts
│   │   ├── institution.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── storage.routes.ts
│   │   └── notification.routes.ts
│   ├── utils/
│   │   ├── matchingEngine.ts   # Deterministic AI match scoring formula
│   │   └── aiAPI.ts            # Gemini API wrapper with fallback
│   ├── hooks/
│   │   ├── usePersistentState.ts
│   │   └── useEscapeKey.ts
│   └── data/
│       └── seedData.ts         # Frontend demo data constants
└── tests/
    ├── server.test.ts          # Backend integration tests (supertest)
    └── frontend.test.tsx       # Frontend unit tests (React Testing Library)
```

---

## 13. Setup & Running Locally

### Prerequisites
- Node.js v18+
- A Supabase Cloud project (free tier at [supabase.com](https://supabase.com))

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Configure environment
Copy the template and fill in your values:
```bash
cp .env.example .env
```

Open `.env` and set:
```env
# Supabase — from Settings > Database
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-...pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-...pooler.supabase.com:5432/postgres

# Supabase — from Settings > API
VITE_SUPABASE_URL=https://[ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google AI (optional — fallback data used if missing)
GEMINI_API_KEY=AIza...

# Email (optional)
RESEND_API_KEY=re_...

# App
NODE_ENV=development
PORT=3000
```

### Step 3: Push schema and seed data
```bash
npm run db:push       # Pushes Prisma schema to Supabase PostgreSQL
npm run db:seed       # Seeds canonical skills, organizations, opportunities
```

### Step 4: Create test users in Supabase Auth
In your Supabase dashboard → Authentication → Add users:
| Email | Password | Role |
|---|---|---|
| `arjun.sharma@apex.edu.in` | `password123` | Student |
| `priya.patel@novatech.com` | `password123` | Recruiter |
| `admin@apex.edu.in` | `password123` | Institution Admin |

> **Tip:** Disable "Confirm email" in Auth → Providers → Email to skip email verification during development.

### Step 5: Run
```bash
npm run dev           # Starts Express + Vite on http://localhost:3000
```

### Other Commands
```bash
npm run build         # Production build (Vite + esbuild)
npm start             # Run production build
npm run db:studio     # Open Prisma Studio (DB GUI)
npm run db:reset      # Reset DB to clean state
npx vitest run        # Run all tests
```

---

## 14. Seed Data

Running `npm run db:seed` populates the database with:

### Canonical Skills Taxonomy (24 skills)
| Category | Skills |
|---|---|
| Languages | Python, TypeScript, JavaScript, Java, Go |
| Backend | SQL & Relational DBs, Node.js & Express, FastAPI, RESTful API Architecture, Redis & Caching |
| Cloud & DevOps | Docker & Containers, Kubernetes, AWS Cloud Services, CI/CD Pipelines |
| Frontend | React.js, Next.js, Tailwind CSS |
| Core CS | System Design, Data Structures & Algorithms, Git & Version Control, Technical Communication |
| Data & AI | Machine Learning, Generative AI & LLMs |
| Security | App Security & OAuth 2.0 |

### Career Roles (4 roles)
- Backend Engineer, Frontend Engineer, Full-Stack Engineer, DevOps & Cloud Engineer

### Demo Data
- 1 Institution: **Apex Institute of Technology** (with CSE Department)
- 3 Organizations: Novatech Systems, CloudScale Inc., DataFirst Analytics
- 4 Opportunities: Full-stack internship, DevOps role, Cloud backend intern, AI product intern
- 2 Collaboration Projects: AI-Driven Smart Campus, Cloud Infrastructure Research
- 3 Learning Programs: Backend bootcamp, Cloud fundamentals, Frontend capstone

---

## 15. Testing

```bash
npx vitest run
```

| Test File | Coverage |
|---|---|
| `tests/server.test.ts` | Express server startup, custom error handler |
| `tests/frontend.test.tsx` | AuthContext bootstrap (no session), AuthContext with session → `/me` call |

All tests use mocked Supabase and Axios clients to isolate unit logic cleanly.

---

## License

MIT License — Built for Smart India Hackathon 2025.

---

*SkillBridge AI — Bridging the gap between academia and industry through AI-powered skill intelligence.*
