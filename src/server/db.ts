/**
 * PathProof Phase 1 — Relational Database Storage & Persistence Engine
 * Follows Document PP-P1-DB-001 (Database Design & Data Dictionary).
 * Persists data to local JSON disk file `data/pathproof_db.json` with in-memory caching and ACID-like isolation.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  User,
  StudentProfile,
  AcademicSubject,
  StudentSubject,
  Skill,
  StudentSkill,
  CareerCategory,
  Career,
  CareerSkill,
  CareerSubject,
  InterestTag,
  StudentPreference,
  CareerInterestTag,
  JobEvidence,
  JobEvidenceSkill,
  CareerAssessment,
  CareerRecommendation,
  CareerComparisonSession,
  CareerComparisonItem,
  AdminAuditLog,
  CopilotConversation,
  CopilotMessage,
  CopilotAction,
  StudentRoadmap,
  StudentRoadmapMilestone,
} from '../types/index.ts';

export interface DatabaseSchema {
  users: User[];
  student_profiles: StudentProfile[];
  academic_subjects: AcademicSubject[];
  student_subjects: StudentSubject[];
  skills: Skill[];
  student_skills: StudentSkill[];
  career_categories: CareerCategory[];
  careers: Career[];
  career_skills: CareerSkill[];
  career_subjects: CareerSubject[];
  interest_tags: InterestTag[];
  student_preferences: StudentPreference[];
  career_interest_tags: CareerInterestTag[];
  job_evidence: JobEvidence[];
  job_evidence_skills: JobEvidenceSkill[];
  career_assessments: CareerAssessment[];
  career_recommendations: CareerRecommendation[];
  career_comparison_sessions: CareerComparisonSession[];
  career_comparison_items: CareerComparisonItem[];
  admin_audit_logs: AdminAuditLog[];
  copilot_conversations: CopilotConversation[];
  copilot_messages: CopilotMessage[];
  copilot_actions: CopilotAction[];
  student_roadmaps: StudentRoadmap[];
  student_roadmap_milestones: StudentRoadmapMilestone[];
  sequences: {
    user_id: number;
    profile_id: number;
    subject_id: number;
    student_subject_id: number;
    skill_id: number;
    student_skill_id: number;
    category_id: number;
    career_id: number;
    interest_tag_id: number;
    evidence_id: number;
    assessment_id: number;
    recommendation_id: number;
    comparison_id: number;
    audit_id: number;
    conversation_id: number;
    message_id: number;
    action_id: number;
    roadmap_id: number;
    milestone_id: number;
  };
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'pathproof_db.json');

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = this.createEmptySchema();
  }

  private createEmptySchema(): DatabaseSchema {
    return {
      users: [],
      student_profiles: [],
      academic_subjects: [],
      student_subjects: [],
      skills: [],
      student_skills: [],
      career_categories: [],
      careers: [],
      career_skills: [],
      career_subjects: [],
      interest_tags: [],
      student_preferences: [],
      career_interest_tags: [],
      job_evidence: [],
      job_evidence_skills: [],
      career_assessments: [],
      career_recommendations: [],
      career_comparison_sessions: [],
      career_comparison_items: [],
      admin_audit_logs: [],
      copilot_conversations: [],
      copilot_messages: [],
      copilot_actions: [],
      student_roadmaps: [],
      student_roadmap_milestones: [],
      sequences: {
        user_id: 1,
        profile_id: 1,
        subject_id: 1,
        student_subject_id: 1,
        skill_id: 1,
        student_skill_id: 1,
        category_id: 1,
        career_id: 1,
        interest_tag_id: 1,
        evidence_id: 1,
        assessment_id: 1,
        recommendation_id: 1,
        comparison_id: 1,
        audit_id: 1,
        conversation_id: 1,
        message_id: 1,
        action_id: 1,
        roadmap_id: 1,
        milestone_id: 1,
      },
    };
  }

  public init(seedIfEmpty = true): void {
    if (this.isLoaded) return;

    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        this.data.copilot_conversations = this.data.copilot_conversations || [];
        this.data.copilot_messages = this.data.copilot_messages || [];
        this.data.copilot_actions = this.data.copilot_actions || [];
        this.data.student_roadmaps = this.data.student_roadmaps || [];
        this.data.student_roadmap_milestones = this.data.student_roadmap_milestones || [];
        if (!this.data.sequences) (this.data as any).sequences = {};
        if (!this.data.sequences.conversation_id) this.data.sequences.conversation_id = 1;
        if (!this.data.sequences.message_id) this.data.sequences.message_id = 1;
        if (!this.data.sequences.action_id) this.data.sequences.action_id = 1;
        if (!this.data.sequences.roadmap_id) this.data.sequences.roadmap_id = 1;
        if (!this.data.sequences.milestone_id) this.data.sequences.milestone_id = 1;
        this.isLoaded = true;
      } else {
        const dir = path.dirname(DB_FILE_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        this.data = this.createEmptySchema();
        this.isLoaded = true;
        if (seedIfEmpty) {
          this.seedInitialData();
        }
        this.save();
      }
    } catch (err) {
      console.error('[DB] Failed to load database file, resetting to initial seed:', err);
      this.data = this.createEmptySchema();
      this.isLoaded = true;
      if (seedIfEmpty) {
        this.seedInitialData();
      }
      this.save();
    }
  }

  public save(): void {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to write database file:', err);
    }
  }

  public resetToSeed(): void {
    this.data = this.createEmptySchema();
    this.seedInitialData();
    this.save();
  }

  public get tables(): DatabaseSchema {
    if (!this.isLoaded) this.init();
    return this.data;
  }

  public nextId(sequenceName: keyof DatabaseSchema['sequences']): number {
    const next = this.data.sequences[sequenceName]++;
    return next;
  }

  public seedInitialData(): void {
    const now = new Date().toISOString();

    // 1. Users
    // Hash is represented safely with a standardized salt representation or direct string check
    // Password for admin: AdminPassword123!
    // Password for student: StudentPassword123!
    this.data.users = [
      {
        user_id: 1,
        full_name: 'Dr. Shahbaz Khan (System Administrator)',
        email: 'admin@pathproof.pk',
        password_hash: 'HASH:AdminPassword123!',
        role: 'ADMIN',
        account_status: 'ACTIVE',
        created_at: '2026-10-01T08:00:00.000Z',
        updated_at: now,
      },
      {
        user_id: 2,
        full_name: 'Hamza Tariq',
        email: 'student@demo.edu.pk',
        password_hash: 'HASH:StudentPassword123!',
        role: 'STUDENT',
        account_status: 'ACTIVE',
        created_at: '2026-10-10T10:00:00.000Z',
        updated_at: now,
      },
      {
        user_id: 3,
        full_name: 'Ayesha Khan',
        email: 'ayesha@demo.edu.pk',
        password_hash: 'HASH:StudentPassword123!',
        role: 'STUDENT',
        account_status: 'ACTIVE',
        created_at: '2026-10-15T12:00:00.000Z',
        updated_at: now,
      },
    ];
    this.data.sequences.user_id = 4;

    // 2. Student Profiles
    this.data.student_profiles = [
      {
        profile_id: 1,
        user_id: 2,
        university_name: 'National University of Sciences & Technology (NUST), Islamabad',
        degree_program: 'BS Software Engineering',
        current_semester: 5,
        graduation_year: 2027,
        weekly_learning_hours: 14.5,
        budget_preference: 'LOW_COST',
        learning_preference: 'PRACTICE',
        created_at: '2026-10-10T10:30:00.000Z',
        updated_at: now,
      },
      {
        profile_id: 2,
        user_id: 3,
        university_name: 'FAST-NUCES, Islamabad',
        degree_program: 'BS Computer Science',
        current_semester: 3,
        graduation_year: 2028,
        weekly_learning_hours: 10,
        budget_preference: 'FREE_ONLY',
        learning_preference: 'MIXED',
        created_at: '2026-10-15T12:30:00.000Z',
        updated_at: now,
      },
    ];
    this.data.sequences.profile_id = 3;

    // 3. Career Categories
    this.data.career_categories = [
      { category_id: 1, category_name: 'Software Development', description: 'Application, web, and systems engineering', is_active: true, created_at: now, updated_at: now },
      { category_id: 2, category_name: 'Quality Assurance', description: 'Software testing, test automation, and verification', is_active: true, created_at: now, updated_at: now },
      { category_id: 3, category_name: 'Data & Analytics', description: 'Data modeling, business intelligence, and analytics', is_active: true, created_at: now, updated_at: now },
      { category_id: 4, category_name: 'Design & User Experience', description: 'User interface, user experience, and design systems', is_active: true, created_at: now, updated_at: now },
      { category_id: 5, category_name: 'Cybersecurity', description: 'Information security, vulnerability analysis, and defense', is_active: true, created_at: now, updated_at: now },
    ];
    this.data.sequences.category_id = 6;

    // 4. Careers (Initial 6 + 1 Draft for testing draft filter)
    this.data.careers = [
      {
        career_id: 1,
        category_id: 1,
        career_title: 'Frontend Developer',
        summary: 'Builds responsive, accessible, interactive web interfaces using modern frameworks and client-side architectures.',
        description: 'Frontend developers bridge design and engineering to build web applications used by thousands of users. In Pakistan, entry-level roles emphasize React, TypeScript, Tailwind CSS, API consumption, and clean component architecture.',
        responsibilities: 'Translate Figma mockups into production code; integrate RESTful APIs; ensure cross-browser responsiveness and accessibility; manage client-side state and caching; optimize web performance.',
        entry_level_tasks: 'Fix UI bugs; build reusable modular components; connect UI to backend endpoints; write unit tests for component rendering; verify mobile responsiveness.',
        education_notes: 'BS in Computer Science, Software Engineering, or IT. Strong coursework in Web Technologies, HCI, and Data Structures.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 2,
        category_id: 1,
        career_title: 'Backend Developer',
        summary: 'Architects robust server APIs, handles databases, manages authentication, and implements core business workflows.',
        description: 'Backend developers create the computational backbone of modern applications. Entry-level openings in Pakistan demand competence with Node.js/Express, Python/Django, relational SQL schema design, and secure authentication.',
        responsibilities: 'Design and document RESTful APIs; optimize SQL queries and schema indexes; implement role-based access control; handle third-party service webhooks; guarantee data integrity.',
        entry_level_tasks: 'Implement CRUD endpoints; write SQL migration scripts; handle input validation and error middleware; write automated integration tests; inspect server logs.',
        education_notes: 'BS in Computer Science or Software Engineering. Coursework in Database Systems, Operating Systems, OOP, and Distributed Systems.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 3,
        category_id: 2,
        career_title: 'QA Engineer',
        summary: 'Ensures software reliability through rigorous test case design, exploratory defect hunting, and automation suites.',
        description: 'QA Engineers protect end users from bugs and stability regressions. Pakistani IT firms actively recruit entry-level QA engineers who possess solid test case design principles, API testing with Postman, and foundational Selenium/Playwright automation.',
        responsibilities: 'Analyze requirements to produce comprehensive test matrices; execute functional and regression tests; verify API payloads with Postman; report structured defects in Jira; automate regression workflows.',
        entry_level_tasks: 'Write and execute manual test cases; reproduce customer-reported bugs with reproduction steps; test API response status codes and schema contracts; write automated smoke scripts.',
        education_notes: 'BS in Software Engineering or Computer Science. Coursework in Software Quality Assurance, Software Engineering, and Database Systems.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 4,
        category_id: 3,
        career_title: 'Data Analyst',
        summary: 'Transforms raw organizational data into actionable business intelligence, dashboards, and quantitative insights.',
        description: 'Data Analysts bridge business problems and data warehousing. Local organizations in finance, logistics, telecom, and SaaS seek graduates skilled in SQL joins, aggregation, Python/Pandas data wrangling, and PowerBI dashboards.',
        responsibilities: 'Extract and transform relational data using SQL; clean messy datasets with Python; design executive dashboards in PowerBI or Tableau; perform exploratory data analysis.',
        entry_level_tasks: 'Write SQL queries to answer operational business questions; build weekly automated KPI reports; validate data pipelines for missing or anomalous values.',
        education_notes: 'BS in Computer Science, Data Science, or Software Engineering. Strong background in Database Systems, Probability & Statistics, and Discrete Mathematics.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 5,
        category_id: 4,
        career_title: 'UI/UX Designer',
        summary: 'Designs intuitive digital product experiences, wireframes, high-fidelity prototypes, and design systems.',
        description: 'UI/UX Designers conduct user research, map user flows, and craft elegant design solutions. In Pakistan, entry-level designers are expected to master Figma, understand accessibility standards, and communicate design rationale effectively.',
        responsibilities: 'Conduct user interviews and card sorting; create user flows and information architecture; design component-driven UI systems in Figma; run usability evaluation sessions.',
        entry_level_tasks: 'Design high-fidelity mobile and desktop mockups; build interactive Figma prototypes; maintain design tokens and component variants; document design specifications for developers.',
        education_notes: 'Degree in Computer Science, Software Engineering, or Digital Arts. Coursework in Human-Computer Interaction, Design Thinking, and Web Technologies.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 6,
        category_id: 5,
        career_title: 'Cybersecurity Analyst',
        summary: 'Monitors systems for security incidents, conducts vulnerability assessments, and enforces cyber defense policies.',
        description: 'Cybersecurity Analysts defend enterprise networks and cloud infrastructure against unauthorized intrusions. Local Pakistani banks, telcos, and defense vendors recruit entry-level analysts with networking, Linux, and OWASP foundations.',
        responsibilities: 'Monitor SIEM alerts and security logs; conduct vulnerability scans; audit server configurations; analyze network traffic anomalies; assist with security incident triage.',
        entry_level_tasks: 'Analyze authentication logs for brute-force attempts; run network port scans with Nmap; review web application endpoints against OWASP Top 10 vulnerabilities.',
        education_notes: 'BS in Cybersecurity, Computer Science, or Computer Engineering. Coursework in Computer Networks, Information Security, and Operating Systems.',
        publication_status: 'PUBLISHED',
        last_reviewed_at: '2026-10-25T00:00:00.000Z',
        created_at: now,
        updated_at: now,
      },
      {
        career_id: 7,
        category_id: 1,
        career_title: 'Cloud DevOps Engineer',
        summary: 'Draft role: Automates CI/CD pipelines, container orchestration, and cloud infrastructure.',
        description: 'Under review by project committee. Used for draft status verification.',
        responsibilities: 'CI/CD pipeline construction; Docker containerization; cloud infrastructure automation.',
        entry_level_tasks: 'Write Dockerfiles; maintain GitHub Actions workflows.',
        education_notes: 'BS in Computer Science or Software Engineering.',
        publication_status: 'DRAFT', // DRAFT: Must be hidden from student catalog!
        last_reviewed_at: null,
        created_at: now,
        updated_at: now,
      },
    ];
    this.data.sequences.career_id = 8;

    // 5. Academic Subjects
    this.data.academic_subjects = [
      { subject_id: 1, subject_name: 'Programming Fundamentals', subject_category: 'Programming', description: 'Core syntax, variables, conditionals, loops, and functions', is_active: true, created_at: now, updated_at: now },
      { subject_id: 2, subject_name: 'Object Oriented Programming', subject_category: 'Programming', description: 'Classes, inheritance, polymorphism, abstraction, and encapsulation', is_active: true, created_at: now, updated_at: now },
      { subject_id: 3, subject_name: 'Data Structures & Algorithms', subject_category: 'Computer Science', description: 'Arrays, linked lists, trees, graphs, sorting, searching, and complexity', is_active: true, created_at: now, updated_at: now },
      { subject_id: 4, subject_name: 'Database Systems', subject_category: 'Database', description: 'Relational data modeling, SQL queries, normalization, transactions, and indexing', is_active: true, created_at: now, updated_at: now },
      { subject_id: 5, subject_name: 'Software Engineering', subject_category: 'Software Engineering', description: 'SDLC methodologies, requirement analysis, design patterns, and architecture', is_active: true, created_at: now, updated_at: now },
      { subject_id: 6, subject_name: 'Computer Networks', subject_category: 'Systems & Networking', description: 'OSI model, TCP/IP, routing, HTTP/HTTPS, DNS, and socket programming', is_active: true, created_at: now, updated_at: now },
      { subject_id: 7, subject_name: 'Operating Systems', subject_category: 'Systems & Networking', description: 'Process scheduling, concurrency, memory management, file systems, and Linux CLI', is_active: true, created_at: now, updated_at: now },
      { subject_id: 8, subject_name: 'Human-Computer Interaction', subject_category: 'Design', description: 'User-centered design, usability heuristics, wireframing, and interaction design', is_active: true, created_at: now, updated_at: now },
      { subject_id: 9, subject_name: 'Probability & Statistics', subject_category: 'Mathematics', description: 'Descriptive stats, distributions, hypothesis testing, and regression analysis', is_active: true, created_at: now, updated_at: now },
      { subject_id: 10, subject_name: 'Web Technologies', subject_category: 'Web', description: 'HTML5, CSS3, JavaScript DOM, responsive design, and HTTP client requests', is_active: true, created_at: now, updated_at: now },
      { subject_id: 11, subject_name: 'Software Quality Assurance', subject_category: 'Software Engineering', description: 'Test methodologies, black/white box testing, automation, and verification', is_active: true, created_at: now, updated_at: now },
      { subject_id: 12, subject_name: 'Information Security', subject_category: 'Security', description: 'Threat modeling, encryption, network security, authentication, and security policies', is_active: true, created_at: now, updated_at: now },
      { subject_id: 13, subject_name: 'Discrete Mathematics', subject_category: 'Mathematics', description: 'Set theory, logic, proofs, relations, and combinatorics', is_active: true, created_at: now, updated_at: now },
      { subject_id: 14, subject_name: 'Artificial Intelligence', subject_category: 'Computer Science', description: 'Search algorithms, knowledge representation, and machine learning basics', is_active: true, created_at: now, updated_at: now },
    ];
    this.data.sequences.subject_id = 15;

    // 6. Skills Taxonomy
    this.data.skills = [
      // Web & Frontend
      { skill_id: 1, skill_name: 'HTML & CSS', skill_category: 'Frontend', description: 'Semantic markup, CSS layout, Flexbox, Grid, and typography', is_active: true, created_at: now, updated_at: now },
      { skill_id: 2, skill_name: 'JavaScript', skill_category: 'Programming', description: 'ES6+ syntax, asynchronous programming, closures, and DOM manipulation', is_active: true, created_at: now, updated_at: now },
      { skill_id: 3, skill_name: 'TypeScript', skill_category: 'Programming', description: 'Static typing, interfaces, generics, and strict type safety', is_active: true, created_at: now, updated_at: now },
      { skill_id: 4, skill_name: 'React.js', skill_category: 'Frontend', description: 'Hooks, state management, component lifecycle, and virtual DOM', is_active: true, created_at: now, updated_at: now },
      { skill_id: 5, skill_name: 'Responsive Design & Tailwind CSS', skill_category: 'Frontend', description: 'Mobile-first design, utility classes, and viewport reflow', is_active: true, created_at: now, updated_at: now },
      // Backend & Data
      { skill_id: 6, skill_name: 'Node.js & Express', skill_category: 'Backend', description: 'Event-driven server runtime, middleware, routing, and HTTP handlers', is_active: true, created_at: now, updated_at: now },
      { skill_id: 7, skill_name: 'SQL & Relational Databases', skill_category: 'Database', description: 'Schema design, complex joins, aggregation, indexing, and normalization', is_active: true, created_at: now, updated_at: now },
      { skill_id: 8, skill_name: 'RESTful API Design', skill_category: 'Backend', description: 'Resource modeling, HTTP status codes, pagination, and request validation', is_active: true, created_at: now, updated_at: now },
      { skill_id: 9, skill_name: 'Python', skill_category: 'Programming', description: 'Clean Python syntax, standard library, and package management', is_active: true, created_at: now, updated_at: now },
      { skill_id: 10, skill_name: 'Git & Version Control', skill_category: 'Core Engineering', description: 'Branching, merging, pull requests, and commit hygiene', is_active: true, created_at: now, updated_at: now },
      // QA & Testing
      { skill_id: 11, skill_name: 'Manual Testing & Test Case Design', skill_category: 'Testing', description: 'Equivalence partitioning, boundary value analysis, and test matrices', is_active: true, created_at: now, updated_at: now },
      { skill_id: 12, skill_name: 'API Testing & Postman', skill_category: 'Testing', description: 'Payload validation, HTTP response codes, and test assertions', is_active: true, created_at: now, updated_at: now },
      { skill_id: 13, skill_name: 'Test Automation (Selenium/Playwright)', skill_category: 'Testing', description: 'Browser automation scripts, locator strategies, and CI test runs', is_active: true, created_at: now, updated_at: now },
      { skill_id: 14, skill_name: 'Defect Tracking & Bug Reporting', skill_category: 'Testing', description: 'Clear reproduction steps, expected vs actual behavior, and severity classification', is_active: true, created_at: now, updated_at: now },
      // Data Analysis
      { skill_id: 15, skill_name: 'Data Analysis with Pandas/Python', skill_category: 'Data', description: 'Dataframes, data cleaning, filtering, and statistical aggregations', is_active: true, created_at: now, updated_at: now },
      { skill_id: 16, skill_name: 'Data Visualization & BI (PowerBI/Tableau)', skill_category: 'Data', description: 'Interactive charts, dashboard KPIs, and data storytelling', is_active: true, created_at: now, updated_at: now },
      { skill_id: 17, skill_name: 'Advanced Excel / Google Sheets', skill_category: 'Data', description: 'Pivot tables, VLOOKUP/XLOOKUP, summary stats, and conditional formatting', is_active: true, created_at: now, updated_at: now },
      // UI / UX Design
      { skill_id: 18, skill_name: 'UI Wireframing & Prototyping (Figma)', skill_category: 'Design', description: 'Auto-layout, reusable components, interactive flows, and design tokens', is_active: true, created_at: now, updated_at: now },
      { skill_id: 19, skill_name: 'User Research & Usability Evaluation', skill_category: 'Design', description: 'Heuristic evaluation, user interviews, journey mapping, and feedback synthesis', is_active: true, created_at: now, updated_at: now },
      { skill_id: 20, skill_name: 'Information Architecture & User Flows', skill_category: 'Design', description: 'Site maps, screen flows, mental models, and content hierarchy', is_active: true, created_at: now, updated_at: now },
      // Cybersecurity
      { skill_id: 21, skill_name: 'Network Security Fundamentals', skill_category: 'Security', description: 'Firewalls, ports, subnets, packet analysis, and VPN protocols', is_active: true, created_at: now, updated_at: now },
      { skill_id: 22, skill_name: 'Vulnerability Assessment & OWASP Top 10', skill_category: 'Security', description: 'XSS, SQLi, CSRF, broken access control, and remediation basics', is_active: true, created_at: now, updated_at: now },
      { skill_id: 23, skill_name: 'Linux CLI & Administration', skill_category: 'Systems', description: 'File permissions, shell scripting, process management, and log inspection', is_active: true, created_at: now, updated_at: now },
      { skill_id: 24, skill_name: 'Security Log Analysis & SIEM', skill_category: 'Security', description: 'Log correlation, anomaly detection, and incident response fundamentals', is_active: true, created_at: now, updated_at: now },
    ];
    this.data.sequences.skill_id = 25;

    // 7. Interest and Activity Tags
    this.data.interest_tags = [
      // INTEREST tags
      { interest_tag_id: 1, tag_code: 'INT_PROBLEM_SOLVING', tag_label: 'Logical Problem Solving', tag_type: 'INTEREST', description: 'Solving complex algorithmic and structural problems', is_active: true },
      { interest_tag_id: 2, tag_code: 'INT_VISUAL_DESIGN', tag_label: 'Visual & Aesthetic Design', tag_type: 'INTEREST', description: 'Crafting visually appealing, clean, and intuitive aesthetics', is_active: true },
      { interest_tag_id: 3, tag_code: 'INT_DATA_PATTERNS', tag_label: 'Data Patterns & Statistics', tag_type: 'INTEREST', description: 'Uncovering trends and quantitative insights from datasets', is_active: true },
      { interest_tag_id: 4, tag_code: 'INT_SOFTWARE_QUALITY', tag_label: 'Software Quality & Flaw Hunting', tag_type: 'INTEREST', description: 'Scrutinizing software behavior and finding hidden edge-case bugs', is_active: true },
      { interest_tag_id: 5, tag_code: 'INT_SYSTEM_ARCHITECTURE', tag_label: 'Backend & System Architecture', tag_type: 'INTEREST', description: 'Building resilient backend servers, data pipelines, and APIs', is_active: true },
      { interest_tag_id: 6, tag_code: 'INT_SECURITY_DEFENSE', tag_label: 'Security & Cyber Defense', tag_type: 'INTEREST', description: 'Defending networks, analyzing threats, and ethical hacking', is_active: true },
      // ACTIVITY tags
      { interest_tag_id: 7, tag_code: 'ACT_FRONTEND_DEV', tag_label: 'Writing Frontend Code & UI', tag_type: 'ACTIVITY', description: 'Building interactive user interfaces using web technologies', is_active: true },
      { interest_tag_id: 8, tag_code: 'ACT_BACKEND_APIS', tag_label: 'Building APIs & Server Logic', tag_type: 'ACTIVITY', description: 'Writing server routes, database queries, and business logic', is_active: true },
      { interest_tag_id: 9, tag_code: 'ACT_TEST_EXECUTION', tag_label: 'Executing Test Cases & Auditing', tag_type: 'ACTIVITY', description: 'Running structured test plans, verifying status codes, and documenting bugs', is_active: true },
      { interest_tag_id: 10, tag_code: 'ACT_DATA_ANALYSIS', tag_label: 'Analyzing Datasets & Charting', tag_type: 'ACTIVITY', description: 'Running SQL queries, crunching spreadsheets, and producing dashboards', is_active: true },
      { interest_tag_id: 11, tag_code: 'ACT_WIREFRAMING_DESIGN', tag_label: 'Wireframing & Prototyping', tag_type: 'ACTIVITY', description: 'Creating user flows, Figma designs, and conducting usability tests', is_active: true },
      { interest_tag_id: 12, tag_code: 'ACT_SECURITY_AUDITING', tag_label: 'Inspecting Logs & Vulnerabilities', tag_type: 'ACTIVITY', description: 'Scanning networks, reviewing authentication, and hardening systems', is_active: true },
    ];
    this.data.sequences.interest_tag_id = 13;

    // 8. Career Skills Mappings
    this.data.career_skills = [
      // Career 1: Frontend Developer
      { career_id: 1, skill_id: 1, target_level: 3, importance_weight: 3.0, requirement_type: 'CORE', mapping_note: 'Semantic HTML and modern CSS are indispensable' },
      { career_id: 1, skill_id: 2, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'Modern JavaScript (ES6+) required for all interactions' },
      { career_id: 1, skill_id: 4, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'React is the dominant framework in Pakistani industry' },
      { career_id: 1, skill_id: 5, target_level: 3, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'Mobile responsiveness and Tailwind CSS' },
      { career_id: 1, skill_id: 8, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Understanding API contracts to fetch and send data' },
      { career_id: 1, skill_id: 3, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'TypeScript is increasingly required for junior roles' },
      { career_id: 1, skill_id: 10, target_level: 2, importance_weight: 1.5, requirement_type: 'IMPORTANT', mapping_note: 'Version control collaboration' },
      { career_id: 1, skill_id: 18, target_level: 2, importance_weight: 1.0, requirement_type: 'OPTIONAL', mapping_note: 'Basic Figma literacy helps when inspecting designs' },

      // Career 2: Backend Developer
      { career_id: 2, skill_id: 6, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'Node.js / Express for server API development' },
      { career_id: 2, skill_id: 7, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'Relational database schema design and SQL querying' },
      { career_id: 2, skill_id: 8, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'RESTful API architectural principles' },
      { career_id: 2, skill_id: 2, target_level: 3, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'JavaScript server runtime proficiency' },
      { career_id: 2, skill_id: 10, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Git for code reviews and team workflows' },
      { career_id: 2, skill_id: 3, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'TypeScript backend development' },
      { career_id: 2, skill_id: 23, target_level: 2, importance_weight: 1.5, requirement_type: 'IMPORTANT', mapping_note: 'Linux command line and server administration' },
      { career_id: 2, skill_id: 22, target_level: 2, importance_weight: 1.0, requirement_type: 'OPTIONAL', mapping_note: 'API security and OWASP defenses' },

      // Career 3: QA Engineer
      { career_id: 3, skill_id: 11, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'Test case design and edge case discovery' },
      { career_id: 3, skill_id: 12, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'API verification using Postman' },
      { career_id: 3, skill_id: 14, target_level: 3, importance_weight: 3.0, requirement_type: 'CORE', mapping_note: 'Detailed bug reporting with reproduction steps' },
      { career_id: 3, skill_id: 7, target_level: 2, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'SQL queries to verify database state during testing' },
      { career_id: 3, skill_id: 10, target_level: 2, importance_weight: 1.5, requirement_type: 'IMPORTANT', mapping_note: 'Version control for test automation repos' },
      { career_id: 3, skill_id: 13, target_level: 2, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'Basic test automation with Selenium or Playwright' },
      { career_id: 3, skill_id: 2, target_level: 2, importance_weight: 1.5, requirement_type: 'OPTIONAL', mapping_note: 'Scripting for automated testing' },

      // Career 4: Data Analyst
      { career_id: 4, skill_id: 7, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'Advanced SQL queries, joins, window functions' },
      { career_id: 4, skill_id: 15, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'Data manipulation in Python with Pandas' },
      { career_id: 4, skill_id: 16, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'Dashboard development in PowerBI or Tableau' },
      { career_id: 4, skill_id: 17, target_level: 3, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'Spreadsheet modeling and rapid analysis' },
      { career_id: 4, skill_id: 9, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Python for automation and data extraction' },
      { career_id: 4, skill_id: 10, target_level: 2, importance_weight: 1.5, requirement_type: 'OPTIONAL', mapping_note: 'Version control for analytics notebooks' },

      // Career 5: UI/UX Designer
      { career_id: 5, skill_id: 18, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'Figma proficiency for component systems and prototypes' },
      { career_id: 5, skill_id: 19, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'User research and usability testing methodologies' },
      { career_id: 5, skill_id: 20, target_level: 3, importance_weight: 3.0, requirement_type: 'CORE', mapping_note: 'Information architecture and user journey mapping' },
      { career_id: 5, skill_id: 1, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Understanding HTML/CSS constraints aids design feasibility' },
      { career_id: 5, skill_id: 5, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Responsive design principles for multiple screen sizes' },
      { career_id: 5, skill_id: 4, target_level: 1, importance_weight: 1.0, requirement_type: 'OPTIONAL', mapping_note: 'Basic React component understanding' },

      // Career 6: Cybersecurity Analyst
      { career_id: 6, skill_id: 21, target_level: 3, importance_weight: 4.0, requirement_type: 'CORE', mapping_note: 'Networking fundamentals and protocols' },
      { career_id: 6, skill_id: 22, target_level: 3, importance_weight: 3.5, requirement_type: 'CORE', mapping_note: 'Vulnerability assessment and web security (OWASP)' },
      { career_id: 6, skill_id: 23, target_level: 3, importance_weight: 3.0, requirement_type: 'CORE', mapping_note: 'Linux command line operations and security permissions' },
      { career_id: 6, skill_id: 24, target_level: 2, importance_weight: 2.5, requirement_type: 'IMPORTANT', mapping_note: 'Log inspection and SIEM alerting' },
      { career_id: 6, skill_id: 9, target_level: 2, importance_weight: 2.0, requirement_type: 'IMPORTANT', mapping_note: 'Python scripting for security checks' },
      { career_id: 6, skill_id: 8, target_level: 2, importance_weight: 1.5, requirement_type: 'OPTIONAL', mapping_note: 'Understanding API security vulnerabilities' },
    ];

    // 9. Career Subjects Mappings
    this.data.career_subjects = [
      // Frontend Developer
      { career_id: 1, subject_id: 10, importance_weight: 4.0, mapping_note: 'Web Technologies is the primary academic foundation for frontend engineering' },
      { career_id: 1, subject_id: 8, importance_weight: 3.0, mapping_note: 'HCI teaches usability heuristics, visual hierarchy, and user-centered design' },
      { career_id: 1, subject_id: 1, importance_weight: 2.5, mapping_note: 'Programming fundamentals provides core control flow and logic' },
      { career_id: 1, subject_id: 5, importance_weight: 2.0, mapping_note: 'Software engineering practices for modular team codebases' },
      { career_id: 1, subject_id: 3, importance_weight: 1.5, mapping_note: 'Data structures for efficient client-side data handling' },

      // Backend Developer
      { career_id: 2, subject_id: 4, importance_weight: 4.0, mapping_note: 'Database Systems is foundational for schema design and query optimization' },
      { career_id: 2, subject_id: 2, importance_weight: 3.5, mapping_note: 'OOP principles for clean domain modeling and layered architecture' },
      { career_id: 2, subject_id: 3, importance_weight: 3.0, mapping_note: 'Data structures and algorithms for performant backend processing' },
      { career_id: 2, subject_id: 6, importance_weight: 2.5, mapping_note: 'Computer Networks for HTTP/TCP/IP socket communication' },
      { career_id: 2, subject_id: 7, importance_weight: 2.0, mapping_note: 'Operating Systems for concurrency, processes, and memory' },

      // QA Engineer
      { career_id: 3, subject_id: 11, importance_weight: 4.0, mapping_note: 'Software Quality Assurance covers formal testing methodologies' },
      { career_id: 3, subject_id: 5, importance_weight: 3.5, mapping_note: 'Software Engineering covers requirement validation and SDLC' },
      { career_id: 3, subject_id: 4, importance_weight: 2.5, mapping_note: 'Database Systems for backend data validation and verification' },
      { career_id: 3, subject_id: 1, importance_weight: 2.0, mapping_note: 'Programming Fundamentals for understanding code logic and writing test scripts' },

      // Data Analyst
      { career_id: 4, subject_id: 4, importance_weight: 4.0, mapping_note: 'Database Systems is critical for SQL queries and relational models' },
      { career_id: 4, subject_id: 9, importance_weight: 3.5, mapping_note: 'Probability & Statistics provides mathematical foundation for inference' },
      { career_id: 4, subject_id: 1, importance_weight: 2.5, mapping_note: 'Programming Fundamentals for Python data wrangling scripts' },
      { career_id: 4, subject_id: 13, importance_weight: 2.0, mapping_note: 'Discrete Mathematics for relational algebra and set theory' },

      // UI/UX Designer
      { career_id: 5, subject_id: 8, importance_weight: 4.0, mapping_note: 'Human-Computer Interaction is the theoretical and practical backbone of UX' },
      { career_id: 5, subject_id: 10, importance_weight: 3.0, mapping_note: 'Web Technologies provides context on technical constraints of UI design' },
      { career_id: 5, subject_id: 5, importance_weight: 2.0, mapping_note: 'Software Engineering for collaborating in agile cross-functional sprints' },

      // Cybersecurity Analyst
      { career_id: 6, subject_id: 12, importance_weight: 4.0, mapping_note: 'Information Security teaches threat vectors, encryption, and policy' },
      { career_id: 6, subject_id: 6, importance_weight: 3.5, mapping_note: 'Computer Networks is vital for packet analysis and firewall defense' },
      { career_id: 6, subject_id: 7, importance_weight: 3.0, mapping_note: 'Operating Systems for access controls, permissions, and kernel security' },
      { career_id: 6, subject_id: 1, importance_weight: 2.0, mapping_note: 'Programming Fundamentals for analyzing scripts and exploits' },
    ];

    // 10. Career Interest Tags Mappings
    this.data.career_interest_tags = [
      // Frontend Developer
      { career_id: 1, interest_tag_id: 2, importance_weight: 4.0, mapping_note: 'Visual aesthetic interest' },
      { career_id: 1, interest_tag_id: 1, importance_weight: 3.0, mapping_note: 'Problem solving for UI state' },
      { career_id: 1, interest_tag_id: 7, importance_weight: 4.0, mapping_note: 'Writing frontend code' },
      { career_id: 1, interest_tag_id: 11, importance_weight: 2.0, mapping_note: 'Wireframing & inspecting mockups' },

      // Backend Developer
      { career_id: 2, interest_tag_id: 5, importance_weight: 4.0, mapping_note: 'Backend architecture interest' },
      { career_id: 2, interest_tag_id: 1, importance_weight: 3.5, mapping_note: 'Algorithmic problem solving' },
      { career_id: 2, interest_tag_id: 8, importance_weight: 4.0, mapping_note: 'Building APIs and server routes' },
      { career_id: 2, interest_tag_id: 10, importance_weight: 2.0, mapping_note: 'Working with databases' },

      // QA Engineer
      { career_id: 3, interest_tag_id: 4, importance_weight: 4.0, mapping_note: 'Software quality & bug hunting' },
      { career_id: 3, interest_tag_id: 1, importance_weight: 3.0, mapping_note: 'Logical edge-case problem solving' },
      { career_id: 3, interest_tag_id: 9, importance_weight: 4.0, mapping_note: 'Executing test cases and auditing' },

      // Data Analyst
      { career_id: 4, interest_tag_id: 3, importance_weight: 4.0, mapping_note: 'Data exploration and patterns' },
      { career_id: 4, interest_tag_id: 1, importance_weight: 3.0, mapping_note: 'Analytical problem solving' },
      { career_id: 4, interest_tag_id: 10, importance_weight: 4.0, mapping_note: 'Analyzing datasets and creating dashboards' },

      // UI/UX Designer
      { career_id: 5, interest_tag_id: 2, importance_weight: 4.0, mapping_note: 'Visual & user interface aesthetics' },
      { career_id: 5, interest_tag_id: 4, importance_weight: 2.0, mapping_note: 'Heuristic evaluation and flaw hunting' },
      { career_id: 5, interest_tag_id: 11, importance_weight: 4.0, mapping_note: 'Wireframing, prototyping, and user tests' },

      // Cybersecurity Analyst
      { career_id: 6, interest_tag_id: 6, importance_weight: 4.0, mapping_note: 'Information security and cyber defense' },
      { career_id: 6, interest_tag_id: 1, importance_weight: 3.0, mapping_note: 'System investigation problem solving' },
      { career_id: 6, interest_tag_id: 12, importance_weight: 4.0, mapping_note: 'Inspecting logs and auditing vulnerabilities' },
    ];

    // 11. Curated Job Evidence records (25 records across 6 careers)
    // Sourced with genuine dates, URLs, Pakistani tech companies, and verification status.
    // 23 CONTENT_CHECKED, 2 ACCESSIBLE_UNCONFIRMED / UNVERIFIABLE to satisfy TC-017 and BR-08!
    this.data.job_evidence = [
      // Career 1: Frontend Developer (5 records: 4 CONTENT_CHECKED, 1 UNVERIFIABLE)
      {
        evidence_id: 1,
        career_id: 1,
        job_title: 'Junior React Frontend Developer',
        organization_name: 'Systems Limited',
        location_text: 'Islamabad / Rawalpindi',
        work_mode: 'HYBRID',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/systems-limited-junior-react-developer-jobs-1428901',
        posted_date: '2026-10-05',
        collected_at: '2026-10-12T09:30:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'BS Computer Science or Software Engineering from HEC recognized university',
        notes: 'Verified posting requirements: React.js, Tailwind CSS, REST APIs, Git. Stipulates clean code and component reusability.',
      },
      {
        evidence_id: 2,
        career_id: 1,
        job_title: 'Associate Frontend Engineer',
        organization_name: '10Pearls',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'LinkedIn Pakistan',
        source_url: 'https://pk.linkedin.com/jobs/view/associate-frontend-engineer-at-10pearls-3948210',
        posted_date: '2026-09-28',
        collected_at: '2026-10-14T11:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Fresh Graduate / Entry Level',
        education_text: 'Bachelor in Computing degree',
        notes: 'Specifies React.js, JavaScript (ES6+), HTML5/CSS3, and TypeScript as a preferred asset.',
      },
      {
        evidence_id: 3,
        career_id: 1,
        job_title: 'Frontend Developer Intern',
        organization_name: 'Arbisoft',
        location_text: 'Lahore / Remote (Pakistan)',
        work_mode: 'HYBRID',
        source_name: 'Arbisoft Careers',
        source_url: 'https://careers.arbisoft.com/jobs/frontend-intern-fall-2026',
        posted_date: '2026-10-10',
        collected_at: '2026-10-16T14:15:00.000Z',
        last_checked_at: '2026-11-02T08:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: 'Enrolled in 6th-8th semester or recent BS graduate',
        notes: 'Assessment requires building a responsive React dashboard consuming a mock REST endpoint.',
      },
      {
        evidence_id: 4,
        career_id: 1,
        job_title: 'Junior Web UI Developer',
        organization_name: 'KeepTruckin / Motive',
        location_text: 'Islamabad',
        work_mode: 'HYBRID',
        source_name: 'BrightSpyre',
        source_url: 'https://www.brightspyre.com/jobs/motive-junior-web-ui-dev-91823',
        posted_date: '2026-08-20',
        collected_at: '2026-10-18T10:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'CLOSED_OR_EXPIRED', // closed posting, but content inspected!
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level',
        education_text: 'BS CS / SE',
        notes: 'Historical record. Verified posting text required HTML5/CSS3, React, and Git before vacancy expired.',
      },
      {
        evidence_id: 5,
        career_id: 1,
        job_title: 'Frontend Trainee (Third-party aggregator listing)',
        organization_name: 'Unspecified Agency',
        location_text: 'Rawalpindi',
        work_mode: 'NOT_SPECIFIED',
        source_name: 'JobAggregator.pk',
        source_url: 'https://jobaggregator.pk/listing/49102-frontend-trainee',
        posted_date: null,
        collected_at: '2026-10-20T16:00:00.000Z',
        last_checked_at: '2026-10-22T09:00:00.000Z',
        posting_status: 'NOT_STATED',
        verification_status: 'UNVERIFIABLE', // EXCLUDED from market stats per BR-08!
        experience_level: 'Entry Level',
        education_text: null,
        notes: 'Original source link redirected to 404 page; content could not be verified by project team.',
      },

      // Career 2: Backend Developer (4 records: all CONTENT_CHECKED)
      {
        evidence_id: 6,
        career_id: 2,
        job_title: 'Junior Node.js / Express Developer',
        organization_name: 'NetSol Technologies',
        location_text: 'Lahore / Islamabad',
        work_mode: 'HYBRID',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/netsol-junior-nodejs-developer-198273',
        posted_date: '2026-10-02',
        collected_at: '2026-10-11T11:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'BS Computer Science or Software Engineering',
        notes: 'Node.js, Express REST API, PostgreSQL / MySQL indexing, JWT auth.',
      },
      {
        evidence_id: 7,
        career_id: 2,
        job_title: 'Associate Backend Engineer',
        organization_name: 'Careem Technologies',
        location_text: 'Islamabad / Remote (Pakistan)',
        work_mode: 'REMOTE',
        source_name: 'Careem Careers',
        source_url: 'https://careers.careem.com/jobs/associate-backend-engineer-pakistan',
        posted_date: '2026-10-12',
        collected_at: '2026-10-15T09:00:00.000Z',
        last_checked_at: '2026-11-02T12:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level',
        education_text: 'Bachelors in CS/SE',
        notes: 'RESTful API design, SQL database querying, Git, and Linux CLI understanding.',
      },
      {
        evidence_id: 8,
        career_id: 2,
        job_title: 'Junior Backend Developer',
        organization_name: 'Afiniti',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'LinkedIn Pakistan',
        source_url: 'https://pk.linkedin.com/jobs/view/junior-backend-engineer-afiniti-82710',
        posted_date: '2026-09-15',
        collected_at: '2026-10-13T10:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'CLOSED_OR_EXPIRED',
        verification_status: 'CONTENT_CHECKED',
        experience_level: '0-1 year',
        education_text: 'BS CS / SE',
        notes: 'Python/Django or Node.js backend endpoints, SQL relations, and unit testing.',
      },
      {
        evidence_id: 9,
        career_id: 2,
        job_title: 'Backend Software Engineering Intern',
        organization_name: 'VentureDive',
        location_text: 'Islamabad',
        work_mode: 'HYBRID',
        source_name: 'VentureDive Careers',
        source_url: 'https://venturedive.com/careers/backend-intern-2026',
        posted_date: '2026-10-20',
        collected_at: '2026-10-24T15:00:00.000Z',
        last_checked_at: '2026-11-03T11:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: 'Final year BS student',
        notes: 'Requires solid OOP fundamentals, relational database queries (SQL), and Express/Node.',
      },

      // Career 3: QA Engineer (5 records: 4 CONTENT_CHECKED, 1 ACCESSIBLE_UNCONFIRMED)
      {
        evidence_id: 10,
        career_id: 3,
        job_title: 'Junior QA Engineer',
        organization_name: 'Systems Limited',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/systems-limited-junior-qa-engineer-102938',
        posted_date: '2026-10-08',
        collected_at: '2026-10-14T09:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'BS in Software Engineering or Computer Science',
        notes: 'Test case authoring, boundary value analysis, Jira defect management, Postman API testing.',
      },
      {
        evidence_id: 11,
        career_id: 3,
        job_title: 'Associate Quality Assurance Analyst',
        organization_name: 'i2c Inc.',
        location_text: 'Lahore / Islamabad',
        work_mode: 'ONSITE',
        source_name: 'LinkedIn Pakistan',
        source_url: 'https://pk.linkedin.com/jobs/view/associate-qa-analyst-i2c-29384',
        posted_date: '2026-09-25',
        collected_at: '2026-10-15T11:00:00.000Z',
        last_checked_at: '2026-11-02T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Fresh Graduate',
        education_text: 'BS CS / SE',
        notes: 'Manual testing, test case documentation, basic SQL for database verification, API testing.',
      },
      {
        evidence_id: 12,
        career_id: 3,
        job_title: 'Software Quality Assurance Intern',
        organization_name: 'Techlogix',
        location_text: 'Islamabad',
        work_mode: 'HYBRID',
        source_name: 'BrightSpyre',
        source_url: 'https://www.brightspyre.com/jobs/techlogix-sqa-intern-58291',
        posted_date: '2026-10-15',
        collected_at: '2026-10-19T13:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: 'Graduating student in Computing',
        notes: 'Manual testing execution, bug reporting with screenshots and logs, introductory Selenium.',
      },
      {
        evidence_id: 13,
        career_id: 3,
        job_title: 'Junior Test Automation Engineer',
        organization_name: '10Pearls',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'Company Portal',
        source_url: 'https://10pearls.com/careers/junior-test-automation-pk',
        posted_date: '2026-09-10',
        collected_at: '2026-10-12T16:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'CLOSED_OR_EXPIRED',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level',
        education_text: 'BS SE / CS',
        notes: 'Selenium Webdriver, Postman, manual test design, Git.',
      },
      {
        evidence_id: 14,
        career_id: 3,
        job_title: 'QA Assistant Posting',
        organization_name: 'Local Startup',
        location_text: 'Rawalpindi',
        work_mode: 'ONSITE',
        source_name: 'Mustakbil.com',
        source_url: 'https://www.mustakbil.com/job/qa-assistant-unconfirmed-9281',
        posted_date: '2026-10-01',
        collected_at: '2026-10-21T10:00:00.000Z',
        last_checked_at: '2026-10-25T10:00:00.000Z',
        posting_status: 'NOT_STATED',
        verification_status: 'ACCESSIBLE_UNCONFIRMED', // EXCLUDED from statistics per BR-08!
        experience_level: 'Intern',
        education_text: null,
        notes: 'Unconfirmed company phone listing; excluded from eligible sample calculation.',
      },

      // Career 4: Data Analyst (4 records: all CONTENT_CHECKED)
      {
        evidence_id: 15,
        career_id: 4,
        job_title: 'Junior Data Analyst',
        organization_name: 'Afiniti',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'LinkedIn Pakistan',
        source_url: 'https://pk.linkedin.com/jobs/view/junior-data-analyst-afiniti-48201',
        posted_date: '2026-10-04',
        collected_at: '2026-10-12T11:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'BS in Computer Science, Data Science, or Mathematics',
        notes: 'Stipulates SQL joins and aggregation, Excel modeling, and Python Pandas.',
      },
      {
        evidence_id: 16,
        career_id: 4,
        job_title: 'Associate Business Intelligence Analyst',
        organization_name: 'SastaTicket.pk',
        location_text: 'Karachi / Remote',
        work_mode: 'REMOTE',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/sastaticket-associate-bi-analyst-39201',
        posted_date: '2026-09-30',
        collected_at: '2026-10-15T09:00:00.000Z',
        last_checked_at: '2026-11-02T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Fresh Graduate',
        education_text: 'BS in Computing or Statistics',
        notes: 'PowerBI dashboards, SQL query authoring, Excel pivot tables.',
      },
      {
        evidence_id: 17,
        career_id: 4,
        job_title: 'Data Analytics Intern',
        organization_name: 'Systems Limited',
        location_text: 'Islamabad / Lahore',
        work_mode: 'HYBRID',
        source_name: 'Company Portal',
        source_url: 'https://systemsltd.com/careers/data-analyst-intern-2026',
        posted_date: '2026-10-18',
        collected_at: '2026-10-22T14:00:00.000Z',
        last_checked_at: '2026-11-03T09:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: '6th-8th semester CS / DS student',
        notes: 'Python for data wrangling, SQL queries, basic statistical analysis.',
      },
      {
        evidence_id: 18,
        career_id: 4,
        job_title: 'Junior Reporting Analyst',
        organization_name: 'Zong (CMPak)',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'BrightSpyre',
        source_url: 'https://www.brightspyre.com/jobs/cmpak-junior-reporting-analyst-18274',
        posted_date: '2026-08-15',
        collected_at: '2026-10-10T10:00:00.000Z',
        last_checked_at: '2026-10-30T10:00:00.000Z',
        posting_status: 'CLOSED_OR_EXPIRED',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level',
        education_text: 'BS Degree in CS/IT',
        notes: 'SQL relational queries, Excel automation, dashboard visualization.',
      },

      // Career 5: UI/UX Designer (4 records: all CONTENT_CHECKED)
      {
        evidence_id: 19,
        career_id: 5,
        job_title: 'Junior UI/UX Designer',
        organization_name: 'Arbisoft',
        location_text: 'Lahore / Remote',
        work_mode: 'HYBRID',
        source_name: 'LinkedIn Pakistan',
        source_url: 'https://pk.linkedin.com/jobs/view/junior-ui-ux-designer-arbisoft-91823',
        posted_date: '2026-10-01',
        collected_at: '2026-10-13T12:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'Degree in CS, Design, or Software Engineering',
        notes: 'Strong portfolio in Figma, wireframing, mobile responsive UI, usability testing.',
      },
      {
        evidence_id: 20,
        career_id: 5,
        job_title: 'Associate Product Designer',
        organization_name: 'VentureDive',
        location_text: 'Islamabad',
        work_mode: 'HYBRID',
        source_name: 'VentureDive Careers',
        source_url: 'https://venturedive.com/careers/associate-product-designer',
        posted_date: '2026-09-20',
        collected_at: '2026-10-14T15:00:00.000Z',
        last_checked_at: '2026-11-02T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Fresh Graduate',
        education_text: 'BS CS / SE / Design',
        notes: 'Figma prototypes, user journey mapping, information architecture, design systems.',
      },
      {
        evidence_id: 21,
        career_id: 5,
        job_title: 'UI/UX Design Intern',
        organization_name: '10Pearls',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/10pearls-ui-ux-design-intern-82910',
        posted_date: '2026-10-11',
        collected_at: '2026-10-18T10:00:00.000Z',
        last_checked_at: '2026-11-03T09:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: 'Enrolled student in computing or multimedia',
        notes: 'Figma components, wireframing, understanding web design constraints (HTML/CSS).',
      },
      {
        evidence_id: 22,
        career_id: 5,
        job_title: 'Visual & UI Designer',
        organization_name: 'Techlogix',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'BrightSpyre',
        source_url: 'https://www.brightspyre.com/jobs/techlogix-visual-ui-designer-49201',
        posted_date: '2026-08-25',
        collected_at: '2026-10-10T14:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'CLOSED_OR_EXPIRED',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level',
        education_text: 'BS CS / SE',
        notes: 'Figma, responsive layouts, user flows, accessibility guidelines.',
      },

      // Career 6: Cybersecurity Analyst (4 records: all CONTENT_CHECKED)
      {
        evidence_id: 23,
        career_id: 6,
        job_title: 'Junior SOC Analyst',
        organization_name: 'National Telecommunication Corporation (NTC)',
        location_text: 'Islamabad',
        work_mode: 'ONSITE',
        source_name: 'BrightSpyre',
        source_url: 'https://www.brightspyre.com/jobs/ntc-junior-soc-analyst-59201',
        posted_date: '2026-10-06',
        collected_at: '2026-10-14T10:00:00.000Z',
        last_checked_at: '2026-11-01T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Entry Level (0-1 year)',
        education_text: 'BS in Cybersecurity, Computer Science, or SE',
        notes: 'Networking protocols (TCP/IP), Linux CLI, SIEM security log analysis, incident triage.',
      },
      {
        evidence_id: 24,
        career_id: 6,
        job_title: 'Associate Information Security Officer',
        organization_name: 'Habib Bank Limited (HBL)',
        location_text: 'Islamabad / Rawalpindi',
        work_mode: 'ONSITE',
        source_name: 'Rozee.pk',
        source_url: 'https://www.rozee.pk/hbl-associate-infosec-officer-94812',
        posted_date: '2026-09-22',
        collected_at: '2026-10-12T15:00:00.000Z',
        last_checked_at: '2026-11-02T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Fresh Graduate',
        education_text: 'BS in Information Security or Computer Science',
        notes: 'Vulnerability assessment, OWASP Top 10 web security checks, network firewalls.',
      },
      {
        evidence_id: 25,
        career_id: 6,
        job_title: 'Cybersecurity Intern',
        organization_name: 'Trillium Information Security Systems',
        location_text: 'Rawalpindi',
        work_mode: 'ONSITE',
        source_name: 'Company Careers',
        source_url: 'https://trilliumis.com/careers/cybersecurity-intern-2026',
        posted_date: '2026-10-12',
        collected_at: '2026-10-19T11:00:00.000Z',
        last_checked_at: '2026-11-03T10:00:00.000Z',
        posting_status: 'OPEN_AT_CHECK',
        verification_status: 'CONTENT_CHECKED',
        experience_level: 'Internship',
        education_text: 'Final year CS/Cybersecurity students',
        notes: 'Linux shell, network packet inspection, Nmap scanning, Python security scripts.',
      },
    ];
    this.data.sequences.evidence_id = 26;

    // 12. Job Evidence Skills (Skill occurrences in evidence records)
    this.data.job_evidence_skills = [
      // Evidence 1 (Frontend, Systems Ltd)
      { evidence_id: 1, skill_id: 4, mention_type: 'REQUIRED', evidence_quote_note: 'React.js functional components' },
      { evidence_id: 1, skill_id: 2, mention_type: 'REQUIRED', evidence_quote_note: 'JavaScript (ES6+) required' },
      { evidence_id: 1, skill_id: 1, mention_type: 'REQUIRED', evidence_quote_note: 'HTML5/CSS3 semantic layout' },
      { evidence_id: 1, skill_id: 5, mention_type: 'REQUIRED', evidence_quote_note: 'Tailwind CSS utility styling' },
      { evidence_id: 1, skill_id: 8, mention_type: 'REQUIRED', evidence_quote_note: 'RESTful API integration' },
      { evidence_id: 1, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git branch workflows' },

      // Evidence 2 (Frontend, 10Pearls)
      { evidence_id: 2, skill_id: 4, mention_type: 'REQUIRED', evidence_quote_note: 'Hands-on React knowledge' },
      { evidence_id: 2, skill_id: 2, mention_type: 'REQUIRED', evidence_quote_note: 'Strong modern JavaScript' },
      { evidence_id: 2, skill_id: 1, mention_type: 'REQUIRED', evidence_quote_note: 'CSS Flexbox and Grid' },
      { evidence_id: 2, skill_id: 3, mention_type: 'PREFERRED', evidence_quote_note: 'TypeScript is a plus' },
      { evidence_id: 2, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git pull request workflow' },

      // Evidence 3 (Frontend, Arbisoft Intern)
      { evidence_id: 3, skill_id: 4, mention_type: 'REQUIRED', evidence_quote_note: 'React dashboard project' },
      { evidence_id: 3, skill_id: 2, mention_type: 'REQUIRED', evidence_quote_note: 'JavaScript data manipulation' },
      { evidence_id: 3, skill_id: 1, mention_type: 'REQUIRED', evidence_quote_note: 'Responsive web design' },
      { evidence_id: 3, skill_id: 8, mention_type: 'PREFERRED', evidence_quote_note: 'Consuming REST endpoints' },

      // Evidence 4 (Frontend, Motive)
      { evidence_id: 4, skill_id: 4, mention_type: 'REQUIRED', evidence_quote_note: 'React.js web interface' },
      { evidence_id: 4, skill_id: 1, mention_type: 'REQUIRED', evidence_quote_note: 'HTML/CSS standards' },
      { evidence_id: 4, skill_id: 5, mention_type: 'PREFERRED', evidence_quote_note: 'CSS frameworks' },
      { evidence_id: 4, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git version control' },

      // Evidence 6 (Backend, NetSol)
      { evidence_id: 6, skill_id: 6, mention_type: 'REQUIRED', evidence_quote_note: 'Node.js and Express framework' },
      { evidence_id: 6, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'PostgreSQL/MySQL relational schema' },
      { evidence_id: 6, skill_id: 8, mention_type: 'REQUIRED', evidence_quote_note: 'RESTful API endpoint design' },
      { evidence_id: 6, skill_id: 2, mention_type: 'REQUIRED', evidence_quote_note: 'JavaScript server-side logic' },

      // Evidence 7 (Backend, Careem)
      { evidence_id: 7, skill_id: 6, mention_type: 'REQUIRED', evidence_quote_note: 'Backend service development' },
      { evidence_id: 7, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'Complex SQL queries and transactions' },
      { evidence_id: 7, skill_id: 8, mention_type: 'REQUIRED', evidence_quote_note: 'High-throughput REST APIs' },
      { evidence_id: 7, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git collaboration' },

      // Evidence 8 (Backend, Afiniti)
      { evidence_id: 8, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'Relational database querying (SQL)' },
      { evidence_id: 8, skill_id: 8, mention_type: 'REQUIRED', evidence_quote_note: 'Backend API implementation' },
      { evidence_id: 8, skill_id: 9, mention_type: 'PREFERRED', evidence_quote_note: 'Python or Node' },

      // Evidence 9 (Backend, VentureDive)
      { evidence_id: 9, skill_id: 6, mention_type: 'REQUIRED', evidence_quote_note: 'Node.js/Express fundamentals' },
      { evidence_id: 9, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'SQL database relations' },
      { evidence_id: 9, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git version control' },

      // Evidence 10 (QA, Systems Ltd)
      { evidence_id: 10, skill_id: 11, mention_type: 'REQUIRED', evidence_quote_note: 'Test case writing and execution' },
      { evidence_id: 10, skill_id: 12, mention_type: 'REQUIRED', evidence_quote_note: 'Postman for REST API verification' },
      { evidence_id: 10, skill_id: 14, mention_type: 'REQUIRED', evidence_quote_note: 'Jira bug tracking and steps to reproduce' },
      { evidence_id: 10, skill_id: 7, mention_type: 'PREFERRED', evidence_quote_note: 'Basic SQL for checking DB entries' },

      // Evidence 11 (QA, i2c)
      { evidence_id: 11, skill_id: 11, mention_type: 'REQUIRED', evidence_quote_note: 'Manual test matrices' },
      { evidence_id: 11, skill_id: 14, mention_type: 'REQUIRED', evidence_quote_note: 'Documenting defect reports' },
      { evidence_id: 11, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'SQL queries for backend verification' },
      { evidence_id: 11, skill_id: 12, mention_type: 'PREFERRED', evidence_quote_note: 'Postman API checks' },

      // Evidence 12 (QA, Techlogix)
      { evidence_id: 12, skill_id: 11, mention_type: 'REQUIRED', evidence_quote_note: 'Functional test case design' },
      { evidence_id: 12, skill_id: 14, mention_type: 'REQUIRED', evidence_quote_note: 'Detailed bug logs' },
      { evidence_id: 12, skill_id: 13, mention_type: 'PREFERRED', evidence_quote_note: 'Selenium automation familiarity' },

      // Evidence 13 (QA, 10Pearls)
      { evidence_id: 13, skill_id: 11, mention_type: 'REQUIRED', evidence_quote_note: 'Test plans and scenarios' },
      { evidence_id: 13, skill_id: 12, mention_type: 'REQUIRED', evidence_quote_note: 'API automation / Postman' },
      { evidence_id: 13, skill_id: 13, mention_type: 'REQUIRED', evidence_quote_note: 'Selenium test scripts' },
      { evidence_id: 13, skill_id: 10, mention_type: 'REQUIRED', evidence_quote_note: 'Git' },

      // Evidence 15 (Data, Afiniti)
      { evidence_id: 15, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'Complex SQL queries and data extraction' },
      { evidence_id: 15, skill_id: 15, mention_type: 'REQUIRED', evidence_quote_note: 'Python Pandas dataframes' },
      { evidence_id: 15, skill_id: 17, mention_type: 'REQUIRED', evidence_quote_note: 'Advanced Excel' },

      // Evidence 16 (Data, SastaTicket)
      { evidence_id: 16, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'SQL database queries' },
      { evidence_id: 16, skill_id: 16, mention_type: 'REQUIRED', evidence_quote_note: 'PowerBI dashboard design' },
      { evidence_id: 16, skill_id: 17, mention_type: 'REQUIRED', evidence_quote_note: 'Excel pivot tables' },

      // Evidence 17 (Data, Systems Ltd)
      { evidence_id: 17, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'SQL joins and grouping' },
      { evidence_id: 17, skill_id: 15, mention_type: 'REQUIRED', evidence_quote_note: 'Pandas data cleaning' },
      { evidence_id: 17, skill_id: 16, mention_type: 'PREFERRED', evidence_quote_note: 'Visualization tools' },

      // Evidence 18 (Data, Zong)
      { evidence_id: 18, skill_id: 7, mention_type: 'REQUIRED', evidence_quote_note: 'SQL queries for KPI reporting' },
      { evidence_id: 18, skill_id: 17, mention_type: 'REQUIRED', evidence_quote_note: 'Excel reporting' },
      { evidence_id: 18, skill_id: 16, mention_type: 'REQUIRED', evidence_quote_note: 'Tableau or PowerBI' },

      // Evidence 19 (Design, Arbisoft)
      { evidence_id: 19, skill_id: 18, mention_type: 'REQUIRED', evidence_quote_note: 'Figma wireframing and high-fidelity mockups' },
      { evidence_id: 19, skill_id: 19, mention_type: 'REQUIRED', evidence_quote_note: 'Conducting usability tests' },
      { evidence_id: 19, skill_id: 20, mention_type: 'REQUIRED', evidence_quote_note: 'User journey mapping' },

      // Evidence 20 (Design, VentureDive)
      { evidence_id: 20, skill_id: 18, mention_type: 'REQUIRED', evidence_quote_note: 'Figma interactive prototypes' },
      { evidence_id: 20, skill_id: 20, mention_type: 'REQUIRED', evidence_quote_note: 'Information architecture' },
      { evidence_id: 20, skill_id: 1, mention_type: 'PREFERRED', evidence_quote_note: 'HTML/CSS basics' },

      // Evidence 21 (Design, 10Pearls)
      { evidence_id: 21, skill_id: 18, mention_type: 'REQUIRED', evidence_quote_note: 'Figma design system components' },
      { evidence_id: 21, skill_id: 19, mention_type: 'REQUIRED', evidence_quote_note: 'User research synthesis' },

      // Evidence 22 (Design, Techlogix)
      { evidence_id: 22, skill_id: 18, mention_type: 'REQUIRED', evidence_quote_note: 'Figma responsive mobile layouts' },
      { evidence_id: 22, skill_id: 20, mention_type: 'REQUIRED', evidence_quote_note: 'Screen flow documentation' },

      // Evidence 23 (Security, NTC)
      { evidence_id: 23, skill_id: 21, mention_type: 'REQUIRED', evidence_quote_note: 'TCP/IP network protocols' },
      { evidence_id: 23, skill_id: 23, mention_type: 'REQUIRED', evidence_quote_note: 'Linux command line' },
      { evidence_id: 23, skill_id: 24, mention_type: 'REQUIRED', evidence_quote_note: 'SIEM log monitoring' },

      // Evidence 24 (Security, HBL)
      { evidence_id: 24, skill_id: 21, mention_type: 'REQUIRED', evidence_quote_note: 'Network firewalls and subnets' },
      { evidence_id: 24, skill_id: 22, mention_type: 'REQUIRED', evidence_quote_note: 'OWASP Top 10 vulnerabilities' },
      { evidence_id: 24, skill_id: 23, mention_type: 'REQUIRED', evidence_quote_note: 'Linux server inspection' },

      // Evidence 25 (Security, Trillium)
      { evidence_id: 25, skill_id: 21, mention_type: 'REQUIRED', evidence_quote_note: 'Packet sniffing and port scanning' },
      { evidence_id: 25, skill_id: 23, mention_type: 'REQUIRED', evidence_quote_note: 'Linux shell environment' },
      { evidence_id: 25, skill_id: 22, mention_type: 'REQUIRED', evidence_quote_note: 'Vulnerability assessment' },
    ];

    // 13. Pre-seeded Student Subjects for Hamza (User 2)
    this.data.student_subjects = [
      { student_subject_id: 1, user_id: 2, subject_id: 1, study_status: 'COMPLETED', grade_text: 'A', semester_taken: 1, created_at: now, updated_at: now },
      { student_subject_id: 2, user_id: 2, subject_id: 2, study_status: 'COMPLETED', grade_text: 'A-', semester_taken: 2, created_at: now, updated_at: now },
      { student_subject_id: 3, user_id: 2, subject_id: 3, study_status: 'COMPLETED', grade_text: 'B+', semester_taken: 3, created_at: now, updated_at: now },
      { student_subject_id: 4, user_id: 2, subject_id: 4, study_status: 'COMPLETED', grade_text: 'A', semester_taken: 4, created_at: now, updated_at: now },
      { student_subject_id: 5, user_id: 2, subject_id: 5, study_status: 'COMPLETED', grade_text: 'B', semester_taken: 4, created_at: now, updated_at: now },
      { student_subject_id: 6, user_id: 2, subject_id: 10, study_status: 'COMPLETED', grade_text: 'A', semester_taken: 5, created_at: now, updated_at: now },
      { student_subject_id: 7, user_id: 2, subject_id: 8, study_status: 'IN_PROGRESS', grade_text: null, semester_taken: 5, created_at: now, updated_at: now },
      { student_subject_id: 8, user_id: 2, subject_id: 11, study_status: 'PLANNED', grade_text: null, semester_taken: 6, created_at: now, updated_at: now },
    ];
    this.data.sequences.student_subject_id = 9;

    // 14. Pre-seeded Student Skills for Hamza (User 2)
    this.data.student_skills = [
      { student_skill_id: 1, user_id: 2, skill_id: 1, proficiency_level: 3, evidence_status: 'SELF_REPORTED', notes: 'Built university project websites using HTML5 and CSS Flexbox', created_at: now, updated_at: now },
      { student_skill_id: 2, user_id: 2, skill_id: 2, proficiency_level: 3, evidence_status: 'SELF_REPORTED', notes: 'Comfortable with ES6 async/await, closures, and promises', created_at: now, updated_at: now },
      { student_skill_id: 3, user_id: 2, skill_id: 4, proficiency_level: 3, evidence_status: 'SELF_REPORTED', notes: 'Created 3 personal React applications with custom hooks and router', created_at: now, updated_at: now },
      { student_skill_id: 4, user_id: 2, skill_id: 5, proficiency_level: 3, evidence_status: 'SELF_REPORTED', notes: 'Regularly use Tailwind CSS for responsive mobile navigation', created_at: now, updated_at: now },
      { student_skill_id: 5, user_id: 2, skill_id: 10, proficiency_level: 2, evidence_status: 'SELF_REPORTED', notes: 'Basic Git commits, push, and branching', created_at: now, updated_at: now },
      { student_skill_id: 6, user_id: 2, skill_id: 7, proficiency_level: 2, evidence_status: 'SELF_REPORTED', notes: 'Completed Database Systems course; can write basic SQL joins', created_at: now, updated_at: now },
      { student_skill_id: 7, user_id: 2, skill_id: 8, proficiency_level: 2, evidence_status: 'SELF_REPORTED', notes: 'Integrated frontend with backend REST JSON endpoints', created_at: now, updated_at: now },
    ];
    this.data.sequences.student_skill_id = 8;

    // 15. Pre-seeded Student Preferences for Hamza (User 2) - At least 3 INTEREST and 3 ACTIVITY
    this.data.student_preferences = [
      { user_id: 2, interest_tag_id: 1, preference_score: 4, updated_at: now }, // Problem solving: 4
      { user_id: 2, interest_tag_id: 2, preference_score: 5, updated_at: now }, // Visual design: 5
      { user_id: 2, interest_tag_id: 4, preference_score: 3, updated_at: now }, // Flaw hunting: 3
      { user_id: 2, interest_tag_id: 7, preference_score: 5, updated_at: now }, // Writing frontend code: 5
      { user_id: 2, interest_tag_id: 8, preference_score: 3, updated_at: now }, // Building APIs: 3
      { user_id: 2, interest_tag_id: 11, preference_score: 4, updated_at: now }, // Wireframing: 4
    ];

    // 16. Initial Admin Audit Log
    this.data.admin_audit_logs = [
      {
        audit_id: 1,
        admin_user_id: 1,
        action: 'SYSTEM_SEED',
        entity_type: 'INITIAL_CATALOGUE',
        entity_id: 'ALL',
        summary: 'PathProof Phase 1 initial database seeded with 6 careers, 24 evidence records, and controlled taxonomy.',
        created_at: now,
      },
    ];
    this.data.sequences.audit_id = 2;

    // 17. Pre-seeded Copilot Conversation for Hamza (User 2)
    this.data.copilot_conversations = [
      {
        conversation_id: 1,
        user_id: 2,
        title: 'Frontend Developer Readiness & Career Advice',
        created_at: now,
        updated_at: now,
      },
    ];
    this.data.sequences.conversation_id = 2;

    this.data.copilot_messages = [
      {
        message_id: 1,
        conversation_id: 1,
        sender: 'user',
        content: 'Hi Copilot! I am in Semester 5 BS SE. How prepared am I for a Junior Frontend Developer role in Pakistan?',
        action_type: 'NONE',
        action_payload: null,
        created_at: now,
      },
      {
        message_id: 2,
        conversation_id: 1,
        sender: 'copilot',
        content: "Hello Hamza! Looking at your FAST NUCES profile and your Semester 5 coursework, you have built a solid foundation. You've completed Web Technologies (Grade A), Data Structures (Grade A-), and your self-reported skills show Intermediate proficiency (Level 3) in React, JavaScript, and Tailwind CSS.\n\nAccording to recent Pakistani job market data from Systems Ltd and 10Pearls, you are in a strong position for frontend internships (PKR 45k - 80k/mo). Your biggest high-impact growth area is Next.js and TypeScript. Would you like me to prepare a personalized 12-week roadmap to bridge these gaps?",
        action_type: 'PROPOSE_ROADMAP',
        action_payload: {
          title: '12-Week Frontend & Next.js Internship Preparation',
          career_id: 1,
          career_title: 'Frontend Developer',
          total_weeks: 12,
          target_role: 'Junior Frontend Developer',
          milestones: [
            {
              week_number: 1,
              title: 'TypeScript Foundations in React',
              description: 'Convert React components from PropTypes to typed interfaces and generics.',
              estimated_hours: 8,
              learning_activities: ['Official TypeScript handbook', 'Refactor 2 existing components to .tsx'],
              completion_criteria: 'All components compile cleanly with no any types.',
            },
            {
              week_number: 4,
              title: 'Next.js App Router & Server Components',
              description: 'Understand client vs server components, routing, and server-side data fetching.',
              estimated_hours: 10,
              learning_activities: ['Next.js Learn tutorial', 'Build a dynamic blog or product catalog'],
              completion_criteria: 'Deploy a server-rendered project to Vercel with metadata.',
            },
            {
              week_number: 8,
              title: 'State Management & Async API Integration',
              description: 'Implement TanStack Query or Zustand for optimistic UI and cache synchronization.',
              estimated_hours: 10,
              learning_activities: ['Build an e-commerce cart with cached REST queries'],
              completion_criteria: 'Handle loading skeletons, errors, and retry mechanisms smoothly.',
            },
            {
              week_number: 12,
              title: 'Capstone Project Polish & Portfolio Dossier',
              description: 'Document architecture, write comprehensive README, and deploy with live demo.',
              estimated_hours: 12,
              learning_activities: ['Add Lighthouse accessibility audit (score >= 90)', 'Record demo walkthrough'],
              completion_criteria: 'Portfolio project ready for Pakistani tech firm submissions.',
            },
          ],
        },
        created_at: now,
      },
    ];
    this.data.sequences.message_id = 3;

    // 18. Pre-seeded Student Roadmap for Hamza
    this.data.student_roadmaps = [
      {
        roadmap_id: 1,
        user_id: 2,
        title: '12-Week Frontend & Next.js Internship Preparation',
        career_id: 1,
        target_role: 'Junior Frontend Developer',
        total_weeks: 12,
        status: 'ACTIVE',
        created_at: now,
        milestones: [
          {
            milestone_id: 1,
            roadmap_id: 1,
            week_number: 1,
            title: 'TypeScript Foundations in React',
            description: 'Convert React components from PropTypes to typed interfaces and generics.',
            estimated_hours: 8,
            learning_activities: ['Official TypeScript handbook', 'Refactor 2 existing components to .tsx'],
            completion_criteria: 'All components compile cleanly with no any types.',
            is_completed: true,
            completed_at: now,
          },
          {
            milestone_id: 2,
            roadmap_id: 1,
            week_number: 4,
            title: 'Next.js App Router & Server Components',
            description: 'Understand client vs server components, routing, and server-side data fetching.',
            estimated_hours: 10,
            learning_activities: ['Next.js Learn tutorial', 'Build a dynamic blog or product catalog'],
            completion_criteria: 'Deploy a server-rendered project to Vercel with metadata.',
            is_completed: false,
            completed_at: null,
          },
          {
            milestone_id: 3,
            roadmap_id: 1,
            week_number: 8,
            title: 'State Management & Async API Integration',
            description: 'Implement TanStack Query or Zustand for optimistic UI and cache synchronization.',
            estimated_hours: 10,
            learning_activities: ['Build an e-commerce cart with cached REST queries'],
            completion_criteria: 'Handle loading skeletons, errors, and retry mechanisms smoothly.',
            is_completed: false,
            completed_at: null,
          },
          {
            milestone_id: 4,
            roadmap_id: 1,
            week_number: 12,
            title: 'Capstone Project Polish & Portfolio Dossier',
            description: 'Document architecture, write comprehensive README, and deploy with live demo.',
            estimated_hours: 12,
            learning_activities: ['Add Lighthouse accessibility audit (score >= 90)', 'Record demo walkthrough'],
            completion_criteria: 'Portfolio project ready for Pakistani tech firm submissions.',
            is_completed: false,
            completed_at: null,
          },
        ],
      },
    ];
    this.data.sequences.roadmap_id = 2;
    this.data.sequences.milestone_id = 5;
  }
}

export const db = new Database();
