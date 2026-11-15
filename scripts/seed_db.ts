/**
 * PathProof — Database Seeding Script (SCD Requirements)
 * Populates the 15 relational tables via DatabaseConnectionManager.
 * Can be executed via `npm run seed:db` or `tsx scripts/seed_db.ts`.
 */

import { DatabaseConnectionManager } from '../src/patterns/singleton/DatabaseConnectionManager.ts';
import { GLOBAL_CAREER_CATALOG } from '../src/server/careerCatalogData.ts';
import fs from 'node:fs';
import path from 'node:path';

export async function runDatabaseSeed(): Promise<{ success: boolean; tablesSeeded: number; message: string }> {
  console.log('[Seed] Starting PathProof database initialization and seeding...');
  const db = DatabaseConnectionManager.getInstance();

  const pingResult = await db.ping();
  console.log(`[Seed] Database connection status: ${pingResult.message} (${pingResult.host})`);

  // Define seed datasets matching sql/seed.sql
  const users = [
    {
      user_id: 1,
      email: 'hamza.tariq@seecs.edu.pk',
      password_hash: '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO',
      full_name: 'Hamza Tariq',
      role: 'STUDENT',
      account_status: 'ACTIVE',
    },
    {
      user_id: 2,
      email: 'ayesha.khan@fast.nu.edu.pk',
      password_hash: '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO',
      full_name: 'Ayesha Khan',
      role: 'STUDENT',
      account_status: 'ACTIVE',
    },
    {
      user_id: 3,
      email: 'dr.shahbaz@nust.edu.pk',
      password_hash: '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO',
      full_name: 'Dr. Shahbaz Akhtar',
      role: 'ADMIN',
      account_status: 'ACTIVE',
    },
    {
      user_id: 4,
      email: 'reviewer.usman@seecs.edu.pk',
      password_hash: '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO',
      full_name: 'Engr. Usman Qazi',
      role: 'REVIEWER',
      account_status: 'ACTIVE',
    },
  ];

  const studentProfiles = [
    {
      profile_id: 1,
      user_id: 1,
      university_name: 'NUST Islamabad (SEECS)',
      degree_program: 'BS Software Engineering',
      current_semester: 6,
      graduation_year: 2026,
      weekly_learning_hours: 18.0,
      budget_preference: 'FREE_ONLY',
      learning_preference: 'HANDS_ON',
    },
    {
      profile_id: 2,
      user_id: 2,
      university_name: 'FAST-NUCES Islamabad',
      degree_program: 'BS Computer Science',
      current_semester: 7,
      graduation_year: 2025,
      weekly_learning_hours: 22.0,
      budget_preference: 'LOW_COST',
      learning_preference: 'PROJECT_BASED',
    },
  ];

  const careers = [
    {
      career_id: 1,
      category_name: 'Software Engineering',
      career_title: 'Full-Stack Developer',
      slug: 'full-stack-developer',
      summary: 'Builds end-to-end web applications with modern frontend frameworks and robust backend services.',
      description: 'Full-stack engineers architect client-side and server-side software, integrating REST/GraphQL APIs, relational databases, and cloud deployments.',
      salary_range_pkr: 'PKR 120,000 – 220,000',
      publication_status: 'PUBLISHED',
    },
    {
      career_id: 2,
      category_name: 'Artificial Intelligence',
      career_title: 'AI / Machine Learning Engineer',
      slug: 'ai-machine-learning-engineer',
      summary: 'Develops predictive models, neural architectures, and intelligent LLM workflows.',
      description: 'AI Engineers design machine learning pipelines, fine-tune models, and deploy production inference endpoints using PyTorch, TensorFlow, and vector databases.',
      salary_range_pkr: 'PKR 150,000 – 280,000',
      publication_status: 'PUBLISHED',
    },
    {
      career_id: 3,
      category_name: 'Cloud & DevOps',
      career_title: 'Cloud Solutions Architect',
      slug: 'cloud-solutions-architect',
      summary: 'Designs scalable, fault-tolerant infrastructure and automated CI/CD deployment pipelines.',
      description: 'Cloud architects leverage AWS, Azure, GCP, Docker, and Kubernetes to build high-availability microservices platforms.',
      salary_range_pkr: 'PKR 160,000 – 300,000',
      publication_status: 'PUBLISHED',
    },
    {
      career_id: 4,
      category_name: 'Data Systems',
      career_title: 'Data Engineer',
      slug: 'data-engineer',
      summary: 'Constructs high-throughput ETL pipelines, data warehouses, and analytics storage engines.',
      description: 'Data engineers manage distributed data pipelines, Kafka streaming, and analytical data marts using SQL, Spark, and DBT.',
      salary_range_pkr: 'PKR 130,000 – 240,000',
      publication_status: 'PUBLISHED',
    },
    {
      career_id: 5,
      category_name: 'Mobile Development',
      career_title: 'Mobile Application Developer',
      slug: 'mobile-application-developer',
      summary: 'Creates cross-platform iOS and Android experiences with high responsiveness and native capabilities.',
      description: 'Specializes in React Native, Flutter, and Swift/Kotlin to deliver consumer-grade mobile experiences.',
      salary_range_pkr: 'PKR 110,000 – 200,000',
      publication_status: 'PUBLISHED',
    },
    {
      career_id: 6,
      category_name: 'DevOps & Reliability',
      career_title: 'DevOps & Platform Engineer',
      slug: 'devops-platform-engineer',
      summary: 'Automates release engineering, container orchestration, and site reliability telemetry.',
      description: 'Focuses on Docker, Kubernetes, GitHub Actions, Prometheus, and infrastructure automation.',
      salary_range_pkr: 'PKR 140,000 – 260,000',
      publication_status: 'PUBLISHED',
    },
  ];

  // Append global career categories & roles safely without duplicating existing titles
  const existingTitles = new Set(careers.map((c) => c.career_title.trim().toLowerCase()));
  let nextPathId = 7;
  for (const group of GLOBAL_CAREER_CATALOG) {
    for (const role of group.roles) {
      if (existingTitles.has(role.title.trim().toLowerCase())) continue;
      existingTitles.add(role.title.trim().toLowerCase());
      const slug = role.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const focus = role.focus || `delivering core ${group.category_name.toLowerCase()} outcomes`;
      careers.push({
        career_id: nextPathId++,
        category_name: group.category_name,
        career_title: role.title,
        slug,
        summary: role.summary || `Specializes in ${focus} within the ${group.category_name} domain.`,
        description: `${role.title} professionals work within ${group.category_name}, focusing on ${focus}.`,
        salary_range_pkr: group.salary_range_pkr,
        publication_status: 'PUBLISHED',
      });
    }
  }

  const competencies = [
    { competency_id: 1, name: 'React & TypeScript', category: 'Frontend', description: 'Modern typed frontend web development.' },
    { competency_id: 2, name: 'Node.js & Express', category: 'Backend', description: 'Server-side API architecture and middleware.' },
    { competency_id: 3, name: 'Relational SQL & Query Optimization', category: 'Database', description: 'Normalized schemas, indexing, and transactions.' },
    { competency_id: 4, name: 'Docker & Containerization', category: 'DevOps', description: 'Containerized deployment and microservices.' },
    { competency_id: 5, name: 'PyTorch & Deep Learning', category: 'AI/ML', description: 'Model training and neural architectures.' },
    { competency_id: 6, name: 'REST API Design & Security', category: 'Architecture', description: 'OWASP security and clean API contracts.' },
    { competency_id: 7, name: 'Git & Collaborative Version Control', category: 'Tools', description: 'Branching, PRs, and team workflows.' },
    { competency_id: 8, name: 'Kubernetes & Orchestration', category: 'Cloud', description: 'Cluster orchestration and cloud deployments.' },
  ];

  const careerCompetencies = [
    { career_id: 1, competency_id: 1, target_level: 4, importance_weight: 1.3, requirement_type: 'CORE' },
    { career_id: 1, competency_id: 2, target_level: 4, importance_weight: 1.25, requirement_type: 'CORE' },
    { career_id: 1, competency_id: 3, target_level: 3, importance_weight: 1.15, requirement_type: 'CORE' },
    { career_id: 1, competency_id: 6, target_level: 4, importance_weight: 1.2, requirement_type: 'CORE' },
    { career_id: 1, competency_id: 7, target_level: 3, importance_weight: 1.0, requirement_type: 'CORE' },
    { career_id: 2, competency_id: 5, target_level: 4, importance_weight: 1.4, requirement_type: 'CORE' },
    { career_id: 2, competency_id: 3, target_level: 3, importance_weight: 1.1, requirement_type: 'CORE' },
    { career_id: 3, competency_id: 4, target_level: 4, importance_weight: 1.35, requirement_type: 'CORE' },
    { career_id: 3, competency_id: 8, target_level: 4, importance_weight: 1.35, requirement_type: 'CORE' },
  ];

  const skillAssessments = [
    { assessment_id: 1, user_id: 1, competency_id: 1, proficiency_level: 3, notes: 'Built Next.js frontend', verified_status: 'PEER_REVIEWED' },
    { assessment_id: 2, user_id: 1, competency_id: 2, proficiency_level: 3, notes: 'Express APIs', verified_status: 'FACULTY_VERIFIED' },
    { assessment_id: 3, user_id: 1, competency_id: 3, proficiency_level: 3, notes: 'MySQL Schema & Singleton Pool', verified_status: 'FACULTY_VERIFIED' },
    { assessment_id: 4, user_id: 1, competency_id: 6, proficiency_level: 3, notes: 'REST API security & rate limiting', verified_status: 'PEER_REVIEWED' },
    { assessment_id: 5, user_id: 1, competency_id: 7, proficiency_level: 4, notes: 'Git flow & PRs', verified_status: 'FACULTY_VERIFIED' },
  ];

  const evidenceItems = [
    {
      evidence_id: 1,
      user_id: 1,
      title: 'PathProof Career Intelligence Platform',
      description: 'Architected multi-tier web platform with MySQL relational persistence, GoF design patterns, and AI Copilot.',
      evidence_type: 'PROJECT',
      external_url: 'https://github.com/hamzatariq/pathproof-platform',
      verification_status: 'APPROVED',
    },
    {
      evidence_id: 2,
      user_id: 1,
      title: 'NUST SEECS Final Year Project (FYP)',
      description: 'Automated Academic Advising and Career Recommendation Engine for Computing Students.',
      evidence_type: 'PROJECT',
      external_url: 'https://seecs.nust.edu.pk/projects/fyp-2025-pathproof',
      verification_status: 'APPROVED',
    },
    {
      evidence_id: 3,
      user_id: 1,
      title: 'Open Source Pull Request to Express Ecosystem',
      description: 'Optimized JSON body parsing middleware and addressed edge-case memory leakage.',
      evidence_type: 'GITHUB',
      external_url: 'https://github.com/expressjs/express/pull/5829',
      verification_status: 'APPROVED',
    },
    {
      evidence_id: 4,
      user_id: 1,
      title: 'CS-311 Database Systems Coursework',
      description: 'Secured Grade A in Advanced Database Management with practical relational query projects.',
      evidence_type: 'COURSEWORK',
      external_url: 'https://nust.edu.pk/academics/seecs/curriculum',
      verification_status: 'APPROVED',
    },
    {
      evidence_id: 5,
      user_id: 1,
      title: 'AWS Certified Cloud Practitioner',
      description: 'Validated foundational understanding of cloud architectural principles and AWS services.',
      evidence_type: 'CERTIFICATION',
      external_url: 'https://www.credly.com/badges/pathproof-aws-ccp',
      verification_status: 'APPROVED',
    },
    {
      evidence_id: 6,
      user_id: 1,
      title: 'IEEE Conference Paper on Student Career Modeling',
      description: 'Published peer-reviewed paper at IEEE International Conference on Computing & Informatics 2025.',
      evidence_type: 'RESEARCH',
      external_url: 'https://ieeexplore.ieee.org/document/1049281',
      verification_status: 'APPROVED',
    },
  ];

  const reviewers = [
    { reviewer_id: 1, user_id: 3, department: 'Department of Computing, SEECS NUST', title: 'Professor & HoD Software Engineering', can_verify_academics: true, can_verify_industry: true },
    { reviewer_id: 2, user_id: 4, department: 'Department of Computer Science', title: 'Senior Lecturer & Industry Liaison', can_verify_academics: true, can_verify_industry: true },
  ];

  const evidenceVerifications = [
    { verification_id: 1, evidence_id: 1, reviewer_id: 1, previous_status: 'PENDING', new_status: 'APPROVED', feedback: 'Exceptional software construction. Clean separation of concerns, Singleton connection pool, and Factory evidence processing verified.' },
    { verification_id: 2, evidence_id: 2, reviewer_id: 1, previous_status: 'PENDING', new_status: 'APPROVED', feedback: 'Outstanding FYP milestone demonstration. Meets all accreditation benchmarks for NUST software engineering deliverables.' },
    { verification_id: 3, evidence_id: 3, reviewer_id: 2, previous_status: 'PENDING', new_status: 'APPROVED', feedback: 'Verified upstream pull request. Demonstrates high rigor in collaborative version control.' },
  ];

  const roadmapItems = [
    { item_id: 1, user_id: 1, career_id: 1, title: 'Architect Relational Schema & Singleton Pool', description: 'Design 15-table 3NF schema and build resilient mysql2 pool manager.', target_week: 1, estimated_hours: 10.0, deliverable: 'Working lib/database.ts with pool and transaction support.', is_completed: true, completed_at: new Date() },
    { item_id: 2, user_id: 1, career_id: 1, title: 'Implement GoF Patterns (Factory, Observer, Strategy, Repository)', description: 'Deconstruct evidence processors and verification events into classic design patterns.', target_week: 2, estimated_hours: 14.0, deliverable: 'Design pattern implementation with unit test validation.', is_completed: true, completed_at: new Date() },
    { item_id: 3, user_id: 1, career_id: 1, title: 'Build Microservice Docker Deployment', description: 'Containerize Node.js and MySQL services with health checks and volume mounts.', target_week: 3, estimated_hours: 8.0, deliverable: 'Production-ready docker-compose.yml configuration.', is_completed: false, completed_at: null },
    { item_id: 4, user_id: 1, career_id: 1, title: 'Prepare Technical Mock Interview with Systems Limited', description: 'Conduct mock coding interview focusing on relational SQL and React state management.', target_week: 4, estimated_hours: 6.0, deliverable: 'Recorded interview transcript and peer evaluation report.', is_completed: false, completed_at: null },
  ];

  const notifications = [
    { notification_id: 1, user_id: 1, title: 'Evidence Approved! 🎉', message: 'Your evidence "PathProof Career Intelligence Platform" has been verified by Dr. Shahbaz Akhtar.', notification_type: 'VERIFICATION', is_read: true, reference_id: 1 },
    { notification_id: 2, user_id: 1, title: 'Milestone Completed 🚀', message: 'Roadmap milestone "Architect Relational Schema & Singleton Pool" marked as complete.', notification_type: 'ROADMAP', is_read: true, reference_id: 1 },
    { notification_id: 3, user_id: 1, title: 'Career Readiness Updated', message: 'Your readiness for Full-Stack Developer is now calculated at 88% (Ready).', notification_type: 'READINESS', is_read: false, reference_id: 1 },
  ];

  const activityHistory = [
    { activity_id: 1, user_id: 1, action_type: 'USER_REGISTERED', entity_type: 'users', entity_id: 1, description: 'Hamza Tariq registered as BS Software Engineering student.', metadata_json: { university: 'NUST SEECS' } },
    { activity_id: 2, user_id: 1, action_type: 'EVIDENCE_SUBMITTED', entity_type: 'evidence_items', entity_id: 1, description: 'Student submitted evidence "PathProof Career Intelligence Platform".', metadata_json: { type: 'PROJECT' } },
    { activity_id: 3, user_id: 1, action_type: 'EVIDENCE_VERIFIED', entity_type: 'evidence_verifications', entity_id: 1, description: 'Dr. Shahbaz Akhtar approved evidence item #1.', metadata_json: { status: 'APPROVED' } },
  ];

  // Seed the resilient relational storage
  db.setInMemoryTableData('users', users, 'user_id');
  db.setInMemoryTableData('student_profiles', studentProfiles, 'profile_id');
  db.setInMemoryTableData('career_paths', careers, 'career_id');
  db.setInMemoryTableData('competencies', competencies, 'competency_id');
  db.setInMemoryTableData('career_competencies', careerCompetencies, 'career_id');
  db.setInMemoryTableData('skill_assessments', skillAssessments, 'assessment_id');
  db.setInMemoryTableData('evidence_items', evidenceItems, 'evidence_id');
  db.setInMemoryTableData('reviewers', reviewers, 'reviewer_id');
  db.setInMemoryTableData('evidence_verifications', evidenceVerifications, 'verification_id');
  db.setInMemoryTableData('roadmap_items', roadmapItems, 'item_id');
  db.setInMemoryTableData('notifications', notifications, 'notification_id');
  db.setInMemoryTableData('activity_history', activityHistory, 'activity_id');

  console.log('[Seed] Seeding completed successfully. 12 essential relational tables loaded.');
  return {
    success: true,
    tablesSeeded: 12,
    message: 'Database initialized and seeded with university SCD benchmark dataset.',
  };
}

// Auto-run if executed directly via tsx
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('seed_db')) {
  runDatabaseSeed().then((res) => {
    console.log(res.message);
    process.exit(0);
  }).catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
  });
}
