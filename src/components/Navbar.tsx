/**
 * PathProof Phase 1 — Navigation Header & User Bar
 */

import React from 'react';
import { SafeUser } from '../types/index.ts';
import {
  Compass,
  User as UserIcon,
  BookOpen,
  Award,
  Sparkles,
  GitCompare,
  ShieldCheck,
  LogOut,
  Sliders,
  FileText,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'profile'
  | 'skills'
  | 'preferences'
  | 'careers'
  | 'recommendations'
  | 'compare'
  | 'admin';

interface NavbarProps {
  currentUser: SafeUser | null;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onQuickSwitchUser: (type: 'student' | 'admin' | 'student2') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenAuth,
  onQuickSwitchUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Compass className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">PathProof</span>
                <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Phase 1
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Career Discovery & Intelligence Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Overview
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => onSelectTab('profile')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Profile & Courses</span>
                </button>

                <button
                  onClick={() => onSelectTab('skills')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'skills'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Skills</span>
                </button>

                <button
                  onClick={() => onSelectTab('preferences')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Interests</span>
                </button>
              </>
            )}

            <button
              onClick={() => onSelectTab('careers')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'careers'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Careers</span>
            </button>

            {currentUser && currentUser.role === 'STUDENT' && (
              <>
                <button
                  onClick={() => onSelectTab('recommendations')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'recommendations'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Matching</span>
                </button>

                <button
                  onClick={() => onSelectTab('compare')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'compare'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare</span>
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Controls & Demo Fast Switcher */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-sm font-medium text-slate-100">{currentUser.full_name}</span>
                  <span className="text-xs text-slate-400 flex items-center justify-end space-x-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        currentUser.role === 'ADMIN' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <span>{currentUser.role}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative group">
                    <button
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium"
                      title="Quick Switch Accounts for Demonstration"
                    >
                      Demo Switch
                    </button>
                    <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1.5 hidden group-hover:block z-50">
                      <div className="px-3 py-1 text-2xs text-slate-400 uppercase font-bold tracking-wider">
                        Switch Session
                      </div>
                      <button
                        onClick={() => onQuickSwitchUser('student')}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Hamza (Student, Sem 5)</span>
                        <span className="text-emerald-400 text-2xs">STUDENT</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('student2')}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Ayesha (Student, Sem 3)</span>
                        <span className="text-emerald-400 text-2xs">STUDENT</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('admin')}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Dr. Shahbaz (Administrator)</span>
                        <span className="text-amber-400 text-2xs">ADMIN</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-sm shadow-sm transition-colors"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 border-t border-slate-800 space-x-2 text-xs no-scrollbar">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => onSelectTab('profile')}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  activeTab === 'profile' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                Profile & Courses
              </button>
              <button
                onClick={() => onSelectTab('skills')}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  activeTab === 'skills' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => onSelectTab('preferences')}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  activeTab === 'preferences' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                Interests
              </button>
            </>
          )}
          <button
            onClick={() => onSelectTab('careers')}
            className={`px-3 py-1.5 rounded whitespace-nowrap ${
              activeTab === 'careers' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Careers
          </button>
          {currentUser && currentUser.role === 'STUDENT' && (
            <>
              <button
                onClick={() => onSelectTab('recommendations')}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  activeTab === 'recommendations' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                Matching
              </button>
              <button
                onClick={() => onSelectTab('compare')}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  activeTab === 'compare' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                Compare
              </button>
            </>
          )}
          {currentUser && currentUser.role === 'ADMIN' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1.5 rounded whitespace-nowrap text-amber-400 ${
                activeTab === 'admin' ? 'bg-amber-500/20 font-semibold' : ''
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
