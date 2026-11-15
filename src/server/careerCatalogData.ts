/**
 * PathProof — Global Career Categories & Roles Expansion Catalog
 * Pure data & helper builder for the 30 global career categories and their roles.
 * Preserves existing category IDs (1..5) and career IDs (1..7) and prevents duplicates.
 */

import { Career, CareerCategory } from '../types/index.ts';

export interface GlobalCategorySeed {
  category_id: number;
  category_name: string;
  description: string;
  education_notes: string;
  salary_range_pkr: string;
  roles: Array<{
    title: string;
    summary?: string;
    focus?: string;
  }>;
}

export const GLOBAL_CAREER_CATALOG: GlobalCategorySeed[] = [
  {
    category_id: 6,
    category_name: 'Technology & Computer Science',
    description: 'Software engineering, artificial intelligence, cloud infrastructure, networking, and robotics.',
    education_notes: 'BS in Computer Science, Software Engineering, AI, Data Science, or Computer Engineering.',
    salary_range_pkr: 'PKR 100,000 – 250,000',
    roles: [
      { title: 'Software Engineer', focus: 'architecting scalable applications, clean modular systems, and production software lifecycles' },
      { title: 'Web Developer', focus: 'building interactive websites, full-stack web services, and responsive browser applications' },
      { title: 'Mobile App Developer', focus: 'creating native and cross-platform Android and iOS mobile applications' },
      { title: 'AI Engineer', focus: 'integrating foundation models, inference pipelines, and applied artificial intelligence systems' },
      { title: 'Machine Learning Engineer', focus: 'training, evaluating, and deploying predictive statistical and deep learning models' },
      { title: 'Data Scientist', focus: 'statistical modeling, experimentation, and machine learning insights from complex datasets' },
      { title: 'Cloud Engineer', focus: 'provisioning resilient cloud infrastructure, networking, and managed platform services' },
      { title: 'DevOps Engineer', focus: 'automating CI/CD pipelines, infrastructure as code, and production observability' },
      { title: 'Game Developer', focus: 'implementing interactive gameplay mechanics, real-time rendering engines, and physics loops' },
      { title: 'Database Administrator', focus: 'managing relational and distributed databases, replication, backups, and query tuning' },
      { title: 'Network Engineer', focus: 'designing, securing, and troubleshooting enterprise routing, switching, and WAN infrastructure' },
      { title: 'Robotics Engineer', focus: 'integrating embedded control systems, computer vision, and autonomous robotic actuators' },
    ],
  },
  {
    category_id: 7,
    category_name: 'Medical & Healthcare',
    description: 'Clinical medicine, surgery, dentistry, pharmacy, nursing, diagnostics, and allied healthcare.',
    education_notes: 'MBBS, BDS, Pharm-D, BSN, DPT, or BS in Allied Health Sciences with relevant licensing.',
    salary_range_pkr: 'PKR 80,000 – 250,000',
    roles: [
      { title: 'Doctor', focus: 'diagnosing illnesses, prescribing clinical treatments, and managing comprehensive patient care' },
      { title: 'Surgeon', focus: 'performing operative procedures, pre-operative assessment, and post-surgical patient recovery' },
      { title: 'Dentist', focus: 'preventive oral healthcare, restorative dental procedures, and maxillofacial diagnostics' },
      { title: 'Pharmacist', focus: 'dispensing medications safely, clinical pharmacology review, and drug interaction counseling' },
      { title: 'Nurse', focus: 'direct bedside patient care, vitals monitoring, medication administration, and clinical coordination' },
      { title: 'Cardiologist', focus: 'diagnosing and treating cardiovascular disorders, ECG interpretation, and heart health management' },
      { title: 'Neurologist', focus: 'evaluating and treating disorders of the brain, spinal cord, and peripheral nervous system' },
      { title: 'Dermatologist', focus: 'clinical diagnosis and treatment of skin, hair, and nail conditions' },
      { title: 'Pediatrician', focus: 'preventive care, immunizations, and acute medical treatment for infants and children' },
      { title: 'Psychiatrist', focus: 'medical evaluation, psychiatric diagnosis, and pharmacotherapy for mental health conditions' },
      { title: 'Physiotherapist', focus: 'physical rehabilitation, mobility restoration, and therapeutic exercise programs' },
      { title: 'Radiologist', focus: 'interpreting medical imaging including X-rays, CT scans, MRI, and diagnostic ultrasound' },
      { title: 'Medical Laboratory Scientist', focus: 'performing hematology, microbiology, and biochemical diagnostic assays' },
      { title: 'Nutritionist', focus: 'evidence-based dietary planning, metabolic health counseling, and clinical nutrition therapy' },
      { title: 'Veterinarian', focus: 'medical diagnostics, surgery, and preventive care for companion and livestock animals' },
    ],
  },
  {
    category_id: 8,
    category_name: 'Engineering',
    description: 'Civil, mechanical, electrical, chemical, aerospace, biomedical, and industrial engineering disciplines.',
    education_notes: 'BE / BS Engineering degree accredited by PEC or equivalent engineering council.',
    salary_range_pkr: 'PKR 85,000 – 220,000',
    roles: [
      { title: 'Civil Engineer', focus: 'designing structural infrastructure, transportation networks, foundations, and public works' },
      { title: 'Mechanical Engineer', focus: 'developing thermal, fluid, and mechanical machinery using CAD and manufacturing analysis' },
      { title: 'Electrical Engineer', focus: 'designing power distribution grids, electronic circuits, control systems, and instrumentation' },
      { title: 'Chemical Engineer', focus: 'optimizing industrial chemical processes, reactor design, and materials production safety' },
      { title: 'Aerospace Engineer', focus: 'aerodynamics, propulsion systems, flight mechanics, and airframe structural engineering' },
      { title: 'Biomedical Engineer', focus: 'designing medical diagnostic devices, prosthetics, and clinical instrumentation systems' },
      { title: 'Automotive Engineer', focus: 'vehicle powertrain design, chassis dynamics, safety testing, and EV integration' },
      { title: 'Environmental Engineer', focus: 'water treatment systems, pollution control engineering, and sustainable waste infrastructure' },
      { title: 'Petroleum Engineer', focus: 'reservoir modeling, drilling engineering, and hydrocarbon extraction optimization' },
      { title: 'Mechatronics Engineer', focus: 'integrating precision mechanical systems, microcontrollers, sensors, and industrial automation' },
    ],
  },
  {
    category_id: 9,
    category_name: 'Business & Management',
    description: 'Organizational strategy, operations, product delivery, human resources, and supply chain leadership.',
    education_notes: 'BBA, MBA, BS Management Sciences, or Engineering Management.',
    salary_range_pkr: 'PKR 80,000 – 220,000',
    roles: [
      { title: 'Business Analyst', focus: 'eliciting operational requirements, process modeling, and data-backed business cases' },
      { title: 'Business Manager', focus: 'overseeing departmental performance, commercial KPIs, budgeting, and team execution' },
      { title: 'Project Manager', focus: 'planning project schedules, managing scope and risks, and delivering cross-functional milestones' },
      { title: 'Product Manager', focus: 'defining product vision, user discovery, roadmap prioritization, and feature launches' },
      { title: 'HR Manager', focus: 'talent acquisition, compensation policy, employee relations, and organizational culture' },
      { title: 'Operations Manager', focus: 'streamlining daily service or manufacturing workflows, quality standards, and throughput' },
      { title: 'Management Consultant', focus: 'diagnosing strategic bottlenecks and advising leadership on organizational transformation' },
      { title: 'Entrepreneur', focus: 'identifying market opportunities, validating business models, and scaling independent ventures' },
      { title: 'Supply Chain Manager', focus: 'coordinating procurement, inventory control, vendor contracts, and end-to-end fulfillment' },
    ],
  },
  {
    category_id: 10,
    category_name: 'Economics & Finance',
    description: 'Financial analysis, investment banking, accounting, auditing, risk modeling, and economic policy.',
    education_notes: 'BS Economics, BS Accounting & Finance, BBA Finance, ACCA, CA, or CFA.',
    salary_range_pkr: 'PKR 85,000 – 250,000',
    roles: [
      { title: 'Economist', focus: 'analyzing macroeconomic indicators, market policy impacts, and econometric forecasts' },
      { title: 'Financial Analyst', focus: 'building financial models, variance analysis, and valuation reports for investment decisions' },
      { title: 'Investment Banker', focus: 'structuring capital raises, mergers and acquisitions, and corporate financial advisory' },
      { title: 'Accountant', focus: 'preparing financial statements, general ledger reconciliations, and IFRS compliance records' },
      { title: 'Auditor', focus: 'examining financial controls, compliance evidence, and statutory audit verification' },
      { title: 'Tax Consultant', focus: 'advising individuals and corporations on tax filings, regulatory compliance, and planning' },
      { title: 'Financial Advisor', focus: 'guiding clients on wealth allocation, retirement planning, and portfolio diversification' },
      { title: 'Actuary', focus: 'modeling insurance risk, mortality tables, and long-term financial liabilities quantitatively' },
      { title: 'Risk Analyst', focus: 'evaluating credit, market, and operational risk exposure across financial portfolios' },
      { title: 'Banking Officer', focus: 'managing commercial banking operations, credit underwriting, and client portfolio services' },
      { title: 'Investment Manager', focus: 'managing asset allocation, equity and fixed-income funds, and portfolio benchmarks' },
    ],
  },
  {
    category_id: 11,
    category_name: 'Law & Legal Studies',
    description: 'Litigation, corporate counsel, judiciary, legal research, prosecution, and international law.',
    education_notes: 'LLB / BA-LLB (Hons) and Bar Council licensing where applicable.',
    salary_range_pkr: 'PKR 70,000 – 220,000',
    roles: [
      { title: 'Lawyer', focus: 'representing clients in legal proceedings, drafting pleadings, and providing legal counsel' },
      { title: 'Judge', focus: 'presiding over court proceedings, evaluating admissible evidence, and issuing reasoned rulings' },
      { title: 'Corporate Lawyer', focus: 'structuring commercial contracts, corporate governance, M&A agreements, and regulatory filings' },
      { title: 'Criminal Lawyer', focus: 'conducting criminal defense or litigation, case investigation, and courtroom advocacy' },
      { title: 'Legal Advisor', focus: 'providing ongoing statutory compliance, contract review, and organizational risk guidance' },
      { title: 'Legal Researcher', focus: 'analyzing case law precedents, statutory amendments, and comparative legal briefs' },
      { title: 'Human Rights Lawyer', focus: 'advocating constitutional protections, public interest litigation, and civil rights compliance' },
      { title: 'Prosecutor', focus: 'evaluating investigative dossiers and presenting criminal cases on behalf of the state' },
      { title: 'International Law Specialist', focus: 'advising on cross-border treaties, trade arbitration, and international regulatory frameworks' },
    ],
  },
  {
    category_id: 12,
    category_name: 'Education & Teaching',
    description: 'K-12 instruction, higher education faculty, curriculum design, academic advising, and educational research.',
    education_notes: 'B.Ed, BS/MS in Subject Specialization, MPhil, or PhD for university faculty tracks.',
    salary_range_pkr: 'PKR 60,000 – 180,000',
    roles: [
      { title: 'School Teacher', focus: 'delivering structured classroom instruction, lesson plans, and formative student assessments' },
      { title: 'University Professor', focus: 'teaching undergraduate and graduate courses, supervising theses, and publishing academic research' },
      { title: 'Lecturer', focus: 'delivering university lectures, lab instruction, and continuous course assessment' },
      { title: 'Researcher', focus: 'designing empirical studies, analyzing scholarly findings, and publishing peer-reviewed work' },
      { title: 'Educational Consultant', focus: 'advising schools and institutions on pedagogy, accreditation standards, and learning outcomes' },
      { title: 'Curriculum Designer', focus: 'structuring course syllabi, instructional modules, rubrics, and competency frameworks' },
      { title: 'Academic Advisor', focus: 'guiding students on degree progression, course selection, and academic standing' },
    ],
  },
  {
    category_id: 13,
    category_name: 'Science & Research',
    description: 'Fundamental and applied natural sciences across physics, chemistry, biology, earth, and space research.',
    education_notes: 'BS, MS, or PhD in Physics, Chemistry, Biology, Biotechnology, or Earth Sciences.',
    salary_range_pkr: 'PKR 75,000 – 200,000',
    roles: [
      { title: 'Physicist', focus: 'investigating matter, energy, optics, and theoretical or experimental physical systems' },
      { title: 'Chemist', focus: 'synthesizing compounds, conducting analytical spectroscopy, and developing industrial materials' },
      { title: 'Biologist', focus: 'studying living organisms, cellular mechanisms, ecosystems, and biological experimentation' },
      { title: 'Astronomer', focus: 'analyzing observational telescope data, astrophysics models, and celestial mechanics' },
      { title: 'Geologist', focus: 'mapping rock strata, mineral resources, seismic formations, and subsurface surveys' },
      { title: 'Geneticist', focus: 'analyzing DNA sequencing, gene expression, hereditary traits, and genomic diagnostics' },
      { title: 'Microbiologist', focus: 'culturing and characterizing microorganisms for clinical, food safety, and biotech labs' },
      { title: 'Research Scientist', focus: 'leading experimental R&D protocols, laboratory validation, and technical publications' },
      { title: 'Environmental Scientist', focus: 'monitoring ecological indicators, air and water quality, and environmental impact assessments' },
    ],
  },
  {
    category_id: 14,
    category_name: 'Arts & Creative Industries',
    description: 'Visual communication, animation, film production, photography, audio engineering, and creative direction.',
    education_notes: 'BFA, B.Des, BS Multimedia & Animation, or strong portfolio of creative production.',
    salary_range_pkr: 'PKR 65,000 – 190,000',
    roles: [
      { title: 'Graphic Designer', focus: 'crafting brand visual identities, typography, editorial layouts, and digital assets' },
      { title: 'Animator', focus: 'producing 2D and 3D character motion, storyboards, and frame-accurate visual storytelling' },
      { title: 'Illustrator', focus: 'creating original editorial, book, concept, and commercial vector or digital artwork' },
      { title: 'Photographer', focus: 'composing editorial, commercial, and documentary photography with studio lighting mastery' },
      { title: 'Filmmaker', focus: 'directing narrative and documentary productions from script breakdown through cinematography' },
      { title: 'Video Editor', focus: 'assembling narrative pacing, color grading, sound sync, and post-production cuts' },
      { title: '3D Artist', focus: 'modeling, texturing, rigging, and lighting 3D assets for games, film, and visualization' },
      { title: 'Interior Designer', focus: 'planning functional indoor aesthetics, materials palettes, lighting, and spatial ergonomics' },
      { title: 'Music Producer', focus: 'arranging compositions, recording instrumentation, mixing, and mastering audio tracks' },
      { title: 'Creative Director', focus: 'leading multidisciplinary creative vision, brand storytelling, and campaign quality' },
    ],
  },
  {
    category_id: 15,
    category_name: 'Media & Journalism',
    description: 'News reporting, editorial publishing, digital content production, broadcasting, and public relations.',
    education_notes: 'BS Mass Communication, Journalism, Media Studies, or Digital Media.',
    salary_range_pkr: 'PKR 65,000 – 180,000',
    roles: [
      { title: 'Journalist', focus: 'investigating public-interest stories, interviewing primary sources, and fact-checked reporting' },
      { title: 'News Reporter', focus: 'covering breaking developments, live field dispatches, and daily news desk filing' },
      { title: 'Editor', focus: 'reviewing manuscripts for factual accuracy, editorial tone, structure, and publication standards' },
      { title: 'Content Creator', focus: 'producing engaging multi-format digital storytelling across video, audio, and written channels' },
      { title: 'Documentary Producer', focus: 'researching, scripting, financing, and overseeing non-fiction documentary films' },
      { title: 'Broadcast Presenter', focus: 'anchoring live television or radio segments, moderating panels, and conducting on-air interviews' },
      { title: 'Public Relations Specialist', focus: 'managing media outreach, press releases, crisis communications, and stakeholder reputation' },
    ],
  },
  {
    category_id: 16,
    category_name: 'Architecture & Construction',
    description: 'Architectural design, urban planning, structural drafting, landscape design, and construction management.',
    education_notes: 'B.Arch (PCATP accredited), BS Civil/Construction Management, or Urban Planning degree.',
    salary_range_pkr: 'PKR 75,000 – 210,000',
    roles: [
      { title: 'Architect', focus: 'designing building concepts, BIM models, spatial circulation, and construction documentation' },
      { title: 'Interior Architect', focus: 'reconfiguring interior structural partitions, adaptive reuse, and technical fit-out plans' },
      { title: 'Urban Planner', focus: 'developing zoning frameworks, transit corridors, and sustainable municipal land-use masterplans' },
      { title: 'Landscape Architect', focus: 'designing public parks, ecological drainage, and outdoor civic environments' },
      { title: 'Construction Manager', focus: 'coordinating site contractors, safety compliance, schedules, and civil build execution' },
      { title: 'Quantity Surveyor', focus: 'preparing bills of quantities, cost estimates, tender evaluations, and contract valuations' },
      { title: 'Structural Designer', focus: 'drafting load-bearing framing layouts, reinforcement detailing, and structural CAD specs' },
    ],
  },
  {
    category_id: 17,
    category_name: 'Social Sciences',
    description: 'Sociology, political analysis, anthropology, social work, criminology, history, and human geography.',
    education_notes: 'BS / MS in Sociology, Political Science, Anthropology, History, or Social Work.',
    salary_range_pkr: 'PKR 60,000 – 160,000',
    roles: [
      { title: 'Sociologist', focus: 'researching social institutions, demographic shifts, and community dynamics through field surveys' },
      { title: 'Political Scientist', focus: 'analyzing governance systems, electoral behavior, legislative processes, and political institutions' },
      { title: 'Anthropologist', focus: 'conducting ethnographic fieldwork, cultural heritage studies, and qualitative human analysis' },
      { title: 'Social Worker', focus: 'supporting vulnerable families, community welfare programs, and case management advocacy' },
      { title: 'Criminologist', focus: 'studying crime patterns, justice system outcomes, and evidence-based prevention strategies' },
      { title: 'Historian', focus: 'archival research, primary source verification, and historical synthesis' },
      { title: 'Geographer', focus: 'analyzing spatial GIS datasets, regional development patterns, and human-environment interaction' },
    ],
  },
  {
    category_id: 18,
    category_name: 'Psychology & Mental Health',
    description: 'Clinical assessment, counseling therapy, educational psychology, organizational behavior, and research.',
    education_notes: 'BS / MS / MPhil in Clinical, Counseling, Educational, or Applied Psychology.',
    salary_range_pkr: 'PKR 65,000 – 180,000',
    roles: [
      { title: 'Clinical Psychologist', focus: 'conducting psychodiagnostic assessments and evidence-based psychotherapy for patients' },
      { title: 'Counseling Psychologist', focus: 'providing structured guidance for life transitions, stress, grief, and interpersonal wellbeing' },
      { title: 'Educational Psychologist', focus: 'assessing learning differences and designing supportive academic interventions for students' },
      { title: 'Industrial Psychologist', focus: 'applying behavioral science to workplace culture, psychometric hiring, and leadership effectiveness' },
      { title: 'Behavioral Researcher', focus: 'designing cognitive and behavioral experiments and analyzing psychometric datasets' },
    ],
  },
  {
    category_id: 19,
    category_name: 'Government & Public Administration',
    description: 'Public policy, civil service administration, regulatory governance, and strategic intelligence.',
    education_notes: 'BS Public Administration, Public Policy, Governance, or CSS / PMS competitive tracks.',
    salary_range_pkr: 'PKR 75,000 – 200,000',
    roles: [
      { title: 'Civil Servant', focus: 'implementing public sector programs, district administration, and statutory citizen services' },
      { title: 'Government Officer', focus: 'managing agency operations, regulatory compliance, and inter-departmental coordination' },
      { title: 'Policy Analyst', focus: 'evaluating public policy proposals, cost-benefit evidence, and legislative impact briefs' },
      { title: 'Public Administrator', focus: 'directing municipal budgets, civil operations, and transparent public service delivery' },
      { title: 'Intelligence Analyst', focus: 'synthesizing open-source and strategic security reporting for institutional decision-makers' },
    ],
  },
  {
    category_id: 20,
    category_name: 'International Relations',
    description: 'Diplomacy, foreign service, international development, geopolitical risk, and global policy research.',
    education_notes: 'BS / MS in International Relations, Global Affairs, Peace & Conflict Studies, or Political Science.',
    salary_range_pkr: 'PKR 80,000 – 220,000',
    roles: [
      { title: 'Diplomat', focus: 'representing national interests abroad, bilateral negotiations, and consular coordination' },
      { title: 'Foreign Affairs Officer', focus: 'drafting diplomatic cables, monitoring regional treaties, and coordinating foreign missions' },
      { title: 'International Development Specialist', focus: 'designing and evaluating multilateral donor-funded programs in health, education, and infrastructure' },
      { title: 'Political Risk Analyst', focus: 'assessing geopolitical stability, regulatory shifts, and cross-border investment risk' },
      { title: 'International Policy Researcher', focus: 'producing policy papers on trade corridors, climate diplomacy, and multilateral governance' },
    ],
  },
  {
    category_id: 21,
    category_name: 'Agriculture & Forestry',
    description: 'Agronomy, agricultural engineering, food science, horticulture, and sustainable forestry.',
    education_notes: 'B.Sc (Hons) Agriculture, Food Science & Technology, Agricultural Engineering, or Forestry.',
    salary_range_pkr: 'PKR 65,000 – 170,000',
    roles: [
      { title: 'Agricultural Engineer', focus: 'designing precision irrigation systems, farm mechanization, and post-harvest storage engineering' },
      { title: 'Agronomist', focus: 'optimizing crop yields, soil fertility management, and climate-resilient cultivation practices' },
      { title: 'Agricultural Scientist', focus: 'researching crop genetics, pest resistance, and sustainable farming innovations' },
      { title: 'Food Scientist', focus: 'developing food safety testing protocols, nutritional preservation, and processing standards' },
      { title: 'Horticulturist', focus: 'managing orchard cultivation, greenhouse propagation, and high-value specialty crops' },
      { title: 'Forestry Specialist', focus: 'overseeing watershed conservation, reforestation programs, and sustainable timber ecology' },
    ],
  },
  {
    category_id: 22,
    category_name: 'Environmental Science',
    description: 'Climate science, environmental consulting, conservation biology, wildlife protection, and sustainability.',
    education_notes: 'BS / MS in Environmental Science, Climate Change, Ecology, or Natural Resource Management.',
    salary_range_pkr: 'PKR 70,000 – 180,000',
    roles: [
      { title: 'Environmental Consultant', focus: 'preparing Environmental Impact Assessments (EIA), audit reports, and regulatory compliance plans' },
      { title: 'Climate Scientist', focus: 'analyzing atmospheric datasets, climate projections, and regional adaptation modeling' },
      { title: 'Conservation Scientist', focus: 'protecting biodiversity corridors, habitat restoration, and natural resource stewardship' },
      { title: 'Wildlife Biologist', focus: 'conducting field surveys of wildlife populations, migration tracking, and species conservation' },
      { title: 'Sustainability Specialist', focus: 'measuring corporate ESG metrics, carbon footprint reduction, and circular supply initiatives' },
    ],
  },
  {
    category_id: 23,
    category_name: 'Aviation & Aerospace',
    description: 'Commercial flight operations, air traffic control, aircraft engineering, maintenance, and aviation management.',
    education_notes: 'CPL/ATPL licensing, CAA Aircraft Maintenance Engineering license, or BS Aerospace/Aviation Management.',
    salary_range_pkr: 'PKR 110,000 – 350,000',
    roles: [
      { title: 'Pilot', focus: 'operating commercial or charter aircraft safely, flight planning, and cockpit resource management' },
      { title: 'Aircraft Engineer', focus: 'certifying airframe systems, avionics diagnostics, and aviation airworthiness engineering' },
      { title: 'Aerospace Scientist', focus: 'researching flight physics, orbital mechanics, and next-generation propulsion materials' },
      { title: 'Air Traffic Controller', focus: 'directing safe aircraft separation, radar vectors, and airport runway sequencing' },
      { title: 'Aviation Manager', focus: 'overseeing airline ground operations, fleet scheduling, safety compliance, and terminal logistics' },
      { title: 'Aircraft Maintenance Engineer', focus: 'performing scheduled airframe, engine, and avionics inspections under CAA regulations' },
    ],
  },
  {
    category_id: 24,
    category_name: 'Hospitality & Tourism',
    description: 'Hotel operations, culinary arts, destination management, event planning, and travel consulting.',
    education_notes: 'BS Hospitality & Tourism Management, Culinary Arts Diploma, or Event Management.',
    salary_range_pkr: 'PKR 60,000 – 170,000',
    roles: [
      { title: 'Hotel Manager', focus: 'directing guest experience, front-office operations, revenue management, and property standards' },
      { title: 'Chef', focus: 'leading kitchen operations, menu development, culinary execution, and food hygiene controls' },
      { title: 'Tourism Manager', focus: 'developing sustainable travel destinations, tour operator partnerships, and visitor programs' },
      { title: 'Event Planner', focus: 'coordinating conferences, corporate summits, vendor logistics, and live event timelines' },
      { title: 'Travel Consultant', focus: 'designing customized itineraries, ticketing logistics, visa guidance, and corporate travel support' },
      { title: 'Hospitality Manager', focus: 'overseeing service quality across resorts, food & beverage outlets, and guest relations' },
    ],
  },
  {
    category_id: 25,
    category_name: 'Sports & Physical Education',
    description: 'Athletic competition, coaching, sports science, strength conditioning, rehabilitation, and sports administration.',
    education_notes: 'BS Sports Sciences & Physical Education, coaching certifications, or Physiotherapy degree.',
    salary_range_pkr: 'PKR 60,000 – 180,000',
    roles: [
      { title: 'Professional Athlete', focus: 'structured high-performance training, competitive match preparation, and tactical discipline' },
      { title: 'Sports Coach', focus: 'designing team tactics, skill drills, athlete mentoring, and season training periodization' },
      { title: 'Sports Scientist', focus: 'analyzing biomechanics, physiological load metrics, and recovery optimization for athletes' },
      { title: 'Fitness Trainer', focus: 'building personalized strength, conditioning, and safe functional movement programs' },
      { title: 'Sports Physiotherapist', focus: 'treating athletic injuries, return-to-play rehabilitation, and preventive mobility taping' },
      { title: 'Sports Manager', focus: 'managing club operations, sponsorships, tournament scheduling, and athlete contracts' },
    ],
  },
  {
    category_id: 26,
    category_name: 'Fashion & Beauty',
    description: 'Apparel design, textile styling, makeup artistry, fashion illustration, beauty therapy, and merchandising.',
    education_notes: 'B.Des Fashion Design, Textile Design, Cosmetology certification, or Merchandising degree.',
    salary_range_pkr: 'PKR 60,000 – 180,000',
    roles: [
      { title: 'Fashion Designer', focus: 'sketching apparel collections, pattern draping, fabric sourcing, and garment prototyping' },
      { title: 'Makeup Artist', focus: 'editorial, bridal, and film makeup artistry with color theory and skin preparation' },
      { title: 'Stylist', focus: 'curating wardrobe aesthetics, editorial lookbooks, and personal or commercial styling shoots' },
      { title: 'Fashion Illustrator', focus: 'rendering expressive garment silhouettes, textile textures, and collection moodboards' },
      { title: 'Beauty Therapist', focus: 'providing clinical skincare treatments, facial aesthetics, and client wellness consultations' },
      { title: 'Fashion Merchandiser', focus: 'forecasting seasonal retail demand, assortment buying, pricing, and inventory sell-through' },
    ],
  },
  {
    category_id: 27,
    category_name: 'Marketing & Advertising',
    description: 'Digital growth, search optimization, brand strategy, social media campaigns, and market research.',
    education_notes: 'BBA Marketing, BS Digital Media, or specialized performance marketing certifications.',
    salary_range_pkr: 'PKR 70,000 – 200,000',
    roles: [
      { title: 'Digital Marketer', focus: 'running multi-channel acquisition campaigns, conversion funnels, and performance analytics' },
      { title: 'SEO Specialist', focus: 'improving organic search visibility via technical audits, keyword strategy, and content structure' },
      { title: 'Marketing Manager', focus: 'owning go-to-market strategy, campaign budgets, customer positioning, and pipeline growth' },
      { title: 'Brand Manager', focus: 'shaping brand equity, packaging messaging, consumer perception, and product launches' },
      { title: 'Social Media Manager', focus: 'planning editorial calendars, community engagement, short-form campaigns, and reach metrics' },
      { title: 'Advertising Strategist', focus: 'crafting creative media briefs, audience segmentation, and cross-channel ad placement' },
      { title: 'Market Research Analyst', focus: 'conducting consumer surveys, focus groups, and competitive pricing intelligence' },
    ],
  },
  {
    category_id: 28,
    category_name: 'Mathematics & Statistics',
    description: 'Pure and applied mathematics, statistical inference, quantitative finance, and operations optimization.',
    education_notes: 'BS / MS in Mathematics, Statistics, Applied Mathematics, or Quantitative Economics.',
    salary_range_pkr: 'PKR 85,000 – 240,000',
    roles: [
      { title: 'Mathematician', focus: 'formulating mathematical models, numerical algorithms, and analytical proofs for complex problems' },
      { title: 'Statistician', focus: 'designing sampling experiments, hypothesis testing, and Bayesian or regression models' },
      { title: 'Quantitative Analyst', focus: 'developing pricing models, algorithmic trading strategies, and stochastic risk simulations' },
      { title: 'Operations Research Analyst', focus: 'applying linear programming, queuing theory, and optimization to resource allocation' },
    ],
  },
  {
    category_id: 29,
    category_name: 'Skilled Trades & Technical Professions',
    description: 'Licensed electrical, plumbing, welding, automotive diagnostics, HVAC, and industrial maintenance trades.',
    education_notes: 'DAE (Diploma of Associate Engineer), TEVTA / NAVTTC Trade Certification, and apprenticeship.',
    salary_range_pkr: 'PKR 55,000 – 150,000',
    roles: [
      { title: 'Electrician', focus: 'installing, testing, and troubleshooting residential and industrial electrical wiring and panels' },
      { title: 'Plumber', focus: 'installing and repairing potable water piping, drainage networks, and sanitary fixtures' },
      { title: 'Welder', focus: 'performing structural MIG, TIG, and arc welding with blueprint tolerances and safety inspection' },
      { title: 'Automotive Technician', focus: 'diagnosing engine, transmission, electrical OBD-II faults, and mechanical vehicle repairs' },
      { title: 'HVAC Technician', focus: 'installing, servicing, and balancing heating, ventilation, refrigeration, and chiller units' },
      { title: 'Industrial Technician', focus: 'maintaining factory CNC machinery, PLC panels, pneumatics, and preventive plant checks' },
    ],
  },
  {
    category_id: 30,
    category_name: 'Military & Defense',
    description: 'Commissioned defense command, defense systems engineering, strategic doctrine, and aerospace defense.',
    education_notes: 'Military Academy commissioning, BS Defense & Strategic Studies, or Aerospace/Defense Engineering.',
    salary_range_pkr: 'PKR 90,000 – 240,000',
    roles: [
      { title: 'Military Officer', focus: 'commanding operational units, mission readiness planning, and disciplined personnel leadership' },
      { title: 'Defense Engineer', focus: 'developing hardened communications, radar, ballistics, and ruggedized defense hardware' },
      { title: 'Military Strategist', focus: 'evaluating operational doctrine, logistics readiness, and scenario wargaming' },
      { title: 'Defense Researcher', focus: 'conducting applied R&D on defense materials, electronic warfare, and threat countermeasures' },
      { title: 'Aerospace Defense Specialist', focus: 'integrating air-defense tracking systems, unmanned aerial platforms, and avionics security' },
    ],
  },
  {
    category_id: 31,
    category_name: 'Transportation & Logistics',
    description: 'Freight management, supply chain analytics, transit planning, aviation cargo, and fleet operations.',
    education_notes: 'BS Supply Chain & Logistics, Transportation Engineering, or Operations Management.',
    salary_range_pkr: 'PKR 75,000 – 190,000',
    roles: [
      { title: 'Logistics Manager', focus: 'managing warehousing, freight forwarding, customs clearance, and on-time distribution' },
      { title: 'Supply Chain Analyst', focus: 'analyzing inventory turnover, lead-time variance, and supplier network KPIs' },
      { title: 'Transportation Planner', focus: 'modeling urban transit demand, freight corridors, and traffic network efficiency' },
      { title: 'Aviation Logistics Specialist', focus: 'coordinating air cargo load planning, dangerous goods compliance, and charter routing' },
      { title: 'Fleet Manager', focus: 'overseeing commercial vehicle dispatch, fuel efficiency, telematics, and maintenance schedules' },
    ],
  },
  {
    category_id: 32,
    category_name: 'Real Estate & Property',
    description: 'Property brokerage, asset management, real estate investment analysis, development, and advisory.',
    education_notes: 'BBA Real Estate / Finance, Civil Engineering, Urban Studies, or RERA/Brokerage licensing.',
    salary_range_pkr: 'PKR 70,000 – 220,000',
    roles: [
      { title: 'Real Estate Agent', focus: 'representing buyers and sellers, property valuations, viewings, and transaction closings' },
      { title: 'Property Manager', focus: 'overseeing tenant leasing, building maintenance, rent collection, and occupancy retention' },
      { title: 'Real Estate Analyst', focus: 'modeling cap rates, cash-flow underwriting, and urban market absorption trends' },
      { title: 'Property Developer', focus: 'acquiring land parcels, securing zoning approvals, and delivering residential or commercial projects' },
      { title: 'Real Estate Consultant', focus: 'advising institutional and private clients on portfolio feasibility and highest-and-best land use' },
    ],
  },
  {
    category_id: 33,
    category_name: 'Entrepreneurship & Startups',
    description: 'Venture creation, small business ownership, startup advisory, innovation management, and venture capital.',
    education_notes: 'Any undergraduate discipline paired with venture incubation, BBA Entrepreneurship, or Finance.',
    salary_range_pkr: 'PKR 80,000 – 300,000+',
    roles: [
      { title: 'Startup Founder', focus: 'validating customer pain points, launching MVPs, fundraising, and leading early-stage teams' },
      { title: 'Business Owner', focus: 'managing independent commercial operations, cash flow, customer retention, and local growth' },
      { title: 'Startup Consultant', focus: 'coaching early-stage founders on pitch decks, unit economics, and go-to-market strategy' },
      { title: 'Innovation Manager', focus: 'running corporate venture labs, rapid prototyping sprints, and emerging product pilots' },
      { title: 'Venture Capital Analyst', focus: 'sourcing startup deal flow, performing market due diligence, and tracking portfolio metrics' },
    ],
  },
  {
    category_id: 34,
    category_name: 'Energy & Renewable Resources',
    description: 'Clean energy engineering, solar PV deployment, power analytics, and nuclear energy systems.',
    education_notes: 'BE Electrical, Mechanical, Energy Engineering, or MS Renewable Energy Systems.',
    salary_range_pkr: 'PKR 90,000 – 240,000',
    roles: [
      { title: 'Renewable Energy Engineer', focus: 'designing wind, hydro, and hybrid microgrid power generation and storage installations' },
      { title: 'Solar Energy Specialist', focus: 'sizing commercial and residential photovoltaic arrays, inverter layouts, and net-metering compliance' },
      { title: 'Energy Analyst', focus: 'evaluating power tariffs, grid load curves, energy efficiency audits, and decarbonization ROI' },
      { title: 'Nuclear Engineer', focus: 'monitoring reactor physics, radiation safety shielding, and nuclear power plant operations' },
    ],
  },
  {
    category_id: 35,
    category_name: 'Emerging Technologies',
    description: 'Frontier computing across AI research, ethics, quantum engineering, Web3, autonomy, and space tech.',
    education_notes: 'BS/MS in Computer Science, AI, Physics, Electrical Engineering, or Robotics.',
    salary_range_pkr: 'PKR 130,000 – 320,000',
    roles: [
      { title: 'AI Researcher', focus: 'advancing novel neural architectures, alignment methods, and peer-reviewed AI breakthroughs' },
      { title: 'AI Ethics Specialist', focus: 'auditing algorithmic fairness, privacy safeguards, safety governance, and responsible AI compliance' },
      { title: 'Quantum Computing Engineer', focus: 'implementing quantum circuits, error-mitigation algorithms, and cryogenic or QPU control software' },
      { title: 'Blockchain Developer', focus: 'writing audited smart contracts, decentralized protocols, and cryptographic consensus tools' },
      { title: 'Autonomous Systems Engineer', focus: 'building sensor fusion, SLAM localization, and real-time path planning for self-driving platforms' },
      { title: 'Space Technology Engineer', focus: 'developing CubeSat payloads, telemetry links, and radiation-hardened orbital subsystems' },
    ],
  },
];

export interface ExpandedCatalogSeed {
  categories: CareerCategory[];
  careers: Career[];
  nextCategoryId: number;
  nextCareerId: number;
}

/**
 * Generates deterministic, deduplicated global categories and career entities
 * without colliding with existing categories or existing career titles.
 */
export function buildExpandedCareerCatalog(
  existingCategories: CareerCategory[],
  existingCareers: Career[],
  timestamp: string
): ExpandedCatalogSeed {
  const existingCatNames = new Set(existingCategories.map((c) => c.category_name.trim().toLowerCase()));
  const existingCareerTitles = new Set(existingCareers.map((c) => c.career_title.trim().toLowerCase()));

  let nextCategoryId = existingCategories.reduce((max, c) => Math.max(max, c.category_id), 0) + 1;
  let nextCareerId = existingCareers.reduce((max, c) => Math.max(max, c.career_id), 0) + 1;

  const categoriesToAdd: CareerCategory[] = [];
  const careersToAdd: Career[] = [];

  const catNameToId = new Map<string, number>();
  for (const c of existingCategories) {
    catNameToId.set(c.category_name.trim().toLowerCase(), c.category_id);
  }

  for (const group of GLOBAL_CAREER_CATALOG) {
    const normalizedCatName = group.category_name.trim().toLowerCase();
    let categoryId = catNameToId.get(normalizedCatName);

    if (!categoryId) {
      categoryId = Math.max(group.category_id, nextCategoryId);
      if (categoryId >= nextCategoryId) {
        nextCategoryId = categoryId + 1;
      }
      catNameToId.set(normalizedCatName, categoryId);
      existingCatNames.add(normalizedCatName);
      categoriesToAdd.push({
        category_id: categoryId,
        category_name: group.category_name,
        description: group.description,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }

    for (const role of group.roles) {
      const normalizedTitle = role.title.trim().toLowerCase();
      if (existingCareerTitles.has(normalizedTitle)) {
        continue;
      }
      existingCareerTitles.add(normalizedTitle);

      const careerId = nextCareerId++;
      const focus = role.focus || `delivering core ${group.category_name.toLowerCase()} outcomes`;
      const summary =
        role.summary ||
        `Specializes in ${focus} within the ${group.category_name} domain.`;

      careersToAdd.push({
        career_id: careerId,
        category_id: categoryId,
        career_title: role.title,
        summary,
        description: `${role.title} professionals work within ${group.category_name}, focusing on ${focus}. This role combines domain expertise, structured problem solving, and collaborative execution in real-world teams.`,
        responsibilities: `Plan and execute core ${role.title} deliverables; maintain domain quality and compliance standards; collaborate with multidisciplinary teams and stakeholders; document workflows and measurable outcomes.`,
        entry_level_tasks: `Assist senior ${role.title} specialists with foundational research, analysis, and execution; prepare structured reports and deliverables; build portfolio evidence aligned with entry-level industry benchmarks.`,
        education_notes: group.education_notes,
        publication_status: 'PUBLISHED',
        last_reviewed_at: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }
  }

  return {
    categories: categoriesToAdd,
    careers: careersToAdd,
    nextCategoryId,
    nextCareerId,
  };
}
