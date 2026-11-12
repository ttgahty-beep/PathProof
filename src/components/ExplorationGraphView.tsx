/**
 * PathProof — Career Exploration Graph & Interactive Mindmap
 * Inspired directly by Reference Design Image 1 (Exploration Graph & AI Roadmap)
 * Synthesizes student core competencies, career tracks, glowing node connections,
 * skill analysis bars, and skill development gap gauges.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Career, StudentSkill, Skill, StudentSubject } from '../types/index.ts';
import {
  Sparkles,
  Search,
  Sliders,
  Compass,
  ArrowRight,
  Award,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  Maximize2,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface ExplorationGraphViewProps {
  onSelectCareer: (careerId: number) => void;
  onOpenReport: (careerId: number) => void;
  onOpenCompare: (careerId: number) => void;
}

export const ExplorationGraphView: React.FC<ExplorationGraphViewProps> = ({
  onSelectCareer,
  onOpenReport,
  onOpenCompare,
}) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | 'student'>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    setIsLoading(true);
    try {
      const [careersData, skillsData, allSkillsData, subjectsData] = await Promise.all([
        apiClient.getCareers(),
        apiClient.getStudentSkills(),
        apiClient.getActiveSkills(),
        apiClient.getStudentSubjects(),
      ]);
      setCareers(careersData);
      setStudentSkills(skillsData);
      setAllSkills(allSkillsData);
      setStudentSubjects(subjectsData);

      // Try fetching existing recommendations for score badges
      try {
        const recs = await apiClient.getRecommendations();
        setRecommendations(recs);
      } catch {
        // Recommendations might not be run yet
      }
    } catch (err) {
      console.error('Failed to load exploration graph data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get recommendation score for a career
  const getScoreForCareer = (careerId: number) => {
    const rec = recommendations.find((r) => r.career_id === careerId);
    if (!rec) return null;
    return {
      alignment: rec.alignment_score !== null ? Math.round(rec.alignment_score) : null,
      readiness: Math.round(rec.skill_coverage_score),
    };
  };

  // Pre-calculated coordinates for responsive mindmap layout (based on 960x480 coordinate space)
  // Center: Student Profile (X: 480, Y: 240)
  // Branch Left: Software Engineering (X: 200, Y: 150) -> Frontend (X: 60, Y: 80), Backend (X: 60, Y: 220)
  // Branch Right Top: Design & UX (X: 740, Y: 130) -> UI/UX Designer (X: 890, Y: 130)
  // Branch Right Bottom: Quality Assurance (X: 740, Y: 280) -> QA Engineer (X: 890, Y: 280)
  // Branch Bottom Left: Data & Analytics (X: 240, Y: 370) -> Data Analyst (X: 90, Y: 370)
  // Branch Bottom Right: Cybersecurity (X: 720, Y: 400) -> Cyber Analyst (X: 890, Y: 400)

  const careerNodes = [
    {
      id: 1, // Frontend Developer
      title: 'Frontend Developer',
      track: 'Software Engineering',
      trackColor: '#38bdf8', // Neon Sky Blue
      x: 100,
      y: 90,
      skills: ['React.js 95%', 'JavaScript 90%', 'HTML/CSS 100%'],
      mappedCourse: 'Web Technologies',
    },
    {
      id: 2, // Backend Developer
      title: 'Backend Developer',
      track: 'Software Engineering',
      trackColor: '#38bdf8',
      x: 100,
      y: 230,
      skills: ['SQL Databases 80%', 'REST APIs 75%', 'Node.js 60%'],
      mappedCourse: 'Database Systems',
    },
    {
      id: 4, // Data Analyst
      title: 'Data Analyst',
      track: 'Data & Analytics',
      trackColor: '#10b981', // Neon Emerald
      x: 120,
      y: 380,
      skills: ['Data Analysis 85%', 'SQL 80%', 'Python 75%'],
      mappedCourse: 'Data Structures & Algo',
    },
    {
      id: 5, // UI/UX Designer
      title: 'UI/UX Designer',
      track: 'Design & User Experience',
      trackColor: '#c084fc', // Neon Purple
      x: 840,
      y: 110,
      skills: ['Wireframing 70%', 'Design Thinking 85%', 'CSS 95%'],
      mappedCourse: 'Human-Computer Interaction',
    },
    {
      id: 3, // QA Engineer
      title: 'QA Engineer',
      track: 'Quality Assurance',
      trackColor: '#fbbf24', // Neon Amber
      x: 840,
      y: 250,
      skills: ['Test Cases 75%', 'Postman 80%', 'Bug Reporting 85%'],
      mappedCourse: 'Software Engineering',
    },
    {
      id: 6, // Cybersecurity Analyst
      title: 'Cybersecurity Analyst',
      track: 'Cyber Defense',
      trackColor: '#f43f5e', // Neon Rose
      x: 840,
      y: 390,
      skills: ['Network Security 60%', 'Linux 70%', 'Protocols 65%'],
      mappedCourse: 'Computer Networks',
    },
  ];

  const filteredNodes = searchQuery
    ? careerNodes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : careerNodes;

  const activeCareer = careers.find((c) => c.career_id === selectedNodeId);
  const activeScore = typeof selectedNodeId === 'number' ? getScoreForCareer(selectedNodeId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in text-white">
      {/* Top Header Row matching Reference Image 1 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-2xs font-extrabold tracking-wider text-cyan-400 uppercase">
              Phase 1 Interactive Exploration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 flex items-center space-x-3">
            <span>Career Exploration Graph & Mindmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual network connecting university competencies, self-reported skills, and Pakistan software industry paths.
          </p>
        </div>

        {/* Search & Graph Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, roles..."
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-64 transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-slate-400">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="px-2 py-1 hover:text-white rounded text-xs font-bold"
              title="Zoom out"
            >
              -
            </button>
            <span className="px-1 text-2xs font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className="px-2 py-1 hover:text-white rounded text-xs font-bold"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-white rounded text-xs ml-1"
              title="Reset view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0b0f19] to-[#060810] border border-cyan-500/20 shadow-2xl overflow-hidden min-h-[520px] p-4 flex flex-col justify-between">
        {/* Glowing Radial Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[250px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[250px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Mindmap Curved Connections Layer */}
        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar">
          <div
            className="relative w-[960px] h-[440px] mx-auto transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 960 440">
              <defs>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
                </linearGradient>

                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Central Hub to Left Nodes (Software Dev / Data) */}
              <path
                d="M 480 220 C 340 220, 280 90, 190 90"
                fill="none"
                stroke="url(#grad-blue)"
                strokeWidth="2.5"
                filter="url(#glow-cyan)"
              />
              <path
                d="M 480 220 C 340 220, 280 230, 190 230"
                fill="none"
                stroke="url(#grad-blue)"
                strokeWidth="2"
              />
              <path
                d="M 480 220 C 340 220, 300 380, 210 380"
                fill="none"
                stroke="url(#grad-emerald)"
                strokeWidth="2"
              />

              {/* Central Hub to Right Nodes (Design, QA, Cybersecurity) */}
              <path
                d="M 480 220 C 620 220, 680 110, 770 110"
                fill="none"
                stroke="url(#grad-purple)"
                strokeWidth="2.5"
                filter="url(#glow-cyan)"
              />
              <path
                d="M 480 220 C 620 220, 680 250, 770 250"
                fill="none"
                stroke="url(#grad-amber)"
                strokeWidth="2"
              />
              <path
                d="M 480 220 C 620 220, 680 390, 770 390"
                fill="none"
                stroke="url(#grad-rose)"
                strokeWidth="2"
              />

              {/* Animated Glowing Signal Pulses */}
              <circle cx="335" cy="155" r="3.5" fill="#38bdf8">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="625" cy="165" r="3.5" fill="#c084fc">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="625" cy="235" r="3.5" fill="#fbbf24">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="345" cy="300" r="3.5" fill="#10b981">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Central Node: Student Discovery Core */}
            <div
              onClick={() => setSelectedNodeId('student')}
              className={`absolute top-[170px] left-[390px] w-[180px] p-3 rounded-2xl cursor-pointer transition-all duration-300 z-20 text-center shadow-xl ${
                selectedNodeId === 'student'
                  ? 'bg-slate-900 border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)] scale-105'
                  : 'bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:scale-102'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center font-bold text-xs mb-1.5 border border-cyan-400/40">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-2xs uppercase tracking-wider text-cyan-400 font-extrabold">Student Core</div>
              <div className="font-extrabold text-sm text-white">Hamza Tariq</div>
              <div className="text-2xs text-slate-400 mt-0.5 font-medium">BS SE · Semester 5</div>
              <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-around text-2xs">
                <span className="text-emerald-400 font-bold">{studentSkills.length} Skills</span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400 font-bold">{studentSubjects.length} Courses</span>
              </div>
            </div>

            {/* Surrounding Interactive Career Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const scores = getScoreForCareer(node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ top: `${node.y}px`, left: `${node.x}px` }}
                  className={`absolute w-[175px] p-3 rounded-xl cursor-pointer transition-all duration-200 z-10 shadow-lg ${
                    isSelected
                      ? 'bg-slate-900 border-2 shadow-2xl scale-105'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:scale-102'
                  }`}
                  // Dynamic border highlight matching track color
                  // eslint-disable-next-line react/style-prop-object
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-2xs uppercase font-extrabold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${node.trackColor}20`,
                        color: node.trackColor,
                        border: `1px solid ${node.trackColor}40`,
                      }}
                    >
                      {node.track}
                    </span>
                    {scores && scores.alignment !== null && (
                      <span className="text-2xs font-extrabold text-emerald-400 font-mono">
                        {scores.alignment}%
                      </span>
                    )}
                  </div>

                  <div className="font-extrabold text-xs text-white leading-tight truncate">{node.title}</div>
                  <div className="text-2xs text-slate-400 truncate mt-0.5">📚 {node.mappedCourse}</div>

                  {/* Top skills pills */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 space-y-1">
                    {node.skills.slice(0, 2).map((sk, idx) => (
                      <div key={idx} className="text-2xs text-slate-300 font-mono flex items-center justify-between">
                        <span className="truncate">{sk.split(' ')[0]}</span>
                        <span className="text-slate-400">{sk.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Action Bar on bottom of Canvas */}
        {activeCareer && typeof selectedNodeId === 'number' && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/60 p-3 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center space-x-2">
                  <span>{activeCareer.career_title}</span>
                  {activeScore && (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Fit: {activeScore.alignment ?? 'N/A'}% · Readiness: {activeScore.readiness}%
                    </span>
                  )}
                </div>
                <div className="text-2xs text-slate-400 line-clamp-1">{activeCareer.summary}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onSelectCareer(activeCareer.career_id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
              >
                Inspect Profile
              </button>
              <button
                onClick={() => onOpenCompare(activeCareer.career_id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
              >
                Compare
              </button>
              <button
                onClick={() => onOpenReport(activeCareer.career_id)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-1"
              >
                <span>Career Reality Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Analytics Cards matching Reference Image 1 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Skill Analysis (Vertical Pill Bars) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xs uppercase tracking-wider text-cyan-400 font-bold">Skill Analysis</div>
                <h3 className="font-extrabold text-sm text-white">Curriculum Competencies</h3>
              </div>
              <span className="text-2xs text-slate-400 font-mono">SE Curricula</span>
            </div>

            {/* Glowing vertical pill bars */}
            <div className="grid grid-cols-4 gap-3 h-36 items-end pt-4 pb-2">
              {[
                { name: 'Algorithms', pct: 95, color: 'from-cyan-500 to-blue-500' },
                { name: 'System Design', pct: 88, color: 'from-teal-400 to-emerald-500' },
                { name: 'Databases', pct: 82, color: 'from-blue-500 to-indigo-500' },
                { name: 'Code & Web', pct: 92, color: 'from-purple-500 to-pink-500' },
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end">
                  <span className="text-2xs font-extrabold text-white mb-1">{bar.pct}%</span>
                  <div className="w-6 sm:w-8 bg-slate-800 rounded-t-lg relative overflow-hidden flex items-end h-24">
                    <div
                      className={`w-full rounded-t-lg bg-gradient-to-t ${bar.color} transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.3)]`}
                      style={{ height: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="text-2xs text-slate-400 truncate w-full text-center mt-2 font-medium">
                    {bar.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-2xs text-slate-500 pt-2 border-t border-slate-800 text-center">
            Evaluated from completed semester 1–5 university courses.
          </div>
        </div>

        {/* Panel 2: Skill Development Gaps (Circular Gauges) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xs uppercase tracking-wider text-purple-400 font-bold">Skill Gap Analysis</div>
                <h3 className="font-extrabold text-sm text-white">Development Horizons</h3>
              </div>
              <span className="text-2xs text-slate-400 font-mono">Phase 1 Target</span>
            </div>

            <div className="flex items-center justify-around h-36 py-2">
              {/* Gauge 1 */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      strokeDasharray="45, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-extrabold text-sm text-cyan-300 font-mono">45%</span>
                </div>
                <span className="text-2xs font-bold text-slate-300 mt-2 text-center">Testing Automation</span>
                <span className="text-2xs text-slate-500">2 skills missing</span>
              </div>

              {/* Gauge 2 */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-400"
                      strokeDasharray="60, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-extrabold text-sm text-purple-300 font-mono">60%</span>
                </div>
                <span className="text-2xs font-bold text-slate-300 mt-2 text-center">Backend Pipelines</span>
                <span className="text-2xs text-slate-500">Node.js developing</span>
              </div>
            </div>
          </div>
          <div className="text-2xs text-slate-500 pt-2 border-t border-slate-800 text-center">
            Independent of alignment score (BR-09 Separation Rule).
          </div>
        </div>

        {/* Panel 3: Career Path Progress Ladder */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xs uppercase tracking-wider text-emerald-400 font-bold">Ladder Stepping</div>
                <h3 className="font-extrabold text-sm text-white">Degree Stage to Market Entry</h3>
              </div>
              <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sem 5 / 8
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-200 font-semibold">Foundational Courses (Sem 1-4)</span>
                </div>
                <span className="text-2xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-xs text-white font-bold">Current: Core Electives (Sem 5)</span>
                </div>
                <span className="text-2xs font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">Active</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-slate-800/60 opacity-80">
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-400">Internship Readiness (Sem 6)</span>
                </div>
                <span className="text-2xs font-mono text-slate-500">Upcoming</span>
              </div>
            </div>
          </div>

          <div className="text-2xs text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Overall Profile Completeness:</span>
            <span className="text-emerald-400 font-mono font-bold">100% (Eligible)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
