/**
 * PathProof Phase 1 — Career Explorer & Pakistan Job Reality Engine
 * Warm Paper + Forest Green design tokens.
 * Implements FR-CAR-01..03, FR-EVID-01..06, expandable career categories,
 * role search, and persistent multi-role career interest selection.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Career, CareerCategory, CareerMarketSummary } from '../types/index.ts';
import {
  Compass,
  Search,
  ExternalLink,
  Award,
  BookOpen,
  BarChart2,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookmarkCheck,
  Bookmark,
  Save,
  AlertCircle,
  FileText,
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
}) => {
  const currentUser = apiClient.getCurrentUser();
  const isStudent = !currentUser || currentUser.role === 'STUDENT';

  const [careers, setCareers] = useState<Career[]>([]);
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(new Set([1, 6]));
  const [isLoading, setIsLoading] = useState(true);

  // Multi-role career interest selection state
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
  const [savedInterestIds, setSavedInterestIds] = useState<number[]>([]);
  const [isSavingInterests, setIsSavingInterests] = useState(false);
  const [interestMessage, setInterestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected Career Detail Modal
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [careerDetail, setCareerDetail] = useState<any | null>(null);
  const [marketSummary, setMarketSummary] = useState<CareerMarketSummary | null>(null);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    loadCareersAndInterests();
  }, []);

  const loadCareersAndInterests = async () => {
    setIsLoading(true);
    try {
      const [careerData, categoryData, interestData] = await Promise.all([
        apiClient.getCareers(),
        apiClient.getCareerCategories().catch(() => []),
        isStudent ? apiClient.getStudentCareerInterests().catch(() => []) : Promise.resolve([]),
      ]);

      setCareers(careerData);

      if (categoryData.length > 0) {
        setCategories(categoryData);
      } else {
        // Fallback synthesis from career rows if categories list is empty
        const catMap = new Map<number, CareerCategory>();
        for (const c of careerData) {
          if (!catMap.has(c.category_id)) {
            catMap.set(c.category_id, {
              category_id: c.category_id,
              category_name: c.category_name || `Category #${c.category_id}`,
              description: null,
              is_active: true,
              created_at: '',
              updated_at: '',
            });
          }
        }
        setCategories(Array.from(catMap.values()));
      }

      const ids = Array.isArray(interestData) ? interestData.map((i) => i.career_id) : [];
      setSelectedInterestIds(ids);
      setSavedInterestIds(ids);
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

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const expandAllCategories = () => {
    setExpandedCategoryIds(new Set(groupedSections.map((g) => g.category.category_id)));
  };

  const collapseAllCategories = () => {
    setExpandedCategoryIds(new Set());
  };

  const toggleCareerInterest = (careerId: number) => {
    setInterestMessage(null);
    setSelectedInterestIds((prev) =>
      prev.includes(careerId) ? prev.filter((id) => id !== careerId) : [...prev, careerId]
    );
  };

  const handleSaveInterests = async () => {
    if (!isStudent) return;
    setIsSavingInterests(true);
    setInterestMessage(null);
    try {
      const saved = await apiClient.saveStudentCareerInterests(selectedInterestIds);
      const ids = saved.map((item) => item.career_id);
      setSelectedInterestIds(ids);
      setSavedInterestIds(ids);
      setInterestMessage({
        type: 'success',
        text: `Saved ${ids.length} career interest${ids.length === 1 ? '' : 's'} to your profile.`,
      });
    } catch (err: any) {
      setInterestMessage({
        type: 'error',
        text: err.message || 'Failed to save career interests.',
      });
    } finally {
      setIsSavingInterests(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      if (selectedCategoryFilter !== 'ALL' && String(c.category_id) !== selectedCategoryFilter) {
        return false;
      }
      if (normalizedQuery) {
        return (
          c.career_title.toLowerCase().includes(normalizedQuery) ||
          (c.summary || '').toLowerCase().includes(normalizedQuery) ||
          (c.description || '').toLowerCase().includes(normalizedQuery) ||
          (c.category_name || '').toLowerCase().includes(normalizedQuery)
        );
      }
      return true;
    });
  }, [careers, selectedCategoryFilter, normalizedQuery]);

  const groupedSections = useMemo(() => {
    const map = new Map<number, Career[]>();
    for (const c of filteredCareers) {
      const existing = map.get(c.category_id) || [];
      existing.push(c);
      map.set(c.category_id, existing);
    }

    return categories
      .filter((cat) => {
        if (selectedCategoryFilter !== 'ALL' && String(cat.category_id) !== selectedCategoryFilter) {
          return false;
        }
        const items = map.get(cat.category_id) || [];
        return items.length > 0;
      })
      .map((cat) => ({
        category: cat,
        roles: map.get(cat.category_id) || [],
      }));
  }, [categories, filteredCareers, selectedCategoryFilter]);

  const selectedCareerObjects = useMemo(() => {
    const byId = new Map(careers.map((c) => [c.career_id, c]));
    return selectedInterestIds.map((id) => byId.get(id)).filter((c): c is Career => Boolean(c));
  }, [careers, selectedInterestIds]);

  const hasUnsavedChanges = useMemo(() => {
    if (selectedInterestIds.length !== savedInterestIds.length) return true;
    const savedSet = new Set(savedInterestIds);
    return selectedInterestIds.some((id) => !savedSet.has(id));
  }, [selectedInterestIds, savedInterestIds]);

  const isSearching = normalizedQuery.length > 0 || selectedCategoryFilter !== 'ALL';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
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
            Explore {careers.length} career roles across {categories.length} global categories, search roles, and save your career interests.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#5B675A] shadow-xs shrink-0">
          Showing <strong className="text-[#173629] font-mono">{filteredCareers.length}</strong> roles in{' '}
          <strong className="text-[#173629] font-mono">{groupedSections.length}</strong> categories
        </div>
      </div>

      {/* Selected Career Interests Persistence Panel (Student) */}
      {isStudent && (
        <div className="bg-white border border-[#E5E4DA] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2E9] text-[#173629] flex items-center justify-center border border-[#DCE8D9]">
                <BookmarkCheck className="w-4 h-4 text-[#244B3A]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#173629]">
                  Selected Career Interests ({selectedInterestIds.length})
                </h2>
                <p className="text-xs text-[#657064]">
                  Select multiple career roles across any categories below and save them to your profile.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {hasUnsavedChanges && (
                <span className="text-2xs font-semibold text-[#854D0E] bg-[#FEF9C3] px-2.5 py-1 rounded-md">
                  Unsaved changes
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveInterests}
                disabled={isSavingInterests}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#D8E99A]" />
                <span>{isSavingInterests ? 'Saving...' : 'Save Career Interests'}</span>
              </button>
            </div>
          </div>

          {selectedCareerObjects.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedCareerObjects.map((career) => (
                <span
                  key={career.career_id}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#EBF2E9] border border-[#DCE8D9] text-[#173629] rounded-lg text-xs font-semibold"
                >
                  <span>{career.career_title}</span>
                  <span className="text-3xs text-[#5B675A]">({career.category_name})</span>
                  <button
                    type="button"
                    onClick={() => toggleCareerInterest(career.career_id)}
                    aria-label={`Remove ${career.career_title}`}
                    className="text-[#5B675A] hover:text-[#991B1B] p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#657064] bg-[#FAF9F5] border border-[#EBEAE0] rounded-lg px-3 py-2">
              No career roles selected yet. Expand any category below and click "Select Interest" on the roles you want to track.
            </div>
          )}

          {interestMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                interestMessage.type === 'success'
                  ? 'bg-[#EBF2E9] border-[#DCE8D9] text-[#173629]'
                  : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]'
              }`}
            >
              {interestMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#244B3A]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#991B1B]" />
              )}
              <span>{interestMessage.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Search, Category Filter & Accordion Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 border border-[#E5E4DA] rounded-xl shadow-xs">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-[#657064] absolute left-3 top-2.5" />
          <input
            type="text"
            aria-label="Search career roles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search career roles or categories (e.g., Surgeon, Software Engineer, Quantum)..."
            className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-8 py-2 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-2 text-[#657064] hover:text-[#173629] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            aria-label="Filter by career category"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-xs font-semibold text-[#173629] focus:outline-none focus:border-[#244B3A]"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={String(cat.category_id)}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={expandAllCategories}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] transition-colors cursor-pointer"
          >
            Expand All
          </button>

          <button
            type="button"
            onClick={collapseAllCategories}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#485347] transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Expandable & Collapsible Career Categories */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-[#657064] text-sm">Loading career catalogue...</p>
        </div>
      ) : groupedSections.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs">
          <Compass className="w-12 h-12 text-[#A0AAA0] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#173629]">
            No careers matching "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryFilter('ALL');
            }}
            className="mt-3 px-4 py-1.5 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded-lg text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedSections.map(({ category, roles }) => {
            const isExpanded = isSearching || expandedCategoryIds.has(category.category_id);
            const selectedInCatCount = roles.filter((r) => selectedInterestIds.includes(r.career_id)).length;

            return (
              <section
                key={category.category_id}
                className="bg-white border border-[#E5E4DA] rounded-2xl shadow-xs overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCategoryExpand(category.category_id)}
                  aria-expanded={isExpanded}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left bg-[#FAF9F5] hover:bg-[#EFEEE5]/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-white border border-[#E5E4DA] flex items-center justify-center shrink-0 text-[#173629]">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-[#173629] truncate">
                        {category.category_name}
                      </h2>
                      {category.description && (
                        <p className="text-xs text-[#657064] truncate">{category.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {selectedInCatCount > 0 && (
                      <span className="px-2.5 py-1 rounded-md bg-[#EBF2E9] border border-[#DCE8D9] text-[#173629] text-2xs font-bold">
                        {selectedInCatCount} selected
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-[#EFEEE5] text-[#485347] text-2xs font-mono font-bold">
                      {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                    </span>
                  </div>
                </button>

                {/* Roles Grid */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#E5E4DA] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                    {roles.map((c) => {
                      const isSelected = selectedInterestIds.includes(c.career_id);

                      return (
                        <div
                          key={c.career_id}
                          className={`border rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group ${
                            isSelected
                              ? 'bg-[#FAFDF8] border-[#244B3A] ring-1 ring-[#244B3A]/20'
                              : 'bg-[#FAF9F5]/60 border-[#E5E4DA] hover:border-[#CBD5CD]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-3xs uppercase tracking-wider font-bold text-[#244B3A]">
                                {c.category_name}
                              </span>
                              <span className="text-3xs text-[#657064] font-mono">
                                CAR-{String(c.career_id).padStart(3, '0')}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-[#173629] group-hover:text-[#244B3A] transition-colors mb-1.5">
                              {c.career_title}
                            </h3>

                            <p className="text-xs text-[#5B675A] line-clamp-3 mb-4 leading-relaxed">
                              {c.summary}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#EBEAE0] space-y-2.5">
                            {isStudent && (
                              <button
                                type="button"
                                onClick={() => toggleCareerInterest(c.career_id)}
                                aria-pressed={isSelected}
                                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#173629] text-white hover:bg-[#244B3A]'
                                    : 'bg-white border border-[#E5E4DA] text-[#173629] hover:bg-[#EFEEE5]'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <BookmarkCheck className="w-3.5 h-3.5 text-[#D8E99A]" />
                                    <span>Selected Interest</span>
                                  </>
                                ) : (
                                  <>
                                    <Bookmark className="w-3.5 h-3.5 text-[#244B3A]" />
                                    <span>Select Interest</span>
                                  </>
                                )}
                              </button>
                            )}

                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(c.career_id)}
                                className="flex-1 py-2 px-3 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <span>Inspect Profile</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#244B3A]" />
                              </button>

                              {onSelectCareerForCompare && (
                                <button
                                  type="button"
                                  onClick={() => onSelectCareerForCompare(c.career_id)}
                                  className="p-2 bg-white hover:bg-[#EFEEE5] text-[#485347] hover:text-[#173629] border border-[#E5E4DA] rounded-lg transition-colors cursor-pointer"
                                  title={`Compare ${c.career_title}`}
                                  aria-label={`Compare ${c.career_title}`}
                                >
                                  <GitCompare className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
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
                    type="button"
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
                  type="button"
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

                    {careerDetail?.requiredSkills?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {careerDetail.requiredSkills.map((sk: any) => (
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
                    ) : (
                      <p className="text-xs text-[#657064] bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl p-3">
                        Specific technical skill proficiency targets have not yet been calibrated for this global career track.
                      </p>
                    )}
                  </div>

                  {/* Mapped HEC Academic Subjects */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#173629] uppercase tracking-wider flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#244B3A]" />
                      <span>Mapped HEC Undergraduate Coursework</span>
                    </h3>

                    {careerDetail?.mappedSubjects?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {careerDetail.mappedSubjects.map((sub: any) => (
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
                    ) : (
                      <p className="text-xs text-[#657064] bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl p-3">
                        Refer to the Education Context above for recommended academic degree qualifications.
                      </p>
                    )}
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
                          Observation Dates: {marketSummary.dateRange.earliest || 'N/A'} to{' '}
                          {marketSummary.dateRange.latest || 'N/A'}
                        </span>
                      </div>
                    )}

                    {evidenceList.length > 0 ? (
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
                    ) : (
                      <p className="text-xs text-[#657064] bg-[#FAF9F5] border border-[#EBEAE0] rounded-xl p-3">
                        No verified local job postings have been attached to this global role yet.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#EFEEE5] border-t border-[#E5E4DA] flex justify-end shrink-0">
              <button
                type="button"
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
