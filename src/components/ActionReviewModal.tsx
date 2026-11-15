import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RoadmapPayload, RoadmapMilestone } from '../types/index.ts';
import { X, Calendar, Clock, CheckCircle2, Plus, Trash2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  payload: RoadmapPayload;
  onClose: () => void;
  onConfirm: (editedPayload: RoadmapPayload) => Promise<void>;
}

const DEFAULT_MILESTONES: RoadmapMilestone[] = [
  {
    week_number: 1,
    title: 'Core Foundations & Setup',
    description: 'Establish repository structure, linting rules, and foundational study schedule.',
    estimated_hours: 8,
    learning_activities: ['Study core documentation', 'Complete initial hands-on exercise'],
    completion_criteria: 'Initial milestone verified and committed to GitHub.',
  },
];

export const ActionReviewModal: React.FC<Props> = ({ isOpen, payload, onClose, onConfirm }) => {
  const [title, setTitle] = useState(payload.title || 'Personalized Career Roadmap');
  const [targetRole, setTargetRole] = useState(payload.target_role || 'Computing Professional');
  const [totalWeeks, setTotalWeeks] = useState(payload.total_weeks || 12);
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(
    payload.milestones && payload.milestones.length > 0
      ? JSON.parse(JSON.stringify(payload.milestones))
      : DEFAULT_MILESTONES
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && payload) {
      setTitle(payload.title || 'Personalized Career Roadmap');
      setTargetRole(payload.target_role || 'Computing Professional');
      setTotalWeeks(payload.total_weeks || 12);
      setMilestones(
        payload.milestones && payload.milestones.length > 0
          ? JSON.parse(JSON.stringify(payload.milestones))
          : DEFAULT_MILESTONES
      );
      setError(null);
    }
  }, [isOpen, payload]);

  if (!isOpen) return null;

  const handleMilestoneChange = (index: number, field: keyof RoadmapMilestone, value: any) => {
    setMilestones((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddMilestone = () => {
    const nextWeek = milestones.length > 0 ? milestones[milestones.length - 1].week_number + 2 : 1;
    setMilestones((prev) => [
      ...prev,
      {
        week_number: nextWeek,
        title: `Milestone ${prev.length + 1}`,
        description: 'New focused study goal and practical deliverable.',
        estimated_hours: 8,
        learning_activities: ['Follow structured module'],
        completion_criteria: 'Deliverable completed and documented.',
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const updatedPayload: RoadmapPayload = {
        title: title.trim() || 'Personalized Career Roadmap',
        target_role: targetRole.trim() || 'Computing Professional',
        total_weeks: Number(totalWeeks) || 12,
        milestones,
      };
      await onConfirm(updatedPayload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save roadmap. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#F7F6F0] rounded-xl border border-[#E5E4DA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-[#173629] text-[#DCE8D9] flex items-center justify-between border-b border-[#0F241B]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#D8E99A]" />
              <span className="text-2xs font-bold uppercase tracking-wider text-[#A3B8AC]">
                Action Safety Verification
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Review & Confirm Career Roadmap
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A3B8AC] hover:text-white hover:bg-[#244B3A] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-6 text-[#202A23]">
          <div className="bg-white p-4 rounded-lg border border-[#E5E4DA] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#657064] mb-1">
                  Roadmap Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F6F0] border border-[#E5E4DA] rounded-lg focus:outline-hidden focus:border-[#244B3A] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657064] mb-1">
                  Target Career Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F7F6F0] border border-[#E5E4DA] rounded-lg focus:outline-hidden focus:border-[#244B3A] font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs text-[#657064]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#244B3A]" />
                <span className="font-semibold text-[#202A23] font-mono tabular-nums">
                  {totalWeeks} Weeks
                </span>{' '}
                Total Duration
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#244B3A]" />
                <span className="font-semibold text-[#202A23] font-mono tabular-nums">
                  {milestones.reduce((acc, m) => acc + (m.estimated_hours || 0), 0)} Hours
                </span>{' '}
                Estimated Commitment
              </span>
            </div>
          </div>

          {/* Milestones list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#173629] flex items-center gap-2">
                <span>Proposed Milestones ({milestones.length})</span>
                <span className="text-xs text-[#657064] font-normal">
                  — You can edit titles, weeks, and criteria before saving.
                </span>
              </h3>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1 text-xs font-semibold text-[#244B3A] hover:text-[#173629] bg-[#DCE8D9]/40 hover:bg-[#DCE8D9] px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg border border-[#E5E4DA] relative group hover:border-[#244B3A]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-2 py-0.5 text-2xs font-mono font-bold bg-[#DCE8D9] text-[#173629] rounded">
                        WEEK {m.week_number}
                      </span>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                        className="flex-1 font-semibold text-sm text-[#202A23] bg-transparent border-b border-transparent hover:border-[#E5E4DA] focus:border-[#244B3A] focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-[#657064] font-mono tabular-nums">
                        {m.estimated_hours}h
                      </span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="text-[#A3B8AC] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-2xs font-semibold text-[#657064]">
                        Milestone Objective:
                      </label>
                      <input
                        type="text"
                        value={m.description}
                        onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 bg-[#F7F6F0] border border-[#E5E4DA] rounded text-xs text-[#202A23] focus:outline-hidden focus:border-[#244B3A]"
                      />
                    </div>

                    <div>
                      <label className="text-2xs font-semibold text-[#657064]">
                        Observable Completion Criteria:
                      </label>
                      <input
                        type="text"
                        value={m.completion_criteria}
                        onChange={(e) =>
                          handleMilestoneChange(idx, 'completion_criteria', e.target.value)
                        }
                        className="w-full mt-0.5 px-2 py-1 bg-[#F7F6F0] border border-[#E5E4DA] rounded text-xs text-[#202A23] focus:outline-hidden focus:border-[#244B3A]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 bg-[#EFEEE5] border-t border-[#E5E4DA] flex items-center justify-between gap-4">
          <p className="text-xs text-[#657064]">
            Action verified by PathProof Backend Engine. No database changes occur until you confirm.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-[#657064] hover:text-[#202A23] hover:bg-[#E5E4DA] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#173629] hover:bg-[#244B3A] rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Persisting Roadmap...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#D8E99A]" />
                  <span>Confirm & Add to My Roadmaps</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
