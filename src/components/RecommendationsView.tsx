/**
 * PathProof Phase 1 — Career Matching & Explainable Recommendations
 * Warm Paper + Forest Green design tokens.
 * Implements FR-REC-01 through FR-REC-06.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import {
  Sparkles,
  Award,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  GitCompare,
  ArrowRight,
  TrendingUp,
  RotateCw,
} from 'lucide-react';

interface RecommendationsViewProps {
  onOpenReport: (careerId: number) => void;
  onOpenCompare: (careerId: number) => void;
  onNavigateToTab: (tab: any) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenReport,
  onOpenCompare,
  onNavigateToTab,
}) => {
  const [assessment, setAssessment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCareerId, setExpandedCareerId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getLatestRecommendations();
      setAssessment(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const data = await apiClient.generateRecommendations();
      setAssessment(data);
      setMessage({ type: 'success', text: 'New recommendations successfully generated.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate recommendations.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpand = (careerId: number) => {
    setExpandedCareerId((prev) => (prev === careerId ? null : careerId));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            EXPLAINABLE MULTI-CRITERIA MATCHING
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <Sparkles className="w-7 h-7 text-[#244B3A]" />
            <span>Career Matching & Factor Breakdown</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Deterministic matching evaluating Coursework (30%), Interests (45%), and Work-Activity Preferences (25%).
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 text-[#D8E99A] ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Calculating...' : 'Recalculate Alignment'}</span>
        </button>
      </div>

      {/* Strict Separation Principle Disclosure (Rule BR-11) */}
      <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#5B675A] flex items-start space-x-3 shadow-xs">
        <Info className="w-5 h-5 text-[#244B3A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#173629] block mb-0.5">
            Architecture Governance Rule (BR-11 / SRS §5.4):
          </span>
          <strong>Alignment Fit</strong> and <strong>Skill Readiness</strong> are computed and presented as strictly separate metrics.
          Alignment indicates whether this career fits your academic coursework and stated interests.
          Skill Readiness indicates your current self-reported technical preparation against employer job postings.
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-start space-x-2 ${
            message.type === 'success'
              ? 'bg-[#EBF2E9] border-[#DCE8D9] text-[#173629]'
              : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#244B3A]" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#991B1B]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Assessment Metadata Card */}
      {assessment && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#657064] shadow-xs">
          <div>
            Assessment ID: <strong className="text-[#173629] font-mono">#{assessment.assessmentId}</strong> · Algorithm:{' '}
            <strong className="text-[#244B3A] font-mono">{assessment.algorithmVersion}</strong>
          </div>
          <div>
            Profile Completeness: <strong className="text-[#173629] font-mono">{assessment.profileCompleteness}%</strong>
          </div>
          <div>
            Computed: <span className="text-[#485347]">{new Date(assessment.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Results Ranking List */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-[#657064] text-sm">Evaluating your academic and preference mappings...</p>
        </div>
      ) : !assessment || !assessment.results || assessment.results.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E4DA] rounded-2xl p-6 space-y-4 shadow-xs">
          <Sparkles className="w-12 h-12 text-[#A0AAA0] mx-auto" />
          <h3 className="text-lg font-bold text-[#173629]">No Matching Results Generated Yet</h3>
          <p className="text-xs text-[#657064] max-w-md mx-auto">
            Click "Recalculate Alignment" above or ensure your profile has academic subjects and interest ratings recorded.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-[#173629] hover:bg-[#244B3A] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
          >
            Generate Career Recommendations
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {assessment.results.map((rec: any, index: number) => {
            const isExpanded = expandedCareerId === rec.careerId;
            const rank = rec.rankPosition || index + 1;

            return (
              <div
                key={rec.careerId}
                className="bg-white border border-[#E5E4DA] hover:border-[#CBD5CD] rounded-2xl p-6 transition-all shadow-xs space-y-4"
              >
                {/* Top Row: Rank, Title, Alignment & Skill Readiness Scores */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                        rank === 1
                          ? 'bg-[#173629] text-[#D8E99A]'
                          : rank === 2
                          ? 'bg-[#EBF2E9] text-[#173629] border border-[#DCE8D9]'
                          : 'bg-[#EFEEE5] text-[#657064]'
                      }`}
                    >
                      #{rank}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-[#173629]">{rec.careerTitle}</h2>
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-[#EFEEE5] text-[#485347]">
                          {rec.categoryName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-3xs text-[#657064] mt-1">
                        <span>
                          Dimensions: <strong className="text-[#202A23]">{rec.availableDimensions} of 3</strong>
                        </span>
                        {rec.components?.omittedDimensions?.length > 0 && (
                          <span className="text-[#854D0E]">
                            ({rec.components.omittedDimensions.join(', ')} omitted - re-normalized)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dual Independent Gauges */}
                  <div className="flex items-center space-x-4 bg-[#FAF9F5] p-3 rounded-xl border border-[#EBEAE0] shrink-0">
                    {/* Gauge 1: Alignment Score */}
                    <div className="text-center px-3 border-r border-[#E5E4DA]">
                      <span className="text-3xs uppercase tracking-wider text-[#657064] font-bold block">
                        Alignment Fit
                      </span>
                      <span className="text-2xl font-extrabold text-[#173629] font-mono tabular-nums">
                        {rec.alignmentScore !== null ? `${rec.alignmentScore}%` : 'N/A'}
                      </span>
                      <span className="text-3xs text-[#657064] block">Courses & Interests</span>
                    </div>

                    {/* Gauge 2: Skill Coverage (Separated) */}
                    <div className="text-center px-3">
                      <span className="text-3xs uppercase tracking-wider text-[#657064] font-bold block">
                        Skill Readiness
                      </span>
                      <span className="text-2xl font-extrabold text-[#244B3A] font-mono tabular-nums">
                        {rec.skillCoverageScore}%
                      </span>
                      <span className="text-3xs text-[#657064] block">Self-Reported</span>
                    </div>
                  </div>
                </div>

                {/* Mathematical Dimension Breakdown Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#FAF9F5] p-3 rounded-xl border border-[#EBEAE0]">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[#657064]">Academic Coursework (30%):</span>
                    <strong className="text-[#173629] font-mono">
                      {rec.components?.academic !== null ? `${rec.components.academic}%` : '—'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between px-2 sm:border-x sm:border-[#E5E4DA]">
                    <span className="text-[#657064]">Stated Interests (45%):</span>
                    <strong className="text-[#173629] font-mono">
                      {rec.components?.interest !== null ? `${rec.components.interest}%` : '—'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[#657064]">Work Activities (25%):</span>
                    <strong className="text-[#173629] font-mono">
                      {rec.components?.activity !== null ? `${rec.components.activity}%` : '—'}
                    </strong>
                  </div>
                </div>

                {/* Primary Reasons / Explainability bullets */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-3xs uppercase font-bold text-[#657064] tracking-wider">
                    Key Alignment Drivers:
                  </div>
                  <ul className="space-y-1 text-xs text-[#485347]">
                    {(rec.reasons || []).slice(0, 3).map((r: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <span className="text-[#244B3A] font-bold">·</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EFE8]">
                  <button
                    onClick={() => toggleExpand(rec.careerId)}
                    className="text-xs font-semibold text-[#244B3A] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Factor Breakdown' : 'Examine Complete Factor Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenCompare(rec.careerId)}
                      className="px-3 py-1.5 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare</span>
                    </button>

                    <button
                      onClick={() => onOpenReport(rec.careerId)}
                      className="px-3.5 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#D8E99A]" />
                      <span>View Reality Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Factor Breakdown & Evidence Transparency */}
                {isExpanded && rec.explanations && (
                  <div className="mt-4 pt-4 border-t border-[#E5E4DA] space-y-4 bg-[#FAF9F5] p-5 rounded-xl border border-[#EBEAE0] animate-fade-in text-xs">
                    <div className="font-bold text-sm text-[#173629] mb-1">
                      Complete Explainability Log for {rec.careerTitle}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Academic Analysis */}
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-xs text-[#173629] flex items-center space-x-1.5">
                          <BookOpen className="w-4 h-4 text-[#244B3A]" />
                          <span>Academic Coursework Contributions</span>
                        </h4>
                        <ul className="space-y-1 text-2xs text-[#485347]">
                          {(rec.explanations.academicReasons || []).map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <span className="text-[#244B3A]">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interest & Activity Analysis */}
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-xs text-[#173629] flex items-center space-x-1.5">
                          <Sliders className="w-4 h-4 text-[#244B3A]" />
                          <span>Interests & Work Style Affinity</span>
                        </h4>
                        <ul className="space-y-1 text-2xs text-[#485347]">
                          {(rec.explanations.interestReasons || []).map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <span className="text-[#244B3A]">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Skill Readiness Analysis */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E5E4DA]">
                      <h4 className="font-bold text-xs text-[#173629] flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-[#244B3A]" />
                        <span>Self-Reported Skill Analysis</span>
                      </h4>
                      <ul className="space-y-1 text-2xs text-[#485347]">
                        {(rec.explanations.skillReasons || []).map((reason: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-[#244B3A]">·</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pakistan Job Evidence Citation */}
                    {rec.explanations.evidenceNotes && rec.explanations.evidenceNotes.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-[#E5E4DA] text-2xs text-[#5B675A] space-y-1">
                        <span className="font-bold text-[#173629] block">
                          Pakistan Job Reality Evidence Grounding:
                        </span>
                        {rec.explanations.evidenceNotes.map((note: string, idx: number) => (
                          <p key={idx}>{note}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
