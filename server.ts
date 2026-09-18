import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini SDK initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge Backend API',
    version: '1.0.0',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

// AI: Resume Parsing Pipeline
app.post('/api/v1/ai/resume/parse', async (req, res) => {
  const { resumeText } = req.body;

  const defaultExtracted = {
    skills: ['Python', 'SQL & Relational DBs', 'Node.js & Express', 'RESTful API Architecture', 'Docker & Containers', 'Git & Version Control'],
    education: {
      degree: 'Bachelor of Technology (B.Tech) in Computer Science',
      institution: 'Apex Institute of Technology',
      graduationYear: 2026,
      cgpa: 8.85
    },
    projects: [
      {
        title: 'Distributed Key-Value Store',
        technologies: ['Go (Golang)', 'Python', 'Docker'],
        summary: 'Built high-throughput in-memory caching system with Raft consensus'
      },
      {
        title: 'Academic Event Portal',
        technologies: ['TypeScript', 'Node.js & Express', 'PostgreSQL'],
        summary: 'Campus management platform handling 3,000+ students'
      }
    ],
    experienceSummary: 'Backend Engineering Intern at DataMesh Analytics (Summer 2025)'
  };

  const ai = getAIClient();
  if (!ai || !resumeText) {
    return res.json({
      success: true,
      data: defaultExtracted,
      source: 'deterministic_engine'
    });
  }

  try {
    const prompt = `You are an expert technical ATS resume parser for SkillBridge.
Extract structured information from the following resume text into clean JSON.
Schema:
{
  "skills": ["string"],
  "education": {
    "degree": "string",
    "institution": "string",
    "graduationYear": number,
    "cgpa": number
  },
  "projects": [
    { "title": "string", "technologies": ["string"], "summary": "string" }
  ],
  "experienceSummary": "string"
}
Return ONLY valid JSON without markdown wrapping.

Resume Text:
${resumeText.slice(0, 4000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, data: parsed, source: 'gemini' });
  } catch (err: any) {
    console.warn('Gemini resume parsing failed, using fallback:', err.message);
    return res.json({ success: true, data: defaultExtracted, source: 'fallback' });
  }
});

// AI: 30/60/90-Day Career Roadmap Generator
app.post('/api/v1/ai/roadmap', async (req, res) => {
  const { currentSkills, targetRole, gaps } = req.body;

  const defaultRoadmap = {
    role: targetRole || 'Backend Engineer',
    summary: `Structured path bridging from ${currentSkills?.length || 5} established capabilities to Senior ${targetRole || 'Backend Engineer'} standards with verified industry evidence.`,
    day30: {
      theme: 'Containerization & Infrastructure Foundations',
      milestones: [
        'Complete hands-on containerization labs: create multi-stage Dockerfiles for Python/Node services',
        'Configure local development orchestration with Docker Compose, healthchecks, and volume mounts',
        'Pass the SkillBridge Cloud Native & DevOps capability assessment with ≥75% score'
      ],
      recommendedAction: 'Enroll in Novatech Cloud-Native Microservices & Docker Masterclass'
    },
    day60: {
      theme: 'Orchestration, Caching & Scalability',
      milestones: [
        'Deploy a multi-service architecture onto local Minikube / K3s cluster with Ingress routing',
        'Implement distributed caching and token-bucket rate limiting with Redis',
        'Publish a verified project repository with CI/CD GitHub Actions pipeline testing coverage'
      ],
      recommendedAction: 'Complete Open Source Distributed Cache Capstone Project'
    },
    day90: {
      theme: 'Production Readiness, System Design & Interview Mastery',
      milestones: [
        'Conduct mock architecture reviews on high concurrency systems (50k+ QPS)',
        'Submit verified portfolio to Novatech and CloudScale verified campus recruiter pool',
        'Complete technical interviews for Cloud Backend Engineer Summer Internship'
      ],
      recommendedAction: 'Schedule 1-on-1 industry mentor session for final portfolio defense'
    }
  };

  const ai = getAIClient();
  if (!ai || !targetRole) {
    return res.json({ success: true, data: defaultRoadmap, source: 'deterministic_engine' });
  }

  try {
    const prompt = `You are a Principal Career Architect on SkillBridge.
Create a personalized 30/60/90-day learning roadmap for a student targeting "${targetRole}".
Current Skills: ${JSON.stringify(currentSkills || [])}
Missing/Gap Skills: ${JSON.stringify(gaps || [])}

Return a valid JSON object matching:
{
  "role": "${targetRole}",
  "summary": "string",
  "day30": { "theme": "string", "milestones": ["string", "string", "string"], "recommendedAction": "string" },
  "day60": { "theme": "string", "milestones": ["string", "string", "string"], "recommendedAction": "string" },
  "day90": { "theme": "string", "milestones": ["string", "string", "string"], "recommendedAction": "string" }
}
Return ONLY pure JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, data: parsed, source: 'gemini' });
  } catch (err: any) {
    console.warn('Gemini roadmap generation error, falling back:', err.message);
    return res.json({ success: true, data: defaultRoadmap, source: 'fallback' });
  }
});

// AI: Role-specific Interview Practice Questions
app.post('/api/v1/ai/interview', async (req, res) => {
  const { roleName, skills } = req.body;

  const defaultQuestions = [
    {
      question: 'How do you design a high-throughput write-heavy service without overwhelming your primary relational database?',
      category: 'System Design',
      hint: 'Consider Write-Ahead Logging, async queue buffering (Kafka), batch writes, and write-back caches.'
    },
    {
      question: 'In Docker, explain how layer caching works and how you order Dockerfile directives to minimize rebuild times.',
      category: 'DevOps & Containers',
      hint: 'Place rarely changing steps like package.json/requirements.txt copies before application source code copies.'
    },
    {
      question: 'What happens during a TCP 3-way handshake and how does connection pooling improve microservice latency?',
      category: 'Networking & Protocols',
      hint: 'SYN -> SYN-ACK -> ACK, eliminating repeated handshake roundtrips per HTTP transaction.'
    }
  ];

  const ai = getAIClient();
  if (!ai || !roleName) {
    return res.json({ success: true, data: defaultQuestions, source: 'deterministic_engine' });
  }

  try {
    const prompt = `Generate 3 realistic technical interview questions for a candidate applying for "${roleName}".
Relevant Skills: ${JSON.stringify(skills || ['Python', 'SQL', 'Docker'])}
Return JSON:
[
  { "question": "string", "category": "string", "hint": "string" }
]
Output pure JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const cleanJson = (response.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, data: parsed, source: 'gemini' });
  } catch (e: any) {
    return res.json({ success: true, data: defaultQuestions, source: 'fallback' });
  }
});

// Boot the server with Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
