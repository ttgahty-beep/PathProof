/**
 * PathProof Phase 1 — Side-by-Side Career Comparison Matrix
 * Warm Paper + Forest Green design tokens.
 * Implements FR-CAR-04 and Business Rule BR-12 (2 to 3 distinct careers).
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Career } from '../types/index.ts';
import {
  GitCompare,
  Plus,
  Trash2,
  Award,
  BookOpen,
  Briefcase,
  AlertCircle,
  FileText,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface ComparisonViewProps {
  initialCareerIds?: number[];
  onOpenReport?: (careerId: number) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  initialCareerIds = [1, 2],
  onOpenReport,
}) => {
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialCareerIds);
  const [comparisonData, setComparisonData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCatalogue();
  }, []);

  const loadCatalogue = async () => {
    try {
      const data = await apiClient.getCareers();
      setAllCareers(data);
      if (selectedIds.length >= 2 && selectedIds.length <= 3) {
        runComparison(selectedIds);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const runComparison = async (ids: number[]) => {
    if (ids.length < 2 || ids.length > 3) {
      setErrorMsg('Comparison requires exactly 2 or 3 distinct careers.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiClient.compareCareers(ids);
      setComparisonData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compare careers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCareer = (careerId: number) => {
    if (selectedIds.includes(careerId)) return;
    if (selectedIds.length >= 3) {
      setErrorMsg('Maximum 3 careers can be compared simultaneously (BR-12 rule).');
      return;
    }
    const next = [...selectedIds, careerId];
    setSelectedIds(next);
    runComparison(next);
  };

  const handleRemoveCareer = (careerId: number) => {
    if (selectedIds.length <= 2) {
      setErrorMsg('Comparison requires at least 2 careers (BR-12 rule).');
      return;
    }
    const next = selectedIds.filter((id) => id !== careerId);
    setSelectedIds(next);
    runComparison(next);
  };

  const availableToAdd = allCareers.filter((c) => !selectedIds.includes(c.career_id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            COMPARATIVE EVALUATION & CURRICULAR OVERLAP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <GitCompare className="w-7 h-7 text-[#244B3A]" />
            <span>Side-by-Side Career Comparison</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Compare 2 or 3 career profiles across responsibilities, coursework overlap, student skill coverage, and job market evidence.
          </p>
        </div>

        {/* Add Career Dropdown if < 3 */}
        {selectedIds.length < 3 && availableToAdd.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs text-[#657064] font-semibold whitespace-nowrap">Add Career:</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCareer(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-[#FAF9F5] border border-[#E5E4DA] text-xs text-[#202A23] rounded-lg px-3 py-2 focus:outline-none focus:border-[#244B3A]"
            >
              <option value="" disabled>
                -- Select 3rd Career --
              </option>
              {availableToAdd.map((c) => (
                <option key={c.career_id} value={c.career_id}>
                  {c.career_title} ({c.category_name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-[#657064]">Assembling side-by-side comparison matrix...</p>
        </div>
      ) : !comparisonData ? (
        <div className="text-center py-16 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs">
          <GitCompare className="w-12 h-12 text-[#A0AAA0] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#173629]">Select at least 2 careers to compare</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto bg-white border border-[#E5E4DA] rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E4DA] bg-[#EFEEE5]">
                  <th className="p-4 w-52 font-bold text-[#173629] uppercase tracking-wider">Metric / Dimension</th>
                  {comparisonData.careers.map((c: any) => (
                    <th key={c.careerId} className="p-4 min-w-[280px] max-w-[360px] align-top border-l border-[#E5E4DA]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-3xs uppercase font-bold text-[#244B3A]">{c.categoryName}</span>
                          <h3 className="text-lg font-bold text-[#173629]">{c.careerTitle}</h3>
                        </div>
                        {selectedIds.length > 2 && (
                          <button
                            onClick={() => handleRemoveCareer(c.careerId)}
                            className="p-1 text-[#657064] hover:text-[#991B1B] transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {onOpenReport && (
                        <button
                          onClick={() => onOpenReport(c.careerId)}
                          className="mt-2 text-2xs text-[#244B3A] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-[#244B3A]" />
                          <span>View Full Reality Report</span>
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E4DA] text-[#202A23]">
                {/* 1. Skill Coverage Section */}
                <tr className="bg-[#FAF9F5] font-bold text-[#173629]">
                  <td className="p-3 uppercase tracking-wider text-2xs text-[#244B3A]">
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-[#244B3A]" />
                      <span>Skill Readiness</span>
                    </div>
                  </td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-3 border-l border-[#E5E4DA]">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold text-[#244B3A] font-mono tabular-nums">
                          {c.skillCoverage}%
                        </span>
                        <div className="text-3xs text-[#657064] space-x-2">
                          <span className="text-[#173629] font-bold">{c.matchedSkillsCount} meets</span> ·{' '}
                          <span className="text-[#854D0E] font-bold">{c.developingSkillsCount} dev</span> ·{' '}
                          <span className="text-[#991B1B] font-bold">{c.missingSkillsCount} missing</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Responsibilities */}
                <tr>
                  <td className="p-4 font-bold text-[#173629]">Typical Responsibilities</td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-4 border-l border-[#E5E4DA] leading-relaxed text-[#485347]">
                      {c.responsibilities}
                    </td>
                  ))}
                </tr>

                {/* 3. Entry-Level Tasks */}
                <tr>
                  <td className="p-4 font-bold text-[#173629]">Junior Entry Tasks</td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-4 border-l border-[#E5E4DA] leading-relaxed text-[#485347]">
                      {c.entryLevelTasks}
                    </td>
                  ))}
                </tr>

                {/* 4. Education Context */}
                <tr>
                  <td className="p-4 font-bold text-[#173629]">Education Context</td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-4 border-l border-[#E5E4DA] leading-relaxed text-[#657064]">
                      {c.educationNotes || 'Standard computing degree'}
                    </td>
                  ))}
                </tr>

                {/* 5. Coursework & Student Status */}
                <tr className="bg-[#FAF9F5] font-bold text-[#173629]">
                  <td className="p-3 uppercase tracking-wider text-2xs text-[#244B3A]">
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#244B3A]" />
                      <span>Academic Courses</span>
                    </div>
                  </td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-3 border-l border-[#E5E4DA]">
                      <div className="space-y-1.5 font-normal">
                        {c.subjects.map((sub: any) => (
                          <div key={sub.subject_id} className="flex items-center justify-between text-2xs">
                            <span className="text-[#202A23] font-medium">{sub.subject_name}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase ${
                                sub.studentStudyStatus === 'COMPLETED'
                                  ? 'bg-[#DCE8D9] text-[#173629]'
                                  : sub.studentStudyStatus === 'IN_PROGRESS'
                                  ? 'bg-[#FEF9C3] text-[#854D0E]'
                                  : 'bg-[#EFEEE5] text-[#657064]'
                              }`}
                            >
                              {sub.studentStudyStatus.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 6. Required Skills vs Student Level */}
                <tr>
                  <td className="p-4 font-bold text-[#173629]">Required Skills Matrix</td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-4 border-l border-[#E5E4DA]">
                      <div className="space-y-1.5">
                        {c.skillGapItems.map((sg: any) => (
                          <div
                            key={sg.skillId}
                            className="p-1.5 bg-[#FAF9F5] rounded border border-[#EBEAE0] flex items-center justify-between text-2xs"
                          >
                            <span className="font-semibold text-[#202A23]">{sg.skillName}</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-3xs text-[#657064] font-mono">
                                Target L{sg.targetLevel} · Student:{' '}
                                {sg.studentLevel ? `L${sg.studentLevel}` : 'None'}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-3xs font-bold ${
                                  sg.status === 'MEETS_TARGET'
                                    ? 'bg-[#DCE8D9] text-[#173629]'
                                    : sg.status === 'DEVELOPING'
                                    ? 'bg-[#FEF9C3] text-[#854D0E]'
                                    : 'bg-[#FEE2E2] text-[#991B1B]'
                                }`}
                              >
                                {sg.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 7. Local Market Sample Summary */}
                <tr className="bg-[#FAF9F5]">
                  <td className="p-4 font-bold text-[#173629]">
                    <div>Pakistan Job Sample</div>
                    <div className="text-3xs text-[#657064] font-normal">Sourced Entry-Level Postings</div>
                  </td>
                  {comparisonData.careers.map((c: any) => (
                    <td key={c.careerId} className="p-4 border-l border-[#E5E4DA]">
                      <div className="space-y-2">
                        <div className="font-bold text-[#202A23]">
                          Sample Size: <strong className="text-[#244B3A] font-mono">{c.marketSampleSize} verified postings</strong>
                        </div>
                        <div className="space-y-1">
                          {c.topMarketSkills.map((sk: any) => (
                            <div key={sk.skillId} className="text-2xs text-[#5B675A] flex items-center justify-between">
                              <span>{sk.skillName}</span>
                              <span className="text-[#173629] font-bold font-mono">
                                {sk.totalMentions}/{sk.eligiblePostingsCount} ({sk.percentage}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
