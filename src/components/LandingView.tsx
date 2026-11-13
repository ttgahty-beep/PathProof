/**
 * PathProof — Commercial Landing Page
 * Features the interactive WebGL FlashlightTextReveal shader background exclusively on the landing page,
 * darker moody typography, and a luminous cursor-tracking spotlight glow.
 * Headline: "Your degree is a start. Make it count."
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Target,
  Bot,
} from 'lucide-react';
import FlashlightTextReveal from '../../components/ui/flashlight-text-reveal.tsx';
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
  const cursorSheenRef = useRef<HTMLDivElement>(null);

  // Foreground cursor glow sheen synced smoothly to pointer without React re-renders
  useEffect(() => {
    const sheen = cursorSheenRef.current;
    if (!sheen) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const paint = () => {
      raf = 0;
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += mq.matches ? dx : dx * 0.18;
      currentY += mq.matches ? dy : dy * 0.18;

      sheen.style.background = `radial-gradient(circle 420px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(216, 233, 154, 0.22) 0%, rgba(132, 206, 126, 0.12) 28%, rgba(28, 74, 54, 0.10) 56%, transparent 100%)`;

      if (!mq.matches && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        raf = requestAnimationFrame(paint);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      kick();
    };

    paint();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

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
    <div className="relative min-h-screen bg-[#060706] text-[#9EA7A1] font-sans antialiased selection:bg-[#D8E99A] selection:text-[#173629]">
      {/* Fixed WebGL Flashlight Shader Background — Landing Page Only */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <FlashlightTextReveal
          text=""
          height="100vh"
          className="h-full w-full"
          colors={['#050605', '#16211C']}
          brightness={-0.18}
          contrast={1.06}
          grain={0.12}
          radius={0.48}
          strength={1.45}
          glowColor="rgba(186, 224, 126, 0.24)"
          glowOpacity={1}
        />
      </div>

      {/* Atmospheric Cursor Glow Layer (behind foreground text so typography stays razor-sharp) */}
      <div
        ref={cursorSheenRef}
        aria-hidden="true"
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Foreground Content Layer */}
      <div className="relative z-10">
        {/* ----------------------------------------------------------------- */}
        {/* SECTION A: TOP BAR CONTRACT                                       */}
        {/* Exactly 3 zones: [Brand wordmark] - [4-5 links] - [1 action CTA]  */}
        {/* ----------------------------------------------------------------- */}
        <header className="sticky top-0 z-40 bg-[#070908]/75 backdrop-blur-md border-b border-white/[0.08] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
            {/* Zone 1: Brand Wordmark (one element, no subtitles) */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 text-xl font-bold tracking-tight text-[#C2CBC5] hover:text-[#E8EFEA] whitespace-nowrap shrink-0 group transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#173629] border border-[#D8E99A]/25 flex items-center justify-center shadow-sm group-hover:bg-[#244B3A] transition-colors">
                <Compass className="w-5 h-5 text-[#D8E99A]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#C2CBC5] group-hover:text-white transition-colors">
                PathProof
              </span>
            </a>

            {/* Zone 2: 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#7D8780]">
              <a
                href="#careers"
                className="hover:text-[#DCE5DF] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Explore Careers
              </a>
              <a
                href="#skill-gaps"
                className="hover:text-[#DCE5DF] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Skill Gaps
              </a>
              <a
                href="#copilot-mentor"
                className="hover:text-[#D8E99A] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 font-semibold text-[#A3B670]"
              >
                <Bot className="w-4 h-4 text-[#B7CA7E]" />
                <span>Copilot Mentor</span>
              </a>
              <a
                href="#roadmap"
                className="hover:text-[#DCE5DF] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Roadmap
              </a>
              <a
                href="#job-reality"
                className="hover:text-[#DCE5DF] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Pakistan Job Reality
              </a>
            </nav>

            {/* Zone 3: Primary Action / Sign In Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenAuth()}
                className="text-xs sm:text-sm font-semibold text-[#9EA7A1] hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onEnterDashboard('overview')}
                className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#173629] bg-[#D8E99A] hover:bg-[#e3f2ab] rounded-lg transition-all shadow-[0_0_20px_rgba(216,233,154,0.22)] flex items-center space-x-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Launch Student Workspace</span>
                <span className="sm:hidden">Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#173629]" />
              </button>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION B: HERO SECTION & INTERACTIVE WORKSPACE PREVIEW           */}
        {/* ----------------------------------------------------------------- */}
        <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/[0.08] bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left 7 Columns: Editorial Headline, Supporting Copy, Value Prop */}
              <div className="lg:col-span-7 space-y-6">
                {/* Contextual Kicker (No pill badge - clean unboxed text) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#8CA05C]">
                  <span>HEC CURRICULUM COMPLIANT</span>
                  <span aria-hidden="true" className="hidden sm:inline text-white/25">·</span>
                  <span>PAKISTAN COMPUTING INDUSTRY EVIDENCE</span>
                  <span aria-hidden="true" className="hidden sm:inline text-white/25">·</span>
                  <span>BS CS / SE / IT</span>
                </div>

                {/* Core Brand Message */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#939E97] tracking-tight leading-[1.08] max-w-2xl text-balance [text-shadow:0_2px_18px_rgba(3,5,4,0.92)]">
                  Your degree is a start.{' '}
                  <span className="text-[#AEC272] underline decoration-[#AEC272]/45 decoration-4 underline-offset-4">
                    Make it count.
                  </span>
                </h1>

                {/* Supporting Copy */}
                <p className="text-lg sm:text-xl text-[#6E7872] font-normal leading-relaxed max-w-xl text-balance [text-shadow:0_1px_12px_rgba(3,5,4,0.9)]">
                  Turn your interests, skills, academic coursework and career goals into a practical, semester-by-semester roadmap backed by empirical hiring evidence from Pakistani software houses.
                </p>

                {/* CTAs & Quick Persona Exploration */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onEnterDashboard('overview')}
                    className="px-6 py-3.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] text-base font-bold rounded-xl shadow-[0_0_24px_rgba(216,233,154,0.22)] flex items-center justify-center space-x-2 transition-all cursor-pointer group"
                  >
                    <span>Explore Live Student Dashboard</span>
                    <ArrowRight className="w-5 h-5 text-[#173629] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="#careers"
                    className="px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] text-[#A8B2AC] hover:text-white text-base font-semibold rounded-xl border border-white/[0.1] backdrop-blur-sm flex items-center justify-center transition-all"
                  >
                    Browse 6 Target Roles
                  </a>
                </div>

                {/* Quick Persona Fast Switcher */}
                <div className="pt-2 flex items-center gap-2 text-xs text-[#6B756F] flex-wrap">
                  <span className="font-medium text-[#8C9690]">Try immediate demo persona:</span>
                  <button
                    onClick={() => {
                      onQuickSwitchUser('student');
                      onEnterDashboard('overview');
                    }}
                    className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-md font-medium text-[#9EA7A1] hover:text-white transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    Hamza Tariq (Sem 5 SE)
                  </button>
                  <button
                    onClick={() => {
                      onQuickSwitchUser('student2');
                      onEnterDashboard('overview');
                    }}
                    className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-md font-medium text-[#9EA7A1] hover:text-white transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    Ayesha Khan (Sem 3 CS)
                  </button>
                  <button
                    onClick={() => {
                      onQuickSwitchUser('admin');
                      onEnterDashboard('admin');
                    }}
                    className="px-2.5 py-1 bg-amber-500/[0.07] hover:bg-amber-500/15 border border-amber-400/20 rounded-md font-medium text-amber-200/80 hover:text-amber-200 transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    Dr. Shahbaz (Faculty Admin)
                  </button>
                </div>

                {/* Quantitative Adjacency Bar */}
                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/[0.08] text-left">
                  <div>
                    <div className="text-2xl font-extrabold text-[#A8B2AC] tabular-nums font-mono">6</div>
                    <div className="text-xs text-[#6B756F] mt-0.5">Core Computing Careers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#A8B2AC] tabular-nums font-mono">24+</div>
                    <div className="text-xs text-[#6B756F] mt-0.5">Verified Job Evidence Postings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#B8CA7E] tabular-nums font-mono">100%</div>
                    <div className="text-xs text-[#6B756F] mt-0.5">Transparent 0.30A + 0.45I + 0.25W</div>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Interactive Live Preview Widget */}
              <div className="lg:col-span-5">
                <div className="bg-[#090B0A]/80 backdrop-blur-md rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden hover:border-[#D8E99A]/30 transition-colors">
                  {/* Header of preview widget */}
                  <div className="bg-[#12261D]/90 border-b border-white/[0.08] text-[#B8C2BC] p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#1C3B2D] border border-[#3A6B55]/60 flex items-center justify-center font-bold text-sm text-[#C8DA8E]">
                        HT
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#C8D1CB] flex items-center space-x-1.5">
                          <span>Hamza Tariq</span>
                          <span className="text-3xs bg-[#1C3B2D] text-[#A8BDAE] px-1.5 py-0.5 rounded font-mono">
                            SE SEM 5
                          </span>
                        </div>
                        <div className="text-2xs text-[#7E9285]">NUST · 15 hrs/wk capacity</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xs uppercase tracking-wider text-[#B8CA7E] font-semibold">
                        Readiness Engine
                      </span>
                      <div className="text-xs text-[#8D9A92] font-mono">Algorithm v1.0</div>
                    </div>
                  </div>

                  {/* Role Switcher in Preview */}
                  <div className="bg-black/40 px-4 py-2 border-b border-white/[0.08] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {demoRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedDemoRole(role.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                          selectedDemoRole === role.id
                            ? 'bg-[#D8E99A] text-[#173629] shadow-xs'
                            : 'text-[#7D8780] hover:text-[#DCE5DF] hover:bg-white/[0.06]'
                        }`}
                      >
                        {role.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Scorecards */}
                  <div className="p-5 space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#6B756F] mb-1">
                        <span>Evaluated Career Target</span>
                        <span>Verified Sample: {currentDemo.sampleSize} Postings</span>
                      </div>
                      <div className="text-lg font-bold text-[#B8C2BC]">{currentDemo.title}</div>
                      <div className="text-xs text-[#9BB068] font-medium mt-0.5">
                        Hiring Companies: {currentDemo.employers}
                      </div>
                    </div>

                    {/* Dual Independent Metrics (BR-11 Rule) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                        <div className="text-3xs uppercase tracking-wider font-bold text-[#6B756F]">
                          Coursework & Interest Fit
                        </div>
                        <div className="text-3xl font-extrabold text-[#B8C2BC] font-mono tabular-nums mt-1">
                          {currentDemo.alignment}%
                        </div>
                        <div className="text-3xs text-[#6B756F] mt-1">
                          Curriculum: 30% · Interests: 45% · Work: 25%
                        </div>
                      </div>

                      <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                        <div className="text-3xs uppercase tracking-wider font-bold text-[#6B756F]">
                          Technical Skill Readiness
                        </div>
                        <div className="text-3xl font-extrabold text-[#B8CA7E] font-mono tabular-nums mt-1">
                          {currentDemo.skillCoverage}%
                        </div>
                        <div className="text-3xs text-[#6B756F] mt-1">
                          Weighted entry proficiency ratio
                        </div>
                      </div>
                    </div>

                    {/* Skill Gap mini breakdown */}
                    <div>
                      <div className="text-xs font-bold text-[#A8B2AC] mb-2 flex items-center justify-between">
                        <span>Verified Required Skills Status</span>
                        <span className="text-3xs text-[#6B756F]">Self-Reported vs Market Target</span>
                      </div>
                      <div className="space-y-1.5">
                        {currentDemo.topSkills.map((sk, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.07] text-xs"
                          >
                            <span className="font-medium text-[#9EA7A1]">{sk.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-3xs text-[#6B756F]">{sk.level}</span>
                              <span
                                className={`text-3xs font-bold px-2 py-0.5 rounded ${
                                  sk.status === 'MEETS_TARGET'
                                    ? 'bg-emerald-500/10 text-emerald-300/85'
                                    : sk.status === 'DEVELOPING'
                                    ? 'bg-amber-500/10 text-amber-300/85'
                                    : 'bg-rose-500/10 text-rose-300/85'
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
                    <div className="p-3 bg-[#173629]/45 rounded-xl border border-[#D8E99A]/20 flex items-start space-x-2.5">
                      <Target className="w-4 h-4 text-[#B8CA7E] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-[#C2CBC5]">Recommended Next Action: </span>
                        <span className="text-[#8FA095]">{currentDemo.nextAction}</span>
                      </div>
                    </div>

                    {/* Direct Jump to workspace */}
                    <button
                      onClick={() => onEnterDashboard('recommendations')}
                      className="w-full py-2.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Inspect Full Evaluation Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#173629]" />
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-5">
            <div className="max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8CA05C] mb-1">
                CAREER CATALOGUE & EMPIRICAL EVIDENCE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#939E97] tracking-tight [text-shadow:0_2px_16px_rgba(3,5,4,0.9)]">
                Explore 6 Core Computing Trajectories
              </h2>
              <p className="text-base text-[#6E7872] mt-2 [text-shadow:0_1px_10px_rgba(3,5,4,0.85)]">
                Each career profile is mapped to HEC undergraduate courses and verified with direct evidence from entry-level Pakistani IT job postings.
              </p>
            </div>

            {/* Category Filter Buttons (Functional Tabs) */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#090B0A]/88 backdrop-blur-md rounded-xl border border-white/[0.1] shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#D8E99A] text-[#173629] shadow-xs'
                      : 'text-[#87918A] hover:text-[#DCE5DF]'
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
                  className="bg-[#090B0A]/78 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/40 p-6 shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6B756F] mb-2">
                      <span className="font-semibold text-[#9BB068]">{c.category_name}</span>
                      <span className="font-mono">{sampleCount} verified postings</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#B8C2BC] group-hover:text-[#E8EFEA] transition-colors">
                      {c.career_title}
                    </h3>
                    <p className="text-xs text-[#757F79] group-hover:text-[#96A099] mt-2 leading-relaxed line-clamp-3 transition-colors">
                      {c.summary}
                    </p>

                    {/* Key Skills from Market Observation */}
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <div className="text-3xs font-bold uppercase tracking-wider text-[#626C66] mb-2">
                        Top Verified Demands in Pakistan
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(topSkillNames.length > 0
                          ? topSkillNames
                          : ['Problem Solving', 'Git', 'Data Structures']
                        ).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-2xs font-medium text-[#9EA7A1]"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Typical Entry Salary Range */}
                    <div className="mt-4 flex items-center justify-between text-xs text-[#757F79] bg-black/35 p-2.5 rounded-lg border border-white/[0.07]">
                      <span>Expected Entry Salary:</span>
                      <span className="font-bold text-[#B8C2BC] font-mono">
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
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenReport(c.career_id)}
                      className="px-3 py-2 text-xs font-semibold text-[#9EA7A1] hover:text-white bg-white/[0.05] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      View Reality Dossier
                    </button>
                    <button
                      onClick={() => onEnterDashboard('careers')}
                      className="px-3 py-2 text-xs font-bold text-[#173629] bg-[#D8E99A] hover:bg-[#e3f2ab] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
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
        <section id="skill-gaps" className="py-16 lg:py-20 bg-black/25 backdrop-blur-[2px] border-y border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left 6 Cols: Explanation */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8CA05C]">
                  MATHEMATICAL TRANSPARENCY & ACCREDITATION
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#939E97] tracking-tight [text-shadow:0_2px_16px_rgba(3,5,4,0.9)]">
                  Know Exactly What Skills You Are Missing
                </h2>
                <p className="text-base text-[#6E7872] leading-relaxed [text-shadow:0_1px_10px_rgba(3,5,4,0.85)]">
                  Most career platforms give students an arbitrary score. PathProof cleanly separates your{' '}
                  <strong className="text-[#A8B2AC]">Curricular Alignment Fit</strong> ($0.30A + 0.45I + 0.25W$) from your{' '}
                  <strong className="text-[#A8B2AC]">Technical Skill Readiness</strong>, analyzing each skill across 3 clear levels:
                </p>

                <div className="space-y-3.5">
                  <div className="p-3.5 bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-300/85 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#B8C2BC]">Meets Target (Ratio 1.0)</div>
                      <div className="text-xs text-[#737D76] mt-0.5">
                        Your self-reported proficiency meets or exceeds entry requirements observed in Pakistani vacancies.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-300/85 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ~
                    </div>
                    <div>
                      <div className="font-bold text-sm text-amber-200/85">Developing (Ratio &gt; 0, &lt; 1.0)</div>
                      <div className="text-xs text-[#737D76] mt-0.5">
                        You have foundational knowledge (e.g. from a university lab), but lack full project evidence or framework proficiency.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-300/85 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      !
                    </div>
                    <div>
                      <div className="font-bold text-sm text-rose-200/85">Missing (Ratio 0.0)</div>
                      <div className="text-xs text-[#737D76] mt-0.5">
                        The market consistently requires this skill, but it is absent from your profile. We prescribe high-impact mini-tasks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: Visual Breakdown Box */}
              <div className="lg:col-span-6">
                <div className="bg-[#090B0A]/82 backdrop-blur-md rounded-2xl border border-white/[0.1] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="text-xs font-bold text-[#B8C2BC]">Full-Stack Web Engineer — Skill Matrix</span>
                    <span className="text-xs font-mono font-bold text-[#B8CA7E]">67% Coverage</span>
                  </div>

                  {/* Skill Rows */}
                  <div className="space-y-2.5">
                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.07] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#B8C2BC]">JavaScript / TypeScript</div>
                        <div className="text-3xs text-[#6B756F]">Required by 100% of sample (Systems, Techlogix)</div>
                      </div>
                      <span className="text-2xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-300/85">
                        MEETS TARGET (3/3)
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.07] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#B8C2BC]">React & Modern UI</div>
                        <div className="text-3xs text-[#6B756F]">Required by 100% of sample</div>
                      </div>
                      <span className="text-2xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-300/85">
                        MEETS TARGET (3/3)
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.07] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-200/85">Next.js / SSR Frameworks</div>
                        <div className="text-3xs text-[#6B756F]">Preferred by 75% of sample (Devsinc, Arbisoft)</div>
                      </div>
                      <span className="text-2xs font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-300/85">
                        DEVELOPING (1/3)
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.07] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-rose-200/85">Docker & Containerization</div>
                        <div className="text-3xs text-[#6B756F]">Required by 50% of junior full-stack postings</div>
                      </div>
                      <span className="text-2xs font-bold px-2 py-1 rounded bg-rose-500/10 text-rose-300/85">
                        MISSING (0/2)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('skills')}
                      className="w-full py-2.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Audit Your Complete Skill Inventory</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#173629]" />
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
            <div className="text-xs font-bold uppercase tracking-wider text-[#8CA05C] mb-1">
              SEMESTER PROGRESSION MODEL
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#939E97] tracking-tight [text-shadow:0_2px_16px_rgba(3,5,4,0.9)]">
              From Semester 1 to Your First Job Offer
            </h2>
            <p className="text-base text-[#6E7872] mt-2 [text-shadow:0_1px_10px_rgba(3,5,4,0.85)]">
              A structured roadmap connecting your HEC Pakistan syllabus with industry milestones so you graduate career-ready, not bewildered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#090B0A]/78 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
              <div className="text-2xs font-bold uppercase tracking-wider text-[#9BB068] font-mono">
                STAGE 01 · SEMESTERS 1–2
              </div>
              <h3 className="text-lg font-bold text-[#B8C2BC] mt-1">Foundations & Logic</h3>
              <p className="text-xs text-[#757F79] mt-2 leading-relaxed">
                Programming Fundamentals (C++/Java), Discrete Structures, and basic version control. Establish problem-solving discipline on LeetCode/HackerRank.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-2xs text-[#9EA7A1] font-medium">
                Milestone: First Git repository & clean CLI application.
              </div>
            </div>

            <div className="bg-[#090B0A]/78 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
              <div className="text-2xs font-bold uppercase tracking-wider text-[#9BB068] font-mono">
                STAGE 02 · SEMESTERS 3–4
              </div>
              <h3 className="text-lg font-bold text-[#B8C2BC] mt-1">Core Computing & Databases</h3>
              <p className="text-xs text-[#757F79] mt-2 leading-relaxed">
                Data Structures & Algorithms, OOP, Database Systems (SQL), and Operating Systems. Connect frontend interfaces with relational schemas.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-2xs text-[#9EA7A1] font-medium">
                Milestone: Full-stack CRUD database project deployed live.
              </div>
            </div>

            <div className="bg-[#0E1511]/82 backdrop-blur-md rounded-xl border border-[#D8E99A]/30 p-5 shadow-lg">
              <div className="text-2xs font-bold uppercase tracking-wider text-[#B8CA7E] font-mono">
                STAGE 03 · SEMESTERS 5–6
              </div>
              <h3 className="text-lg font-bold text-[#C8D1CB] mt-1">Specialization & Internships</h3>
              <p className="text-xs text-[#88938C] mt-2 leading-relaxed">
                Web Technologies, SQA, Cloud Systems, and AI electives. Apply for competitive summer internships at Techlogix, 10Pearls, or Systems Ltd.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-2xs text-[#B8CA7E] font-bold">
                Milestone: 8-week summer internship + verified skill dossier.
              </div>
            </div>

            <div className="bg-[#090B0A]/78 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
              <div className="text-2xs font-bold uppercase tracking-wider text-[#9BB068] font-mono">
                STAGE 04 · SEMESTERS 7–8
              </div>
              <h3 className="text-lg font-bold text-[#B8C2BC] mt-1">Final Year Project & Induction</h3>
              <p className="text-xs text-[#757F79] mt-2 leading-relaxed">
                Production FYP architecture, automated testing, system design interviews, and graduate recruitment assessment drives across Islamabad & Lahore.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-2xs text-[#9EA7A1] font-medium">
                Milestone: Full-time Associate Software Engineer contract signed.
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION E.5: PATHPROOF COPILOT — YOUR PERSONAL CAREER MENTOR     */}
        {/* ----------------------------------------------------------------- */}
        <section id="copilot-mentor" className="py-16 lg:py-24 bg-black/25 backdrop-blur-[2px] border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left 5 Cols: Editorial Narrative & Action Safety */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#8CA05C]">
                  <Bot className="w-4 h-4 text-[#9BB068]" />
                  <span>INTELLIGENT CAREER ASSISTANT</span>
                  <span aria-hidden="true" className="text-white/25">·</span>
                  <span>CONTEXT-GROUNDED</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#939E97] tracking-tight leading-tight [text-shadow:0_2px_16px_rgba(3,5,4,0.9)]">
                  PathProof Copilot. <br />
                  <span className="text-[#AEC272]">Your personal career mentor.</span>
                </h2>

                <p className="text-base text-[#6E7872] leading-relaxed [text-shadow:0_1px_10px_rgba(3,5,4,0.85)]">
                  A generic chatbot gives disconnected answers. <strong className="text-[#A8B2AC]">PathProof Copilot</strong> understands your authenticated academic transcripts, self-reported skills, and Pakistan job reality evidence to deliver actionable, tailored mentorship.
                </p>

                {/* 3 Pillars of Copilot */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3 text-xs text-[#7D8780]">
                    <CheckCircle2 className="w-4 h-4 text-[#9BB068] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#B8C2BC]">Student Context Engine:</strong> Evaluates your actual semester, weekly hours, and completed HEC courses before recommending actions.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs text-[#7D8780]">
                    <CheckCircle2 className="w-4 h-4 text-[#9BB068] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#B8C2BC]">Action Safety Gate:</strong> AI-generated learning roadmaps never silently write to your schedule; they require inspection and approval in a dedicated review modal.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs text-[#7D8780]">
                    <CheckCircle2 className="w-4 h-4 text-[#9BB068] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#B8C2BC]">Empirical Grounding:</strong> Recommends specific technologies requested by verified Pakistani tech employers (Systems Ltd, Techlogix, 10Pearls).
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onEnterDashboard('copilot')}
                    className="px-6 py-3.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(216,233,154,0.2)] flex items-center justify-center space-x-2 transition-all cursor-pointer group"
                  >
                    <Bot className="w-4 h-4 text-[#173629]" />
                    <span>Launch Copilot in Workspace</span>
                    <ArrowRight className="w-4 h-4 text-[#173629] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Live Interactive App-Frame Simulation */}
              <div className="lg:col-span-7">
                <div className="bg-[#090B0A]/85 backdrop-blur-md border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
                  {/* Simulated Copilot Header */}
                  <div className="bg-[#12261D]/90 border-b border-white/[0.08] text-[#B8C2BC] p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1C3B2D] flex items-center justify-center text-[#B8CA7E]">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#C8D1CB]">PathProof Copilot Simulator</div>
                        <div className="text-3xs text-[#7E9285]">Connected to Hamza Tariq (NUST · BS SE · Sem 5)</div>
                      </div>
                    </div>
                    <span className="text-3xs font-mono bg-[#1C3B2D] text-[#A8BDAE] px-2 py-0.5 rounded">
                      GEMINI FLASH 3.8
                    </span>
                  </div>

                  {/* Interactive Demo Prompt Chips */}
                  <div className="bg-black/45 px-4 py-2 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-3xs uppercase font-bold text-[#6B756F] shrink-0">Try Query:</span>
                    <button
                      onClick={() => setCopilotDemoTopic('roadmap')}
                      className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        copilotDemoTopic === 'roadmap'
                          ? 'bg-[#D8E99A] text-[#173629] shadow-xs'
                          : 'bg-white/[0.06] text-[#8D9790] hover:text-white'
                      }`}
                    >
                      12-Week Roadmap
                    </button>
                    <button
                      onClick={() => setCopilotDemoTopic('systems')}
                      className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        copilotDemoTopic === 'systems'
                          ? 'bg-[#D8E99A] text-[#173629] shadow-xs'
                          : 'bg-white/[0.06] text-[#8D9790] hover:text-white'
                      }`}
                    >
                      Systems Ltd Prep
                    </button>
                    <button
                      onClick={() => setCopilotDemoTopic('gaps')}
                      className={`px-2.5 py-1 text-2xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        copilotDemoTopic === 'gaps'
                          ? 'bg-[#D8E99A] text-[#173629] shadow-xs'
                          : 'bg-white/[0.06] text-[#8D9790] hover:text-white'
                      }`}
                    >
                      High-Impact Skill Gaps
                    </button>
                  </div>

                  {/* Chat Stream Area */}
                  <div className="p-5 space-y-4 max-h-[440px] overflow-y-auto">
                    {/* User Query Bubble */}
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-[#173629] border border-white/10 text-[#D0D9D3] text-xs rounded-xl rounded-tr-xs p-3 max-w-[85%] shadow-2xs">
                        {copilotDemoTopic === 'roadmap' &&
                          'Can you create a structured 12-week learning roadmap for my 15-hour weekly capacity in Semester 5?'}
                        {copilotDemoTopic === 'systems' &&
                          'How do I prepare for a junior Full-Stack interview at Systems Limited or 10Pearls?'}
                        {copilotDemoTopic === 'gaps' &&
                          'What is my highest-leverage skill gap to reach 85%+ readiness for Full-Stack roles?'}
                      </div>
                    </div>

                    {/* Copilot Assistant Response Bubble */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1C3B2D] text-[#B8CA7E] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white/[0.03] text-[#9EA7A1] text-xs rounded-xl rounded-tl-xs p-4 border border-white/[0.08] max-w-[90%] shadow-2xs space-y-3">
                        {copilotDemoTopic === 'roadmap' && (
                          <>
                            <p className="leading-relaxed text-[#8D9790]">
                              Hello Hamza. Based on your current Semester 5 workload (15 weekly learning hours) and your target of <strong className="text-[#C2CBC5]">Full-Stack Web Engineer</strong>, I have synthesized a tailored 12-week roadmap structured around 4 milestone sprints.
                            </p>

                            {/* Roadmap Proposal Preview Card */}
                            <div className="p-3 bg-black/40 rounded-xl border border-[#D8E99A]/20 space-y-2">
                              <div className="flex items-center justify-between text-2xs">
                                <span className="font-bold text-[#B8CA7E] uppercase tracking-wider">
                                  Staged Roadmap Proposal
                                </span>
                                <span className="px-2 py-0.5 font-mono font-bold bg-[#173629] text-[#C8DA8E] rounded">
                                  12 WEEKS · 180 HOURS
                                </span>
                              </div>
                              <div className="font-bold text-sm text-[#C2CBC5]">
                                Production Full-Stack Readiness Track (Semester 5)
                              </div>
                              <div className="space-y-1.5 pt-1 text-2xs text-[#8D9790]">
                                <div className="flex items-center justify-between p-1.5 bg-white/[0.03] rounded border border-white/[0.07]">
                                  <span className="font-semibold text-[#B8C2BC]">Weeks 1–3: Next.js & Server Components</span>
                                  <span className="font-mono text-[#6B756F]">45 hrs</span>
                                </div>
                                <div className="flex items-center justify-between p-1.5 bg-white/[0.03] rounded border border-white/[0.07]">
                                  <span className="font-semibold text-[#B8C2BC]">Weeks 4–7: PostgreSQL & Relational Schemas</span>
                                  <span className="font-mono text-[#6B756F]">60 hrs</span>
                                </div>
                                <div className="flex items-center justify-between p-1.5 bg-white/[0.03] rounded border border-white/[0.07]">
                                  <span className="font-semibold text-[#B8C2BC]">Weeks 8–10: Docker & CI/CD Pipelines</span>
                                  <span className="font-mono text-[#6B756F]">45 hrs</span>
                                </div>
                                <div className="flex items-center justify-between p-1.5 bg-white/[0.03] rounded border border-white/[0.07]">
                                  <span className="font-semibold text-[#B8C2BC]">Weeks 11–12: System Design & Mock Interviews</span>
                                  <span className="font-mono text-[#6B756F]">30 hrs</span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center justify-between gap-2">
                                <span className="text-3xs text-[#6B756F] italic">
                                  Action Safety: Staged for confirmation in ActionReviewModal
                                </span>
                                <button
                                  onClick={() => onEnterDashboard('copilot')}
                                  className="px-3 py-1.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] text-2xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                                >
                                  Review & Confirm in App
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        {copilotDemoTopic === 'systems' && (
                          <>
                            <p className="leading-relaxed text-[#8D9790]">
                              For junior engineering intake at <strong className="text-[#C2CBC5]">Systems Limited</strong> and <strong className="text-[#C2CBC5]">10Pearls</strong> in Lahore and Islamabad, our Job Reality Engine highlights three non-negotiables:
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-2xs leading-relaxed text-[#8D9790]">
                              <li>
                                <strong className="text-[#C2CBC5]">DSA in Practice:</strong> Be prepared to explain Time & Space complexity for tree traversals and caching strategies.
                              </li>
                              <li>
                                <strong className="text-[#C2CBC5]">Next.js App Router:</strong> Server vs Client components and data revalidation are queried in 75% of technical rounds.
                              </li>
                              <li>
                                <strong className="text-[#C2CBC5]">Relational DB Design:</strong> Normalization to 3NF and writing indexed SQL queries on PostgreSQL.
                              </li>
                            </ul>
                            <div className="pt-1 text-2xs text-[#B8CA7E] font-semibold">
                              Would you like me to outline a 5-step mock interview practice checklist for this week?
                            </div>
                          </>
                        )}

                        {copilotDemoTopic === 'gaps' && (
                          <>
                            <p className="leading-relaxed text-[#8D9790]">
                              Comparing your self-reported inventory with the 4 verified Full-Stack postings from Systems Ltd and Techlogix:
                            </p>
                            <div className="space-y-1.5 text-2xs">
                              <div className="p-2 bg-black/35 rounded-lg border border-white/[0.08] flex items-center justify-between">
                                <div>
                                  <strong className="text-[#C2CBC5]">Next.js / SSR:</strong> Currently Level 1 (Beginner)
                                </div>
                                <span className="font-bold text-[#B8CA7E] font-mono">+15% Coverage Gain</span>
                              </div>
                              <div className="p-2 bg-black/35 rounded-lg border border-white/[0.08] flex items-center justify-between">
                                <div>
                                  <strong className="text-[#C2CBC5]">Docker Containers:</strong> Currently Level 0 (Missing)
                                </div>
                                <span className="font-bold text-[#B8CA7E] font-mono">+12% Coverage Gain</span>
                              </div>
                            </div>
                            <p className="text-2xs text-[#757F79] pt-1">
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
        <section id="job-reality" className="py-16 lg:py-20 bg-transparent border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8CA05C] mb-1">
                THE PAKISTAN JOB REALITY ENGINE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#939E97] tracking-tight [text-shadow:0_2px_16px_rgba(3,5,4,0.9)]">
                Curated, Dated & Content-Checked Observations
              </h2>
              <p className="text-base text-[#6E7872] mt-2 [text-shadow:0_1px_10px_rgba(3,5,4,0.85)]">
                Every job evidence record in PathProof is directly inspected by faculty administrators. We do not use hallucinated market trends or unverified scraping.
              </p>
            </div>

            {/* Real Pakistani Postings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
                <div className="flex items-center justify-between text-xs text-[#6B756F] mb-2">
                  <span className="font-bold text-[#9BB068]">Techlogix (Islamabad)</span>
                  <span className="font-mono text-3xs">Feb 2026</span>
                </div>
                <h4 className="font-bold text-sm text-[#B8C2BC]">Associate Software Engineer (Web / React)</h4>
                <p className="text-xs text-[#757F79] mt-2 italic leading-relaxed">
                  "Requires strong foundation in JavaScript, HTML5/CSS3, and REST API consumption. Candidates with Next.js and Tailwind experience will be prioritized."
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-3xs font-semibold">
                  <span className="text-emerald-300/80 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300/80" />
                    <span>CONTENT_CHECKED</span>
                  </span>
                  <span className="text-[#6B756F]">Sample Ref: #101</span>
                </div>
              </div>

              <div className="bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
                <div className="flex items-center justify-between text-xs text-[#6B756F] mb-2">
                  <span className="font-bold text-[#9BB068]">Systems Ltd (Lahore / Karachi)</span>
                  <span className="font-mono text-3xs">Jan 2026</span>
                </div>
                <h4 className="font-bold text-sm text-[#B8C2BC]">Junior Full-Stack Developer</h4>
                <p className="text-xs text-[#757F79] mt-2 italic leading-relaxed">
                  "Hands-on familiarity with relational databases (PostgreSQL/SQL Server), Git workflows, and modular unit testing. BS Computer Science or Software Engineering required."
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-3xs font-semibold">
                  <span className="text-emerald-300/80 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300/80" />
                    <span>CONTENT_CHECKED</span>
                  </span>
                  <span className="text-[#6B756F]">Sample Ref: #102</span>
                </div>
              </div>

              <div className="bg-[#090B0A]/80 backdrop-blur-md rounded-xl border border-white/[0.09] hover:border-[#D8E99A]/35 p-5 shadow-lg transition-colors">
                <div className="flex items-center justify-between text-xs text-[#6B756F] mb-2">
                  <span className="font-bold text-[#9BB068]">10Pearls (Islamabad)</span>
                  <span className="font-mono text-3xs">Feb 2026</span>
                </div>
                <h4 className="font-bold text-sm text-[#B8C2BC]">Associate Software Quality Assurance (SQA)</h4>
                <p className="text-xs text-[#757F79] mt-2 italic leading-relaxed">
                  "Knowledge of software testing life cycle (STLC), automated test scripts with Playwright/Selenium, and API validation in Postman."
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-3xs font-semibold">
                  <span className="text-emerald-300/80 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300/80" />
                    <span>CONTENT_CHECKED</span>
                  </span>
                  <span className="text-[#6B756F]">Sample Ref: #109</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-[#626C66] italic">
              * Empirical Governance Rule BR-07: All frequencies represent sampled observations from published Pakistani vacancies and do not claim to describe the total job market.
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION G: CLOSING CONVERSION BANNER & FOOTER                     */}
        {/* ----------------------------------------------------------------- */}
        <section className="py-16 lg:py-20 bg-[#0D1E17]/85 backdrop-blur-md border-t border-white/[0.08] text-[#B8C2BC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#C2CBC5]">
              Ready to find out where your degree truly leads?
            </h2>
            <p className="text-base sm:text-lg text-[#8D9E93] max-w-2xl mx-auto leading-relaxed">
              Enter your HEC coursework, log your self-reported programming skills, and generate your career readiness dossier in minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onEnterDashboard('overview')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#D8E99A] hover:bg-[#e3f2ab] text-[#173629] font-bold text-base rounded-xl transition-all shadow-[0_0_24px_rgba(216,233,154,0.22)] cursor-pointer"
              >
                Start Free Career Assessment
              </button>
              <button
                onClick={() => onOpenAuth()}
                className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#B8C2BC] hover:text-white font-semibold text-base rounded-xl border border-white/15 transition-all cursor-pointer"
              >
                Sign In to Existing Account
              </button>
            </div>
          </div>
        </section>

        {/* Authentic Pakistani Footer */}
        <footer id="about" className="bg-[#050605]/92 backdrop-blur-md text-[#6B756F] border-t border-white/[0.08] py-12 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.08]">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#B8C2BC] font-bold text-lg">
                  <Compass className="w-5 h-5 text-[#B8CA7E]" />
                  <span>PathProof</span>
                </div>
                <p className="text-[#6B756F] leading-relaxed">
                  Career Decision & Real-World Readiness Platform for university computing students in Pakistan.
                </p>
                <div className="text-3xs text-[#545D57]">
                  Software Construction & Development Semester Project
                </div>
              </div>

              <div>
                <div className="font-bold text-[#9EA7A1] uppercase tracking-wider mb-3">Academic Curricula</div>
                <ul className="space-y-2">
                  <li>HEC BS Computer Science (2023 Revision)</li>
                  <li>HEC BS Software Engineering Guidelines</li>
                  <li>HEC BS Information Technology Framework</li>
                  <li>National Computing Education Accreditation (NCEAC)</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-[#9EA7A1] uppercase tracking-wider mb-3">Pakistan Industry Hubs</div>
                <ul className="space-y-2">
                  <li>Islamabad / Rawalpindi (I-9, Blue Area, Chaklala)</li>
                  <li>Lahore (Gulberg, DHA Phase 5, Johar Town)</li>
                  <li>Karachi (Shahrah-e-Faisal, Clifton, Korangi)</li>
                  <li>Remote & Hybrid International Teams</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-[#9EA7A1] uppercase tracking-wider mb-3">Mathematical Engine</div>
                <p className="text-[#6B756F] leading-relaxed mb-2">
                  Transparent multi-criteria utility formula:
                </p>
                <code className="text-3xs bg-[#12261D] text-[#B8CA7E] px-2 py-1 rounded block font-mono">
                  Alignment = 0.30A + 0.45I + 0.25W
                </code>
                <div className="mt-2 text-3xs text-[#545D57]">
                  Dynamic re-normalization for missing dimensions.
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-3xs text-[#545D57]">
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
    </div>
  );
};
