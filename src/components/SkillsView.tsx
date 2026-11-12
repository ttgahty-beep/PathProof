/**
 * PathProof Phase 1 — Student Skill Inventory & Self-Reported Proficiency
 * Warm Paper + Forest Green design tokens.
 * Implements FR-SKILL-01 through FR-SKILL-04.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { Skill, StudentSkill, ProficiencyLevel } from '../types/index.ts';
import { Award, Plus, Trash2, Edit3, Search, Info, CheckCircle2, AlertTriangle, FileCode2 } from 'lucide-react';

interface SkillsViewProps {
  onSkillsUpdated?: () => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onSkillsUpdated }) => {
  const [activeSkills, setActiveSkills] = useState<Skill[]>([]);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const [skills, mySkills] = await Promise.all([
        apiClient.getActiveSkills(),
        apiClient.getStudentSkills(),
      ]);
      setActiveSkills(skills);
      setStudentSkills(mySkills);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load skills.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecordId(null);
    setSelectedSkillId('');
    setProficiencyLevel(2);
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingRecordId(record.student_skill_id);
    setSelectedSkillId(record.skill_id);
    setProficiencyLevel(record.proficiency_level);
    setNotes(record.notes || '');
    setShowModal(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      if (editingRecordId) {
        await apiClient.updateStudentSkill(editingRecordId, proficiencyLevel, notes || null);
        setMessage({ type: 'success', text: 'Skill proficiency updated successfully.' });
      } else {
        await apiClient.addStudentSkill(Number(selectedSkillId), proficiencyLevel, notes || null);
        setMessage({ type: 'success', text: 'New skill added to your inventory.' });
      }

      setShowModal(false);
      const updated = await apiClient.getStudentSkills();
      setStudentSkills(updated);
      if (onSkillsUpdated) onSkillsUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save skill.' });
    }
  };

  const handleRemoveSkill = async (id: number) => {
    try {
      await apiClient.removeStudentSkill(id);
      setStudentSkills((prev) => prev.filter((s) => s.student_skill_id !== id));
      setMessage({ type: 'success', text: 'Skill removed from your inventory.' });
      if (onSkillsUpdated) onSkillsUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove skill.' });
    }
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1:
        return { label: 'Level 1: Beginner', desc: 'Foundations & syntax', badge: 'bg-[#EFEEE5] text-[#485347]' };
      case 2:
        return { label: 'Level 2: Basic', desc: 'Coursework / with guidance', badge: 'bg-[#FEF9C3] text-[#854D0E]' };
      case 3:
        return { label: 'Level 3: Intermediate', desc: 'Independent feature build', badge: 'bg-[#DCE8D9] text-[#173629]' };
      case 4:
        return { label: 'Level 4: Advanced', desc: 'Production / deep mastery', badge: 'bg-[#244B3A] text-white' };
      default:
        return { label: 'Level 0: None', desc: 'No recorded knowledge', badge: 'bg-gray-100 text-gray-500' };
    }
  };

  const existingSkillIds = new Set(studentSkills.map((s) => s.skill_id));
  const availableToAdd = activeSkills.filter((s) => !existingSkillIds.has(s.skill_id));
  const categories = Array.from(new Set(activeSkills.map((s) => s.skill_category)));

  const filteredSkills = studentSkills.filter((sk: any) => {
    if (categoryFilter !== 'ALL' && sk.skill_category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return sk.skill_name?.toLowerCase().includes(q) || sk.notes?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title & Phase 1 Boundary Note */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            TECHNICAL READINESS & COMPETENCIES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <Award className="w-7 h-7 text-[#244B3A]" />
            <span>Self-Reported Skill Inventory</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Maintain your technical competencies and self-evaluated proficiency levels across software engineering disciplines.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#173629] hover:bg-[#244B3A] text-white font-bold rounded-lg text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8E99A]" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Disclosing Self-Reported Evidence (FR-SKILL-04 & PRD Section 2) */}
      <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#5B675A] flex items-start space-x-3 shadow-xs">
        <Info className="w-5 h-5 text-[#244B3A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#173629] block mb-0.5">
            Academic Evaluation & Transparency Note:
          </span>
          In Phase 1, all student skills are classified as <strong>SELF_REPORTED</strong>.
          Skill readiness indicators reflect your self-assessment against employer requirements, not independently evaluated coding assessments.
          Verified code challenges and portfolio simulations belong to Phase 2.
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 border border-[#E5E4DA] rounded-xl shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#657064] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your skills..."
            className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#173629] text-white shadow-xs font-bold'
                : 'bg-[#EFEEE5] text-[#485347] hover:bg-[#E5E4DA]'
            }`}
          >
            All Categories ({studentSkills.length})
          </button>
          {categories.map((cat) => {
            const count = studentSkills.filter((s: any) => s.skill_category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#173629] text-white shadow-xs font-bold'
                    : 'bg-[#EFEEE5] text-[#485347] hover:bg-[#E5E4DA]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs">
          <Award className="w-12 h-12 text-[#A0AAA0] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#173629]">No skills matching your criteria</h3>
          <p className="text-xs text-[#5B675A] max-w-sm mx-auto mt-1">
            Add skills like JavaScript, SQL, React, Postman, or Figma to unlock accurate skill readiness analysis.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-[#173629] hover:bg-[#244B3A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            + Add First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((sk: any) => {
            const prof = getProficiencyLabel(sk.proficiency_level);
            return (
              <div
                key={sk.student_skill_id}
                className="bg-white border border-[#E5E4DA] hover:border-[#CBD5CD] rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xs uppercase tracking-wider font-bold text-[#244B3A]">
                      {sk.skill_category || 'General'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-3xs font-semibold bg-[#EFEEE5] text-[#657064]">
                      SELF_REPORTED
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#173629] mb-2">{sk.skill_name}</h3>

                  <div className="mb-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${prof.badge}`}>
                      {prof.label}
                    </span>
                    <p className="text-2xs text-[#657064] mt-1">{prof.desc}</p>
                  </div>

                  {sk.notes && (
                    <div className="p-2.5 bg-[#FAF9F5] border border-[#EBEAE0] rounded-lg text-2xs text-[#485347] flex items-start space-x-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-[#244B3A] shrink-0 mt-0.5" />
                      <span className="italic">"{sk.notes}"</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-[#F0EFE8]">
                  <button
                    onClick={() => handleOpenEdit(sk)}
                    className="p-1.5 text-[#657064] hover:text-[#173629] hover:bg-[#EFEEE5] rounded transition-colors cursor-pointer"
                    title="Edit skill proficiency"
                    aria-label={`Edit ${sk.skill_name}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveSkill(sk.student_skill_id)}
                    className="p-1.5 text-[#657064] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer"
                    title="Remove skill"
                    aria-label={`Remove ${sk.skill_name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#173629] mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#244B3A]" />
              <span>{editingRecordId ? 'Update Skill Proficiency' : 'Add Skill to Inventory'}</span>
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  Skill from Taxonomy
                </label>
                {editingRecordId ? (
                  <div className="p-2.5 bg-[#EFEEE5] border border-[#E5E4DA] rounded-lg text-sm font-semibold text-[#173629]">
                    {activeSkills.find((s) => s.skill_id === selectedSkillId)?.skill_name || 'Selected Skill'}
                  </div>
                ) : (
                  <select
                    required
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  >
                    <option value="">-- Choose Skill --</option>
                    {availableToAdd.map((s) => (
                      <option key={s.skill_id} value={s.skill_id}>
                        {s.skill_name} ({s.skill_category})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-2">
                  Proficiency Level (1 to 4)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { lvl: 1, name: '1 - Beginner', desc: 'Foundations & syntax' },
                    { lvl: 2, name: '2 - Basic', desc: 'Coursework / with guidance' },
                    { lvl: 3, name: '3 - Intermediate', desc: 'Independent feature build' },
                    { lvl: 4, name: '4 - Advanced', desc: 'Production / deep mastery' },
                  ].map((p) => (
                    <button
                      key={p.lvl}
                      type="button"
                      onClick={() => setProficiencyLevel(p.lvl as ProficiencyLevel)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                        proficiencyLevel === p.lvl
                          ? 'bg-[#EBF2E9] border-[#244B3A] text-[#173629] font-bold shadow-2xs'
                          : 'bg-[#FAF9F5] border-[#E5E4DA] text-[#5B675A] hover:bg-[#EFEEE5]'
                      }`}
                    >
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-3xs text-[#657064] mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  Context / Project Evidence Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Built semester project with this; completed online certifications."
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2.5 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#F0EFE8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSkillId}
                  className="px-5 py-2 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {editingRecordId ? 'Update Skill' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
