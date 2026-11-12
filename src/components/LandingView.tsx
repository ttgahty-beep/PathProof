/**
 * PathProof — Commercial Landing Page
 * Designed following UniDesk design inspiration + Warm Paper & Forest Green aesthetic.
 * Headline: "Your degree is a start. Make it count."
 * Supporting: "Turn your interests, skills, academic experience and career goals into a practical roadmap backed by evidence."
 */

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  MapPin,
  Target,
  Bot,
} from 'lucide-react';
import { Career, CareerMarketSummary } from '../types/index.ts';

interface LandingViewProps {
  careers: Career[];
  marketSummaries: Record<number, CareerMarketSummary>;
  onEnterDashboard: (tab?: string) => void;
  onOpenReport: (careerId: number) => void;
  onOpenAuth: () => void;
  onQuickSwitchUser: (type: 'student' | 'admin' | 'student2') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  careers,
  marketSummaries,
  onEnterDashboard,
  onOpenReport,
  onOpenAuth,
  onQuickSwitchUser,
}) => {
  const [selectedDemoRole, setSelectedDemoRole] = useState<number>(1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [copilotDemoTopic, setCopilotDemoTopic] = useState<'systems' | 'gaps' | 'roadmap'>('roadmap');

  const demoRoles = [
    {
      id: 1,
      title: 'Full-Stack Web Engineer',
      category: 'Software Engineering',
      alignment: 82,
      skillCoverage: 67,
      sampleSize: 4,
      employers: 'Systems Ltd · Techlogix · 10Pearls',
      avgSalary: 'PKR 85,000 – 135,000',
      nextAction: 'Level up Next.js & Server Components to Intermediate (+15% coverage gain)',
      topSkills: [
        { name: 'JavaScript / TypeScript', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'React.js', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'Next.js', status: 'DEVELOPING', level: '1/3' },
        { name: 'PostgreSQL', status: 'DEVELOPING', level: '2/3' },
        { name: 'Docker / Containers', status: 'MISSING', level: '0/2' },
      ],
    },
    {
      id: 2,
      title: 'Mobile App Engineer (Flutter)',
      category: 'Mobile Development',
      alignment: 74,
      skillCoverage: 58,
      sampleSize: 4,
      employers: 'Devsinc · Arbisoft · VentureDive',
      avgSalary: 'PKR 80,000 – 130,000',
      nextAction: 'Build an offline-first state management demo with Bloc (+18% coverage)',
      topSkills: [
        { name: 'Dart / Flutter', status: 'DEVELOPING', level: '2/3' },
        { name: 'REST APIs', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'State Management (Bloc)', status: 'DEVELOPING', level: '1/3' },
        { name: 'CI/CD Fastlane', status: 'MISSING', level: '0/2' },
      ],
    },
    {
      id: 3,
      title: 'SQA Engineer (Automation)',
      category: 'Quality Assurance',
      alignment: 89,
      skillCoverage: 78,
      sampleSize: 4,
      employers: '10Pearls · Techlogix · Afiniti',
      avgSalary: 'PKR 75,000 – 120,000',
      nextAction: 'Write automated Playwright regression specs for an active semester project',
      topSkills: [
        { name: 'Selenium / Playwright', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'Test Plan Design', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'Postman / API Testing', status: 'MEETS_TARGET', level: '3/3' },
        { name: 'CI Integration', status: 'DEVELOPING', level: '1/2' },
      ],
    },
  ];

  const currentDemo = demoRoles.find((r) => r.id === selectedDemoRole) || demoRoles[0];

  const filteredCareers = careers.filter((c) => {
    if (activeCategoryFilter === 'ALL') return true;
    return c.category_name === activeCategoryFilter;
  });

  const categories = ['ALL', 'Software Development', 'Quality Assurance', 'Data & Analytics', 'Cloud & Infrastructure'];

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#202A23] font-sans antialiased selection:bg-[#244B3A] selection:text-white">
      {/* ----------------------------------------------------------------- */}
      {/* SECTION A: TOP BAR CONTRACT                                       */}
      {/* Exactly 3 zones: [Brand wordmark] - [4-5 links] - [1 action CTA]  */}
      {/* ----------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#F7F6F0]/95 backdrop-blur-md border-b border-[#E5E4DA] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (one element, no subtitles) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2.5 text-xl font-bold tracking-tight text-[#173629] whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#173629] flex items-center justify-center text-white shadow-sm group-hover:bg-[#244B3A] transition-colors">
              <Compass className="w-5 h-5 text-[#D8E99A]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#173629]">PathProof</span>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#485347]">
            <a
              href="#careers"
              className="hover:text-[#173629] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Explore Careers
            </a>
            <a
              href="#skill-gaps"
              className="hover:text-[#173629] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Skill Gaps
            </a>
            <a
              href="#copilot-mentor"
              className="hover:text-[#173629] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 font-semibold text-[#173629]"
            >
              <Bot className="w-4 h-4 text-[#244B3A]" />
              <span>Copilot Mentor</span>
            </a>
            <a
              href="#roadmap"
              className="hover:text-[#173629] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Roadmap
            </a>
            <a
              href="#job-reality"
              className="hover:text-[#173629] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Pakistan Job Reality
            </a>
          </nav>

          {/* Zone 3: Primary Action / Sign In Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth()}
              className="text-xs sm:text-sm font-semibold text-[#173629] hover:text-[#244B3A] px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterDashboard('overview')}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#173629] hover:bg-[#244B3A] rounded-lg transition-all shadow-sm flex items-center space-x-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <span className="hidden sm:inline">Launch Student Workspace</span>
              <span className="sm:hidden">Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#D8E99A]" />
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION B: HERO SECTION & INTERACTIVE WORKSPACE PREVIEW           */}
      {/* ----------------------------------------------------------------- */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E5E4DA] bg-gradient-to-b from-[#F7F6F0] via-[#F4F3EB] to-[#EFEEE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left 7 Columns: Editorial Headline, Supporting Copy, Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              {/* Contextual Kicker (No pill badge - clean unboxed text) */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#244B3A]">
                <span>HEC CURRICULUM COMPLIANT</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span>PAKISTAN COMPUTING INDUSTRY EVIDENCE</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span>BS CS / SE / IT</span>
              </div>

              {/* Core Brand Message */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173629] tracking-tight leading-[1.08] max-w-2xl text-balance">
                Your degree is a start.{' '}
                <span className="text-[#244B3A] underline decoration-[#D8E99A] decoration-4 underline-offset-4">
                  Make it count.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg sm:text-xl text-[#485347] font-normal leading-relaxed max-w-xl text-balance">
                Turn your interests, skills, academic coursework and career goals into a practical, semester-by-semester roadmap backed by empirical hiring evidence from Pakistani software houses.
              </p>

              {/* CTAs & Quick Persona Exploration */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onEnterDashboard('overview')}
                  className="px-6 py-3.5 bg-[#173629] hover:bg-[#244B3A] text-white text-base font-semibold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer group"
                >
                  <span>Explore Live Student Dashboard</span>
                  <ArrowRight className="w-5 h-5 text-[#D8E99A] group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#careers"
                  className="px-5 py-3.5 bg-white hover:bg-[#FAF9F5] text-[#173629] text-base font-semibold rounded-xl border border-[#E5E4DA] shadow-xs flex items-center justify-center transition-all"
                >
                  Browse 6 Target Roles
                </a>
              </div>

              {/* Quick Persona Fast Switcher Pills */}
              <div className="pt-2 flex items-center gap-2 text-xs text-[#5B675A] flex-wrap">
                <span className="font-medium text-[#202A23]">Try immediate demo persona:</span>
                <button
                  onClick={() => {
                    onQuickSwitchUser('student');
                    onEnterDashboard('overview');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#EBF2E9] border border-[#DCE8D9] rounded-md font-medium text-[#173629] transition-colors cursor-pointer"
                >
                  Hamza Tariq (Sem 5 SE)
                </button>
                <button
                  onClick={() => {
                    onQuickSwitchUser('student2');
                    onEnterDashboard('overview');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#EBF2E9] border border-[#DCE8D9] rounded-md font-medium text-[#173629] transition-colors cursor-pointer"
                >
                  Ayesha Khan (Sem 3 CS)
                </button>
                <button
                  onClick={() => {
                    onQuickSwitchUser('admin');
                    onEnterDashboard('admin');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] border border-[#FDE68A] rounded-md font-medium text-[#92400E] transition-colors cursor-pointer"
                >
                  Dr. Shahbaz (Faculty Admin)
                </button>
              </div>

              {/* Quantitative Adjacency Bar */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E5E4DA] text-left">
                <div>
                  <div className="text-2xl font-extrabold text-[#173629] tabular-nums font-mono">6</div>
                  <div className="text-xs text-[#657064] mt-0.5">Core Computing Careers</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#173629] tabular-nums font-mono">24+</div>
                  <div className="text-xs text-[#657064] mt-0.5">Verified Job Evidence Postings</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#173629] tabular-nums font-mono">100%</div>
                  <div className="text-xs text-[#657064] mt-0.5">Transparent 0.30A + 0.45I + 0.25W</div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Live Preview Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#E5E4DA] shadow-xl overflow-hidden">
                {/* Header of preview widget */}
                <div className="bg-[#173629] text-white p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#244B3A] border border-[#3A6B55] flex items-center justify-center font-bold text-sm text-[#D8E99A]">
                      HT
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>Hamza Tariq</span>
                        <span className="text-3xs bg-[#244B3A] text-[#DCE8D9] px-1.5 py-0.5 rounded font-mono">
                          SE SEM 5
                        </span>
                      </div>
                      <div className="text-2xs text-[#B2C5B9]">NUST · 15 hrs/wk capacity</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xs uppercase tracking-wider text-[#D8E99A] font-semibold">
                      Readiness Engine
                    </span>
                    <div className="text-xs text-white/80 font-mono">Algorithm v1.0</div>
                  </div>
                </div>

                {/* Role Switcher in Preview */}
                <div className="bg-[#EFEEE5] px-4 py-2 border-b border-[#E5E4DA] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {demoRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedDemoRole(role.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        selectedDemoRole === role.id
                          ? 'bg-[#173629] text-white shadow-xs'
                          : 'text-[#485347] hover:text-[#173629] hover:bg-white/60'
                      }`}
                    >
                      {role.title.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Scorecards */}
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#657064] mb-1">
                      <span>Evaluated Career Target</span>
                      <span>Verified Sample: {currentDemo.sampleSize} Postings</span>
                    </div>
                    <div className="text-lg font-bold text-[#173629]">{currentDemo.title}</div>
                    <div className="text-xs text-[#244B3A] font-medium mt-0.5">
                      Hiring Companies: {currentDemo.employers}
                    </div>
                  </div>

                  {/* Dual Independent Metrics (BR-11 Rule) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E5E4DA]">
                      <div className="text-3xs uppercase tracking-wider font-bold text-[#657064]">
                        Coursework & Interest Fit
                      </div>
                      <div className="text-3xl font-extrabold text-[#173629] font-mono tabular-nums mt-1">
                        {currentDemo.alignment}%
                      </div>
                      <div className="text-3xs text-[#657064] mt-1">
                        Curriculum: 30% · Interests: 45% · Work: 25%
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E5E4DA]">
                      <div className="text-3xs uppercase tracking-wider font-bold text-[#657064]">
                        Technical Skill Readiness
                      </div>
                      <div className="text-3xl font-extrabold text-[#244B3A] font-mono tabular-nums mt-1">
                        {currentDemo.skillCoverage}%
                      </div>
                      <div className="text-3xs text-[#657064] mt-1">
                        Weighted entry proficiency ratio
                      </div>
                    </div>
                  </div>

                  {/* Skill Gap mini breakdown */}
                  <div>
                    <div className="text-xs font-bold text-[#173629] mb-2 flex items-center justify-between">
                      <span>Verified Required Skills Status</span>
                      <span className="text-3xs text-[#657064]">Self-Reported vs Market Target</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentDemo.topSkills.map((sk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#EBEAE0] text-xs"
                        >
                          <span className="font-medium text-[#202A23]">{sk.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-3xs text-[#657064]">{sk.level}</span>
                            <span
                              className={`text-3xs font-bold px-2 py-0.5 rounded ${
                                sk.status === 'MEETS_TARGET'
                                  ? 'bg-[#DCE8D9] text-[#173629]'
                                  : sk.status === 'DEVELOPING'
                                  ? 'bg-[#FEF9C3] text-[#854D0E]'
                                  : 'bg-[#FEE2E2] text-[#991B1B]'
                              }`}
                            >
                              {sk.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action Box */}
                  <div className="p-3 bg-[#EBF2E9] rounded-xl border border-[#DCE8D9] flex items-start space-x-2.5">
                    <Target className="w-4 h-4 text-[#244B3A] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-[#173629]">Recommended Next Action: </span>
                      <span className="text-[#324536]">{currentDemo.nextAction}</span>
                    </div>
                  </div>

                  {/* Direct Jump to workspace */}
                  <button
                    onClick={() => onEnterDashboard('recommendations')}
                    className="w-full py-2.5 bg-[#173629] hover:bg-[#244B3A] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Inspect Full Evaluation Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8E99A]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION C: CAREER DISCOVERY CATALOGUE & MARKET HIGHLIGHTS         */}
      {/* ----------------------------------------------------------------- */}
      <section id="careers" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
              CAREER CATALOGUE & EMPIRICAL EVIDENCE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173629] tracking-tight">
              Explore 6 Core Computing Trajectories
            </h2>
            <p className="text-base text-[#5B675A] mt-2 max-w-2xl">
              Each career profile is mapped to HEC undergraduate courses and verified with direct evidence from entry-level Pakistani IT job postings.
            </p>
          </div>

          {/* Category Filter Buttons (Functional Tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#EFEEE5] rounded-xl border border-[#E5E4DA] no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-[#173629] text-white shadow-xs'
                    : 'text-[#485347] hover:text-[#173629]'
                }`}
              >
                {cat === 'ALL' ? 'All Roles' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((c) => {
            const summary = marketSummaries[c.career_id];
            const sampleCount = summary?.sampleSize || 4;
            const topSkillNames = (summary?.skillFrequencies || []).slice(0, 3).map((s) => s.skillName);

            return (
              <div
                key={c.career_id}
                className="bg-white rounded-xl border border-[#E5E4DA] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#657064] mb-2">
                    <span className="font-semibold text-[#244B3A]">{c.category_name}</span>
                    <span className="font-mono">{sampleCount} verified postings</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#173629] group-hover:text-[#244B3A] transition-colors">
                    {c.career_title}
                  </h3>
                  <p className="text-xs text-[#485347] mt-2 leading-relaxed line-clamp-3">
                    {c.summary}
                  </p>

                  {/* Key Skills from Market Observation */}
                  <div className="mt-4 pt-4 border-t border-[#F0EFE8]">
                    <div className="text-3xs font-bold uppercase tracking-wider text-[#657064] mb-2">
                      Top Verified Demands in Pakistan
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(topSkillNames.length > 0
                        ? topSkillNames
                        : ['Problem Solving', 'Git', 'Data Structures']
                      ).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#F7F6F0] border border-[#E5E4DA] rounded text-2xs font-medium text-[#202A23]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Entry Salary Range */}
                  <div className="mt-4 flex items-center justify-between text-xs text-[#485347] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EBEAE0]">
                    <span>Expected Entry Salary:</span>
                    <span className="font-bold text-[#173629] font-mono">
                      {c.career_id === 1
                        ? 'PKR 85,000 – 135,000'
                        : c.career_id === 2
                        ? 'PKR 80,000 – 130,000'
                        : c.career_id === 3
                        ? 'PKR 75,000 – 120,000'
                        : c.career_id === 4
                        ? 'PKR 95,000 – 150,000'
                        : c.career_id === 5
                        ? 'PKR 90,000 – 140,000'
                        : 'PKR 75,000 – 115,000'}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-[#F0EFE8] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenReport(c.career_id)}
                    className="px-3 py-2 text-xs font-semibold text-[#173629] bg-[#EFEEE5] hover:bg-[#E5E4DA] rounded-lg transition-colors cursor-pointer"
                  >
                    View Reality Dossier
                  </button>
                  <button
                    onClick={() => onEnterDashboard('careers')}
                    className="px-3 py-2 text-xs font-semibold text-white bg-[#173629] hover:bg-[#244B3A] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Check Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION D: SKILL GAP ANALYZER IN ACTION                           */}
      {/* ----------------------------------------------------------------- */}
      <section id="skill-gaps" className="py-16 lg:py-20 bg-[#EFEEE5] border-y border-[#E5E4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 6 Cols: Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A]">
                MATHEMATICAL TRANSPARENCY & ACCREDITATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173629] tracking-tight">
                Know Exactly What Skills You Are Missing
              </h2>
              <p className="text-base text-[#485347] leading-relaxed">
                Most career platforms give students an arbitrary score. PathProof cleanly separates your{' '}
                <strong>Curricular Alignment Fit</strong> ($0.30A + 0.45I + 0.25W$) from your{' '}
                <strong>Technical Skill Readiness</strong>, analyzing each skill across 3 clear levels:
              </p>

              <div className="space-y-3.5">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E4DA] flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-[#DCE8D9] text-[#173629] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#173629]">Meets Target (Ratio 1.0)</div>
                    <div className="text-xs text-[#5B675A] mt-0.5">
                      Your self-reported proficiency meets or exceeds entry requirements observed in Pakistani vacancies.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E5E4DA] flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-[#FEF9C3] text-[#854D0E] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ~
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#854D0E]">Developing (Ratio &gt; 0, &lt; 1.0)</div>
                    <div className="text-xs text-[#5B675A] mt-0.5">
                      You have foundational knowledge (e.g. from a university lab), but lack full project evidence or framework proficiency.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E5E4DA] flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    !
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#991B1B]">Missing (Ratio 0.0)</div>
                    <div className="text-xs text-[#5B675A] mt-0.5">
                      The market consistently requires this skill, but it is absent from your profile. We prescribe high-impact mini-tasks.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Visual Breakdown Box */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-[#E5E4DA] p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E4DA] pb-3">
                  <span className="text-xs font-bold text-[#173629]">Full-Stack Web Engineer — Skill Matrix</span>
                  <span className="text-xs font-mono font-bold text-[#244B3A]">67% Coverage</span>
                </div>

                {/* Skill Rows */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#EBEAE0] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#173629]">JavaScript / TypeScript</div>
                      <div className="text-3xs text-[#657064]">Required by 100% of sample (Systems, Techlogix)</div>
                    </div>
                    <span className="text-2xs font-bold px-2 py-1 rounded bg-[#DCE8D9] text-[#173629]">
                      MEETS TARGET (3/3)
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#EBEAE0] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#173629]">React & Modern UI</div>
                      <div className="text-3xs text-[#657064]">Required by 100% of sample</div>
                    </div>
                    <span className="text-2xs font-bold px-2 py-1 rounded bg-[#DCE8D9] text-[#173629]">
                      MEETS TARGET (3/3)
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#EBEAE0] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#854D0E]">Next.js / SSR Frameworks</div>
                      <div className="text-3xs text-[#657064]">Preferred by 75% of sample (Devsinc, Arbisoft)</div>
                    </div>
                    <span className="text-2xs font-bold px-2 py-1 rounded bg-[#FEF9C3] text-[#854D0E]">
                      DEVELOPING (1/3)
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#EBEAE0] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#991B1B]">Docker & Containerization</div>
                      <div className="text-3xs text-[#657064]">Required by 50% of junior full-stack postings</div>
                    </div>
                    <span className="text-2xs font-bold px-2 py-1 rounded bg-[#FEE2E2] text-[#991B1B]">
                      MISSING (0/2)
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onEnterDashboard('skills')}
                    className="w-full py-2.5 bg-[#173629] hover:bg-[#244B3A] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Audit Your Complete Skill Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8E99A]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION E: PERSONALIZED SEMESTER ROADMAP (4 STAGES)               */}
      {/* ----------------------------------------------------------------- */}
      <section id="roadmap" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            SEMESTER PROGRESSION MODEL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173629] tracking-tight">
            From Semester 1 to Your First Job Offer
          </h2>
          <p className="text-base text-[#5B675A] mt-2">
            A structured roadmap connecting your HEC Pakistan syllabus with industry milestones so you graduate career-ready, not bewildered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-[#244B3A] font-mono">
              STAGE 01 · SEMESTERS 1–2
            </div>
            <h3 className="text-lg font-bold text-[#173629] mt-1">Foundations & Logic</h3>
            <p className="text-xs text-[#5B675A] mt-2 leading-relaxed">
              Programming Fundamentals (C++/Java), Discrete Structures, and basic version control. Establish problem-solving discipline on LeetCode/HackerRank.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F0EFE8] text-2xs text-[#173629] font-medium">
              Milestone: First Git repository & clean CLI application.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-[#244B3A] font-mono">
              STAGE 02 · SEMESTERS 3–4
            </div>
            <h3 className="text-lg font-bold text-[#173629] mt-1">Core Computing & Databases</h3>
            <p className="text-xs text-[#5B675A] mt-2 leading-relaxed">
              Data Structures & Algorithms, OOP, Database Systems (SQL), and Operating Systems. Connect frontend interfaces with relational schemas.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F0EFE8] text-2xs text-[#173629] font-medium">
              Milestone: Full-stack CRUD database project deployed live.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs bg-gradient-to-b from-white to-[#F9FBF8]">
            <div className="text-2xs font-bold uppercase tracking-wider text-[#173629] font-mono">
              STAGE 03 · SEMESTERS 5–6
            </div>
            <h3 className="text-lg font-bold text-[#173629] mt-1">Specialization & Internships</h3>
            <p className="text-xs text-[#5B675A] mt-2 leading-relaxed">
              Web Technologies, SQA, Cloud Systems, and AI electives. Apply for competitive summer internships at Techlogix, 10Pearls, or Systems Ltd.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F0EFE8] text-2xs text-[#244B3A] font-bold">
              Milestone: 8-week summer internship + verified skill dossier.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-[#244B3A] font-mono">
              STAGE 04 · SEMESTERS 7–8
            </div>
            <h3 className="text-lg font-bold text-[#173629] mt-1">Final Year Project & Induction</h3>
            <p className="text-xs text-[#5B675A] mt-2 leading-relaxed">
              Production FYP architecture, automated testing, system design interviews, and graduate recruitment assessment drives across Islamabad & Lahore.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F0EFE8] text-2xs text-[#173629] font-medium">
              Milestone: Full-time Associate Software Engineer contract signed.
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION E.5: PATHPROOF COPILOT — YOUR PERSONAL CAREER MENTOR     */}
      {/* ----------------------------------------------------------------- */}
      <section id="copilot-mentor" className="py-16 lg:py-24 bg-white border-t border-[#E5E4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 5 Cols: Editorial Narrative & Action Safety */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#244B3A]">
                <Bot className="w-4 h-4 text-[#244B3A]" />
                <span>INTELLIGENT CAREER ASSISTANT</span>
                <span aria-hidden="true">·</span>
                <span>CONTEXT-GROUNDED</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173629] tracking-tight leading-tight">
                PathProof Copilot. <br />
                <span className="text-[#244B3A]">Your personal career mentor.</span>
              </h2>

              <p className="text-base text-[#485347] leading-relaxed">
                A generic chatbot gives disconnected answers. <strong>PathProof Copilot</strong> understands your authenticated academic transcripts, self-reported skills, and Pakistan job reality evidence to deliver actionable, tailored mentorship.
              </p>

              {/* 3 Pillars of Copilot */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 text-xs text-[#202A23]">
                  <CheckCircle2 className="w-4 h-4 text-[#244B3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#173629]">Student Context Engine:</strong> Evaluates your actual semester, weekly hours, and completed HEC courses before recommending actions.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-[#202A23]">
                  <CheckCircle2 className="w-4 h-4 text-[#244B3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#173629]">Action Safety Gate:</strong> AI-generated learning roadmaps never silently write to your schedule; they require inspection and approval in a dedicated review modal.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-[#202A23]">
                  <CheckCircle2 className="w-4 h-4 text-[#244B3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#173629]">Empirical Grounding:</strong> Recommends specific technologies requested by verified Pakistani tech employers (Systems Ltd, Techlogix, 10Pearls).
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onEnterDashboard('copilot')}
                  className="px-6 py-3.5 bg-[#173629] hover:bg-[#244B3A] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer group"
                >
                  <Bot className="w-4 h-4 text-[#D8E99A]" />
                  <span>Launch Copilot in Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#D8E99A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right 7 Cols: Live Interactive App-Frame Simulation */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAF9F5] border border-[#E5E4DA] rounded-2xl shadow-xl overflow-hidden">
                {/* Simulated Copilot Header */}
                <div className="bg-[#173629] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#244B3A] flex items-center justify-center text-[#D8E99A]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">PathProof Copilot Simulator</div>
                      <div className="text-3xs text-[#A3B8AC]">Connected to Hamza Tariq (NUST · BS SE · Sem 5)</div>
                    </div>
                  </div>
                  <span className="text-3xs font-mono bg-[#244B3A] text-[#DCE8D9] px-2 py-0.5 rounded">
                    GEMINI FLASH 3.8
                  </span>
                </div>

                {/* Interactive Demo Prompt Chips */}
                <div className="bg-[#EFEEE5] px-4 py-2 border-b border-[#E5E4DA] flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-3xs uppercase font-bold text-[#657064] shrink-0">Try Query:</span>
                  <button
                    onClick={() => setCopilotDemoTopic('roadmap')}
                    className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                      copilotDemoTopic === 'roadmap'
                        ? 'bg-[#173629] text-white shadow-xs'
                        : 'bg-white text-[#485347] hover:text-[#173629]'
                    }`}
                  >
                    12-Week Roadmap
                  </button>
                  <button
                    onClick={() => setCopilotDemoTopic('systems')}
                    className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                      copilotDemoTopic === 'systems'
                        ? 'bg-[#173629] text-white shadow-xs'
                        : 'bg-white text-[#485347] hover:text-[#173629]'
                    }`}
                  >
                    Systems Ltd Prep
                  </button>
                  <button
                    onClick={() => setCopilotDemoTopic('gaps')}
                    className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                      copilotDemoTopic === 'gaps'
                        ? 'bg-[#173629] text-white shadow-xs'
                        : 'bg-white text-[#485347] hover:text-[#173629]'
                    }`}
                  >
                    High-Impact Skill Gaps
                  </button>
                </div>

                {/* Chat Stream Area */}
                <div className="p-5 space-y-4 max-h-[440px] overflow-y-auto">
                  {/* User Query Bubble */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="bg-[#173629] text-white text-xs rounded-xl rounded-tr-xs p-3 max-w-[85%] shadow-2xs">
                      {copilotDemoTopic === 'roadmap' &&
                        "Can you create a structured 12-week learning roadmap for my 15-hour weekly capacity in Semester 5?"}
                      {copilotDemoTopic === 'systems' &&
                        "How do I prepare for a junior Full-Stack interview at Systems Limited or 10Pearls?"}
                      {copilotDemoTopic === 'gaps' &&
                        "What is my highest-leverage skill gap to reach 85%+ readiness for Full-Stack roles?"}
                    </div>
                  </div>

                  {/* Copilot Assistant Response Bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#DCE8D9] text-[#173629] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white text-[#202A23] text-xs rounded-xl rounded-tl-xs p-4 border border-[#E5E4DA] max-w-[90%] shadow-2xs space-y-3">
                      {copilotDemoTopic === 'roadmap' && (
                        <>
                          <p className="leading-relaxed">
                            Hello Hamza. Based on your current Semester 5 workload (15 weekly learning hours) and your target of <strong>Full-Stack Web Engineer</strong>, I have synthesized a tailored 12-week roadmap structured around 4 milestone sprints.
                          </p>

                          {/* Roadmap Proposal Preview Card */}
                          <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#244B3A]/30 space-y-2">
                            <div className="flex items-center justify-between text-2xs">
                              <span className="font-bold text-[#244B3A] uppercase tracking-wider">
                                Staged Roadmap Proposal
                              </span>
                              <span className="px-2 py-0.5 font-mono font-bold bg-[#DCE8D9] text-[#173629] rounded">
                                12 WEEKS · 180 HOURS
                              </span>
                            </div>
                            <div className="font-bold text-sm text-[#173629]">
                              Production Full-Stack Readiness Track (Semester 5)
                            </div>
                            <div className="space-y-1.5 pt-1 text-2xs text-[#485347]">
                              <div className="flex items-center justify-between p-1.5 bg-white rounded border border-[#E5E4DA]">
                                <span className="font-semibold text-[#173629]">Weeks 1–3: Next.js & Server Components</span>
                                <span className="font-mono text-[#657064]">45 hrs</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 bg-white rounded border border-[#E5E4DA]">
                                <span className="font-semibold text-[#173629]">Weeks 4–7: PostgreSQL & Relational Schemas</span>
                                <span className="font-mono text-[#657064]">60 hrs</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 bg-white rounded border border-[#E5E4DA]">
                                <span className="font-semibold text-[#173629]">Weeks 8–10: Docker & CI/CD Pipelines</span>
                                <span className="font-mono text-[#657064]">45 hrs</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 bg-white rounded border border-[#E5E4DA]">
                                <span className="font-semibold text-[#173629]">Weeks 11–12: System Design & Mock Interviews</span>
                                <span className="font-mono text-[#657064]">30 hrs</span>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                              <span className="text-3xs text-[#657064] italic">
                                Action Safety: Staged for confirmation in ActionReviewModal
                              </span>
                              <button
                                onClick={() => onEnterDashboard('copilot')}
                                className="px-3 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white text-2xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                Review & Confirm in App
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {copilotDemoTopic === 'systems' && (
                        <>
                          <p className="leading-relaxed">
                            For junior engineering intake at <strong>Systems Limited</strong> and <strong>10Pearls</strong> in Lahore and Islamabad, our Job Reality Engine highlights three non-negotiables:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-2xs leading-relaxed text-[#324536]">
                            <li>
                              <strong>DSA in Practice:</strong> Be prepared to explain Time & Space complexity for tree traversals and caching strategies.
                            </li>
                            <li>
                              <strong>Next.js App Router:</strong> Server vs Client components and data revalidation are queried in 75% of technical rounds.
                            </li>
                            <li>
                              <strong>Relational DB Design:</strong> Normalization to 3NF and writing indexed SQL queries on PostgreSQL.
                            </li>
                          </ul>
                          <div className="pt-1 text-2xs text-[#244B3A] font-semibold">
                            Would you like me to outline a 5-step mock interview practice checklist for this week?
                          </div>
                        </>
                      )}

                      {copilotDemoTopic === 'gaps' && (
                        <>
                          <p className="leading-relaxed">
                            Comparing your self-reported inventory with the 4 verified Full-Stack postings from Systems Ltd and Techlogix:
                          </p>
                          <div className="space-y-1.5 text-2xs">
                            <div className="p-2 bg-[#F7F6F0] rounded-lg border border-[#E5E4DA] flex items-center justify-between">
                              <div>
                                <strong className="text-[#173629]">Next.js / SSR:</strong> Currently Level 1 (Beginner)
                              </div>
                              <span className="font-bold text-[#244B3A] font-mono">+15% Coverage Gain</span>
                            </div>
                            <div className="p-2 bg-[#F7F6F0] rounded-lg border border-[#E5E4DA] flex items-center justify-between">
                              <div>
                                <strong className="text-[#173629]">Docker Containers:</strong> Currently Level 0 (Missing)
                              </div>
                              <span className="font-bold text-[#244B3A] font-mono">+12% Coverage Gain</span>
                            </div>
                          </div>
                          <p className="text-2xs text-[#5B675A] pt-1">
                            Upgrading Next.js to Level 2 will raise your Technical Readiness score from 67% to 82%.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION F: PAKISTAN JOB REALITY ENGINE & CITATIONS                */}
      {/* ----------------------------------------------------------------- */}
      <section id="job-reality" className="py-16 lg:py-20 bg-[#EFEEE5] border-y border-[#E5E4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
              THE PAKISTAN JOB REALITY ENGINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173629] tracking-tight">
              Curated, Dated & Content-Checked Observations
            </h2>
            <p className="text-base text-[#5B675A] mt-2">
              Every job evidence record in PathProof is directly inspected by faculty administrators. We do not use hallucinated market trends or unverified scraping.
            </p>
          </div>

          {/* Real Pakistani Postings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#657064] mb-2">
                <span className="font-bold text-[#173629]">Techlogix (Islamabad)</span>
                <span className="font-mono text-3xs">Feb 2026</span>
              </div>
              <h4 className="font-bold text-sm text-[#173629]">Associate Software Engineer (Web / React)</h4>
              <p className="text-xs text-[#485347] mt-2 italic leading-relaxed">
                "Requires strong foundation in JavaScript, HTML5/CSS3, and REST API consumption. Candidates with Next.js and Tailwind experience will be prioritized."
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0EFE8] flex items-center justify-between text-3xs font-semibold">
                <span className="text-[#173629] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#244B3A]" />
                  <span>CONTENT_CHECKED</span>
                </span>
                <span className="text-[#657064]">Sample Ref: #101</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#657064] mb-2">
                <span className="font-bold text-[#173629]">Systems Ltd (Lahore / Karachi)</span>
                <span className="font-mono text-3xs">Jan 2026</span>
              </div>
              <h4 className="font-bold text-sm text-[#173629]">Junior Full-Stack Developer</h4>
              <p className="text-xs text-[#485347] mt-2 italic leading-relaxed">
                "Hands-on familiarity with relational databases (PostgreSQL/SQL Server), Git workflows, and modular unit testing. BS Computer Science or Software Engineering required."
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0EFE8] flex items-center justify-between text-3xs font-semibold">
                <span className="text-[#173629] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#244B3A]" />
                  <span>CONTENT_CHECKED</span>
                </span>
                <span className="text-[#657064]">Sample Ref: #102</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E4DA] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#657064] mb-2">
                <span className="font-bold text-[#173629]">10Pearls (Islamabad)</span>
                <span className="font-mono text-3xs">Feb 2026</span>
              </div>
              <h4 className="font-bold text-sm text-[#173629]">Associate Software Quality Assurance (SQA)</h4>
              <p className="text-xs text-[#485347] mt-2 italic leading-relaxed">
                "Knowledge of software testing life cycle (STLC), automated test scripts with Playwright/Selenium, and API validation in Postman."
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0EFE8] flex items-center justify-between text-3xs font-semibold">
                <span className="text-[#173629] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#244B3A]" />
                  <span>CONTENT_CHECKED</span>
                </span>
                <span className="text-[#657064]">Sample Ref: #109</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-[#657064] italic">
            * Empirical Governance Rule BR-07: All frequencies represent sampled observations from published Pakistani vacancies and do not claim to describe the total job market.
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION G: CLOSING CONVERSION BANNER & FOOTER                     */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 lg:py-20 bg-[#173629] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to find out where your degree truly leads?
          </h2>
          <p className="text-base sm:text-lg text-[#DCE8D9] max-w-2xl mx-auto leading-relaxed">
            Enter your HEC coursework, log your self-reported programming skills, and generate your career readiness dossier in minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onEnterDashboard('overview')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D8E99A] hover:bg-[#cbe07d] text-[#173629] font-bold text-base rounded-xl transition-all shadow-md cursor-pointer"
            >
              Start Free Career Assessment
            </button>
            <button
              onClick={() => onOpenAuth()}
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold text-base rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* Authentic Pakistani Footer */}
      <footer id="about" className="bg-[#0F241B] text-[#9FB3A6] border-t border-[#1C3E2F] py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1C3E2F]">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-lg">
                <Compass className="w-5 h-5 text-[#D8E99A]" />
                <span>PathProof</span>
              </div>
              <p className="text-[#849C8C] leading-relaxed">
                Career Decision & Real-World Readiness Platform for university computing students in Pakistan.
              </p>
              <div className="text-3xs text-[#6F8778]">
                Software Construction & Development Semester Project
              </div>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3">Academic Curricula</div>
              <ul className="space-y-2">
                <li>HEC BS Computer Science (2023 Revision)</li>
                <li>HEC BS Software Engineering Guidelines</li>
                <li>HEC BS Information Technology Framework</li>
                <li>National Computing Education Accreditation (NCEAC)</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3">Pakistan Industry Hubs</div>
              <ul className="space-y-2">
                <li>Islamabad / Rawalpindi (I-9, Blue Area, Chaklala)</li>
                <li>Lahore (Gulberg, DHA Phase 5, Johar Town)</li>
                <li>Karachi (Shahrah-e-Faisal, Clifton, Korangi)</li>
                <li>Remote & Hybrid International Teams</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3">Mathematical Engine</div>
              <p className="text-[#849C8C] leading-relaxed mb-2">
                Transparent multi-criteria utility formula:
              </p>
              <code className="text-3xs bg-[#173629] text-[#D8E99A] px-2 py-1 rounded block font-mono">
                Alignment = 0.30A + 0.45I + 0.25W
              </code>
              <div className="mt-2 text-3xs text-[#6F8778]">
                Dynamic re-normalization for missing dimensions.
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-3xs text-[#6F8778]">
            <div>
              © 2026 PathProof Career Intelligence. Designed for Pakistani University Computing Scholars.
            </div>
            <div className="flex items-center space-x-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Academic Integrity</span>
              <span>·</span>
              <span>NCEAC Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
