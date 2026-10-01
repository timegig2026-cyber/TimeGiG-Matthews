import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { SubscriptionType } from '../types';

interface RegisterScreenProps {
  subscription: SubscriptionType;
  onBack: () => void;
  onSignup: (data: { email: string; password: string }) => void;
  onSkipAdmin?: () => void;
  onOpenLogin?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  subscription,
  onBack,
  onSignup,
  onSkipAdmin,
  onOpenLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email format (e.g. name@example.com).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions before signing up.');
      return;
    }

    onSignup({ email: trimmedEmail, password });
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative select-none">
      {/* Background soft ambient tint */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Back Navigation & Subscription Badge */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Subscription</span>
          </button>

          {/* Selected Subscription indicator badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              subscription === 'tenant'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            {subscription === 'tenant' ? (
              <>
                <Building2 className="w-3.5 h-3.5" />
                <span>Tenant Plan</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>User Plan</span>
              </>
            )}
          </div>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {/* Fast-track Admin Skip - Only visible when admin email is entered */}
          {onSkipAdmin && email.trim().toLowerCase() === 'timegig2026@gmail.com' && (
            <div className="mb-6 pb-6 border-b border-slate-100 animate-in fade-in">
              <button
                type="button"
                onClick={onSkipAdmin}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
              >
                <span>⚡ Skip & Open Admin (timegig2026@gmail.com)</span>
              </button>
            </div>
          )}

          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Create Your Account
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Sign Up
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Register with your email and password to proceed with your{' '}
              <strong className="text-slate-800">
                {subscription === 'tenant' ? 'Tenant Subscription' : 'User Subscription'}
              </strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-9 bg-slate-50/50 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password (min 6 chars)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-9 pr-9 bg-slate-50/50 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-9 bg-slate-50/50 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (error) setError(null);
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and Privacy Policy.
                </span>
              </label>
            </div>

            {/* Signup Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!acceptedTerms}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  acceptedTerms
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 active:scale-[0.99]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Signup</span>
              </button>
            </div>
          </form>

          {/* Already registered login link */}
          {onOpenLogin && (
            <div className="mt-6 text-center pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Terms and Conditions
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Platform Usage & Subscription Agreement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  1. Subscription & Account Eligibility
                </h4>
                <p>
                  By registering, you agree to select either a Tenant Subscription or User Subscription. Each user may hold one active subscription tier per registered email address.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  2. Identity Verification & Profile Pictures
                </h4>
                <p>
                  Tenants are required to upload valid National ID or Passport documentation and a clear portrait face photograph. Profile pictures may only be modified once every 30 days and are subject to mandatory administrator approval.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  3. Payments & Proof of Payment (PoP)
                </h4>
                <p>
                  Tenant subscriptions carry a monthly fee of R299,99 payable to the designated Capitec account using reference Ten29. Proof of Payment documents are subject to administrative review within an SLA of 15 to 25 minutes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  4. Privacy & Data Security
                </h4>
                <p>
                  Personal data, identity records, and contact details are stored securely. You maintain full ownership of your data and can update contact and social links through your profile at any time.
                </p>
              </div>
            </div>

            {/* Footer with Accept button */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
