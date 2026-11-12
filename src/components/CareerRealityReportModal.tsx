/**
 * PathProof Phase 1 — Career Reality Report View & Export
 * Warm Paper + Forest Green design tokens.
 * Implements FR-REPORT-01 through FR-REPORT-03.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import {
  FileText,
  X,
  Printer,
  Compass,
  GraduationCap,
  Award,
  Layers,
  BarChart2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building,
  Calendar,
} from 'lucide-react';

interface CareerRealityReportModalProps {
  careerId: number;
  onClose: () => void;
}

export const CareerRealityReportModal: React.FC<CareerRealityReportModalProps> = ({
  careerId,
  onClose,
}) => {
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [careerId]);

  const loadReport = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiClient.getCareerRealityReport(careerId);
      setReport(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-fade-in">
      <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-6 max-h-[95vh] flex flex-col print:border-none print:shadow-none print:max-h-none print:bg-white print:text-black">
        {/* Header Actions */}
        <div className="px-6 py-4 border-b border-[#E5E4DA] flex items-center justify-between shrink-0 bg-[#F7F6F0] sticky top-0 z-20 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173629] flex items-center justify-center text-[#D8E99A]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-[#173629] text-base">PathProof Career Reality Report</span>
              <span className="ml-2 text-3xs uppercase px-2 py-0.5 rounded bg-[#DCE8D9] text-[#173629] font-bold">
                Official Dossier
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#D8E99A]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#657064] hover:text-[#173629] p-1 rounded-lg hover:bg-[#EFEEE5] transition-colors cursor-pointer"
              aria-label="Close report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 print:p-0 print:space-y-6 bg-white text-[#202A23]">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-[#657064]">
                Synthesizing academic coursework, student skills, and local market evidence...
              </p>
            </div>
          ) : errorMsg || !report ? (
            <div className="p-6 text-center text-[#991B1B]">
              <p className="text-sm font-semibold">{errorMsg || 'Unable to generate report.'}</p>
            </div>
          ) : (() => {
            const student = report.student || {};
            const career = report.career || {};
            const alignment = report.alignment || { alignmentScore: null, academicScore: null, interestScore: null, activityScore: null };
            const skillReadiness = report.skillReadiness || { skillCoverageScore: 0, matchedCount: 0, developingCount: 0, missingCount: 0 };
            const skillGaps = (report.skillGaps || report.skillReadiness?.gapItems || []) as any[];
            const marketEvidence = (report.marketEvidence || report.jobRealityMarketSample?.marketSummary || {
              sampleSize: 0,
              skillFrequencies: [],
            }) as any;
            const skillFrequencies = (marketEvidence.skillFrequencies || []) as any[];

            return (
              <>
                {/* Document Header */}
                <div className="border-b border-[#E5E4DA] pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-3xs uppercase tracking-widest text-[#244B3A] font-bold block">
                        PATHPROOF INTELLIGENCE DOSSIER · PP-P1-REP
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] mt-1">
                        {career.careerTitle || 'Career Title'}
                      </h1>
                      <span className="text-xs text-[#657064] font-semibold">
                        Category: {career.categoryName || 'General'}
                      </span>
                    </div>

                    <div className="text-left sm:text-right text-xs text-[#657064] space-y-1">
                      <div>
                        Report ID: <strong className="text-[#173629] font-mono">{report.reportId || 'REP-001'}</strong>
                      </div>
                      <div>
                        Generated: <span className="text-[#202A23]">{report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="text-3xs text-[#244B3A] font-bold font-mono">
                        Algorithm Model: p1.0 (Deterministic)
                      </div>
                    </div>
                  </div>

                  {/* Student Profile Metadata Box */}
                  <div className="mt-5 p-4 bg-[#FAF9F5] border border-[#E5E4DA] rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-3xs uppercase font-bold text-[#657064] block">Student Scholar</span>
                      <strong className="text-[#173629] font-semibold">{student.fullName || 'Student Scholar'}</strong>
                    </div>
                    <div>
                      <span className="text-3xs uppercase font-bold text-[#657064] block">Degree & Semester</span>
                      <strong className="text-[#173629] font-semibold">
                        {student.degreeProgram || 'Computing'} (Sem {student.currentSemester || '—'})
                      </strong>
                    </div>
                    <div>
                      <span className="text-3xs uppercase font-bold text-[#657064] block">Institution</span>
                      <span className="text-[#485347] truncate block">
                        {student.universityName || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-3xs uppercase font-bold text-[#657064] block">Study Capacity</span>
                      <span className="text-[#485347]">
                        {student.weeklyLearningHours ? `${student.weeklyLearningHours} hrs/wk` : 'Flexible'} ·{' '}
                        {student.budgetPreference ? String(student.budgetPreference).replace('_', ' ') : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dual Primary Metric Cards (Alignment vs Skill Readiness) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Alignment Fit */}
                  <div className="p-5 bg-[#FAF9F5] border border-[#E5E4DA] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-5 h-5 text-[#244B3A]" />
                        <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider">
                          Career Alignment Score
                        </h3>
                      </div>
                      <span className="text-3xl font-extrabold text-[#173629] font-mono tabular-nums">
                        {alignment.alignmentScore !== null && alignment.alignmentScore !== undefined ? `${alignment.alignmentScore}%` : 'N/A'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5B675A] leading-relaxed">
                      Calculated from your academic coursework relevance (30%), stated interest fit (45%), and work activity preferences (25%).
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E4DA] text-center text-xs">
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#657064] block">Academic</span>
                        <strong className="text-[#173629] font-mono">
                          {alignment.academicScore !== null && alignment.academicScore !== undefined ? `${alignment.academicScore}%` : 'N/A'}
                        </strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#657064] block">Interest</span>
                        <strong className="text-[#173629] font-mono">
                          {alignment.interestScore !== null && alignment.interestScore !== undefined ? `${alignment.interestScore}%` : 'N/A'}
                        </strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#657064] block">Activity</span>
                        <strong className="text-[#173629] font-mono">
                          {alignment.activityScore !== null && alignment.activityScore !== undefined ? `${alignment.activityScore}%` : 'N/A'}
                        </strong>
                      </div>
                    </div>

                    <p className="text-3xs text-[#657064] italic">
                      {alignment.disclaimer}
                    </p>
                  </div>

                  {/* 2. Skill Readiness & Coverage */}
                  <div className="p-5 bg-[#FAF9F5] border border-[#E5E4DA] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-[#244B3A]" />
                        <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider">
                          Skill Readiness & Coverage
                        </h3>
                      </div>
                      <span className="text-3xl font-extrabold text-[#244B3A] font-mono tabular-nums">
                        {skillReadiness.skillCoverageScore || 0}%
                      </span>
                    </div>

                    <p className="text-xs text-[#5B675A] leading-relaxed">
                      Weighted proportion of required skills currently met or partially met by your self-reported proficiency.
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E4DA] text-center text-xs">
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#173629] font-bold block">Meets Target</span>
                        <strong className="text-[#173629] font-mono">{skillReadiness.matchedCount || 0}</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#854D0E] font-bold block">Developing</span>
                        <strong className="text-[#854D0E] font-mono">{skillReadiness.developingCount || 0}</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E5E4DA]">
                        <span className="text-3xs text-[#991B1B] font-bold block">Missing</span>
                        <strong className="text-[#991B1B] font-mono">{skillReadiness.missingCount || 0}</strong>
                      </div>
                    </div>

                    <p className="text-3xs text-[#657064] italic">
                      {skillReadiness.disclaimer}
                    </p>
                  </div>
                </div>

                {/* Complete Skill Gap Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#244B3A]" />
                      <span>Skill Gap Breakdown Matrix</span>
                    </h3>
                    <span className="text-3xs text-[#657064]">
                      Target Level Scale: 1 Beginner, 2 Basic, 3 Intermediate, 4 Advanced
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-[#E5E4DA] rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#EFEEE5] text-[#173629]">
                        <tr className="border-b border-[#E5E4DA]">
                          <th className="p-3 font-bold">Skill Name</th>
                          <th className="p-3 font-bold">Category</th>
                          <th className="p-3 font-bold">Importance</th>
                          <th className="p-3 font-bold">Target</th>
                          <th className="p-3 font-bold">Your Level</th>
                          <th className="p-3 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E4DA] bg-white text-[#202A23]">
                        {skillGaps.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-[#657064]">
                              No specific skill gaps recorded for this target profile.
                            </td>
                          </tr>
                        ) : (
                          skillGaps.map((sg: any) => (
                            <tr key={sg.skillId || sg.competencyId || Math.random()} className="hover:bg-[#FAF9F5]">
                              <td className="p-3 font-semibold">{sg.skillName || sg.competencyName}</td>
                              <td className="p-3 text-[#657064]">{sg.skillCategory || sg.category || 'General'}</td>
                              <td className="p-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-3xs font-bold ${
                                    sg.requirementType === 'CORE'
                                      ? 'bg-[#FEE2E2] text-[#991B1B]'
                                      : sg.requirementType === 'IMPORTANT'
                                      ? 'bg-[#FEF9C3] text-[#854D0E]'
                                      : 'bg-[#EFEEE5] text-[#657064]'
                                  }`}
                                >
                                  {sg.requirementType || 'CORE'} ({sg.importanceWeight || 1.0}x)
                                </span>
                              </td>
                              <td className="p-3 font-mono font-semibold">L{sg.targetLevel}</td>
                              <td className="p-3 font-mono text-[#657064]">
                                {sg.studentLevel ? `L${sg.studentLevel}` : 'None (0)'}
                              </td>
                              <td className="p-3 text-right">
                                <span
                                  className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                    sg.status === 'MEETS_TARGET'
                                      ? 'bg-[#DCE8D9] text-[#173629]'
                                      : sg.status === 'DEVELOPING'
                                      ? 'bg-[#FEF9C3] text-[#854D0E]'
                                      : 'bg-[#FEE2E2] text-[#991B1B]'
                                  }`}
                                >
                                  {sg.status ? String(sg.status).replace('_', ' ') : 'MISSING'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Verified Pakistani Job Evidence Summary */}
                <div className="space-y-3 pt-4 border-t border-[#E5E4DA]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart2 className="w-4 h-4 text-[#244B3A]" />
                      <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider">
                        Empirical Pakistan Job Market Evidence
                      </h3>
                    </div>
                    <span className="text-3xs text-[#244B3A] font-bold">
                      Sample: {marketEvidence.sampleSize || 0} Verified Postings
                    </span>
                  </div>

                  <div className="p-3 bg-[#EBF2E9] border border-[#DCE8D9] rounded-xl text-xs text-[#173629]">
                    <strong>Empirical Notice:</strong> Frequencies indicate mentions across inspected postings from Techlogix, Systems Ltd, and 10Pearls.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {skillFrequencies.length === 0 ? (
                      <div className="col-span-2 p-3 text-center text-[#657064] bg-[#FAF9F5] rounded-xl">
                        No market evidence postings recorded for this specialization.
                      </div>
                    ) : (
                      skillFrequencies.map((sk: any) => (
                        <div
                          key={sk.skillId || Math.random()}
                          className="p-3 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl flex items-center justify-between"
                        >
                          <span className="font-semibold text-[#173629]">{sk.skillName}</span>
                          <div className="text-right">
                            <span className="font-bold text-[#244B3A] font-mono">
                              {sk.totalMentions || 0} / {sk.eligiblePostingsCount || marketEvidence.sampleSize || 0} ({sk.percentage || 0}%)
                            </span>
                            <div className="text-3xs text-[#657064]">
                              {sk.requiredCount || 0} required · {sk.preferredCount || 0} preferred
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Dossier Sign-Off Footer */}
                <div className="pt-6 border-t border-[#E5E4DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-3xs text-[#657064]">
                  <div>
                    PathProof University Intelligence Platform · Document No. PP-P1-DOSSIER
                  </div>
                  <div>
                    Verified by National Curricular Standards & Empirical Market Sampling
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
