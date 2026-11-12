/**
 * PathProof Phase 1 — Smart Student Profile & Coursework Manager
 * Warm Paper + Forest Green design tokens.
 * Implements FR-PROF-01 through FR-PROF-05 + Coursework Evidence Records.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { StudentProfile, StudentSubject, AcademicSubject } from '../types/index.ts';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';

interface ProfileViewProps {
  onProfileUpdated?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onProfileUpdated, onNavigateToTab }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [allSubjects, setAllSubjects] = useState<AcademicSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form inputs
  const [universityName, setUniversityName] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [currentSemester, setCurrentSemester] = useState<number | ''>('');
  const [graduationYear, setGraduationYear] = useState<number | ''>('');
  const [weeklyHours, setWeeklyHours] = useState<number | ''>('');
  const [budgetPref, setBudgetPref] = useState<StudentProfile['budget_preference']>('NOT_SPECIFIED');
  const [learningPref, setLearningPref] = useState<StudentProfile['learning_preference']>('NOT_SPECIFIED');

  // Add Subject Modal state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [studyStatus, setStudyStatus] = useState<'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'>('COMPLETED');
  const [gradeText, setGradeText] = useState('');
  const [semesterTaken, setSemesterTaken] = useState<number | ''>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prof, subs, allSubs] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getStudentSubjects(),
        apiClient.getActiveSubjects(),
      ]);

      setProfile(prof);
      setStudentSubjects(subs);
      setAllSubjects(allSubs);

      if (prof) {
        setUniversityName(prof.university_name || '');
        setDegreeProgram(prof.degree_program || '');
        setCurrentSemester(prof.current_semester || '');
        setGraduationYear(prof.graduation_year || '');
        setWeeklyHours(prof.weekly_learning_hours || 10);
        setBudgetPref(prof.budget_preference || 'NOT_SPECIFIED');
        setLearningPref(prof.learning_preference || 'NOT_SPECIFIED');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load profile details.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await apiClient.updateProfile({
        university_name: universityName || null,
        degree_program: degreeProgram || null,
        current_semester: currentSemester === '' ? 1 : Number(currentSemester),
        graduation_year: graduationYear === '' ? null : Number(graduationYear),
        weekly_learning_hours: weeklyHours === '' ? 10 : Number(weeklyHours),
        budget_preference: budgetPref,
        learning_preference: learningPref,
      });

      setProfile(updated);
      setMessage({ type: 'success', text: 'Academic profile details updated successfully.' });
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    try {
      await apiClient.addStudentSubject({
        subject_id: Number(selectedSubjectId),
        study_status: studyStatus,
        grade_text: gradeText || null,
        semester_taken: semesterTaken === '' ? null : Number(semesterTaken),
      });

      setShowAddSubject(false);
      setSelectedSubjectId('');
      setGradeText('');
      setSemesterTaken('');
      const updatedSubs = await apiClient.getStudentSubjects();
      setStudentSubjects(updatedSubs);
      setMessage({ type: 'success', text: 'Coursework subject added successfully.' });
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to add subject record.' });
    }
  };

  const handleRemoveSubject = async (id: number) => {
    try {
      await apiClient.removeStudentSubject(id);
      setStudentSubjects((prev) => prev.filter((s) => s.student_subject_id !== id));
      setMessage({ type: 'success', text: 'Coursework record removed.' });
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove subject.' });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#244B3A] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-[#657064] text-sm">Loading your academic profile...</p>
      </div>
    );
  }

  const existingSubjectIds = new Set(studentSubjects.map((s) => s.subject_id));
  const availableToAdd = allSubjects.filter((s) => !existingSubjectIds.has(s.subject_id));

  const completedCount = studentSubjects.filter((s) => s.study_status === 'COMPLETED').length;
  const inProgressCount = studentSubjects.filter((s) => s.study_status === 'IN_PROGRESS').length;
  const plannedCount = studentSubjects.filter((s) => s.study_status === 'PLANNED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#244B3A] mb-1">
            ACADEMIC PROFILE & CURRICULAR EVIDENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
            <GraduationCap className="w-7 h-7 text-[#244B3A]" />
            <span>Smart Student Profile & Coursework</span>
          </h1>
          <p className="text-sm text-[#5B675A] mt-1">
            Record your university degree, semester stage, completed HEC coursework, and weekly study capacity.
          </p>
        </div>

        <div className="p-3 bg-white border border-[#E5E4DA] rounded-xl text-xs text-[#5B675A] max-w-md shadow-xs">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#244B3A] shrink-0 mt-0.5" />
            <span>
              <strong>HEC Accreditation Rule:</strong> Coursework accounts for 30% of your career alignment score.
              Completed courses earn 100% credit factor, while in-progress courses earn 50%.
            </span>
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
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#991B1B]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Academic & Constraint Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[#173629] mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#244B3A]" />
              <span>Academic Details</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g. NUST, FAST-NUCES, COMSATS, UET"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  Degree Programme
                </label>
                <input
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  placeholder="e.g. BS Software Engineering, BS Computer Science"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                    Semester (1-12)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="e.g. 5"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="e.g. 2027"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EFE8]">
                <h3 className="text-sm font-bold text-[#173629] mb-3 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#244B3A]" />
                  <span>Learning Capacity & Constraints</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-[#657064] uppercase tracking-wider">
                        Weekly Study Hours (0-80)
                      </label>
                      <span className="text-xs font-bold text-[#244B3A] font-mono">
                        {weeklyHours !== '' ? `${weeklyHours} hrs/wk` : 'Not set'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={weeklyHours !== '' ? weeklyHours : 10}
                      onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                      className="w-full accent-[#244B3A] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                      Budget Preference
                    </label>
                    <select
                      value={budgetPref}
                      onChange={(e) => setBudgetPref(e.target.value as any)}
                      className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                    >
                      <option value="NOT_SPECIFIED">Not Specified</option>
                      <option value="FREE_ONLY">Free Resources Only (Open Source / YouTube)</option>
                      <option value="LOW_COST">Low Cost (Affordable student subscriptions)</option>
                      <option value="FLEXIBLE">Flexible Budget</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                      Preferred Learning Method
                    </label>
                    <select
                      value={learningPref}
                      onChange={(e) => setLearningPref(e.target.value as any)}
                      className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                    >
                      <option value="NOT_SPECIFIED">Not Specified</option>
                      <option value="PRACTICE">Hands-on Practice & Project Building</option>
                      <option value="VIDEO">Video Tutorials & Guided Coding</option>
                      <option value="READING">Official Documentation & Books</option>
                      <option value="MIXED">Mixed Modality</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 px-4 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Academic Coursework Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F0EFE8]">
              <div>
                <h2 className="text-lg font-bold text-[#173629] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#244B3A]" />
                  <span>University Coursework Units ({studentSubjects.length})</span>
                </h2>
                <p className="text-xs text-[#5B675A] mt-0.5">
                  Calibrated against HEC Pakistan standard curriculum for Computing degrees.
                </p>
              </div>

              <button
                onClick={() => setShowAddSubject(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#173629] hover:bg-[#244B3A] text-white font-semibold rounded-lg text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Coursework Unit</span>
              </button>
            </div>

            {/* Course Summary Cards */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-[#EBF2E9] border border-[#DCE8D9] rounded-xl text-center">
                <span className="text-2xs uppercase tracking-wider text-[#173629] font-bold block">Completed</span>
                <span className="text-2xl font-extrabold text-[#173629] font-mono tabular-nums">{completedCount}</span>
                <span className="text-3xs text-[#657064] block mt-0.5">100% Fit Credit</span>
              </div>
              <div className="p-3 bg-[#FEF9C3] border border-[#FEF08A] rounded-xl text-center">
                <span className="text-2xs uppercase tracking-wider text-[#854D0E] font-bold block">In Progress</span>
                <span className="text-2xl font-extrabold text-[#854D0E] font-mono tabular-nums">{inProgressCount}</span>
                <span className="text-3xs text-[#854D0E] block mt-0.5">50% Fit Credit</span>
              </div>
              <div className="p-3 bg-[#EFEEE5] border border-[#E5E4DA] rounded-xl text-center">
                <span className="text-2xs uppercase tracking-wider text-[#657064] font-bold block">Planned</span>
                <span className="text-2xl font-extrabold text-[#202A23] font-mono tabular-nums">{plannedCount}</span>
                <span className="text-3xs text-[#657064] block mt-0.5">Future Semester</span>
              </div>
            </div>

            {/* Coursework Table */}
            {studentSubjects.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-[#E5E4DA] rounded-xl bg-[#FAF9F5]">
                <BookOpen className="w-10 h-10 text-[#A0AAA0] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#173629]">No coursework recorded yet</p>
                <p className="text-xs text-[#657064] max-w-sm mx-auto mt-1">
                  Add completed or ongoing subjects like Programming Fundamentals, Database Systems, or Web Technologies to calculate your academic career alignment.
                </p>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="mt-4 px-4 py-2 bg-[#173629] hover:bg-[#244B3A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  + Add First Course
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFEEE5] text-3xs uppercase tracking-wider text-[#657064] border-y border-[#E5E4DA]">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Subject Name</th>
                      <th className="py-2.5 px-3 font-bold">Category</th>
                      <th className="py-2.5 px-3 font-bold">Study Status</th>
                      <th className="py-2.5 px-3 font-bold">Semester</th>
                      <th className="py-2.5 px-3 font-bold">Grade</th>
                      <th className="py-2.5 px-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EFE8]">
                    {studentSubjects.map((sub: any) => (
                      <tr key={sub.student_subject_id} className="hover:bg-[#FAF9F5] transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#173629]">{sub.subject_name}</td>
                        <td className="py-3 px-3 text-[#657064]">{sub.subject_category || 'General'}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                              sub.study_status === 'COMPLETED'
                                ? 'bg-[#DCE8D9] text-[#173629]'
                                : sub.study_status === 'IN_PROGRESS'
                                ? 'bg-[#FEF9C3] text-[#854D0E]'
                                : 'bg-[#EFEEE5] text-[#657064]'
                            }`}
                          >
                            {sub.study_status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#5B675A] font-mono">
                          {sub.semester_taken ? `Sem ${sub.semester_taken}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-[#173629] font-mono font-semibold">
                          {sub.grade_text || '—'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleRemoveSubject(sub.student_subject_id)}
                            className="p-1.5 text-[#A0AAA0] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer"
                            title="Remove subject"
                            aria-label={`Remove subject ${sub.subject_name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#173629] mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-[#244B3A]" />
              <span>Add Academic Coursework Subject</span>
            </h3>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  Select Subject from HEC Taxonomy
                </label>
                <select
                  required
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                >
                  <option value="">-- Choose Subject --</option>
                  {availableToAdd.map((s) => (
                    <option key={s.subject_id} value={s.subject_id}>
                      {s.subject_name} ({s.subject_category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                    Study Status
                  </label>
                  <select
                    value={studyStatus}
                    onChange={(e) => setStudyStatus(e.target.value as any)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  >
                    <option value="COMPLETED">Completed (100% credit)</option>
                    <option value="IN_PROGRESS">In Progress (50% credit)</option>
                    <option value="PLANNED">Planned (0% credit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                    Semester Taken
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={semesterTaken}
                    onChange={(e) => setSemesterTaken(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="e.g. 4"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                    Grade (Optional)
                  </label>
                  <input
                    type="text"
                    value={gradeText}
                    onChange={(e) => setGradeText(e.target.value)}
                    placeholder="e.g. A, B+"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg px-3 py-2 text-sm text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#F0EFE8]">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-4 py-2 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSubjectId}
                  className="px-5 py-2 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
