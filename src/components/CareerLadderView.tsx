/**
 * PathProof — Career Progression Ladder & Stage Journey
 * Inspired directly by Reference Design Image 3 ("Plano de Carreira" / Journey Track)
 * Provides step-by-step progression roadmap from University Semesters to Industry Entry.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Career, StudentProfile, StudentSkill } from '../types/index.ts';
import {
  GitCommit,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  FileCheck,
  Compass,
} from 'lucide-react';

interface CareerLadderViewProps {
  onSelectCareer: (careerId: number) => void;
  onOpenReport: (careerId: number) => void;
}

export const CareerLadderView: React.FC<CareerLadderViewProps> = ({
  onSelectCareer,
  onOpenReport,
}) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<number>(1); // Default to Frontend Developer
  const [careerDetail, setCareerDetail] = useState<any | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedCareerId) {
      loadCareerLadder(selectedCareerId);
    }
  }, [selectedCareerId]);

  const loadInitial = async () => {
    try {
      const [careersData, prof, skills] = await Promise.all([
        apiClient.getCareers(),
        apiClient.getProfile(),
        apiClient.getStudentSkills(),
      ]);
      setCareers(careersData);
      setProfile(prof);
      setStudentSkills(skills);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCareerLadder = async (id: number) => {
    setIsLoading(true);
    try {
      const detail = await apiClient.getCareerDetail(id);
      setCareerDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSemester = profile?.current_semester || 5;
  const weeklyHours = profile?.weekly_learning_hours || 15;

  // Stages modeling based on Pakistani CS/SE Curriculum stages:
  // Stage 1: Sem 1-4 (Foundational Computing)
  // Stage 2: Sem 5-6 (Specialized Electives & Projects - CURRENT for Hamza)
  // Stage 3: Sem 7-8 (Internship & Final Year Project Industry Readiness)
  // Stage 4: Post-Graduation (Associate / Junior Full-Time Role in Industry)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in text-white">
      {/* Header and Career Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-2xs font-extrabold tracking-wider text-emerald-400 uppercase">
              Degree-to-Industry Pathway
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Career Journey & Progression Ladder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your semester milestones, prerequisites, and high-impact skills required to unlock entry-level market opportunities.
          </p>
        </div>

        {/* Career Switcher Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Target Career:</label>
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-xs sm:text-sm font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
          >
            {careers.map((c) => (
              <option key={c.career_id} value={c.career_id}>
                {c.career_title} ({c.category_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Journey Grid matching Reference Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 9 Columns: Your Journey (Sua Jornada) Stepping Nodes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Career Progression Track</span>
              </h2>
              <button
                onClick={() => onOpenReport(selectedCareerId)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>Full Reality Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stepping Connector Bar (Connected horizontal nodes) */}
            <div className="relative flex items-center justify-between px-4 sm:px-8 py-4">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0" />
              <div
                className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 -z-0 transition-all duration-500"
                style={{ width: '45%' }}
              />

              {/* Node 1: Completed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-slate-950" />
                </div>
                <span className="text-2xs font-extrabold text-emerald-400 mt-2">Sem 1-4 Done</span>
              </div>

              {/* Node 2: Current (In Progress) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-extrabold text-xs flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  65%
                </div>
                <span className="text-2xs font-extrabold text-cyan-400 mt-2">Current (Sem 5)</span>
              </div>

              {/* Node 3: Locked / Upcoming */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-2xs font-medium text-slate-400 mt-2">Intern / Sem 6-7</span>
              </div>

              {/* Node 4: Industry Entry */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-2xs font-medium text-slate-400 mt-2">Junior Engineer</span>
              </div>
            </div>

            {/* Stage Cards Grid (4 columns matching Reference Image 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
              {/* Card 1: Foundational Stage */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-2xs uppercase tracking-wider font-extrabold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Foundations
                  </span>
                  <h3 className="font-extrabold text-sm text-white mt-2">Core CS & SE</h3>
                  <div className="text-2xs text-emerald-400 font-semibold mt-0.5 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed (Sem 1-4)</span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-2">
                    Programming, Data Structures, OOP, and Database Systems completed.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-2xs">
                  <div className="font-bold text-slate-300">Prerequisites Met:</div>
                  <div className="flex items-center space-x-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>OOP & Data Structures</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Relational Database Queries</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Current Stage (Sem 5) */}
              <div className="bg-slate-950/70 border-2 border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg shadow-cyan-500/10">
                <div>
                  <span className="text-2xs uppercase tracking-wider font-extrabold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                    Current Milestone
                  </span>
                  <h3 className="font-extrabold text-sm text-white mt-2">Advanced Stack</h3>
                  <div className="text-2xs text-cyan-300 font-semibold mt-0.5">
                    Semester 5 · 65% Completed
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-2xs">
                  <div className="font-bold text-slate-300">Target Skills (Active):</div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Web Technologies / APIs</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span>Production Frameworks</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Internship / Capstone Prep */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3 opacity-90">
                <div>
                  <span className="text-2xs uppercase tracking-wider font-extrabold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                    Upcoming Step
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-300 mt-2">Market Intern</h3>
                  <div className="text-2xs text-slate-400 mt-0.5">Semesters 6–7</div>
                  <p className="text-2xs text-slate-500 mt-2">
                    Requires 2 additional verification skills before applying.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-2xs">
                  <div className="font-bold text-slate-400">Required Skills:</div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Unit Testing Automation</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>CI/CD Pipeline Basics</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Post-Graduation Industry Role */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3 opacity-75">
                <div>
                  <span className="text-2xs uppercase tracking-wider font-extrabold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                    Career Horizon
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-300 mt-2">Associate Role</h3>
                  <div className="text-2xs text-slate-400 mt-0.5">Post-Degree (Sem 8+)</div>
                  <p className="text-2xs text-slate-500 mt-2">
                    Entry-level software engineer with competitive compensation.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-2xs">
                  <div className="font-bold text-slate-400">Key Competencies:</div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Production Architecture</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Team SDLC & Code Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Progress Summary Banner matching Image 3 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-200">
                  Progression Toward {careerDetail?.career_title || 'Role'} Entry:
                </span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">68%</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Keep progressing! You have completed foundational coursework and 7 relevant skills.
              </div>
            </div>

            <button
              onClick={() => onSelectCareer(selectedCareerId)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 shrink-0 transition-colors"
            >
              View Verified Market Postings
            </button>
          </div>
        </div>

        {/* Right 4 Columns: Next High-Impact Action (Próxima Ação) matching Image 3 */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-2xs uppercase tracking-wider font-extrabold text-emerald-400">
                Recommended Next Action
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Target Milestone Icon & Title */}
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-3">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-white">
                Complete Web Technologies Lab & REST Integration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fulfills core prerequisite for Pakistani software firms hiring junior frontend & full-stack roles.
              </p>
            </div>

            {/* Action Meta Details (Time & Impact) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-2xs mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Estimated Time</span>
                </div>
                <div className="font-extrabold text-sm text-white font-mono">{weeklyHours}h / week</div>
                <div className="text-2xs text-slate-500">Student Study Budget</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-1 text-emerald-400 text-2xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Readiness Gain</span>
                </div>
                <div className="font-extrabold text-sm text-emerald-400 font-mono">+15% Gain</div>
                <div className="text-2xs text-slate-500">Direct Alignment</div>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onOpenReport(selectedCareerId)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Generate Reality Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-white flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Phase 1 Scope Guarantee</span>
            </div>
            <p className="text-2xs leading-relaxed text-slate-400">
              The ladder connects verified university coursework to target career taxonomies. Dynamic automated task scheduling belongs to Phase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
