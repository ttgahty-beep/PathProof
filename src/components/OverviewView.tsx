/**
 * PathProof Phase 1 — Platform Overview & Student Discovery Journey
 * Implements Charter & PRD vision and student onboarding flow.
 */

import React from 'react';
import { SafeUser } from '../types/index.ts';
import {
  Compass,
  Sparkles,
  BookOpen,
  Award,
  Sliders,
  GitCompare,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building,
  Target,
  Layers,
  Clock,
} from 'lucide-react';

interface OverviewViewProps {
  currentUser: SafeUser | null;
  onNavigate: (tab: any) => void;
  onOpenAuth: () => void;
  onQuickSwitchUser: (type: 'student' | 'admin' | 'student2') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  onQuickSwitchUser,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phase 1 — Career Discovery & Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            From Vague Assumptions to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Evidence-Based
            </span>{' '}
            Career Clarity.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            PathProof connects your university coursework, self-reported skills, and preferred work activities
            directly to curated entry-level job and internship evidence from Pakistan’s software industry.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {currentUser ? (
              <>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Career Matching</span>
                </button>

                <button
                  onClick={() => onNavigate('careers')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700 flex items-center space-x-1.5"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Explore 6 Target Careers</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onQuickSwitchUser('student')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700 flex items-center space-x-2"
                >
                  <span>Instant Student Demo</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Abstract decorative accent */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Core Foundational Principles (Document PP-P1-PRD-001 Section 2) */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-2xs uppercase tracking-widest text-emerald-400 font-bold">
            Guiding Philosophy
          </span>
          <h2 className="text-2xl font-black text-white">Principles That Govern PathProof</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Evidence Before Claims</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every job-market statistic displays its exact source URL, sample size (numerator/denominator),
              and verification date. Sample data describes only our research observations, never national overclaims.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Alignment ≠ Skill Readiness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We strictly separate interest and academic fit from how many entry-level skills you currently meet.
              Passion for building systems is never confused with meeting all database prerequisites.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Deterministic & Explainable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box "AI scores." Recommendations provide explicit component scores (Academic 30%, Interest 45%, Activity 25%)
              with verifiable factual reasons for every result.
            </p>
          </div>
        </div>
      </div>

      {/* Student End-to-End Discovery Journey */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-2xs uppercase tracking-widest text-emerald-400 font-bold">Workflow Roadmap</span>
            <h2 className="text-xl font-bold text-white">Phase 1 Student Discovery Workflow</h2>
          </div>
          <span className="text-xs text-slate-400">Complete all 5 stages for maximum matching clarity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            onClick={() => onNavigate('profile')}
            className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              1
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
              Profile & Courses
            </h4>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Record degree, semester, learning hours, and completed/in-progress university subjects.
            </p>
          </div>

          <div
            onClick={() => onNavigate('skills')}
            className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              2
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors">
              Skills Inventory
            </h4>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Add self-reported technical skills across levels 1 (Beginner) to 4 (Advanced).
            </p>
          </div>

          <div
            onClick={() => onNavigate('preferences')}
            className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              3
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Interests & Work
            </h4>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Rate conceptual interests and day-to-day work activities on a 1–5 scale.
            </p>
          </div>

          <div
            onClick={() => onNavigate('recommendations')}
            className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              4
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
              Matching Engine
            </h4>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Generate ranked career alternatives with dimension scores and transparent reasons.
            </p>
          </div>

          <div
            onClick={() => onNavigate('compare')}
            className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              5
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
              Comparison & Report
            </h4>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Compare 2–3 paths side by side and generate an official Career Reality Report.
            </p>
          </div>
        </div>
      </div>

      {/* Scope Governance Card (Document PP-P1-CH-001 Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Included in Phase 1</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Student registration & role-based access control (Student vs Admin).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Smart student profile with semester stage, coursework status, hours, and budget.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Searchable catalogue of 6 initial computing career paths.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Pakistan Job Reality Engine with 24+ source-tracked entry-level observations.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Explainable matching engine with re-normalized missing dimension handling.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Side-by-side career comparison of 2 or 3 distinct paths.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Official Career Reality Report synthesizing academics, skills, and evidence.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Explicitly Reserved for Phase 2</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Practical coding challenge simulations and automated submission grading.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Adaptive learning roadmaps and constraint-aware task scheduling.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Student verified portfolio and evidence artifact lockers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Counsellor review dashboard and student-counsellor assignments.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-bold">•</span>
              <span>Live job scraping feeds, job applications, or recruitment placement.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
