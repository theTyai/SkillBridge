import {
  User,
  CanonicalSkill,
  CareerRole,
  Opportunity,
  Assessment,
  LearningProgram,
  FacultyOpportunity,
  CollaborationProject,
  NotificationItem,
  InstitutionAnalytics,
  StudentProfile,
  FacultyProfile,
  Application
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Arjun Sharma',
    email: 'student@demo.com',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    institutionId: 'inst-apex',
    institutionName: 'Apex Institute of Technology',
    headline: 'Final Year CSE Student | Aspiring Backend & Cloud Architect',
    bio: 'Passionate about distributed systems, microservices, and high-performance database design. Actively building open-source developer tooling and seeking summer 2026/fall internships.',
    location: 'Bangalore, India'
  },
  {
    id: 'usr-industry-1',
    name: 'Sarah Jenkins',
    email: 'industry@demo.com',
    role: 'industry',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    organizationId: 'org-novatech',
    organizationName: 'Novatech Systems',
    headline: 'Head of Engineering Talent & University Partnerships at Novatech',
    bio: 'Overseeing early career recruitment and academic incubation for cloud-native infrastructure, AI engineering, and fintech platforms.',
    location: 'San Francisco, CA & Bangalore'
  },
  {
    id: 'usr-faculty-1',
    name: 'Dr. Ramesh Kumar',
    email: 'faculty@demo.com',
    role: 'academician',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    institutionId: 'inst-apex',
    institutionName: 'Apex Institute of Technology',
    headline: 'Professor & Head of Distributed Systems Lab, Dept. of CSE',
    bio: '20+ years of research in distributed computing, edge intelligence, and consensus protocols. Lead investigator on multiple industry-sponsored research grants.',
    location: 'Bangalore, India'
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Meenakshi Sundaram',
    email: 'admin@demo.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    institutionId: 'inst-apex',
    institutionName: 'Apex Institute of Technology',
    headline: 'Dean of Placements & Academic-Industry Collaborations',
    bio: 'Empowering 5,000+ engineers with verifiable industry skill standards, corporate mentorships, and placement success pipelines.',
    location: 'Bangalore, India'
  }
];

export const CANONICAL_SKILLS: CanonicalSkill[] = [
  { id: 'sk-python', name: 'Python', slug: 'python', category: 'Languages', aliases: ['py', 'python3'], description: 'High-level programming language widely used in backend, data, and AI.' },
  { id: 'sk-ts', name: 'TypeScript', slug: 'typescript', category: 'Languages', aliases: ['ts', 'typescript'], description: 'Typed superset of JavaScript that compiles to plain JavaScript.' },
  { id: 'sk-js', name: 'JavaScript', slug: 'javascript', category: 'Languages', aliases: ['js', 'ecmascript', 'es6'], description: 'The standard scripting language of the web.' },
  { id: 'sk-java', name: 'Java', slug: 'java', category: 'Languages', aliases: ['jvm', 'java17', 'java21'], description: 'Object-oriented programming language for enterprise backend systems.' },
  { id: 'sk-go', name: 'Go (Golang)', slug: 'go', category: 'Languages', aliases: ['golang', 'go-lang'], description: 'Fast, statically typed compiled language designed for concurrency and cloud services.' },
  { id: 'sk-sql', name: 'SQL & Relational DBs', slug: 'sql', category: 'Backend', aliases: ['sql', 'postgres', 'postgresql', 'mysql'], description: 'Database querying, normalization, indexing, and transactional integrity.' },
  { id: 'sk-nodejs', name: 'Node.js & Express', slug: 'nodejs', category: 'Backend', aliases: ['node', 'nodejs', 'expressjs'], description: 'Asynchronous event-driven JavaScript runtime for server-side APIs.' },
  { id: 'sk-fastapi', name: 'FastAPI', slug: 'fastapi', category: 'Backend', aliases: ['fastapi', 'python-fastapi'], description: 'Modern, fast web framework for building APIs with Python based on standard type hints.' },
  { id: 'sk-rest', name: 'RESTful API Architecture', slug: 'rest-apis', category: 'Backend', aliases: ['rest', 'restful', 'api-design'], description: 'Contract design, HTTP verbs, status codes, pagination, and API security.' },
  { id: 'sk-redis', name: 'Redis & Caching', slug: 'redis', category: 'Backend', aliases: ['redis', 'in-memory-cache'], description: 'In-memory key-value store, distributed caching, pub/sub, and rate limiting.' },
  { id: 'sk-docker', name: 'Docker & Containers', slug: 'docker', category: 'Cloud & DevOps', aliases: ['docker', 'containerization', 'containers'], description: 'Packaging applications and dependencies into standardized containers.' },
  { id: 'sk-k8s', name: 'Kubernetes', slug: 'kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'kube', 'kubernetes'], description: 'Automated container deployment, scaling, and operational management.' },
  { id: 'sk-aws', name: 'AWS Cloud Services', slug: 'aws', category: 'Cloud & DevOps', aliases: ['amazon-web-services', 'aws-cloud', 'ec2', 's3'], description: 'Cloud infrastructure including EC2, S3, RDS, Lambda, and IAM security.' },
  { id: 'sk-cicd', name: 'CI/CD Pipelines & GitHub Actions', slug: 'ci-cd', category: 'Cloud & DevOps', aliases: ['github-actions', 'jenkins', 'devops-pipelines'], description: 'Automated build, test, and zero-downtime deployment pipelines.' },
  { id: 'sk-react', name: 'React.js', slug: 'react', category: 'Frontend', aliases: ['reactjs', 'react'], description: 'Declarative component-driven UI library for web interfaces.' },
  { id: 'sk-nextjs', name: 'Next.js', slug: 'nextjs', category: 'Frontend', aliases: ['next', 'nextjs'], description: 'React framework for server-side rendering, static generation, and edge routing.' },
  { id: 'sk-tailwind', name: 'Tailwind CSS', slug: 'tailwind', category: 'Frontend', aliases: ['tailwindcss'], description: 'Utility-first CSS framework for rapid responsive user interface design.' },
  { id: 'sk-sys-design', name: 'System Design & Scalability', slug: 'system-design', category: 'Core CS', aliases: ['distributed-systems', 'architecture', 'scalability'], description: 'Designing distributed, fault-tolerant, horizontally scalable software systems.' },
  { id: 'sk-dsa', name: 'Data Structures & Algorithms', slug: 'dsa', category: 'Core CS', aliases: ['algorithms', 'data-structures', 'leetcode'], description: 'Algorithmic complexity, tree/graph traversal, dynamic programming, and search optimization.' },
  { id: 'sk-ml', name: 'Machine Learning & Scikit-Learn', slug: 'machine-learning', category: 'Data & AI', aliases: ['ml', 'scikit-learn', 'sklearn'], description: 'Supervised/unsupervised algorithms, feature engineering, and model evaluation.' },
  { id: 'sk-genai', name: 'Generative AI & LLMs', slug: 'genai', category: 'Data & AI', aliases: ['llm', 'rag', 'gemini-api', 'langchain'], description: 'Prompt engineering, RAG pipelines, fine-tuning, and LLM application development.' },
  { id: 'sk-sec', name: 'App Security & OAuth 2.0', slug: 'security', category: 'Security', aliases: ['cybersecurity', 'oauth', 'jwt', 'owasp'], description: 'JWT authentication, RBAC, input sanitation, OWASP top 10 prevention, and TLS.' },
  { id: 'sk-git', name: 'Git & Version Control', slug: 'git', category: 'Core CS', aliases: ['git', 'github', 'version-control'], description: 'Branching strategies, interactive rebase, pull request reviews, and merge conflict resolution.' },
  { id: 'sk-comm', name: 'Technical Communication & Collaboration', slug: 'communication', category: 'Soft Skills', aliases: ['soft-skills', 'teamwork', 'documentation'], description: 'Clear technical documentation, architectural decision records (ADRs), and cross-functional empathy.' }
];

export const STUDENT_INITIAL_PROFILE: StudentProfile = {
  userId: 'usr-student-1',
  studentId: 'APEX-2022-CSE-042',
  institutionId: 'inst-apex',
  institutionName: 'Apex Institute of Technology',
  branch: 'Computer Science & Engineering',
  degree: 'Bachelor of Technology (B.Tech)',
  graduationYear: 2026,
  cgpa: 8.85,
  bio: 'Driven Computer Science undergraduate focused on high-throughput backend services and cloud deployment. Winner of Smart India Hackathon 2024 (Runner Up).',
  targetRoles: ['Backend Engineer', 'Cloud & DevOps Engineer'],
  portfolioSlug: 'arjun-sharma-apex',
  isPublic: true,
  skills: [
    { skillId: 'sk-python', name: 'Python', proficiency: 86, level: 'Advanced', source: 'assessed', assessedAt: '2026-02-15', verified: true },
    { skillId: 'sk-nodejs', name: 'Node.js & Express', proficiency: 84, level: 'Advanced', source: 'assessed', assessedAt: '2026-02-15', verified: true },
    { skillId: 'sk-sql', name: 'SQL & Relational DBs', proficiency: 82, level: 'Advanced', source: 'assessed', assessedAt: '2026-02-10', verified: true },
    { skillId: 'sk-ts', name: 'TypeScript', proficiency: 78, level: 'Intermediate', source: 'assessed', assessedAt: '2026-01-20', verified: true },
    { skillId: 'sk-rest', name: 'RESTful API Architecture', proficiency: 85, level: 'Advanced', source: 'assessed', assessedAt: '2026-02-15', verified: true },
    { skillId: 'sk-git', name: 'Git & Version Control', proficiency: 90, level: 'Expert', source: 'verified', assessedAt: '2026-01-10', verified: true },
    { skillId: 'sk-docker', name: 'Docker & Containers', proficiency: 52, level: 'Beginner', source: 'self-reported', verified: false },
    { skillId: 'sk-aws', name: 'AWS Cloud Services', proficiency: 45, level: 'Beginner', source: 'self-reported', verified: false },
    { skillId: 'sk-dsa', name: 'Data Structures & Algorithms', proficiency: 80, level: 'Advanced', source: 'assessed', assessedAt: '2026-01-15', verified: true },
    { skillId: 'sk-react', name: 'React.js', proficiency: 70, level: 'Intermediate', source: 'self-reported', verified: true }
  ],
  githubUrl: 'https://github.com/arjunsharma-dev',
  linkedinUrl: 'https://linkedin.com/in/arjunsharma-cse',
  resumeUrl: '/documents/Arjun_Sharma_Backend_Resume.pdf',
  projects: [
    {
      id: 'proj-1',
      title: 'DistriCache: High Throughput Distributed In-Memory Store',
      description: 'Implemented a distributed key-value cache engine in Go and Python with Raft consensus, consistent hashing, and LRU eviction supporting 45k ops/sec.',
      technologies: ['Go (Golang)', 'Python', 'Docker', 'Distributed Systems'],
      githubRepo: 'https://github.com/arjunsharma-dev/districache',
      liveDemo: 'https://districache-demo.dev',
      featured: true
    },
    {
      id: 'proj-2',
      title: 'EduFlow Campus Portal & Realtime Notification Hub',
      description: 'Full stack academic event management platform serving 3,000+ students. Integrated WebSockets for live alerts and Redis for session throttling.',
      technologies: ['TypeScript', 'Node.js & Express', 'PostgreSQL', 'Redis'],
      githubRepo: 'https://github.com/arjunsharma-dev/eduflow-portal',
      featured: true
    },
    {
      id: 'proj-3',
      title: 'SmartResume: AI Parsing & Gap Scoring Engine',
      description: 'Constructed an automated resume information extraction pipeline using Gemini API and structured JSON schemas with semantic entity matching.',
      technologies: ['Python', 'FastAPI', 'Gemini API', 'React.js'],
      githubRepo: 'https://github.com/arjunsharma-dev/smart-resume',
      featured: false
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Meta Certified Professional Backend Developer',
      issuer: 'Meta & Coursera',
      issueDate: '2025-11-12',
      credentialId: 'META-BE-88914',
      credentialUrl: 'https://coursera.org/verify/META-BE-88914',
      verificationStatus: 'verified',
      verifiedBy: 'Apex Institute Verification Cell',
      verifiedAt: '2025-11-15'
    },
    {
      id: 'cert-2',
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      issueDate: '2026-01-05',
      credentialId: 'AWS-CCP-719302',
      credentialUrl: 'https://aws.amazon.com/verification/719302',
      verificationStatus: 'verified',
      verifiedBy: 'Apex Institute Verification Cell',
      verifiedAt: '2026-01-08'
    },
    {
      id: 'cert-3',
      title: 'Docker Certified Associate Preparatory Exam',
      issuer: 'Docker Community Academy',
      issueDate: '2026-02-01',
      credentialId: 'DCA-PREP-3312',
      verificationStatus: 'pending'
    }
  ],
  experiences: [
    {
      id: 'exp-1',
      title: 'Backend Engineering Intern',
      company: 'DataMesh Analytics',
      type: 'internship',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      current: false,
      description: 'Refactored reporting query pipeline in PostgreSQL reducing 95th percentile latency by 38%. Authored unit tests achieving 89% code coverage.'
    }
  ]
};

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'role-backend',
    name: 'Backend Engineer',
    category: 'Software Engineering',
    description: 'Builds secure, scalable server-side systems, database schemas, microservices, and reliable APIs.',
    averageSalary: '$85,000 - $135,000 / yr (₹14 - 24 LPA)',
    marketDemand: 'Very High',
    requiredSkills: [
      { skillId: 'sk-python', name: 'Python', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-nodejs', name: 'Node.js & Express', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-rest', name: 'RESTful API Architecture', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.15, importance: 'Mandatory' },
      { skillId: 'sk-docker', name: 'Docker & Containers', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.15, importance: 'Mandatory' },
      { skillId: 'sk-aws', name: 'AWS Cloud Services', minimumLevel: 'Intermediate', minimumProficiency: 65, weight: 0.10, importance: 'High' }
    ]
  },
  {
    id: 'role-cloud-devops',
    name: 'Cloud & DevOps Engineer',
    category: 'Infrastructure',
    description: 'Designs cloud infrastructure, automated CI/CD pipelines, container orchestration, and reliability monitoring.',
    averageSalary: '$90,000 - $145,000 / yr (₹16 - 28 LPA)',
    marketDemand: 'Very High',
    requiredSkills: [
      { skillId: 'sk-docker', name: 'Docker & Containers', minimumLevel: 'Advanced', minimumProficiency: 80, weight: 0.25, importance: 'Mandatory' },
      { skillId: 'sk-k8s', name: 'Kubernetes', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.25, importance: 'Mandatory' },
      { skillId: 'sk-aws', name: 'AWS Cloud Services', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-cicd', name: 'CI/CD Pipelines & GitHub Actions', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.15, importance: 'Mandatory' },
      { skillId: 'sk-python', name: 'Python', minimumLevel: 'Intermediate', minimumProficiency: 65, weight: 0.15, importance: 'High' }
    ]
  },
  {
    id: 'role-fullstack',
    name: 'Full Stack Engineer',
    category: 'Software Engineering',
    description: 'Bridges responsive user experiences with resilient APIs, databases, and continuous delivery.',
    averageSalary: '$80,000 - $130,000 / yr (₹12 - 22 LPA)',
    marketDemand: 'Very High',
    requiredSkills: [
      { skillId: 'sk-ts', name: 'TypeScript', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-react', name: 'React.js', minimumLevel: 'Advanced', minimumProficiency: 80, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-nodejs', name: 'Node.js & Express', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.15, importance: 'Mandatory' },
      { skillId: 'sk-tailwind', name: 'Tailwind CSS', minimumLevel: 'Intermediate', minimumProficiency: 65, weight: 0.15, importance: 'High' },
      { skillId: 'sk-docker', name: 'Docker & Containers', minimumLevel: 'Beginner', minimumProficiency: 50, weight: 0.10, importance: 'Nice-to-have' }
    ]
  },
  {
    id: 'role-ai-engineer',
    name: 'AI & Data Intelligence Engineer',
    category: 'Data & Artificial Intelligence',
    description: 'Implements production ML pipelines, RAG frameworks, LLM integrations, and vectorized data retrieval.',
    averageSalary: '$95,000 - $160,000 / yr (₹18 - 32 LPA)',
    marketDemand: 'Very High',
    requiredSkills: [
      { skillId: 'sk-python', name: 'Python', minimumLevel: 'Expert', minimumProficiency: 85, weight: 0.30, importance: 'Mandatory' },
      { skillId: 'sk-genai', name: 'Generative AI & LLMs', minimumLevel: 'Advanced', minimumProficiency: 75, weight: 0.25, importance: 'Mandatory' },
      { skillId: 'sk-ml', name: 'Machine Learning & Scikit-Learn', minimumLevel: 'Intermediate', minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', minimumLevel: 'Intermediate', minimumProficiency: 65, weight: 0.15, importance: 'High' },
      { skillId: 'sk-fastapi', name: 'FastAPI', minimumLevel: 'Intermediate', minimumProficiency: 65, weight: 0.10, importance: 'High' }
    ]
  }
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    industryId: 'org-novatech',
    companyName: 'Novatech Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    title: 'Cloud Backend Engineering Intern (Summer 2026)',
    roleId: 'role-backend',
    type: 'internship',
    description: 'Join Novatech’s Core Cloud Infrastructure team. You will work on distributed microservices handling 20,000+ RPS, optimize PostgreSQL query planners, and package services into Docker/Kubernetes clusters.',
    location: 'Bangalore, India (Hybrid)',
    workMode: 'hybrid',
    stipendOrSalary: '₹45,000 / month + Pre-Placement Offer (PPO)',
    duration: '6 Months (Jan - Jun 2026)',
    deadline: '2026-04-30',
    openings: 8,
    status: 'published',
    requiredSkills: [
      { skillId: 'sk-python', name: 'Python', requiredLevel: 'Advanced', requiredProficiency: 75, required: true },
      { skillId: 'sk-nodejs', name: 'Node.js & Express', requiredLevel: 'Intermediate', requiredProficiency: 70, required: true },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', requiredLevel: 'Intermediate', requiredProficiency: 70, required: true },
      { skillId: 'sk-docker', name: 'Docker & Containers', requiredLevel: 'Intermediate', requiredProficiency: 65, required: true }
    ],
    preferredSkills: ['AWS Cloud Services', 'Redis & Caching', 'Git & Version Control'],
    eligibility: {
      minCgpa: 7.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science'],
      allowedGradYears: [2026, 2027]
    },
    applicationQuestions: [
      'Briefly describe a database query optimization or concurrency challenge you solved.',
      'Provide links to your GitHub code samples demonstrating API development.'
    ],
    createdAt: '2026-02-01',
    applicantsCount: 34
  },
  {
    id: 'opp-2',
    industryId: 'org-cloudscale',
    companyName: 'CloudScale Networks',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=120&q=80',
    title: 'Junior DevOps & Site Reliability Engineer',
    roleId: 'role-cloud-devops',
    type: 'job',
    description: 'Full-time position for recent graduates. Build infrastructure-as-code with Terraform, configure resilient Kubernetes deployments, and enforce security policies with automated GitHub Actions.',
    location: 'Remote / Bangalore',
    workMode: 'remote',
    stipendOrSalary: '₹14.5 LPA - ₹18 LPA',
    duration: 'Full-Time Employment',
    deadline: '2026-05-15',
    openings: 4,
    status: 'published',
    requiredSkills: [
      { skillId: 'sk-docker', name: 'Docker & Containers', requiredLevel: 'Advanced', requiredProficiency: 75, required: true },
      { skillId: 'sk-k8s', name: 'Kubernetes', requiredLevel: 'Intermediate', requiredProficiency: 65, required: true },
      { skillId: 'sk-aws', name: 'AWS Cloud Services', requiredLevel: 'Intermediate', requiredProficiency: 70, required: true },
      { skillId: 'sk-cicd', name: 'CI/CD Pipelines & GitHub Actions', requiredLevel: 'Intermediate', requiredProficiency: 65, required: true }
    ],
    preferredSkills: ['Python', 'System Design & Scalability', 'App Security & OAuth 2.0'],
    eligibility: {
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Electronics & Communication', 'Information Technology'],
      allowedGradYears: [2025, 2026]
    },
    applicationQuestions: [
      'How have you implemented continuous integration or automated container testing in past projects?'
    ],
    createdAt: '2026-02-10',
    applicantsCount: 22
  },
  {
    id: 'opp-3',
    industryId: 'org-datamesh',
    companyName: 'DataMesh Intelligence',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    title: 'Applied Generative AI & RAG Systems Intern',
    roleId: 'role-ai-engineer',
    type: 'internship',
    description: 'Work with our research lab connecting large language models to enterprise knowledge graphs and vector databases. Benchmark prompt accuracy and build real-time AI agents.',
    location: 'Hyderabad, India (Hybrid)',
    workMode: 'hybrid',
    stipendOrSalary: '₹50,000 / month',
    duration: '4 Months',
    deadline: '2026-04-20',
    openings: 5,
    status: 'published',
    requiredSkills: [
      { skillId: 'sk-python', name: 'Python', requiredLevel: 'Advanced', requiredProficiency: 80, required: true },
      { skillId: 'sk-genai', name: 'Generative AI & LLMs', requiredLevel: 'Intermediate', requiredProficiency: 70, required: true },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', requiredLevel: 'Intermediate', requiredProficiency: 65, required: true }
    ],
    preferredSkills: ['FastAPI', 'Machine Learning & Scikit-Learn', 'Docker & Containers'],
    eligibility: {
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'AI & Data Science'],
      allowedGradYears: [2026, 2027]
    },
    createdAt: '2026-02-12',
    applicantsCount: 45
  },
  {
    id: 'opp-4',
    industryId: 'org-novatech',
    companyName: 'Novatech Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    title: 'Open Source Distributed Cache Live Project',
    roleId: 'role-backend',
    type: 'live_project',
    description: 'Industry mentored 8-week capstone project sponsored by Novatech. Selected student teams receive cloud credits, bi-weekly architecture reviews with senior staff engineers, and completion certificates.',
    location: 'Remote',
    workMode: 'remote',
    stipendOrSalary: '₹25,000 Project Completion Grant',
    duration: '8 Weeks',
    deadline: '2026-03-30',
    openings: 12,
    status: 'published',
    requiredSkills: [
      { skillId: 'sk-python', name: 'Python', requiredLevel: 'Intermediate', requiredProficiency: 65, required: true },
      { skillId: 'sk-sql', name: 'SQL & Relational DBs', requiredLevel: 'Intermediate', requiredProficiency: 60, required: true }
    ],
    preferredSkills: ['Redis & Caching', 'Docker & Containers'],
    eligibility: {
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science'],
      allowedGradYears: [2026, 2027, 2028]
    },
    createdAt: '2026-02-14',
    applicantsCount: 19
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    opportunityId: 'opp-1',
    opportunityTitle: 'Cloud Backend Engineering Intern (Summer 2026)',
    companyName: 'Novatech Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    studentId: 'usr-student-1',
    studentName: 'Arjun Sharma',
    studentEmail: 'student@demo.com',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    status: 'Shortlisted',
    appliedAt: '2026-02-05',
    resumeUrl: '/documents/Arjun_Sharma_Backend_Resume.pdf',
    coverNote: 'Excited about Novatech’s distributed storage infrastructure. My background in building Raft cache engines aligns strongly with your microservices stack.',
    matchScore: 88,
    events: [
      { id: 'evt-1', status: 'Applied', note: 'Application submitted successfully via SkillBridge portal.', createdAt: '2026-02-05', createdBy: 'Arjun Sharma' },
      { id: 'evt-2', status: 'Under Review', note: 'Profile verified against academic credentials by campus placement coordinator.', createdAt: '2026-02-08', createdBy: 'System Verification' },
      { id: 'evt-3', status: 'Shortlisted', note: 'High compatibility match on Python, SQL, and REST APIs. Advanced to Technical Round 1.', createdAt: '2026-02-14', createdBy: 'Sarah Jenkins (Recruiter)' }
    ],
    internalNotes: 'Strong algorithmic foundation (80% DSA). Needs slight upskilling on Docker containerization, but overall candidate rank is in top 5%.'
  },
  {
    id: 'app-102',
    opportunityId: 'opp-4',
    opportunityTitle: 'Open Source Distributed Cache Live Project',
    companyName: 'Novatech Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    studentId: 'usr-student-1',
    studentName: 'Arjun Sharma',
    studentEmail: 'student@demo.com',
    studentBranch: 'Computer Science & Engineering',
    studentCgpa: 8.85,
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    status: 'Interview',
    appliedAt: '2026-02-15',
    resumeUrl: '/documents/Arjun_Sharma_Backend_Resume.pdf',
    matchScore: 94,
    events: [
      { id: 'evt-11', status: 'Applied', note: 'Application registered for Live Industry Project Cohort.', createdAt: '2026-02-15', createdBy: 'Arjun Sharma' },
      { id: 'evt-12', status: 'Shortlisted', note: 'Selected for cohort interview based on DistriCache project demo.', createdAt: '2026-02-18', createdBy: 'Novatech Lab Mentors' },
      { id: 'evt-13', status: 'Interview', note: 'Technical discussion scheduled for Monday 10:00 AM.', createdAt: '2026-02-20', createdBy: 'Sarah Jenkins' }
    ],
    internalNotes: 'Candidate built a working Raft implementation on GitHub. High priority interview.'
  }
];

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'asmt-backend',
    title: 'Backend Engineering & API Design Assessment',
    category: 'Software Engineering',
    capability: 'Backend Engineering',
    durationMinutes: 20,
    description: 'Evaluate your practical competence in REST API contracts, database transaction isolation, error boundaries, and Node/Python backend patterns.',
    questionsCount: 5,
    skillsCovered: ['Python', 'Node.js & Express', 'SQL & Relational DBs', 'RESTful API Architecture'],
    questions: [
      {
        id: 'q-be-1',
        prompt: 'In a high-concurrency payment ledger, two requests attempt to debit the same wallet balance concurrently. Which database isolation level or locking mechanism prevents the lost update anomaly with minimum locking overhead?',
        skillId: 'sk-sql',
        skillName: 'SQL & Relational DBs',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Read Uncommitted with client-side polling', isCorrect: false, points: 0 },
          { id: 'opt-2', text: 'SELECT ... FOR UPDATE (Pessimistic locking) or Optimistic concurrency control with a version column', isCorrect: true, points: 100 },
          { id: 'opt-3', text: 'Table-level Exclusive LOCK before every write transaction', isCorrect: false, points: 20 },
          { id: 'opt-4', text: 'Store the balance in browser LocalStorage before syncing', isCorrect: false, points: 0 }
        ],
        explanation: 'SELECT FOR UPDATE locks the selected row during transaction execution, or optimistic locking checks version columns on commit to prevent race conditions without table locks.'
      },
      {
        id: 'q-be-2',
        prompt: 'When designing an idempotent RESTful payment initiation endpoint (e.g. POST /api/v1/payments), what is the industry best practice to prevent duplicate credit card charges if the client retries after a network drop?',
        skillId: 'sk-rest',
        skillName: 'RESTful API Architecture',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Require an Idempotency-Key header stored in Redis/DB with response caching for that key', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'Change the HTTP method from POST to GET', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'Disable client retry logic completely', isCorrect: false, points: 10 },
          { id: 'opt-4', text: 'Rely solely on IP address rate limiting', isCorrect: false, points: 25 }
        ],
        explanation: 'Idempotency keys ensure repeated requests within a time window return the cached initial transaction result rather than creating duplicates.'
      },
      {
        id: 'q-be-3',
        prompt: 'In Node.js event-driven architecture, what occurs if an Express route handler executes a synchronous CPU-bound loop computing 500,000 hash iterations on the main thread?',
        skillId: 'sk-nodejs',
        skillName: 'Node.js & Express',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Node.js automatically allocates a new OS process for each concurrent incoming request', isCorrect: false, points: 0 },
          { id: 'opt-2', text: 'It blocks the Node.js Event Loop, stalling all concurrent HTTP requests from being processed', isCorrect: true, points: 100 },
          { id: 'opt-3', text: 'It immediately throws an unhandled OutOfMemory exception', isCorrect: false, points: 20 },
          { id: 'opt-4', text: 'It spawns a GPU worker automatically', isCorrect: false, points: 0 }
        ],
        explanation: 'Node.js uses a single-threaded event loop for JavaScript execution. Heavy synchronous CPU tasks freeze the entire thread unless offloaded to Worker Threads or external job queues.'
      },
      {
        id: 'q-be-4',
        prompt: 'You are analyzing an unindexed SQL query: `SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;`. The table has 8,000,000 rows. What is the optimal composite index to satisfy this query with index-only scanning?',
        skillId: 'sk-sql',
        skillName: 'SQL & Relational DBs',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'CREATE INDEX idx_user_created ON orders (user_id, created_at DESC);', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'CREATE INDEX idx_orders_all ON orders (created_at, user_id);', isCorrect: false, points: 30 },
          { id: 'opt-3', text: 'CREATE INDEX idx_orders_pk ON orders (id);', isCorrect: false, points: 10 },
          { id: 'opt-4', text: 'No index is required because Postgres handles 8 million rows in RAM', isCorrect: false, points: 0 }
        ],
        explanation: 'A composite index on (user_id, created_at DESC) allows the query engine to filter user_id directly and traverse the pre-sorted B-tree in descending order without an in-memory sort.'
      },
      {
        id: 'q-be-5',
        prompt: 'In Python backend services, what is the key difference between using a generator (`yield`) versus returning a pre-built list for processing 10 GB of server log records?',
        skillId: 'sk-python',
        skillName: 'Python',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Generators stream one record at a time with O(1) memory footprint rather than allocating 10 GB in RAM', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'Generators compile Python code to C++ binary at runtime', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'Pre-built lists are always faster and consume less memory than generators', isCorrect: false, points: 0 },
          { id: 'opt-4', text: 'Generators bypass the Python Global Interpreter Lock (GIL)', isCorrect: false, points: 20 }
        ],
        explanation: 'Generators use lazy evaluation, producing items on-demand, which prevents memory exhaustion when working with massive streams.'
      }
    ]
  },
  {
    id: 'asmt-cloud-devops',
    title: 'Cloud Native & DevOps Assessment',
    category: 'Cloud & Infrastructure',
    capability: 'Cloud & DevOps',
    durationMinutes: 20,
    description: 'Assess skills in Docker containerization, multi-stage builds, Kubernetes pods & services, CI/CD pipelines, and AWS primitives.',
    questionsCount: 4,
    skillsCovered: ['Docker & Containers', 'Kubernetes', 'AWS Cloud Services', 'CI/CD Pipelines & GitHub Actions'],
    questions: [
      {
        id: 'q-cd-1',
        prompt: 'Why do production Dockerfiles for Node.js / Go utilize multi-stage builds (e.g. `FROM node:20 AS builder` followed by `FROM alpine:latest` or `distroless`)?',
        skillId: 'sk-docker',
        skillName: 'Docker & Containers',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'To strip build-time SDKs, compilers, and source files, yielding a lightweight, secure container image without unnecessary attack surface', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'To allow the container to run on both Windows and Linux simultaneously', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'To avoid writing Docker compose files', isCorrect: false, points: 10 },
          { id: 'opt-4', text: 'Multi-stage builds are purely cosmetic with identical final image sizes', isCorrect: false, points: 0 }
        ],
        explanation: 'Multi-stage builds allow separating the heavy build environment from the minimal runtime image, reducing image sizes from ~1GB down to ~50MB and eliminating security vulnerabilities.'
      },
      {
        id: 'q-cd-2',
        prompt: 'In Kubernetes, which resource type provides a stable internal IP address and DNS name that load-balances traffic across ephemeral replica pods matching a label selector?',
        skillId: 'sk-k8s',
        skillName: 'Kubernetes',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Service (ClusterIP / NodePort)', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'ConfigMap', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'PersistentVolumeClaim', isCorrect: false, points: 0 },
          { id: 'opt-4', text: 'DaemonSet', isCorrect: false, points: 20 }
        ],
        explanation: 'A Kubernetes Service abstracts away dynamic pod IP changes, providing a reliable virtual IP and DNS name that routes requests to active pods via kube-proxy / iptables.'
      },
      {
        id: 'q-cd-3',
        prompt: 'In AWS IAM, what is the principle of least privilege regarding S3 bucket access for an EC2 backend instance?',
        skillId: 'sk-aws',
        skillName: 'AWS Cloud Services',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Attach an IAM Role with an S3 policy restricted to the specific bucket ARN and specific actions (e.g., s3:GetObject, s3:PutObject)', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'Hardcode AWS_ACCESS_KEY_ID root credentials in git repository', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'Make the S3 bucket publicly readable and writable to simplify authentication', isCorrect: false, points: 0 },
          { id: 'opt-4', text: 'Grant AdministratorAccess policy to all instances', isCorrect: false, points: 0 }
        ],
        explanation: 'IAM Roles attached to EC2 instances deliver temporary, automatically rotated STS credentials without hardcoded keys, with scoped permissions to target ARNs only.'
      },
      {
        id: 'q-cd-4',
        prompt: 'In a GitHub Actions CI pipeline, what is the purpose of caching dependencies (e.g. actions/cache for node_modules or pip wheels) across runs?',
        skillId: 'sk-cicd',
        skillName: 'CI/CD Pipelines & GitHub Actions',
        type: 'mcq',
        options: [
          { id: 'opt-1', text: 'Substantially speeds up workflow execution time and reduces external network bandwidth by reusing unchanged packages', isCorrect: true, points: 100 },
          { id: 'opt-2', text: 'Prevents unit test failures from being detected', isCorrect: false, points: 0 },
          { id: 'opt-3', text: 'Ensures code changes are automatically merged without human review', isCorrect: false, points: 0 },
          { id: 'opt-4', text: 'Stores production database backups', isCorrect: false, points: 0 }
        ],
        explanation: 'Caching eliminates redundant package downloads on every commit when package-lock.json hash has not changed.'
      }
    ]
  }
];

export const LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: 'prog-1',
    companyOrInstitution: 'Novatech Systems & AWS Academy',
    providerType: 'Industry',
    title: 'Cloud-Native Microservices & Docker Masterclass',
    description: 'Hands-on 6-week intensive bootcamp designed by Novatech senior architects. Master multi-stage containerization, Docker Compose networking, Kubernetes deployment manifests, and production telemetry.',
    targetSkills: ['Docker & Containers', 'Kubernetes', 'AWS Cloud Services'],
    durationWeeks: 6,
    mode: 'Hybrid Bootcamp',
    level: 'Intermediate',
    deadline: '2026-04-15',
    capacity: 60,
    enrolledCount: 42,
    syllabusModules: [
      'Module 1: Docker Fundamentals & Daemon Architecture',
      'Module 2: Container Security & Multi-stage Optimizations',
      'Module 3: Orchestration with Docker Compose & Service Discovery',
      'Module 4: Introduction to Kubernetes Pods, ReplicaSets, and Deployments',
      'Module 5: Ingress Controllers & TLS Certificates',
      'Module 6: Capstone Project: Containerizing a 3-tier Microservices Platform'
    ],
    certificateProvided: true
  },
  {
    id: 'prog-2',
    companyOrInstitution: 'DataMesh AI Institute',
    providerType: 'Industry',
    title: 'Enterprise Generative AI & RAG Engineering',
    description: 'Learn how to build real-world AI applications using Gemini API, vector embeddings, chunking strategies, and hybrid semantic search with PostgreSQL pgvector.',
    targetSkills: ['Generative AI & LLMs', 'Python', 'FastAPI'],
    durationWeeks: 4,
    mode: 'Online Self-paced',
    level: 'Advanced',
    deadline: '2026-05-01',
    capacity: 100,
    enrolledCount: 78,
    syllabusModules: [
      'Module 1: Foundations of Large Language Models & Prompt Engineering',
      'Module 2: Vector Embeddings & Similarity Search',
      'Module 3: Retrieval-Augmented Generation (RAG) Architecture',
      'Module 4: Evaluation, Guardrails, and Production Deployment'
    ],
    certificateProvided: true
  },
  {
    id: 'prog-3',
    companyOrInstitution: 'Apex Institute Center of Excellence',
    providerType: 'Institution',
    title: 'Advanced System Design & High Concurrency Engineering',
    description: 'Taught by university faculty and industry visiting Fellows. Deep dive into distributed consensus, cache invalidation strategies, database partitioning, and rate limiters.',
    targetSkills: ['System Design & Scalability', 'SQL & Relational DBs', 'Redis & Caching'],
    durationWeeks: 8,
    mode: 'Instructor-led',
    level: 'Advanced',
    deadline: '2026-03-31',
    capacity: 45,
    enrolledCount: 39,
    syllabusModules: [
      'Module 1: Scalability Fundamentals & Vertical vs Horizontal Tradeoffs',
      'Module 2: Database Sharding, Replication, and CAP Theorem',
      'Module 3: Distributed Caching with Redis & Memcached',
      'Module 4: Message Queues & Event-Driven Systems (Kafka / RabbitMQ)',
      'Module 5: Designing a Distributed Rate Limiter & URL Shortener'
    ],
    certificateProvided: true
  }
];

export const FACULTY_OPPORTUNITIES: FacultyOpportunity[] = [
  {
    id: 'fac-1',
    type: 'Faculty Internship',
    title: 'Summer 2026 Industry Immersion Fellowship in Cloud Infrastructure',
    companyName: 'Novatech Systems',
    description: 'Faculty sabbatical program offering 8 weeks of embedded research within Novatech’s infrastructure engineering team. Gain firsthand experience with real cloud deployments to enrich university curricula.',
    stipendOrGrant: '₹1,20,000 Research Fellowship Grant',
    duration: '8 Weeks (Summer 2026)',
    location: 'Bangalore Innovation Lab',
    deadline: '2026-04-15',
    domain: 'Distributed Systems & Cloud Computing',
    status: 'Open'
  },
  {
    id: 'fac-2',
    type: 'Research Collaboration',
    title: 'Industry-Sponsored Grant: Fault-Tolerant AI Inference on Edge Nodes',
    companyName: 'DataMesh AI Labs',
    description: 'Joint R&D project funding university lab equipment and student researchers. Seeking academic lead investigators in computer architecture and model quantization.',
    stipendOrGrant: '₹8,50,000 R&D Seed Funding',
    duration: '12 Months',
    location: 'Apex Institute Lab & Remote',
    deadline: '2026-05-30',
    domain: 'Edge Computing & AI Quantization',
    status: 'Open'
  },
  {
    id: 'fac-3',
    type: 'FDP',
    title: 'National Faculty Development Program on Secure DevOps & Cloud Orchestration',
    companyName: 'AWS Academy & IEEE Computer Society',
    description: 'AICTE-recognized 5-day hands-on FDP for university professors and researchers. Covers automated cloud provisioning, container security, and teaching labs.',
    stipendOrGrant: 'Sponsored by Corporate CSR (Free Registration + Certificate)',
    duration: '5 Days (May 18 - 22, 2026)',
    location: 'Hybrid (Virtual + Apex Campus Center)',
    deadline: '2026-05-05',
    domain: 'DevOps & Cyber Security',
    status: 'Open'
  },
  {
    id: 'fac-4',
    type: 'Consultancy',
    title: 'Expert Technical Consultant: High-Throughput Database Sharding Review',
    companyName: 'FinTech Horizon Payments',
    description: 'Seeking academic faculty with specialized expertise in database transactions and ACID isolation to audit financial ledger architecture.',
    stipendOrGrant: '₹2,50,000 Retainer Fee',
    duration: '3 Months (Part-time / 10 hrs per month)',
    location: 'Remote / Virtual',
    deadline: '2026-04-10',
    domain: 'Database Systems & High Concurrency',
    status: 'Open'
  }
];

export const COLLABORATION_PROJECTS: CollaborationProject[] = [
  {
    id: 'collab-1',
    title: 'Smart Campus IoT Energy Optimization & Predictor',
    type: 'Live Project',
    industryPartner: 'Novatech Systems',
    institutionPartner: 'Apex Institute of Technology',
    description: 'Undergraduate student engineering team mentored by Novatech senior IoT architects to deploy energy sensors across university academic blocks and predict peak grid load.',
    status: 'Active',
    participantsCount: 16,
    milestones: [
      { id: 'm-1', title: 'Sensor Hardware Deployment & MQTT Broker Setup', dueDate: '2026-02-28', completed: true },
      { id: 'm-2', title: 'Telemetry Data Ingestion Pipeline & TimeSeries DB', dueDate: '2026-03-25', completed: true },
      { id: 'm-3', title: 'Predictive Load Forecasting Model in Python', dueDate: '2026-04-20', completed: false },
      { id: 'm-4', title: 'Final Review & Open Source Release', dueDate: '2026-05-15', completed: false }
    ],
    messagesCount: 28
  },
  {
    id: 'collab-2',
    title: 'SkillBridge National AI Hackathon: Academia to Industry 2026',
    type: 'Innovation Hackathon',
    industryPartner: 'Novatech, DataMesh & CloudScale',
    institutionPartner: 'Apex Institute Placement Cell',
    description: '48-hour inter-college hackathon focusing on student AI assistants, verifiable credentials, and intelligent talent matching algorithms.',
    status: 'Planning',
    participantsCount: 140,
    milestones: [
      { id: 'hm-1', title: 'Theme Announcement & Problem Statement Release', dueDate: '2026-03-01', completed: true },
      { id: 'hm-2', title: 'Student Team Registrations & Screening', dueDate: '2026-03-20', completed: false },
      { id: 'hm-3', title: 'Hackathon Weekend & Live Evaluation', dueDate: '2026-04-10', completed: false }
    ],
    messagesCount: 15
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-1',
    type: 'application',
    title: 'Application Shortlisted!',
    message: 'Novatech Systems moved your Cloud Backend Engineering Intern application to Shortlisted. Technical Round 1 details will arrive shortly.',
    createdAt: '2026-02-14T10:30:00Z',
    read: false,
    link: 'applications'
  },
  {
    id: 'notif-2',
    userId: 'usr-student-1',
    type: 'opportunity',
    title: 'High Match Opportunity Available (94% Match)',
    message: 'A new opening matches your verified Python and SQL skills: Open Source Distributed Cache Live Project at Novatech.',
    createdAt: '2026-02-14T14:15:00Z',
    read: false,
    link: 'opportunities'
  },
  {
    id: 'notif-3',
    userId: 'usr-student-1',
    type: 'verification',
    title: 'Credential Verified by Institution',
    message: 'Apex Institute Verification Cell approved and verified your AWS Certified Cloud Practitioner credential.',
    createdAt: '2026-01-08T09:00:00Z',
    read: true,
    link: 'portfolio'
  }
];

export const INSTITUTION_ANALYTICS: InstitutionAnalytics = {
  totalStudents: 4820,
  verifiedStudents: 4320,
  totalFaculty: 185,
  partnerCompanies: 64,
  activeOpportunities: 82,
  totalApplications: 1240,
  activeInternships: 612,
  placementsCount: 438,
  placementRate: 84.6,
  averageStipend: '₹38,500 / month',
  topSkillGaps: [
    { skill: 'Docker & Containers', demandPercent: 82, studentCoveragePercent: 38, gapScore: 44 },
    { skill: 'Kubernetes & Cloud Native', demandPercent: 68, studentCoveragePercent: 26, gapScore: 42 },
    { skill: 'Generative AI & RAG', demandPercent: 74, studentCoveragePercent: 35, gapScore: 39 },
    { skill: 'System Design & Scalability', demandPercent: 78, studentCoveragePercent: 42, gapScore: 36 },
    { skill: 'AWS Cloud Services', demandPercent: 80, studentCoveragePercent: 48, gapScore: 32 }
  ],
  departmentBreakdown: [
    { department: 'Computer Science & Engineering', studentsCount: 1800, placedCount: 220, avgReadiness: 81 },
    { department: 'AI & Data Science', studentsCount: 950, placedCount: 110, avgReadiness: 84 },
    { department: 'Information Technology', studentsCount: 1100, placedCount: 85, avgReadiness: 76 },
    { department: 'Electronics & Communication', studentsCount: 970, placedCount: 23, avgReadiness: 69 }
  ],
  skillDemandTrends: [
    { skill: 'Python', category: 'Languages', growthPercent: 42, openingsCount: 58 },
    { skill: 'Docker & Containers', category: 'DevOps', growthPercent: 68, openingsCount: 52 },
    { skill: 'SQL & Relational DBs', category: 'Backend', growthPercent: 28, openingsCount: 46 },
    { skill: 'TypeScript', category: 'Languages', growthPercent: 35, openingsCount: 41 },
    { skill: 'Generative AI & LLMs', category: 'AI', growthPercent: 112, openingsCount: 38 }
  ]
};

// Aliases for camelCase imports across the application
export const demoUsers = SEED_USERS;
export const initialStudentProfile = STUDENT_INITIAL_PROFILE;
export const initialOpportunities = OPPORTUNITIES;
export const initialApplications = INITIAL_APPLICATIONS;
export const initialAssessments = ASSESSMENTS;
export const initialLearningPrograms = LEARNING_PROGRAMS;
export const initialCollaborationProjects = COLLABORATION_PROJECTS;
export const initialFacultyOpportunities = FACULTY_OPPORTUNITIES;
export const initialCanonicalSkills = CANONICAL_SKILLS;
export const initialInstitutionAnalytics = INSTITUTION_ANALYTICS;
export const initialCareerRoles = CAREER_ROLES;
export const initialNotifications = INITIAL_NOTIFICATIONS;

