/**
 * PathProof Phase 1 — Career Explorer & Pakistan Job Reality Engine
 * Warm Paper + Forest Green design tokens.
 * Implements FR-CAR-01..03 and FR-EVID-01..06.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Career, CareerMarketSummary } from '../types/index.ts';
import {
  Compass,
  Search,
  ExternalLink,
  ShieldAlert,
  Layers,
  Award,
  BookOpen,
  Calendar,
  Building,
  MapPin,
  FileText,
  BarChart2,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';

interface CareerViewProps {
  onSelectCareerForReport?: (careerId: number) => void;
  onSelectCareerForCompare?: (careerId: number) => void;
  onSelectCareerForGap?: (careerId: number) => void;
}

export const CareerView: React.FC<CareerViewProps> = ({
  onSelectCareerForReport,
  onSelectCareerForCompare,
  onSelectCareerForGap,
}) => {
  const [careers, setCareers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Career Detail Modal
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [careerDetail, setCareerDetail] = useState<any | null>(null);
  const [marketSummary, setMarketSummary] = useState<CareerMarketSummary | null>(null);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getCareers();
      setCareers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = async (careerId: number) => {
    setSelectedCareerId(careerId);
    setIsLoadingDetail(true);
    try {
      const [detail, summary, evidence] = await Promise.all([
        apiClient.getCareerById(careerId),
        apiClient.getCareerMarketSummary(careerId),
        apiClient.getCareerEvidence(careerId),
      ]);
      setCareerDetail(detail);
      setMarketSummary(summary);
      setEvidenceList(evidence);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedCareerId(null);
    setCareerDetail(null);
    setMarketSummary(null);
    setEvidenceList([]);
  };

  const categories = Array.from(new Set(careers.map((c) => c.category_name).filter(Boolean)));

  const filtered = careers.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category_name !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.career_title.toLowerCase().includes(q) ||
        c.summary?.toLowerCase().includes(q) ||
        c.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            CAREER TAXONOMY & MARKET BENCHMARKS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <Compass className="w-7 h-7 text-[#244B3A]" />
            <span>Career Catalogue & Job Reality Engine</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Explore 6 published computing careers mapped against HEC curriculum and backed by 24+ verified Pakistani job postings.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#5B675A] shadow-xs">
          Showing <strong className="text-[#173629] font-mono">{filtered.length}</strong> published career profiles
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3.5 border border-[#E5E4DA] rounded-xl shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#657064] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or summary..."
            className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#173629] text-white shadow-xs font-bold'
                : 'bg-[#EFEEE5] text-[#485347] hover:bg-[#E5E4DA]'
            }`}
          >
            All Roles ({careers.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#173629] text-white shadow-xs font-bold'
                  : 'bg-[#EFEEE5] text-[#485347] hover:bg-[#E5E4DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-[#657064] text-sm">Loading career catalogue...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs">
          <Compass className="w-12 h-12 text-[#A0AAA0] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#173629]">No careers matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.career_id}
              className="bg-white border border-[#E5E4DA] hover:border-[#CBD5CD] rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-3xs uppercase tracking-wider font-bold text-[#244B3A]">
                    {c.category_name}
                  </span>
                  <span className="text-3xs text-[#657064] font-mono">CAR-00{c.career_id}</span>
                </div>

                <h2 className="text-lg font-bold text-[#173629] group-hover:text-[#244B3A] transition-colors mb-2">
                  {c.career_title}
                </h2>

                <p className="text-xs text-[#5B675A] line-clamp-3 mb-4 leading-relaxed">
                  {c.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EFE8] space-y-3">
                <div className="grid grid-cols-2 gap-2 text-2xs text-[#657064]">
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-[#244B3A]" />
                    <span>Skills & Targets</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#244B3A]" />
                    <span>HEC Courses</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleOpenDetail(c.career_id)}
                    className="flex-1 py-2 px-3 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#244B3A]" />
                  </button>

                  {onSelectCareerForCompare && (
                    <button
                      onClick={() => onSelectCareerForCompare(c.career_id)}
                      className="p-2 bg-[#FAF9F5] hover:bg-[#EFEEE5] text-[#485347] hover:text-[#173629] border border-[#E5E4DA] rounded-lg transition-colors cursor-pointer"
                      title="Add to comparison"
                      aria-label="Add to comparison"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Career Details Modal */}
      {selectedCareerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E4DA] flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF2E9] text-[#173629] flex items-center justify-center border border-[#DCE8D9]">
                  <Compass className="w-5 h-5 text-[#244B3A]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#173629]">
                    {careerDetail?.career_title || 'Career Profile'}
                  </h2>
                  <span className="text-xs text-[#657064]">{careerDetail?.category_name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onSelectCareerForReport && (
                  <button
                    onClick={() => {
                      onSelectCareerForReport(selectedCareerId);
                      handleCloseDetail();
                    }}
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D8E99A]" />
                    <span>Career Reality Report</span>
                  </button>
                )}

                <button
                  onClick={handleCloseDetail}
                  className="text-[#657064] hover:text-[#173629] p-1 rounded-lg hover:bg-[#EFEEE5] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {isLoadingDetail ? (
                <div className="py-16 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-xs text-[#657064]">Loading details and job evidence...</p>
                </div>
              ) : (
                <>
                  {/* Summary & Responsibilities */}
                  <div className="space-y-4">
                    <p className="text-sm text-[#202A23] leading-relaxed bg-[#FAF9F5] p-4 rounded-xl border border-[#EBEAE0]">
                      {careerDetail?.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl space-y-1.5">
                        <h4 className="text-xs font-bold text-[#173629] uppercase tracking-wider">
                          Typical Responsibilities
                        </h4>
                        <p className="text-xs text-[#485347] leading-relaxed">
                          {careerDetail?.responsibilities || 'Not specified'}
                        </p>
                      </div>

                      <div className="p-4 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl space-y-1.5">
                        <h4 className="text-xs font-bold text-[#244B3A] uppercase tracking-wider">
                          Representative Entry-Level Tasks
                        </h4>
                        <p className="text-xs text-[#485347] leading-relaxed">
                          {careerDetail?.entry_level_tasks || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {careerDetail?.education_notes && (
                      <div className="p-3 bg-[#EBF2E9] border border-[#DCE8D9] rounded-xl text-xs text-[#173629]">
                        <strong>Education Context:</strong> {careerDetail.education_notes}
                      </div>
                    )}
                  </div>

                  {/* Required Skills & Target Levels */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider flex items-center space-x-2">
                        <Award className="w-4 h-4 text-[#244B3A]" />
                        <span>Required Skills & Target Proficiency</span>
                      </h3>
                      <span className="text-3xs text-[#657064]">
                        Target Level: 1 Beginner, 2 Basic, 3 Intermediate, 4 Advanced
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {careerDetail?.requiredSkills?.map((sk: any) => (
                        <div
                          key={sk.skill_id}
                          className="p-3 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl flex items-start justify-between"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-xs text-[#173629]">{sk.skill_name}</span>
                              <span
                                className={`text-3xs uppercase font-bold px-1.5 py-0.5 rounded ${
                                  sk.requirement_type === 'CORE'
                                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                                    : sk.requirement_type === 'IMPORTANT'
                                    ? 'bg-[#FEF9C3] text-[#854D0E]'
                                    : 'bg-[#EFEEE5] text-[#657064]'
                                }`}
                              >
                                {sk.requirement_type}
                              </span>
                            </div>
                            <span className="text-3xs text-[#657064] block mt-0.5">
                              Importance Weight: {sk.importance_weight}x
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-[#173629] font-mono">
                              Level {sk.target_level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mapped HEC Academic Subjects */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#244B3A]" />
                      <span>Mapped HEC Undergraduate Coursework</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {careerDetail?.mappedSubjects?.map((sub: any) => (
                        <div
                          key={sub.subject_id}
                          className="p-3 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-[#173629]">{sub.subject_name}</span>
                            <span className="text-3xs text-[#657064] block">Weight: {sub.importance_weight}x</span>
                          </div>
                          <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-[#EBF2E9] text-[#173629]">
                            {sub.subject_category || 'Core'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pakistan Job Reality Engine: Verified Postings */}
                  <div className="space-y-3 pt-4 border-t border-[#E5E4DA]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart2 className="w-4 h-4 text-[#244B3A]" />
                        <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider">
                          Verified Pakistani Job Evidence Records ({evidenceList.length})
                        </h3>
                      </div>
                      <span className="text-3xs text-[#657064]">
                        Status: CONTENT_CHECKED
                      </span>
                    </div>

                    {marketSummary && (
                      <div className="p-3 bg-[#EBF2E9] border border-[#DCE8D9] rounded-xl text-xs text-[#173629] flex items-center justify-between">
                        <span>
                          <strong>Sample Size:</strong> {marketSummary.sampleSize} verified Pakistani job postings
                        </span>
                        <span className="text-3xs text-[#485347]">
                          Observation Dates: {marketSummary.dateRange.earliest || '2026-01-01'} to {marketSummary.dateRange.latest || '2026-02-28'}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {evidenceList.map((ev) => (
                        <div
                          key={ev.evidence_id}
                          className="p-3.5 bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-bold text-xs text-[#173629] flex items-center space-x-2">
                                <span>{ev.job_title}</span>
                                <span className="text-3xs px-2 py-0.5 rounded bg-[#DCE8D9] text-[#173629] font-bold">
                                  {ev.verification_status}
                                </span>
                              </div>
                              <div className="text-3xs text-[#657064] flex items-center space-x-2 mt-0.5">
                                <span className="font-semibold text-[#485347]">{ev.organization_name}</span>
                                <span>·</span>
                                <span>{ev.location_text}</span>
                                <span>·</span>
                                <span>Posted: {ev.posted_date || 'Feb 2026'}</span>
                              </div>
                            </div>

                            <a
                              href={ev.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-2xs text-[#244B3A] hover:underline flex items-center space-x-1 shrink-0 font-medium"
                            >
                              <span>View Source</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {ev.notes && (
                            <p className="text-2xs text-[#485347] italic bg-white p-2 rounded border border-[#EBEAE0]">
                              "{ev.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#EFEEE5] border-t border-[#E5E4DA] flex justify-end shrink-0">
              <button
                onClick={handleCloseDetail}
                className="px-5 py-2 bg-[#173629] hover:bg-[#244B3A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
