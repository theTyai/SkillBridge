import { PrismaClient, UserRole, SkillSource } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillBridge production seed...');

  // ─────────────────────────────────────────────────────
  // 1. CANONICAL SKILLS TAXONOMY (23 skills)
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding canonical skills...');

  const skillsData = [
    { name: 'Python', slug: 'python', category: 'Languages', aliases: ['py', 'python3'], description: 'High-level programming language widely used in backend, data, and AI.' },
    { name: 'TypeScript', slug: 'typescript', category: 'Languages', aliases: ['ts', 'typescript'], description: 'Typed superset of JavaScript that compiles to plain JavaScript.' },
    { name: 'JavaScript', slug: 'javascript', category: 'Languages', aliases: ['js', 'ecmascript', 'es6'], description: 'The standard scripting language of the web.' },
    { name: 'Java', slug: 'java', category: 'Languages', aliases: ['jvm', 'java17', 'java21'], description: 'Object-oriented programming language for enterprise backend systems.' },
    { name: 'Go (Golang)', slug: 'go', category: 'Languages', aliases: ['golang', 'go-lang'], description: 'Fast, statically typed compiled language designed for concurrency and cloud services.' },
    { name: 'SQL & Relational DBs', slug: 'sql', category: 'Backend', aliases: ['sql', 'postgres', 'postgresql', 'mysql'], description: 'Database querying, normalization, indexing, and transactional integrity.' },
    { name: 'Node.js & Express', slug: 'nodejs', category: 'Backend', aliases: ['node', 'nodejs', 'expressjs'], description: 'Asynchronous event-driven JavaScript runtime for server-side APIs.' },
    { name: 'FastAPI', slug: 'fastapi', category: 'Backend', aliases: ['fastapi', 'python-fastapi'], description: 'Modern, fast web framework for building APIs with Python based on standard type hints.' },
    { name: 'RESTful API Architecture', slug: 'rest-apis', category: 'Backend', aliases: ['rest', 'restful', 'api-design'], description: 'Contract design, HTTP verbs, status codes, pagination, and API security.' },
    { name: 'Redis & Caching', slug: 'redis', category: 'Backend', aliases: ['redis', 'in-memory-cache'], description: 'In-memory key-value store, distributed caching, pub/sub, and rate limiting.' },
    { name: 'Docker & Containers', slug: 'docker', category: 'Cloud & DevOps', aliases: ['docker', 'containerization', 'containers'], description: 'Packaging applications and dependencies into standardized containers.' },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'kube', 'kubernetes'], description: 'Automated container deployment, scaling, and operational management.' },
    { name: 'AWS Cloud Services', slug: 'aws', category: 'Cloud & DevOps', aliases: ['amazon-web-services', 'aws-cloud', 'ec2', 's3'], description: 'Cloud infrastructure including EC2, S3, RDS, Lambda, and IAM security.' },
    { name: 'CI/CD Pipelines & GitHub Actions', slug: 'ci-cd', category: 'Cloud & DevOps', aliases: ['github-actions', 'jenkins', 'devops-pipelines'], description: 'Automated build, test, and zero-downtime deployment pipelines.' },
    { name: 'React.js', slug: 'react', category: 'Frontend', aliases: ['reactjs', 'react'], description: 'Declarative component-driven UI library for web interfaces.' },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend', aliases: ['next', 'nextjs'], description: 'React framework for server-side rendering, static generation, and edge routing.' },
    { name: 'Tailwind CSS', slug: 'tailwind', category: 'Frontend', aliases: ['tailwindcss'], description: 'Utility-first CSS framework for rapid responsive user interface design.' },
    { name: 'System Design & Scalability', slug: 'system-design', category: 'Core CS', aliases: ['distributed-systems', 'architecture', 'scalability'], description: 'Designing distributed, fault-tolerant, horizontally scalable software systems.' },
    { name: 'Data Structures & Algorithms', slug: 'dsa', category: 'Core CS', aliases: ['algorithms', 'data-structures', 'leetcode'], description: 'Algorithmic complexity, tree/graph traversal, dynamic programming, and search optimization.' },
    { name: 'Machine Learning & Scikit-Learn', slug: 'machine-learning', category: 'Data & AI', aliases: ['ml', 'scikit-learn', 'sklearn'], description: 'Supervised/unsupervised algorithms, feature engineering, and model evaluation.' },
    { name: 'Generative AI & LLMs', slug: 'genai', category: 'Data & AI', aliases: ['llm', 'rag', 'gemini-api', 'langchain'], description: 'Prompt engineering, RAG pipelines, fine-tuning, and LLM application development.' },
    { name: 'App Security & OAuth 2.0', slug: 'security', category: 'Security', aliases: ['cybersecurity', 'oauth', 'jwt', 'owasp'], description: 'JWT authentication, RBAC, input sanitation, OWASP top 10 prevention, and TLS.' },
    { name: 'Git & Version Control', slug: 'git', category: 'Core CS', aliases: ['git', 'github', 'version-control'], description: 'Branching strategies, interactive rebase, pull request reviews, and merge conflict resolution.' },
    { name: 'Technical Communication & Collaboration', slug: 'communication', category: 'Soft Skills', aliases: ['soft-skills', 'teamwork', 'documentation'], description: 'Clear technical documentation, architectural decision records (ADRs), and cross-functional empathy.' },
  ];

  const skills = await Promise.all(
    skillsData.map((skill) =>
      db.canonicalSkill.upsert({
        where: { slug: skill.slug },
        update: {},
        create: skill,
      })
    )
  );

  const skillMap = new Map(skills.map((s) => [s.slug, s]));
  console.log(`  ✓ ${skills.length} canonical skills seeded`);

  // ─────────────────────────────────────────────────────
  // 2. CAREER ROLES (4 roles)
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding career roles...');

  const backendRole = await db.careerRole.upsert({
    where: { slug: 'backend-engineer' },
    update: {},
    create: {
      name: 'Backend Engineer',
      slug: 'backend-engineer',
      category: 'Software Engineering',
      description: 'Builds secure, scalable server-side systems, database schemas, microservices, and reliable APIs.',
      averageSalary: '$85,000 - $135,000 / yr (₹14 - 24 LPA)',
      marketDemand: 'Very High',
      skills: {
        create: [
          { canonicalSkillId: skillMap.get('python')!.id, minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('nodejs')!.id, minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('sql')!.id, minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('rest-apis')!.id, minimumProficiency: 75, weight: 0.15, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('docker')!.id, minimumProficiency: 70, weight: 0.15, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('aws')!.id, minimumProficiency: 65, weight: 0.10, importance: 'High' },
        ],
      },
    },
  });

  const devopsRole = await db.careerRole.upsert({
    where: { slug: 'cloud-devops-engineer' },
    update: {},
    create: {
      name: 'Cloud & DevOps Engineer',
      slug: 'cloud-devops-engineer',
      category: 'Infrastructure',
      description: 'Designs cloud infrastructure, automated CI/CD pipelines, container orchestration, and reliability monitoring.',
      averageSalary: '$90,000 - $145,000 / yr (₹16 - 28 LPA)',
      marketDemand: 'Very High',
      skills: {
        create: [
          { canonicalSkillId: skillMap.get('docker')!.id, minimumProficiency: 80, weight: 0.25, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('kubernetes')!.id, minimumProficiency: 70, weight: 0.25, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('aws')!.id, minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('ci-cd')!.id, minimumProficiency: 75, weight: 0.15, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('python')!.id, minimumProficiency: 65, weight: 0.15, importance: 'High' },
        ],
      },
    },
  });

  const fullstackRole = await db.careerRole.upsert({
    where: { slug: 'full-stack-engineer' },
    update: {},
    create: {
      name: 'Full Stack Engineer',
      slug: 'full-stack-engineer',
      category: 'Software Engineering',
      description: 'Bridges responsive user experiences with resilient APIs, databases, and continuous delivery.',
      averageSalary: '$80,000 - $130,000 / yr (₹12 - 22 LPA)',
      marketDemand: 'Very High',
      skills: {
        create: [
          { canonicalSkillId: skillMap.get('typescript')!.id, minimumProficiency: 75, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('react')!.id, minimumProficiency: 80, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('nodejs')!.id, minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('sql')!.id, minimumProficiency: 70, weight: 0.15, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('tailwind')!.id, minimumProficiency: 65, weight: 0.15, importance: 'High' },
          { canonicalSkillId: skillMap.get('docker')!.id, minimumProficiency: 50, weight: 0.10, importance: 'Nice-to-have' },
        ],
      },
    },
  });

  const aiRole = await db.careerRole.upsert({
    where: { slug: 'ai-data-engineer' },
    update: {},
    create: {
      name: 'AI & Data Intelligence Engineer',
      slug: 'ai-data-engineer',
      category: 'Data & Artificial Intelligence',
      description: 'Implements production ML pipelines, RAG frameworks, LLM integrations, and vectorized data retrieval.',
      averageSalary: '$95,000 - $160,000 / yr (₹18 - 32 LPA)',
      marketDemand: 'Very High',
      skills: {
        create: [
          { canonicalSkillId: skillMap.get('python')!.id, minimumProficiency: 85, weight: 0.30, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('genai')!.id, minimumProficiency: 75, weight: 0.25, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('machine-learning')!.id, minimumProficiency: 70, weight: 0.20, importance: 'Mandatory' },
          { canonicalSkillId: skillMap.get('sql')!.id, minimumProficiency: 65, weight: 0.15, importance: 'High' },
          { canonicalSkillId: skillMap.get('fastapi')!.id, minimumProficiency: 65, weight: 0.10, importance: 'High' },
        ],
      },
    },
  });

  console.log('  ✓ 4 career roles seeded');

  // ─────────────────────────────────────────────────────
  // 3. DEMO INSTITUTION
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding demo institution...');

  const institution = await db.institution.upsert({
    where: { domain: 'apextech.edu.in' },
    update: {},
    create: {
      name: 'Apex Institute of Technology',
      domain: 'apextech.edu.in',
      accreditationCode: 'AICTE-AIT-2002',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      website: 'https://apextech.edu.in',
    },
  });

  const cseDept = await db.department.upsert({
    where: { institutionId_code: { institutionId: institution.id, code: 'CSE' } },
    update: {},
    create: {
      institutionId: institution.id,
      name: 'Computer Science & Engineering',
      code: 'CSE',
    },
  });

  console.log('  ✓ Demo institution and CSE department seeded');

  // ─────────────────────────────────────────────────────
  // 4. DEMO INDUSTRY ORGANIZATIONS
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding demo organizations...');

  const novatech = await db.industryOrganization.upsert({
    where: { domain: 'novatech.io' },
    update: {},
    create: {
      name: 'Novatech Systems',
      domain: 'novatech.io',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      sector: 'Cloud Infrastructure',
      size: '201-500',
      website: 'https://novatech.io',
      verified: true,
    },
  });

  const cloudscale = await db.industryOrganization.upsert({
    where: { domain: 'cloudscale.net' },
    update: {},
    create: {
      name: 'CloudScale Networks',
      domain: 'cloudscale.net',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=120&q=80',
      sector: 'Networking & Cloud',
      size: '51-200',
      verified: true,
    },
  });

  const datamesh = await db.industryOrganization.upsert({
    where: { domain: 'datamesh.ai' },
    update: {},
    create: {
      name: 'DataMesh Intelligence',
      domain: 'datamesh.ai',
      logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
      sector: 'Data & AI',
      size: '51-200',
      verified: true,
    },
  });

  console.log('  ✓ 3 demo organizations seeded');

  // ─────────────────────────────────────────────────────
  // 5. DEMO OPPORTUNITIES
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding demo opportunities...');

  await db.opportunity.upsert({
    where: { id: 'opp-demo-1' },
    update: {},
    create: {
      id: 'opp-demo-1',
      organizationId: novatech.id,
      roleId: backendRole.id,
      title: 'Cloud Backend Engineering Intern (Summer 2026)',
      type: 'INTERNSHIP',
      description: 'Join Novatech\'s Core Cloud Infrastructure team. You will work on distributed microservices handling 20,000+ RPS, optimize PostgreSQL query planners, and package services into Docker/Kubernetes clusters.',
      location: 'Bangalore, India (Hybrid)',
      workMode: 'HYBRID',
      stipendOrSalary: '₹45,000 / month + Pre-Placement Offer (PPO)',
      duration: '6 Months (Jan - Jun 2026)',
      deadline: new Date('2026-04-30'),
      openings: 8,
      status: 'PUBLISHED',
      minCgpa: 7.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science'],
      allowedGradYears: [2026, 2027],
      applicationQuestions: [
        'Briefly describe a database query optimization or concurrency challenge you solved.',
        'Provide links to your GitHub code samples demonstrating API development.',
      ],
      publishedAt: new Date('2026-02-01'),
      requiredSkills: {
        create: [
          { canonicalSkillId: skillMap.get('python')!.id, requiredProficiency: 75, required: true },
          { canonicalSkillId: skillMap.get('nodejs')!.id, requiredProficiency: 70, required: true },
          { canonicalSkillId: skillMap.get('sql')!.id, requiredProficiency: 70, required: true },
          { canonicalSkillId: skillMap.get('docker')!.id, requiredProficiency: 65, required: true },
        ],
      },
    },
  });

  await db.opportunity.upsert({
    where: { id: 'opp-demo-2' },
    update: {},
    create: {
      id: 'opp-demo-2',
      organizationId: cloudscale.id,
      roleId: devopsRole.id,
      title: 'Junior DevOps & Site Reliability Engineer',
      type: 'JOB',
      description: 'Full-time position for recent graduates. Build infrastructure-as-code with Terraform, configure resilient Kubernetes deployments, and enforce security policies with automated GitHub Actions.',
      location: 'Remote / Bangalore',
      workMode: 'REMOTE',
      stipendOrSalary: '₹14.5 LPA - ₹18 LPA',
      duration: 'Full-Time Employment',
      deadline: new Date('2026-05-15'),
      openings: 4,
      status: 'PUBLISHED',
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Electronics & Communication', 'Information Technology'],
      allowedGradYears: [2025, 2026],
      applicationQuestions: [
        'How have you implemented continuous integration or automated container testing in past projects?',
      ],
      publishedAt: new Date('2026-02-10'),
      requiredSkills: {
        create: [
          { canonicalSkillId: skillMap.get('docker')!.id, requiredProficiency: 75, required: true },
          { canonicalSkillId: skillMap.get('kubernetes')!.id, requiredProficiency: 65, required: true },
          { canonicalSkillId: skillMap.get('aws')!.id, requiredProficiency: 70, required: true },
          { canonicalSkillId: skillMap.get('ci-cd')!.id, requiredProficiency: 65, required: true },
        ],
      },
    },
  });

  await db.opportunity.upsert({
    where: { id: 'opp-demo-3' },
    update: {},
    create: {
      id: 'opp-demo-3',
      organizationId: datamesh.id,
      roleId: aiRole.id,
      title: 'Applied Generative AI & RAG Systems Intern',
      type: 'INTERNSHIP',
      description: 'Work with our research lab connecting large language models to enterprise knowledge graphs and vector databases. Benchmark prompt accuracy and build real-time AI agents.',
      location: 'Hyderabad, India (Hybrid)',
      workMode: 'HYBRID',
      stipendOrSalary: '₹50,000 / month',
      duration: '4 Months',
      deadline: new Date('2026-04-20'),
      openings: 5,
      status: 'PUBLISHED',
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'AI & Data Science'],
      allowedGradYears: [2026, 2027],
      publishedAt: new Date('2026-02-12'),
      requiredSkills: {
        create: [
          { canonicalSkillId: skillMap.get('python')!.id, requiredProficiency: 80, required: true },
          { canonicalSkillId: skillMap.get('genai')!.id, requiredProficiency: 70, required: true },
          { canonicalSkillId: skillMap.get('sql')!.id, requiredProficiency: 65, required: true },
        ],
      },
    },
  });

  await db.opportunity.upsert({
    where: { id: 'opp-demo-4' },
    update: {},
    create: {
      id: 'opp-demo-4',
      organizationId: novatech.id,
      roleId: backendRole.id,
      title: 'Open Source Distributed Cache Live Project',
      type: 'LIVE_PROJECT',
      description: 'Industry mentored 8-week capstone project sponsored by Novatech. Selected student teams receive cloud credits, bi-weekly architecture reviews with senior staff engineers, and completion certificates.',
      location: 'Remote',
      workMode: 'REMOTE',
      stipendOrSalary: '₹25,000 Project Completion Grant',
      duration: '8 Weeks',
      deadline: new Date('2026-03-30'),
      openings: 12,
      status: 'PUBLISHED',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science'],
      allowedGradYears: [2026, 2027, 2028],
      publishedAt: new Date('2026-02-14'),
      requiredSkills: {
        create: [
          { canonicalSkillId: skillMap.get('python')!.id, requiredProficiency: 65, required: true },
          { canonicalSkillId: skillMap.get('sql')!.id, requiredProficiency: 60, required: true },
        ],
      },
    },
  });

  console.log('  ✓ 4 demo opportunities seeded');

  // ─────────────────────────────────────────────────────
  // 6. DEMO COLLABORATION PROJECTS
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding demo collaboration projects...');

  await db.collaborationProject.upsert({
    where: { id: 'collab-demo-1' },
    update: {},
    create: {
      id: 'collab-demo-1',
      institutionId: institution.id,
      organizationId: novatech.id,
      title: 'Smart Grid Edge Intelligence Research Initiative',
      type: 'Industry Research',
      description: 'A joint 5-month research partnership on ML-driven predictive load balancing for smart power grids using real-time edge IoT data streams.',
      status: 'ACTIVE',
      participantsCount: 12,
      milestones: {
        create: [
          { title: 'Sensor Hardware Deployment & MQTT Broker Setup', dueDate: new Date('2026-02-28'), completed: true, sortOrder: 1 },
          { title: 'Telemetry Data Ingestion Pipeline & TimeSeries DB', dueDate: new Date('2026-03-25'), completed: true, sortOrder: 2 },
          { title: 'Predictive Load Forecasting Model in Python', dueDate: new Date('2026-04-20'), completed: false, sortOrder: 3 },
          { title: 'Final Review & Open Source Release', dueDate: new Date('2026-05-15'), completed: false, sortOrder: 4 },
        ],
      },
    },
  });

  await db.collaborationProject.upsert({
    where: { id: 'collab-demo-2' },
    update: {},
    create: {
      id: 'collab-demo-2',
      institutionId: institution.id,
      organizationId: datamesh.id,
      title: 'Open DataMesh Student Innovation Hackathon 2026',
      type: 'Innovation Hackathon',
      description: 'A 48-hour hackathon focused on real-world generative AI applications in healthcare, fintech, and logistics. Open to all branches.',
      status: 'PLANNING',
      participantsCount: 0,
      milestones: {
        create: [
          { title: 'Theme Announcement & Problem Statement Release', dueDate: new Date('2026-03-01'), completed: true, sortOrder: 1 },
          { title: 'Student Team Registrations & Screening', dueDate: new Date('2026-03-20'), completed: false, sortOrder: 2 },
          { title: 'Hackathon Weekend & Live Evaluation', dueDate: new Date('2026-04-10'), completed: false, sortOrder: 3 },
        ],
      },
    },
  });

  console.log('  ✓ 2 demo collaboration projects seeded');

  // ─────────────────────────────────────────────────────
  // 7. LEARNING PROGRAMS
  // ─────────────────────────────────────────────────────
  console.log('  → Seeding learning programs...');

  await db.learningProgram.upsert({
    where: { id: 'prog-demo-1' },
    update: {},
    create: {
      id: 'prog-demo-1',
      organizationId: novatech.id,
      providerType: 'Industry',
      title: 'Novatech Cloud-Native Microservices & Docker Masterclass',
      description: 'Hands-on 6-week intensive covering production-grade Docker containerization, Kubernetes orchestration, and cloud-native API design patterns used in real Novatech infrastructure.',
      targetSkills: ['Docker & Containers', 'Kubernetes', 'RESTful API Architecture'],
      durationWeeks: 6,
      mode: 'Instructor-led',
      level: 'Intermediate',
      deadline: new Date('2026-03-15'),
      capacity: 50,
      certificateProvided: true,
      syllabusModules: [
        'Module 1: Docker Fundamentals & Multi-Stage Builds',
        'Module 2: Docker Compose & Local Orchestration',
        'Module 3: Kubernetes Deployments, Services, and Ingress',
        'Module 4: Helm Charts & Configuration Management',
        'Module 5: CI/CD Integration with GitHub Actions',
        'Module 6: Capstone — Deploy a Production Microservice',
      ],
    },
  });

  await db.learningProgram.upsert({
    where: { id: 'prog-demo-2' },
    update: {},
    create: {
      id: 'prog-demo-2',
      organizationId: datamesh.id,
      providerType: 'Industry',
      title: 'Generative AI & RAG Engineering Bootcamp',
      description: 'Intensive 4-week program on production LLM integration, vector database indexing, RAG pipeline architecture, and Gemini API application development.',
      targetSkills: ['Generative AI & LLMs', 'Python', 'Machine Learning & Scikit-Learn'],
      durationWeeks: 4,
      mode: 'Hybrid Bootcamp',
      level: 'Advanced',
      deadline: new Date('2026-04-01'),
      capacity: 30,
      certificateProvided: true,
      syllabusModules: [
        'Module 1: LLM Fundamentals & Prompt Engineering',
        'Module 2: Embeddings, Vector Stores & Retrieval',
        'Module 3: Building RAG Pipelines with LangChain',
        'Module 4: Deploying AI APIs with FastAPI',
      ],
    },
  });

  await db.learningProgram.upsert({
    where: { id: 'prog-demo-3' },
    update: {},
    create: {
      id: 'prog-demo-3',
      institutionId: institution.id,
      providerType: 'Institution',
      title: 'Apex DSA Competitive Programming Bootcamp',
      description: '8-week structured competitive programming program covering core algorithm patterns, graph theory, dynamic programming, and segment trees for placement preparation.',
      targetSkills: ['Data Structures & Algorithms', 'Python', 'Java'],
      durationWeeks: 8,
      mode: 'Instructor-led',
      level: 'Intermediate',
      deadline: new Date('2026-05-01'),
      capacity: 100,
      certificateProvided: true,
      syllabusModules: [
        'Week 1: Arrays, Strings & Two Pointers',
        'Week 2: Linked Lists, Stacks & Queues',
        'Week 3: Binary Search & Sorting',
        'Week 4: Trees, BSTs & Traversals',
        'Week 5: Graphs — BFS, DFS & Shortest Paths',
        'Week 6: Dynamic Programming Fundamentals',
        'Week 7: Advanced DP & Greedy Algorithms',
        'Week 8: Mock Assessments & Placement Simulation',
      ],
    },
  });

  console.log('  ✓ 3 learning programs seeded');

  console.log('\n✅ SkillBridge seed complete!');
  console.log('   Note: User accounts are created via Supabase Auth + registration flow.');
  console.log('   This seed provides the platform-level reference data only.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
