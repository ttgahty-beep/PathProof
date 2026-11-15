/**
 * PathProof — Career Decision & Real-World Readiness Platform
 * Phase 1: Career Discovery & Intelligence
 * Software Construction & Development Semester Project
 *
 * Implements the approved Warm Paper + Forest Green design system (UniDesk inspiration).
 * Core Brand Message: "Your degree is a start. Make it count."
 * Presentation: Full commercial landing page for visitors with instant authenticated workspace access.
 * Workspace: Persistent left sidebar with deep forest-green active states (#173629).
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from './services/apiClient.ts';
import { SafeUser } from './types/index.ts';
import { usePathProofIntelligence } from './hooks/usePathProofIntelligence.ts';
import { LandingView } from './components/LandingView.tsx';
import { DashboardLayout, DashboardTab } from './components/DashboardLayout.tsx';
import { StudentOverviewView } from './components/StudentOverviewView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { SkillsView } from './components/SkillsView.tsx';
import { PreferencesView } from './components/PreferencesView.tsx';
import { CareerView } from './components/CareerView.tsx';
import { RecommendationsView } from './components/RecommendationsView.tsx';
import { ComparisonView } from './components/ComparisonView.tsx';
import { CareerRealityReportModal } from './components/CareerRealityReportModal.tsx';
import { AdminView } from './components/AdminView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CopilotView } from './components/CopilotView.tsx';

export default function App() {
  const intel = usePathProofIntelligence();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

  // View Mode: 'landing' (public marketing showcase) vs 'workspace' (authenticated student/admin app)
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Auth Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Career Reality Report Modal
  const [reportModalCareerId, setReportModalCareerId] = useState<number | null>(null);

  // Comparison State
  const [comparisonCareerIds, setComparisonCareerIds] = useState<number[]>([1, 2]);

  useEffect(() => {
    const saved = apiClient.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
      apiClient
        .getMe()
        .then((u) => setCurrentUser(u))
        .catch(() => {
          apiClient.clearSession();
          handleQuickSwitch('student');
        });
    } else {
      handleQuickSwitch('student');
    }
  }, []);

  const handleQuickSwitch = async (type: 'student' | 'admin' | 'student2') => {
    let email = 'student@demo.edu.pk';
    let pass = 'StudentPassword123!';

    if (type === 'admin') {
      email = 'admin@pathproof.pk';
      pass = 'AdminPassword123!';
    } else if (type === 'student2') {
      email = 'ayesha@demo.edu.pk';
      pass = 'StudentPassword123!';
    }

    try {
      const res = await apiClient.login(email, pass);
      setCurrentUser(res.user);
      if (type === 'admin') {
        setActiveTab('admin');
      } else if (activeTab === 'admin') {
        setActiveTab('overview');
      }
      intel.refresh();
    } catch (err) {
      console.error('Demo auto-login failed:', err);
    }
  };

  const handleLogout = async () => {
    await apiClient.logout();
    setCurrentUser(null);
    setViewMode('landing');
    setActiveTab('overview');
    intel.refresh();
  };

  const handleOpenReport = (careerId: number) => {
    setReportModalCareerId(careerId);
  };

  const handleOpenCompare = (careerId: number) => {
    setComparisonCareerIds((prev) => {
      if (prev.includes(careerId)) return prev;
      if (prev.length < 3) return [...prev, careerId];
      return [prev[0], careerId];
    });
    setActiveTab('compare');
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDashboard = (tab?: string) => {
    if (tab) {
      setActiveTab(tab as DashboardTab);
    }
    if (!currentUser) {
      handleQuickSwitch('student');
    }
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#202A23] font-sans">
      {/* ----------------------------------------------------------------- */}
      {/* VIEWPORT ROUTER: LANDING vs DASHBOARD WORKSPACE                   */}
      {/* ----------------------------------------------------------------- */}
      {viewMode === 'landing' && (
        <LandingView
          careers={intel.careers}
          marketSummaries={intel.marketSummaries}
          onEnterDashboard={handleEnterDashboard}
          onOpenReport={handleOpenReport}
          onOpenAuth={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          onQuickSwitchUser={handleQuickSwitch}
        />
      )}

      {viewMode === 'workspace' && (
        <DashboardLayout
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onReturnToLanding={() => setViewMode('landing')}
          onLogout={handleLogout}
          onQuickSwitchUser={handleQuickSwitch}
          onOpenReport={handleOpenReport}
        >
          {activeTab === 'overview' && (
            <StudentOverviewView
              intel={intel}
              onNavigate={handleTabChange}
              onOpenReport={handleOpenReport}
              onOpenCompare={handleOpenCompare}
            />
          )}

          {activeTab === 'profile' && currentUser && (
            <ProfileView
              onProfileUpdated={() => intel.refresh()}
              onNavigateToTab={handleTabChange}
            />
          )}

          {activeTab === 'skills' && currentUser && (
            <SkillsView onSkillsUpdated={() => intel.refresh()} />
          )}

          {activeTab === 'preferences' && currentUser && (
            <PreferencesView onPreferencesUpdated={() => intel.refresh()} />
          )}

          {activeTab === 'careers' && (
            <CareerView
              onSelectCareerForReport={handleOpenReport}
              onSelectCareerForCompare={handleOpenCompare}
            />
          )}

          {activeTab === 'recommendations' && currentUser && (
            <RecommendationsView
              onOpenReport={handleOpenReport}
              onOpenCompare={handleOpenCompare}
              onNavigateToTab={handleTabChange}
            />
          )}

          {activeTab === 'compare' && currentUser && (
            <ComparisonView
              initialCareerIds={comparisonCareerIds}
              onOpenReport={handleOpenReport}
            />
          )}

          {activeTab === 'copilot' && currentUser?.role === 'STUDENT' && (
            <CopilotView
              currentUser={currentUser}
              onNavigateToTab={handleTabChange}
              onOpenReport={handleOpenReport}
            />
          )}

          {activeTab === 'copilot' && currentUser?.role !== 'STUDENT' && (
            <div className="bg-white rounded-xl border border-[#E5E4DA] p-8 text-center space-y-4 max-w-lg mx-auto my-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#173629]">Student Account Required for Copilot</h2>
              <p className="text-xs text-[#657064]">
                {currentUser
                  ? 'You are currently signed in as an Administrator. Switch to a Student persona to use PathProof Copilot Mentor.'
                  : 'Signing you into your workspace session...'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('student')}
                  className="px-4 py-2 bg-[#173629] hover:bg-[#244B3A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Switch to Student (Hamza)
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
            <AdminView currentUser={currentUser} />
          )}
        </DashboardLayout>
      )}

      {/* Global Career Reality Report Modal */}
      {reportModalCareerId !== null && (
        <CareerRealityReportModal
          careerId={reportModalCareerId}
          onClose={() => setReportModalCareerId(null)}
        />
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          setViewMode('workspace');
          if (u.role === 'ADMIN') setActiveTab('admin');
          else setActiveTab('overview');
          intel.refresh();
        }}
      />
    </div>
  );
}
