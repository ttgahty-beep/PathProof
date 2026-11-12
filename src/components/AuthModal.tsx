/**
 * PathProof Phase 1 — Authentication Modal & Role Security
 * Warm Paper + Forest Green design tokens.
 * Enforces FR-AUTH-01 through FR-AUTH-07.
 */

import React, { useState } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { SafeUser } from '../types/index.ts';
import { X, Lock, Mail, User, AlertCircle, CheckCircle2, Compass } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: SafeUser) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const res = await apiClient.register(fullName, email, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await apiClient.login(email, password);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userEmail: string, userPass: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await apiClient.login(userEmail, userPass);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E5E4DA] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4DA] bg-[#F7F6F0]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#173629] flex items-center justify-center text-[#D8E99A]">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-[#173629]">
              {mode === 'login' ? 'Sign In to PathProof' : 'Create Student Account'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#657064] hover:text-[#173629] p-1 rounded-lg hover:bg-[#EFEEE5] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E5E4DA] bg-[#FAF9F5]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-[#173629] text-[#173629] bg-white font-bold'
                : 'border-transparent text-[#657064] hover:text-[#173629]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-[#173629] text-[#173629] bg-white font-bold'
                : 'border-transparent text-[#657064] hover:text-[#173629]'
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A0AAA0] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-3 py-2 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0AAA0] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-3 py-2 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#657064] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0AAA0] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DA] rounded-lg pl-9 pr-3 py-2 text-xs text-[#202A23] placeholder-[#A0AAA0] focus:outline-none focus:border-[#244B3A]"
                />
              </div>
              {mode === 'register' && (
                <p className="text-3xs text-[#657064] mt-1">
                  Public registration assigns <strong>STUDENT</strong> role. Admin accounts are provisioned by project supervisors.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#173629] hover:bg-[#244B3A] disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Student Account'}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-[#E5E4DA]">
            <div className="text-3xs uppercase tracking-wider text-[#657064] font-bold mb-2">
              Instant Demonstration Accounts:
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student@demo.edu.pk', 'StudentPassword123!')}
                className="w-full text-left p-2.5 bg-[#FAF9F5] hover:bg-[#EFEEE5] border border-[#E5E4DA] rounded-lg text-xs text-[#202A23] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-[#173629]">Hamza Tariq (Pre-filled Profile)</div>
                  <div className="text-3xs text-[#657064]">Semester 5, BS SE, 8 courses, 7 skills, recommendations ready</div>
                </div>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-[#DCE8D9] text-[#173629]">
                  Student
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ayesha@demo.edu.pk', 'StudentPassword123!')}
                className="w-full text-left p-2.5 bg-[#FAF9F5] hover:bg-[#EFEEE5] border border-[#E5E4DA] rounded-lg text-xs text-[#202A23] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-[#173629]">Ayesha Khan (Semester 3 CS)</div>
                  <div className="text-3xs text-[#657064]">Early-degree student testing ownership isolation</div>
                </div>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-[#DCE8D9] text-[#173629]">
                  Student
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@pathproof.pk', 'AdminPassword123!')}
                className="w-full text-left p-2.5 bg-[#FAF9F5] hover:bg-[#EFEEE5] border border-[#FEF08A] rounded-lg text-xs text-[#202A23] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-[#854D0E]">Dr. Shahbaz Khan</div>
                  <div className="text-3xs text-[#657064]">Curator & Admin: Mappings, Job Evidence, User Status</div>
                </div>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-[#FEF9C3] text-[#854D0E]">
                  Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
