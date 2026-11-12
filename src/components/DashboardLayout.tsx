/**
 * PathProof — Authenticated Student Dashboard Layout
 * Features a persistent left sidebar with deep forest-green active states,
 * contextual breadcrumbs, in-app notification center, and instant persona switching.
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  Award,
  Sliders,
  Sparkles,
  GitCompare,
  ShieldCheck,
  Bell,
  LogOut,
  ExternalLink,
  ChevronDown,
  Printer,
  Menu,
  X,
  CheckCircle2,
  FileText,
  User as UserIcon,
  Home,
  Bot,
} from 'lucide-react';
import { SafeUser, AppNotification } from '../types/index.ts';
import { apiClient } from '../services/apiClient.ts';
import { FloatingCopilotDrawer } from './FloatingCopilotDrawer.tsx';

export type DashboardTab =
  | 'overview'
  | 'profile'
  | 'skills'
  | 'preferences'
  | 'careers'
  | 'recommendations'
  | 'compare'
  | 'copilot'
  | 'admin';

interface DashboardLayoutProps {
  currentUser: SafeUser | null;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onReturnToLanding: () => void;
  onLogout: () => void;
  onQuickSwitchUser: (type: 'student' | 'admin' | 'student2') => void;
  onOpenReport?: (careerId: number) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onReturnToLanding,
  onLogout,
  onQuickSwitchUser,
  onOpenReport,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch {
      // Ignore if offline
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Fallback local update
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const tabLabels: Record<DashboardTab, string> = {
    overview: 'Workspace Overview',
    profile: 'Profile & Coursework',
    skills: 'Skills Inventory',
    preferences: 'Interests & Activities',
    careers: 'Career Explorer',
    recommendations: 'Matching & Factor Breakdown',
    compare: 'Career Comparison Matrix',
    copilot: 'PathProof Copilot Mentor',
    admin: 'Faculty Admin Panel',
  };

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; role?: 'STUDENT' | 'ADMIN' }[] = [
    { id: 'overview', label: 'Workspace Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile & Coursework', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills Inventory', icon: <Award className="w-4 h-4" /> },
    { id: 'preferences', label: 'Interests & Activities', icon: <Sliders className="w-4 h-4" /> },
    { id: 'careers', label: 'Career Explorer', icon: <Compass className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Career Matching', icon: <Sparkles className="w-4 h-4" />, role: 'STUDENT' },
    { id: 'compare', label: 'Compare Careers', icon: <GitCompare className="w-4 h-4" />, role: 'STUDENT' },
    { id: 'copilot', label: 'Copilot Mentor', icon: <Bot className="w-4 h-4" />, role: 'STUDENT' },
    { id: 'admin', label: 'Admin Console', icon: <ShieldCheck className="w-4 h-4" />, role: 'ADMIN' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex">
      {/* ----------------------------------------------------------------- */}
      {/* PERSISTENT LEFT SIDEBAR (Desktop: 250px, Deep Forest Green #173629) */}
      {/* ----------------------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#173629] text-white shrink-0 border-r border-[#0F241B] select-none fixed inset-y-0 left-0 z-30">
        {/* Brand Area */}
        <div className="p-5 border-b border-[#244B3A]/60 flex items-center justify-between">
          <div
            onClick={onReturnToLanding}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#244B3A] flex items-center justify-center text-[#D8E99A] group-hover:bg-[#2F5E49] transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white leading-tight">PathProof</div>
              <div className="text-3xs text-[#A3B8AC] tracking-wider uppercase">Career Intelligence</div>
            </div>
          </div>
        </div>

        {/* Student Persona Badge with fast switcher */}
        <div className="p-4 border-b border-[#244B3A]/60 bg-[#0F241B]/50">
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-[#244B3A]/40 hover:bg-[#244B3A]/80 transition-colors border border-[#244B3A] cursor-pointer"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#244B3A] border border-[#3A6B55] flex items-center justify-center font-bold text-xs text-[#D8E99A] shrink-0">
                  {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'U'}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.full_name || 'Student Account'}
                  </div>
                  <div className="text-3xs text-[#A3B8AC] truncate">
                    {currentUser?.role === 'ADMIN' ? 'Faculty Administrator' : 'BS SE · Semester 5'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A3B8AC] shrink-0" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showPersonaMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0F241B] border border-[#244B3A] rounded-xl shadow-2xl py-1 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 text-3xs uppercase font-bold text-[#A3B8AC] tracking-wider border-b border-[#244B3A]/60">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => {
                    onQuickSwitchUser('student');
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#244B3A] flex items-center justify-between transition-colors text-white cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">Hamza Tariq</div>
                    <div className="text-3xs text-[#A3B8AC]">BS SE · Sem 5 · NUST</div>
                  </div>
                  <span className="text-3xs bg-[#244B3A] text-[#DCE8D9] px-1.5 py-0.5 rounded">STUDENT</span>
                </button>
                <button
                  onClick={() => {
                    onQuickSwitchUser('student2');
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#244B3A] flex items-center justify-between transition-colors text-white cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">Ayesha Khan</div>
                    <div className="text-3xs text-[#A3B8AC]">BS CS · Sem 3 · FAST</div>
                  </div>
                  <span className="text-3xs bg-[#244B3A] text-[#DCE8D9] px-1.5 py-0.5 rounded">STUDENT</span>
                </button>
                <button
                  onClick={() => {
                    onQuickSwitchUser('admin');
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#244B3A] flex items-center justify-between transition-colors text-white cursor-pointer border-t border-[#244B3A]/60"
                >
                  <div>
                    <div className="font-semibold">Dr. Shahbaz Khan</div>
                    <div className="text-3xs text-[#A3B8AC]">Faculty Admin</div>
                  </div>
                  <span className="text-3xs bg-[#92400E] text-[#FEF3C7] px-1.5 py-0.5 rounded">ADMIN</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items (Forest Green active states) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          <div className="px-3 py-1.5 text-3xs uppercase font-bold tracking-wider text-[#7E9689]">
            WORKSPACE TOOLS
          </div>
          {navItems.map((item) => {
            if (item.role && currentUser?.role !== item.role) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#244B3A] text-[#DCE8D9] shadow-xs'
                    : 'text-[#C7D4CD] hover:text-white hover:bg-[#244B3A]/40'
                }`}
              >
                <span className={isActive ? 'text-[#D8E99A]' : 'text-[#8EA598]'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Footprint */}
        <div className="p-3 border-t border-[#244B3A]/60 bg-[#0F241B]/40 space-y-1">
          <button
            onClick={() => onReturnToLanding()}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#A3B8AC] hover:text-white hover:bg-[#244B3A]/40 rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#8EA598]" />
            <span>Public Landing Page</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#F87171] hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN WORKSPACE CANVAS (Desktop marginLeft: 16rem = 256px)         */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar inside Workspace */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E5E4DA] h-16 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
          {/* Left: Mobile hamburger & Contextual Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#173629] hover:bg-[#EFEEE5] rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center space-x-2 text-xs text-[#657064]">
              <span
                onClick={onReturnToLanding}
                className="hover:text-[#173629] cursor-pointer hidden sm:inline"
              >
                PathProof
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-[#173629]">{tabLabels[activeTab]}</span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Persona Pills on Header */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-[#EFEEE5] rounded-lg border border-[#E5E4DA] text-2xs">
              <button
                onClick={() => onQuickSwitchUser('student')}
                className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                  currentUser?.full_name?.includes('Hamza')
                    ? 'bg-[#173629] text-white shadow-xs'
                    : 'text-[#485347] hover:text-[#173629]'
                }`}
              >
                Hamza (Sem 5)
              </button>
              <button
                onClick={() => onQuickSwitchUser('student2')}
                className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                  currentUser?.full_name?.includes('Ayesha')
                    ? 'bg-[#173629] text-white shadow-xs'
                    : 'text-[#485347] hover:text-[#173629]'
                }`}
              >
                Ayesha (Sem 3)
              </button>
              <button
                onClick={() => onQuickSwitchUser('admin')}
                className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-[#92400E] text-white shadow-xs'
                    : 'text-[#92400E] hover:bg-[#FEF3C7]'
                }`}
              >
                Admin
              </button>
            </div>

            {/* In-App Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#485347] hover:text-[#173629] hover:bg-[#EFEEE5] rounded-lg transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#991B1B] text-white text-3xs font-bold rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E4DA] rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
                  <div className="p-3.5 bg-[#EFEEE5] border-b border-[#E5E4DA] flex items-center justify-between">
                    <div className="font-bold text-xs text-[#173629] flex items-center space-x-1.5">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-3xs bg-[#244B3A] text-white px-1.5 py-0.5 rounded font-mono">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-3xs text-[#244B3A] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F0EFE8]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#657064]">No notifications yet.</div>
                    ) : (
                      notifications.map((note) => (
                        <div
                          key={note.notification_id}
                          onClick={() => {
                            handleMarkAsRead(note.notification_id);
                            if (note.link_tab) {
                              onSelectTab(note.link_tab as DashboardTab);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-[#F7F6F0] ${
                            note.is_read ? 'opacity-70 bg-white' : 'bg-[#FAF9F5]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#173629]">{note.title}</span>
                            {!note.is_read && (
                              <span className="w-2 h-2 rounded-full bg-[#244B3A] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-2xs text-[#485347] mt-1 leading-relaxed">{note.message}</p>
                          <div className="mt-2 flex items-center justify-between text-3xs text-[#657064]">
                            <span className="uppercase font-mono">{note.type}</span>
                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Print Official Dossier Button */}
            {onOpenReport && (
              <button
                onClick={() => onOpenReport(1)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#EFEEE5] hover:bg-[#E5E4DA] text-[#173629] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                title="Print Official Career Dossier"
              >
                <Printer className="w-4 h-4 text-[#244B3A]" />
                <span>Dossier</span>
              </button>
            )}

            {/* Back to Home CTA */}
            <button
              onClick={onReturnToLanding}
              className="text-xs font-semibold text-[#173629] hover:bg-[#EFEEE5] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Home className="w-3.5 h-3.5 text-[#244B3A]" />
              <span className="hidden md:inline">Landing Page</span>
            </button>
          </div>
        </header>

        {/* Mobile Off-Canvas Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-[#173629] text-white flex flex-col p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-4 border-b border-[#244B3A]">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-[#D8E99A]" />
                  <span className="font-bold text-base text-white">PathProof</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#C7D4CD] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 border-b border-[#244B3A] text-xs">
                <div className="font-bold text-white">{currentUser?.full_name}</div>
                <div className="text-3xs text-[#A3B8AC]">{currentUser?.role}</div>
              </div>

              <nav className="flex-1 py-3 space-y-1">
                {navItems.map((item) => {
                  if (item.role && currentUser?.role !== item.role) return null;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? 'bg-[#244B3A] text-[#DCE8D9]' : 'text-[#C7D4CD] hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#244B3A] space-y-1 text-xs">
                <button
                  onClick={() => {
                    onReturnToLanding();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-[#A3B8AC] hover:text-white flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left py-2 text-rose-400 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Floating Copilot Drawer Widget */}
        <FloatingCopilotDrawer
          currentUser={currentUser}
          onOpenFullTab={() => onSelectTab('copilot')}
        />
      </div>
    </div>
  );
};
