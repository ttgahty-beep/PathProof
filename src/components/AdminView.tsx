/**
 * PathProof Phase 1 — Basic Administrator Panel
 * Warm Paper + Forest Green design tokens.
 * Implements FR-ADMIN-01 through FR-ADMIN-05.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { SafeUser, Career } from '../types/index.ts';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Database,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  ExternalLink,
  History,
  Lock,
  X,
} from 'lucide-react';

interface AdminViewProps {
  currentUser: SafeUser;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'quality' | 'users' | 'careers' | 'evidence'>('quality');
  const [dataQuality, setDataQuality] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<SafeUser[]>([]);
  const [careersList, setCareersList] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Career Form
  const [showNewCareerModal, setShowNewCareerModal] = useState(false);
  const [newCareerTitle, setNewCareerTitle] = useState('');
  const [newCareerCategoryId, setNewCareerCategoryId] = useState(1);
  const [newCareerSummary, setNewCareerSummary] = useState('');
  const [newCareerDesc, setNewCareerDesc] = useState('');
  const [newCareerStatus, setNewCareerStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');

  // New Evidence Form
  const [showNewEvidenceModal, setShowNewEvidenceModal] = useState(false);
  const [evidenceCareerId, setEvidenceCareerId] = useState(1);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceOrg, setEvidenceOrg] = useState('');
  const [evidenceLocation, setEvidenceLocation] = useState('Islamabad');
  const [evidenceWorkMode, setEvidenceWorkMode] = useState<any>('HYBRID');
  const [evidenceSource, setEvidenceSource] = useState('Rozee.pk');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceStatus, setEvidenceStatus] = useState<any>('OPEN_AT_CHECK');
  const [evidenceVerification, setEvidenceVerification] = useState<any>('CONTENT_CHECKED');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  useEffect(() => {
    loadAdminData();
  }, [activeSubTab]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === 'quality') {
        const quality = await apiClient.getAdminDataQuality();
        setDataQuality(quality);
      } else if (activeSubTab === 'users') {
        const users = await apiClient.getAdminUsers();
        setUsersList(users);
      } else if (activeSubTab === 'careers') {
        const data = await apiClient.getCareers();
        setCareersList(data);
      } else if (activeSubTab === 'evidence') {
        const data = await apiClient.getCareers();
        setCareersList(data);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load administration data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: SafeUser) => {
    const nextStatus = user.account_status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await apiClient.setUserStatus(user.user_id, nextStatus);
      setUsersList((prev) =>
        prev.map((u) => (u.user_id === user.user_id ? { ...u, account_status: nextStatus } : u))
      );
      setMessage({
        type: 'success',
        text: `Account for ${user.full_name} set to ${nextStatus}.`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update user status.' });
    }
  };

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createCareer({
        category_id: newCareerCategoryId,
        career_title: newCareerTitle,
        summary: newCareerSummary,
        description: newCareerDesc,
        publication_status: newCareerStatus,
      });
      setShowNewCareerModal(false);
      setNewCareerTitle('');
      setNewCareerSummary('');
      setNewCareerDesc('');
      setMessage({ type: 'success', text: 'New career successfully added to catalogue.' });
      loadAdminData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create career profile.' });
    }
  };

  const handleToggleCareerPublish = async (career: Career) => {
    const nextStatus = career.publication_status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await apiClient.updateCareer(career.career_id, {
        publication_status: nextStatus,
      });
      setCareersList((prev) =>
        prev.map((c) => (c.career_id === career.career_id ? { ...c, publication_status: nextStatus } : c))
      );
      setMessage({
        type: 'success',
        text: `Career "${career.career_title}" is now ${nextStatus}.`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update publication status.' });
    }
  };

  const handleCreateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createJobEvidence({
        career_id: evidenceCareerId,
        job_title: evidenceTitle,
        organization_name: evidenceOrg,
        location_text: evidenceLocation,
        work_mode: evidenceWorkMode,
        source_name: evidenceSource,
        source_url: evidenceUrl,
        posting_status: evidenceStatus,
        verification_status: evidenceVerification,
        notes: evidenceNotes,
      });
      setShowNewEvidenceModal(false);
      setEvidenceTitle('');
      setEvidenceOrg('');
      setEvidenceUrl('');
      setEvidenceNotes('');
      setMessage({ type: 'success', text: 'New job evidence record successfully saved.' });
      loadAdminData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to record job evidence.' });
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset database to canonical initial seed data?')) return;
    try {
      await apiClient.resetDatabase();
      setMessage({ type: 'success', text: 'Database reset to initial verified seed dataset.' });
      loadAdminData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset database.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E5E4DA]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173629] flex items-center space-x-2">
              <ShieldCheck className="w-7 h-7 text-[#854D0E]" />
              <span>Faculty Administration & Governance</span>
            </h1>
            <span className="text-3xs uppercase px-2 py-0.5 rounded bg-[#FEF9C3] text-[#854D0E] font-bold">
              Admin Access Active
            </span>
          </div>
          <p className="text-sm text-[#5B675A] mt-1">
            Maintain catalogue data, audit mappings, curate verified job postings, and inspect system data quality.
          </p>
        </div>

        <button
          onClick={handleResetDatabase}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#991B1B] border border-[#E5E4DA] rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Initial Seeds</span>
        </button>
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

      {/* Admin Subtabs */}
      <div className="flex border-b border-[#E5E4DA] space-x-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('quality')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'quality'
              ? 'border-[#173629] text-[#173629]'
              : 'border-transparent text-[#657064] hover:text-[#173629]'
          }`}
        >
          Data Quality & Audit Logs
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-[#173629] text-[#173629]'
              : 'border-transparent text-[#657064] hover:text-[#173629]'
          }`}
        >
          User Account Management
        </button>

        <button
          onClick={() => setActiveSubTab('careers')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'careers'
              ? 'border-[#173629] text-[#173629]'
              : 'border-transparent text-[#657064] hover:text-[#173629]'
          }`}
        >
          Career Profiles & Drafts
        </button>

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'evidence'
              ? 'border-[#173629] text-[#173629]'
              : 'border-transparent text-[#657064] hover:text-[#173629]'
          }`}
        >
          Job Evidence Curation
        </button>
      </div>

      {/* 1. Quality & Audit Logs Subtab */}
      {activeSubTab === 'quality' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#657064]">Loading quality metrics...</div>
          ) : !dataQuality ? (
            <div className="text-center py-12 text-xs text-[#657064]">No quality data available.</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl shadow-xs">
                  <span className="text-3xs uppercase font-bold text-[#657064] block">Published Careers</span>
                  <span className="text-2xl font-extrabold text-[#173629] font-mono tabular-nums">
                    {dataQuality.publishedCareers} / {dataQuality.totalCareers}
                  </span>
                </div>
                <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl shadow-xs">
                  <span className="text-3xs uppercase font-bold text-[#657064] block">Verified Evidence</span>
                  <span className="text-2xl font-extrabold text-[#244B3A] font-mono tabular-nums">
                    {dataQuality.verifiedEvidenceRecords} / {dataQuality.totalEvidenceRecords}
                  </span>
                </div>
                <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl shadow-xs">
                  <span className="text-3xs uppercase font-bold text-[#657064] block">Registered Users</span>
                  <span className="text-2xl font-extrabold text-[#173629] font-mono tabular-nums">
                    {dataQuality.totalUsers}
                  </span>
                </div>
                <div className="p-4 bg-white border border-[#E5E4DA] rounded-xl shadow-xs">
                  <span className="text-3xs uppercase font-bold text-[#657064] block">Audit Logs</span>
                  <span className="text-2xl font-extrabold text-[#173629] font-mono tabular-nums">
                    {dataQuality.auditLogsCount}
                  </span>
                </div>
              </div>

              {/* Data Quality Warnings */}
              <div className="p-5 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#173629] flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-[#854D0E]" />
                  <span>Curricular Quality Invariants & Warnings ({dataQuality.warnings?.length || 0})</span>
                </h3>

                {dataQuality.warnings?.length === 0 ? (
                  <p className="text-xs text-[#244B3A] font-medium">
                    All published careers satisfy minimum mapping invariants (≥ 2 skills, ≥ 1 course, ≥ 3 verified postings).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dataQuality.warnings.map((w: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#FEF9C3] border border-[#FEF08A] rounded-lg text-xs text-[#854D0E] flex items-center justify-between"
                      >
                        <span>{w.message}</span>
                        <span className="text-3xs uppercase font-bold">{w.level}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Audit Logs */}
              <div className="p-5 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#173629] flex items-center space-x-2">
                  <History className="w-4 h-4 text-[#244B3A]" />
                  <span>Recent Administrative Audit Events</span>
                </h3>

                <div className="overflow-x-auto border border-[#E5E4DA] rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#EFEEE5] text-[#173629]">
                      <tr className="border-b border-[#E5E4DA]">
                        <th className="p-2.5 font-bold">Action</th>
                        <th className="p-2.5 font-bold">Entity</th>
                        <th className="p-2.5 font-bold">Summary</th>
                        <th className="p-2.5 font-bold text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E4DA] bg-white">
                      {dataQuality.recentAuditLogs?.map((log: any) => (
                        <tr key={log.audit_id} className="hover:bg-[#FAF9F5]">
                          <td className="p-2.5 font-bold text-[#173629]">{log.action}</td>
                          <td className="p-2.5 text-[#657064]">{log.entity_type}</td>
                          <td className="p-2.5 text-[#202A23]">{log.summary}</td>
                          <td className="p-2.5 text-right font-mono text-3xs text-[#657064]">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. User Accounts Subtab */}
      {activeSubTab === 'users' && (
        <div className="p-6 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#173629]">User Account Directory</h3>
            <span className="text-xs text-[#657064] font-mono">{usersList.length} accounts</span>
          </div>

          <div className="overflow-x-auto border border-[#E5E4DA] rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EFEEE5] text-[#173629]">
                <tr className="border-b border-[#E5E4DA]">
                  <th className="p-3 font-bold">User Name</th>
                  <th className="p-3 font-bold">Email</th>
                  <th className="p-3 font-bold">Role</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4DA] bg-white text-[#202A23]">
                {usersList.map((u) => (
                  <tr key={u.user_id} className="hover:bg-[#FAF9F5]">
                    <td className="p-3 font-bold text-[#173629]">{u.full_name}</td>
                    <td className="p-3 text-[#657064] font-mono">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-3xs font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-[#FEF9C3] text-[#854D0E]'
                            : 'bg-[#DCE8D9] text-[#173629]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-3xs font-bold ${
                          u.account_status === 'ACTIVE'
                            ? 'bg-[#DCE8D9] text-[#173629]'
                            : 'bg-[#FEE2E2] text-[#991B1B]'
                        }`}
                      >
                        {u.account_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.user_id !== currentUser.user_id && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className="px-2.5 py-1 text-2xs font-semibold bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded transition-colors cursor-pointer"
                        >
                          {u.account_status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Career Profiles & Drafts Subtab */}
      {activeSubTab === 'careers' && (
        <div className="p-6 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#173629]">Career Profiles & Publication State</h3>
              <p className="text-xs text-[#657064] mt-0.5">
                Draft careers are hidden from regular students until approved by faculty administrators.
              </p>
            </div>

            <button
              onClick={() => setShowNewCareerModal(true)}
              className="px-3.5 py-2 bg-[#173629] hover:bg-[#244B3A] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#D8E99A]" />
              <span>Add Career Profile</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-[#E5E4DA] rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EFEEE5] text-[#173629]">
                <tr className="border-b border-[#E5E4DA]">
                  <th className="p-3 font-bold">Career Title</th>
                  <th className="p-3 font-bold">Category</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Publish Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4DA] bg-white text-[#202A23]">
                {careersList.map((c) => (
                  <tr key={c.career_id} className="hover:bg-[#FAF9F5]">
                    <td className="p-3 font-bold text-[#173629]">{c.career_title}</td>
                    <td className="p-3 text-[#657064]">{c.category_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-3xs font-bold ${
                          c.publication_status === 'PUBLISHED'
                            ? 'bg-[#DCE8D9] text-[#173629]'
                            : 'bg-[#FEF9C3] text-[#854D0E]'
                        }`}
                      >
                        {c.publication_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleCareerPublish(c)}
                        className={`px-3 py-1 text-2xs font-bold rounded transition-colors cursor-pointer ${
                          c.publication_status === 'PUBLISHED'
                            ? 'bg-[#FAF9F5] hover:bg-[#EFEEE5] text-[#854D0E] border border-[#E5E4DA]'
                            : 'bg-[#173629] hover:bg-[#244B3A] text-white'
                        }`}
                      >
                        {c.publication_status === 'PUBLISHED' ? 'Set to Draft' : 'Publish Role'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Job Evidence Curation Subtab */}
      {activeSubTab === 'evidence' && (
        <div className="p-6 bg-white border border-[#E5E4DA] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#173629]">Pakistan Job Evidence Records</h3>
              <p className="text-xs text-[#657064] mt-0.5">
                Directly curate dated job postings from Techlogix, Systems Ltd, 10Pearls, Arbisoft, and Devsinc.
              </p>
            </div>

            <button
              onClick={() => setShowNewEvidenceModal(true)}
              className="px-3.5 py-2 bg-[#173629] hover:bg-[#244B3A] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#D8E99A]" />
              <span>Add Verified Posting</span>
            </button>
          </div>

          <div className="p-4 bg-[#EBF2E9] border border-[#DCE8D9] rounded-xl text-xs text-[#173629]">
            <strong>Governance Standard:</strong> Only postings with <code>CONTENT_CHECKED</code> status count toward skill frequency statistics and student dossier evidence bars.
          </div>
        </div>
      )}

      {/* Modal: New Career Profile */}
      {showNewCareerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DA] mb-4">
              <h3 className="text-base font-bold text-[#173629]">Add New Career Profile</h3>
              <button onClick={() => setShowNewCareerModal(false)} className="text-[#657064] hover:text-[#173629]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCareer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#657064] mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  value={newCareerTitle}
                  onChange={(e) => setNewCareerTitle(e.target.value)}
                  placeholder="e.g. Cybersecurity Analyst"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Category</label>
                <select
                  value={newCareerCategoryId}
                  onChange={(e) => setNewCareerCategoryId(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                >
                  <option value={1}>Software Development</option>
                  <option value={2}>Quality Assurance</option>
                  <option value={3}>Data & Analytics</option>
                  <option value={4}>Cloud & Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Summary (1-line)</label>
                <input
                  type="text"
                  required
                  value={newCareerSummary}
                  onChange={(e) => setNewCareerSummary(e.target.value)}
                  placeholder="Concise overview of role"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={newCareerDesc}
                  onChange={(e) => setNewCareerDesc(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Publication Status</label>
                <select
                  value={newCareerStatus}
                  onChange={(e) => setNewCareerStatus(e.target.value as any)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                >
                  <option value="PUBLISHED">PUBLISHED (Visible immediately)</option>
                  <option value="DRAFT">DRAFT (Hidden from students)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5E4DA]">
                <button
                  type="button"
                  onClick={() => setShowNewCareerModal(false)}
                  className="px-3 py-1.5 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white rounded-lg font-bold cursor-pointer"
                >
                  Create Career
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Job Evidence */}
      {showNewEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DA] mb-4">
              <h3 className="text-base font-bold text-[#173629]">Add Verified Pakistan Job Evidence</h3>
              <button onClick={() => setShowNewEvidenceModal(false)} className="text-[#657064] hover:text-[#173629]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#657064] mb-1">Target Career Profile</label>
                <select
                  value={evidenceCareerId}
                  onChange={(e) => setEvidenceCareerId(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                >
                  {careersList.map((c) => (
                    <option key={c.career_id} value={c.career_id}>
                      {c.career_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. Junior Web Developer"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#657064] mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={evidenceOrg}
                    onChange={(e) => setEvidenceOrg(e.target.value)}
                    placeholder="e.g. Systems Ltd"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#657064] mb-1">Location</label>
                  <input
                    type="text"
                    value={evidenceLocation}
                    onChange={(e) => setEvidenceLocation(e.target.value)}
                    placeholder="e.g. Lahore / Islamabad"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Source URL</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://company.com/careers/..."
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Verification Status</label>
                <select
                  value={evidenceVerification}
                  onChange={(e) => setEvidenceVerification(e.target.value as any)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                >
                  <option value="CONTENT_CHECKED">CONTENT_CHECKED (Eligible for statistics)</option>
                  <option value="ACCESSIBLE_UNCONFIRMED">ACCESSIBLE_UNCONFIRMED</option>
                  <option value="UNVERIFIABLE">UNVERIFIABLE</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#657064] mb-1">Inspection Notes</label>
                <textarea
                  rows={2}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Verified required skills: React, TypeScript, REST API..."
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg p-2 text-[#202A23] focus:outline-none focus:border-[#244B3A]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5E4DA]">
                <button
                  type="button"
                  onClick={() => setShowNewEvidenceModal(false)}
                  className="px-3 py-1.5 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#173629] hover:bg-[#244B3A] text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
