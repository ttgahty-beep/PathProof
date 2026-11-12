-- ============================================================================
-- PATHPROOF CAREER INTELLIGENCE PLATFORM — SEED DATA (MYSQL)
-- Software Construction & Development (SCD) Demo Dataset
-- ============================================================================

USE `pathproof_db`;

-- Disable foreign key checks for clean truncation and insertion
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `copilot_messages`;
TRUNCATE TABLE `copilot_conversations`;
TRUNCATE TABLE `activity_history`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `roadmap_items`;
TRUNCATE TABLE `evidence_verifications`;
TRUNCATE TABLE `reviewers`;
TRUNCATE TABLE `evidence_skills`;
TRUNCATE TABLE `evidence_items`;
TRUNCATE TABLE `skill_assessments`;
TRUNCATE TABLE `career_competencies`;
TRUNCATE TABLE `competencies`;
TRUNCATE TABLE `career_paths`;
TRUNCATE TABLE `student_profiles`;
TRUNCATE TABLE `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS
-- Password for all seed users is 'Password123!' (bcrypt hashed)
INSERT INTO `users` (`user_id`, `email`, `password_hash`, `full_name`, `role`, `account_status`) VALUES
(1, 'hamza.tariq@seecs.edu.pk', '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO', 'Hamza Tariq', 'STUDENT', 'ACTIVE'),
(2, 'ayesha.khan@fast.nu.edu.pk', '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO', 'Ayesha Khan', 'STUDENT', 'ACTIVE'),
(3, 'dr.shahbaz@nust.edu.pk', '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO', 'Dr. Shahbaz Akhtar', 'ADMIN', 'ACTIVE'),
(4, 'reviewer.usman@seecs.edu.pk', '$2b$10$I72aZ5Ev4aAlie.Q05TUK.BIo7p8hp3lTin9IjMkdy5Isk.dX8XpO', 'Engr. Usman Qazi', 'REVIEWER', 'ACTIVE');

-- 2. STUDENT PROFILES
INSERT INTO `student_profiles` (`profile_id`, `user_id`, `university_name`, `degree_program`, `current_semester`, `graduation_year`, `weekly_learning_hours`, `budget_preference`, `learning_preference`) VALUES
(1, 1, 'NUST Islamabad (SEECS)', 'BS Software Engineering', 6, 2026, 18.0, 'FREE_ONLY', 'HANDS_ON'),
(2, 2, 'FAST-NUCES Islamabad', 'BS Computer Science', 7, 2025, 22.0, 'LOW_COST', 'PROJECT_BASED');

-- 3. REVIEWERS
INSERT INTO `reviewers` (`reviewer_id`, `user_id`, `department`, `title`, `can_verify_academics`, `can_verify_industry`) VALUES
(1, 3, 'Department of Computing, SEECS NUST', 'Professor & HoD Software Engineering', TRUE, TRUE),
(2, 4, 'Department of Computer Science', 'Senior Lecturer & Industry Liaison', TRUE, TRUE);

-- 4. CAREER PATHS (6 PUBLISHED TRACKS)
INSERT INTO `career_paths` (`career_id`, `category_name`, `career_title`, `slug`, `summary`, `description`, `salary_range_pkr`, `publication_status`) VALUES
(1, 'Software Engineering', 'Full-Stack Developer', 'full-stack-developer', 'Builds end-to-end web applications with modern frontend frameworks and robust backend services.', 'Full-stack engineers architect client-side and server-side software, integrating REST/GraphQL APIs, relational databases, and cloud deployments.', 'PKR 120,000 – 220,000', 'PUBLISHED'),
(2, 'Artificial Intelligence', 'AI / Machine Learning Engineer', 'ai-machine-learning-engineer', 'Develops predictive models, neural architectures, and intelligent LLM workflows.', 'AI Engineers design machine learning pipelines, fine-tune models, and deploy production inference endpoints using PyTorch, TensorFlow, and vector databases.', 'PKR 150,000 – 280,000', 'PUBLISHED'),
(3, 'Cloud & DevOps', 'Cloud Solutions Architect', 'cloud-solutions-architect', 'Designs scalable, fault-tolerant infrastructure and automated CI/CD deployment pipelines.', 'Cloud architects leverage AWS, Azure, GCP, Docker, and Kubernetes to build high-availability microservices platforms.', 'PKR 160,000 – 300,000', 'PUBLISHED'),
(4, 'Data Systems', 'Data Engineer', 'data-engineer', 'Constructs high-throughput ETL pipelines, data warehouses, and analytics storage engines.', 'Data engineers manage distributed data pipelines, Kafka streaming, and analytical data marts using SQL, Spark, and DBT.', 'PKR 130,000 – 240,000', 'PUBLISHED'),
(5, 'Mobile Development', 'Mobile Application Developer', 'mobile-application-developer', 'Creates cross-platform iOS and Android experiences with high responsiveness and native capabilities.', 'Specializes in React Native, Flutter, and Swift/Kotlin to deliver consumer-grade mobile experiences.', 'PKR 110,000 – 200,000', 'PUBLISHED'),
(6, 'DevOps & Reliability', 'DevOps & Platform Engineer', 'devops-platform-engineer', 'Automates release engineering, container orchestration, and site reliability telemetry.', 'Focuses on Docker, Kubernetes, GitHub Actions, Prometheus, and infrastructure automation.', 'PKR 140,000 – 260,000', 'PUBLISHED');

-- 5. COMPETENCIES
INSERT INTO `competencies` (`competency_id`, `name`, `category`, `description`) VALUES
(1, 'React & TypeScript', 'Frontend', 'Building type-safe, component-driven user interfaces with modern React hooks and state management.'),
(2, 'Node.js & Express', 'Backend', 'Architecting RESTful microservices, asynchronous I/O, middleware pipelines, and JWT authentication.'),
(3, 'Relational SQL & Query Optimization', 'Database', 'Designing 3NF schemas, foreign keys, composite indexes, transactions, and query plans in MySQL/PostgreSQL.'),
(4, 'Docker & Containerization', 'DevOps', 'Creating multi-stage Dockerfiles, compose environments, and containerized runtime configurations.'),
(5, 'PyTorch & Deep Learning', 'AI/ML', 'Building tensor operations, neural network training loops, transfer learning, and evaluation metrics.'),
(6, 'REST API Design & Security', 'Architecture', 'Designing idempotent HTTP endpoints, rate limiting, CORS policies, and OWASP Top 10 mitigation.'),
(7, 'Git & Collaborative Version Control', 'Tools', 'Mastering feature branch workflows, rebase conventions, PR reviews, and semantic versioning.'),
(8, 'Kubernetes & Orchestration', 'Cloud', 'Deploying Helm charts, ingress controllers, replica sets, and persistent volume claims.'),
(9, 'Data Pipeline Engineering & ETL', 'Data', 'Batch data ingestion, streaming transformations, schema migrations, and pipeline scheduling.'),
(10, 'Mobile Responsive Architecture', 'Frontend', 'Mobile-first styling, touch gestures, offline caching, and responsive typography.');

-- 6. CAREER COMPETENCIES MAPPING
INSERT INTO `career_competencies` (`career_id`, `competency_id`, `target_level`, `importance_weight`, `requirement_type`) VALUES
-- Full-Stack Developer
(1, 1, 4, 1.30, 'CORE'),
(1, 2, 4, 1.25, 'CORE'),
(1, 3, 3, 1.15, 'CORE'),
(1, 6, 4, 1.20, 'CORE'),
(1, 7, 3, 1.00, 'CORE'),
(1, 4, 2, 0.90, 'ELECTIVE'),
-- AI / ML Engineer
(2, 5, 4, 1.40, 'CORE'),
(2, 3, 3, 1.10, 'CORE'),
(2, 7, 3, 1.00, 'CORE'),
(2, 4, 2, 0.90, 'ELECTIVE'),
-- Cloud Solutions Architect
(3, 4, 4, 1.35, 'CORE'),
(3, 8, 4, 1.35, 'CORE'),
(3, 6, 3, 1.10, 'CORE'),
(3, 7, 3, 1.00, 'CORE'),
-- Data Engineer
(4, 3, 4, 1.40, 'CORE'),
(4, 9, 4, 1.35, 'CORE'),
(4, 4, 3, 1.10, 'CORE'),
(4, 7, 3, 1.00, 'CORE'),
-- Mobile Developer
(5, 1, 4, 1.30, 'CORE'),
(5, 10, 4, 1.35, 'CORE'),
(5, 6, 3, 1.15, 'CORE'),
(5, 7, 3, 1.00, 'CORE');

-- 7. SKILL ASSESSMENTS (Hamza Tariq)
INSERT INTO `skill_assessments` (`assessment_id`, `user_id`, `competency_id`, `proficiency_level`, `notes`, `verified_status`) VALUES
(1, 1, 1, 3, 'Built Next.js and React SPAs with full TypeScript type safety.', 'PEER_REVIEWED'),
(2, 1, 2, 3, 'Developed Express REST APIs with middleware authentication.', 'FACULTY_VERIFIED'),
(3, 1, 3, 3, 'Designed normalized MySQL schema with foreign keys and indexes.', 'FACULTY_VERIFIED'),
(4, 1, 6, 3, 'Implemented rate limiting, CORS, and JWT session handling.', 'PEER_REVIEWED'),
(5, 1, 7, 4, 'Active Git contributor with 250+ commits on GitHub.', 'FACULTY_VERIFIED'),
(6, 1, 4, 2, 'Created multi-stage Dockerfiles for Node.js apps.', 'SELF_REPORTED');

-- 8. EVIDENCE ITEMS
INSERT INTO `evidence_items` (`evidence_id`, `user_id`, `title`, `description`, `evidence_type`, `external_url`, `verification_status`) VALUES
(1, 1, 'PathProof Career Intelligence Platform', 'Architected multi-tier web platform with MySQL relational persistence, GoF design patterns, and AI Copilot.', 'PROJECT', 'https://github.com/hamzatariq/pathproof-platform', 'APPROVED'),
(2, 1, 'NUST SEECS Final Year Project (FYP)', 'Automated Academic Advising and Career Recommendation Engine for Computing Students.', 'PROJECT', 'https://seecs.nust.edu.pk/projects/fyp-2025-pathproof', 'APPROVED'),
(3, 1, 'Open Source Pull Request to Express Ecosystem', 'Optimized JSON body parsing middleware and addressed edge-case memory leakage.', 'GITHUB', 'https://github.com/expressjs/express/pull/5829', 'APPROVED'),
(4, 1, 'CS-311 Database Systems Coursework', 'Secured Grade A in Advanced Database Management with practical relational query projects.', 'COURSEWORK', 'https://nust.edu.pk/academics/seecs/curriculum', 'APPROVED'),
(5, 1, 'AWS Certified Cloud Practitioner', 'Validated foundational understanding of cloud architectural principles and AWS services.', 'CERTIFICATION', 'https://www.credly.com/badges/pathproof-aws-ccp', 'APPROVED'),
(6, 1, 'IEEE Conference Paper on Student Career Modeling', 'Published peer-reviewed paper at IEEE International Conference on Computing & Informatics 2025.', 'RESEARCH', 'https://ieeexplore.ieee.org/document/1049281', 'APPROVED');

-- 9. EVIDENCE SKILLS
INSERT INTO `evidence_skills` (`evidence_id`, `competency_id`, `claimed_level`) VALUES
(1, 1, 4),
(1, 2, 4),
(1, 3, 3),
(2, 2, 3),
(2, 3, 3),
(3, 2, 4),
(4, 3, 3),
(5, 4, 3),
(6, 5, 3);

-- 10. EVIDENCE VERIFICATIONS
INSERT INTO `evidence_verifications` (`verification_id`, `evidence_id`, `reviewer_id`, `previous_status`, `new_status`, `feedback`) VALUES
(1, 1, 1, 'PENDING', 'APPROVED', 'Exceptional software construction. Clean separation of concerns, Singleton connection pool, and Factory evidence processing verified.'),
(2, 2, 1, 'PENDING', 'APPROVED', 'Outstanding FYP milestone demonstration. Meets all accreditation benchmarks for NUST software engineering deliverables.'),
(3, 3, 2, 'PENDING', 'APPROVED', 'Verified upstream pull request. Demonstrates high rigor in collaborative version control.');

-- 11. ROADMAP ITEMS
INSERT INTO `roadmap_items` (`item_id`, `user_id`, `career_id`, `title`, `description`, `target_week`, `estimated_hours`, `deliverable`, `is_completed`, `completed_at`) VALUES
(1, 1, 1, 'Architect Relational Schema & Singleton Pool', 'Design 15-table 3NF schema and build resilient mysql2 pool manager.', 1, 10.0, 'Working lib/database.ts with pool and transaction support.', TRUE, NOW()),
(2, 1, 1, 'Implement GoF Patterns (Factory, Observer, Strategy, Repository)', 'Deconstruct evidence processors and verification events into classic design patterns.', 2, 14.0, 'Design pattern implementation with unit test validation.', TRUE, NOW()),
(3, 1, 1, 'Build Microservice Docker Deployment', 'Containerize Node.js and MySQL services with health checks and volume mounts.', 3, 8.0, 'Production-ready docker-compose.yml configuration.', FALSE, NULL),
(4, 1, 1, 'Prepare Technical Mock Interview with Systems Limited', 'Conduct mock coding interview focusing on relational SQL and React state management.', 4, 6.0, 'Recorded interview transcript and peer evaluation report.', FALSE, NULL);

-- 12. NOTIFICATIONS
INSERT INTO `notifications` (`notification_id`, `user_id`, `title`, `message`, `notification_type`, `is_read`, `reference_id`) VALUES
(1, 1, 'Evidence Approved! 🎉', 'Your evidence "PathProof Career Intelligence Platform" has been verified by Dr. Shahbaz Akhtar.', 'VERIFICATION', TRUE, 1),
(2, 1, 'Milestone Completed 🚀', 'Roadmap milestone "Architect Relational Schema & Singleton Pool" marked as complete.', 'ROADMAP', TRUE, 1),
(3, 1, 'Career Readiness Updated', 'Your readiness for Full-Stack Developer is now calculated at 88% (Ready).', 'READINESS', FALSE, 1);

-- 13. ACTIVITY HISTORY
INSERT INTO `activity_history` (`activity_id`, `user_id`, `action_type`, `entity_type`, `entity_id`, `description`, `metadata_json`) VALUES
(1, 1, 'USER_REGISTERED', 'users', 1, 'Hamza Tariq registered as BS Software Engineering student.', '{"university": "NUST SEECS"}'),
(2, 1, 'EVIDENCE_SUBMITTED', 'evidence_items', 1, 'Student submitted evidence "PathProof Career Intelligence Platform".', '{"type": "PROJECT"}'),
(3, 1, 'EVIDENCE_VERIFIED', 'evidence_verifications', 1, 'Dr. Shahbaz Akhtar approved evidence item #1.', '{"status": "APPROVED"}');

-- 14. COPILOT CONVERSATIONS
INSERT INTO `copilot_conversations` (`conversation_id`, `user_id`, `title`) VALUES
(1, 1, 'Full-Stack Developer Preparation & SCD Patterns');

-- 15. COPILOT MESSAGES
INSERT INTO `copilot_messages` (`message_id`, `conversation_id`, `sender`, `content`, `action_type`, `action_payload_json`, `is_fallback`) VALUES
(1, 1, 'user', 'How should I structure the Singleton connection manager and Factory evidence processors for my SCD project?', NULL, NULL, FALSE),
(2, 1, 'assistant', 'For your SCD requirements, implement DatabaseConnectionManager as a strict Singleton to guarantee a single mysql2 connection pool. Pair this with EvidenceFactory to handle Project, GitHub, Coursework, Certification, and Research evidence types seamlessly.', 'SUGGEST_ROADMAP_MILESTONE', '{"title": "Implement GoF Patterns", "target_week": 2}', FALSE);
