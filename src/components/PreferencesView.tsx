/**
 * PathProof Phase 1 — Interest & Work-Activity Assessment
 * Warm Paper + Forest Green design tokens.
 * Implements FR-PREF-01 through FR-PREF-03 and SRS Section 5.3.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { InterestTag, StudentPreference } from '../types/index.ts';
import { Sliders, Sparkles, CheckCircle2, AlertCircle, Info, Star } from 'lucide-react';

interface PreferencesViewProps {
  onPreferencesUpdated?: () => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({ onPreferencesUpdated }) => {
  const [allTags, setAllTags] = useState<InterestTag[]>([]);
  const [studentPrefs, setStudentPrefs] = useState<StudentPreference[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const [tags, myPrefs] = await Promise.all([
        apiClient.getInterestTags(),
        apiClient.getStudentPreferences(),
      ]);
      setAllTags(tags);
      setStudentPrefs(myPrefs);

      const initialScores: Record<number, number> = {};
      for (const p of myPrefs) {
        initialScores[p.interest_tag_id] = p.preference_score;
      }
      setScores(initialScores);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load preferences.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreChange = (tagId: number, scoreVal: number) => {
    setScores((prev) => ({
      ...prev,
      [tagId]: scoreVal,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const payload = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .map(([tagIdStr, score]) => ({
        interest_tag_id: Number(tagIdStr),
        preference_score: score,
      }));

    try {
      await apiClient.saveStudentPreferences(payload);
      setMessage({ type: 'success', text: 'Interests and work-activity preferences saved successfully.' });
      if (onPreferencesUpdated) onPreferencesUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-[#657064] text-sm">Loading interest & activity items...</p>
      </div>
    );
  }

  const interestTags = allTags.filter((t) => t.tag_type === 'INTEREST');
  const activityTags = allTags.filter((t) => t.tag_type === 'ACTIVITY');

  const ratedInterestsCount = interestTags.filter((t) => (scores[t.interest_tag_id] || 0) > 0).length;
  const ratedActivitiesCount = activityTags.filter((t) => (scores[t.interest_tag_id] || 0) > 0).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title & Dimension Weighting Notice */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            QUALITATIVE EVALUATION & FIT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <Sliders className="w-7 h-7 text-[#244B3A]" />
            <span>Interests & Work Activity Preferences</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Rate items from 1 (Low Affinity) to 5 (High Affinity). Requires minimum 3 ratings per dimension for standard 3-tier weighting.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save All Ratings'}
        </button>
      </div>

      {/* Minimum Dimension Criteria Cards (Rule BR-04) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 ${
            ratedInterestsCount >= 3
              ? 'bg-[#EBF2E9] border-[#DCE8D9] text-[#173629]'
              : 'bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]'
          }`}
        >
          {ratedInterestsCount >= 3 ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#244B3A]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#854D0E]" />
          )}
          <div>
            <div className="font-bold text-sm">
              Interest Dimension: {ratedInterestsCount} / 3 minimum rated
            </div>
            <div className="text-xs opacity-90 mt-0.5">
              {ratedInterestsCount >= 3
                ? 'Eligible for Career Matching (45% weight in standard model).'
                : 'Need at least 3 ratings. If omitted, matching re-normalizes without penalizing.'}
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 ${
            ratedActivitiesCount >= 3
              ? 'bg-[#EBF2E9] border-[#DCE8D9] text-[#173629]'
              : 'bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]'
          }`}
        >
          {ratedActivitiesCount >= 3 ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#244B3A]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#854D0E]" />
          )}
          <div>
            <div className="font-bold text-sm">
              Work-Activity Dimension: {ratedActivitiesCount} / 3 minimum rated
            </div>
            <div className="text-xs opacity-90 mt-0.5">
              {ratedActivitiesCount >= 3
                ? 'Eligible for Career Matching (25% weight in standard model).'
                : 'Need at least 3 ratings. If omitted, matching re-normalizes without penalizing.'}
            </div>
          </div>
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
            <AlertCircle className="w-5 h-5 shrink-0 text-[#991B1B]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Dimension 1: Conceptual Interests */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#244B3A]" />
          <h2 className="text-xl font-bold text-[#173629]">Dimension 1 — Conceptual Interests</h2>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-[#EFEEE5] text-[#657064]">
            What intellectually stimulates you (45% weight)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestTags.map((tag) => {
            const currentScore = scores[tag.interest_tag_id] || 0;
            return (
              <div
                key={tag.interest_tag_id}
                className="bg-white border border-[#E5E4DA] rounded-xl p-5 hover:border-[#CBD5CD] transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-[#173629]">{tag.tag_label}</h3>
                    <p className="text-xs text-[#5B675A] mt-0.5">{tag.description}</p>
                  </div>
                  {currentScore > 0 && (
                    <span className="px-2 py-0.5 bg-[#EBF2E9] text-[#173629] font-bold text-xs rounded border border-[#DCE8D9] shrink-0 font-mono">
                      {currentScore} / 5
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EFE8]">
                  <div className="text-3xs font-semibold text-[#657064] uppercase tracking-wider mb-2">
                    Select Rating (1 to 5):
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const labels = ['1 (Low)', '2', '3 (Med)', '4', '5 (High)'];
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleScoreChange(tag.interest_tag_id, lvl)}
                          className={`py-2 px-1 text-center rounded-lg border text-2xs font-semibold transition-all cursor-pointer ${
                            currentScore === lvl
                              ? 'bg-[#173629] text-white border-[#173629] font-bold shadow-xs'
                              : 'bg-[#FAF9F5] border-[#E5E4DA] text-[#485347] hover:bg-[#EFEEE5]'
                          }`}
                        >
                          {labels[lvl - 1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension 2: Work-Activity Types */}
      <div className="space-y-4 pt-4 border-t border-[#E5E4DA]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#854D0E]" />
          <h2 className="text-xl font-bold text-[#173629]">Dimension 2 — Work-Activity Types</h2>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-[#EFEEE5] text-[#657064]">
            Daily hands-on tasks and workflows (25% weight)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activityTags.map((tag) => {
            const currentScore = scores[tag.interest_tag_id] || 0;
            return (
              <div
                key={tag.interest_tag_id}
                className="bg-white border border-[#E5E4DA] rounded-xl p-5 hover:border-[#CBD5CD] transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-[#173629]">{tag.tag_label}</h3>
                    <p className="text-xs text-[#5B675A] mt-0.5">{tag.description}</p>
                  </div>
                  {currentScore > 0 && (
                    <span className="px-2 py-0.5 bg-[#FEF9C3] text-[#854D0E] font-bold text-xs rounded border border-[#FEF08A] shrink-0 font-mono">
                      {currentScore} / 5
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EFE8]">
                  <div className="text-3xs font-semibold text-[#657064] uppercase tracking-wider mb-2">
                    Select Rating (1 to 5):
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const labels = ['1 (Low)', '2', '3 (Med)', '4', '5 (High)'];
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleScoreChange(tag.interest_tag_id, lvl)}
                          className={`py-2 px-1 text-center rounded-lg border text-2xs font-semibold transition-all cursor-pointer ${
                            currentScore === lvl
                              ? 'bg-[#173629] text-white border-[#173629] font-bold shadow-xs'
                              : 'bg-[#FAF9F5] border-[#E5E4DA] text-[#485347] hover:bg-[#EFEEE5]'
                          }`}
                        >
                          {labels[lvl - 1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save All Preferences & Recalculate'}
        </button>
      </div>
    </div>
  );
};
