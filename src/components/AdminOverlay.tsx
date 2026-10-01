import React, { useState, useEffect } from 'react';
import {
  X,
  BadgeCheck,
  Building2,
  User,
  UserCheck,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  Globe,
  DollarSign,
  Activity,
  Zap,
  Share2,
  Copy,
  Check,
  Volume2,
  Send,
  MessageCircle,
  Search,
  Filter,
  UserX,
  ShieldAlert,
} from 'lucide-react';
import type { AdminTabType, VerificationSubmission, TenantPoPSubmission, ReferredUser } from '../types';
import { AdminBottomNavBar } from './AdminBottomNavBar';
import { playCoinSound } from '../utils/audio';

interface AdminOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  verification: VerificationSubmission | null;
  onApproveVerification: () => void;
  onRejectVerification: (reason: string) => void;
  tenantPoP: TenantPoPSubmission | null;
  onApproveTenantPoP: () => void;
  onRejectTenantPoP: (reason: string) => void;
  referredUsers: ReferredUser[];
  onApproveReferredUser: (id: string) => void;
  onRejectReferredUser: (id: string) => void;
}

const tabLabels: Record<AdminTabType, string> = {
  overview: 'overview',
  verification: 'Verification',
  tenant_pop: 'Tenant PoP',
  user_pop: 'User PoP',
};

export const AdminOverlay: React.FC<AdminOverlayProps> = ({
  isOpen,
  onClose,
  verification,
  onApproveVerification,
  onRejectVerification,
  tenantPoP,
  onApproveTenantPoP,
  onRejectTenantPoP,
  referredUsers = [],
  onApproveReferredUser,
  onRejectReferredUser,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTabType>('overview');

  // Preview modal for zoomed-in document or face photo
  const [previewItem, setPreviewItem] = useState<{ title: string; url: string } | null>(null);

  // Reject prompt state
  const [rejectDialog, setRejectDialog] = useState<{
    type: 'verification' | 'tenantPoP';
    isOpen: boolean;
  }>({ type: 'verification', isOpen: false });
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Referred Users filter and search state
  const [referredFilter, setReferredFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [referredSearch, setReferredSearch] = useState('');

  // -------------------------------------------------------------
  // Admin Share Link & Coin Sound Triggers
  // -------------------------------------------------------------
  const [copiedLink, setCopiedLink] = useState(false);
  const adminShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?ref=admin&start=fresh`
    : 'https://ais-dev-ioh67yrynxlfj7y5clr6d4-339746247390.us-west2.run.app/?ref=admin&start=fresh';

  const handleCopyAdminLink = () => {
    navigator.clipboard.writeText(adminShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Play coin sound when proof of payment is received
  useEffect(() => {
    if (tenantPoP) {
      playCoinSound();
    }
  }, [tenantPoP?.id]);

  const handleApprovePoPWithSound = () => {
    playCoinSound();
    onApproveTenantPoP();
  };
  const [baseOnlineTenants, setBaseOnlineTenants] = useState<number>(42);
  const [baseSubscriptionUsers, setBaseSubscriptionUsers] = useState<number>(128);
  const [liveVisits, setLiveVisits] = useState<number>(342);

  // Simulation timer for live traffic and online presence fluctuations
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Live visits slowly climb and oscillate
      setLiveVisits((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1, +2
        const next = prev + (delta >= 0 ? delta + 1 : 0);
        return Math.max(300, next);
      });

      // Online tenants slight organic fluctuation (±1)
      setBaseOnlineTenants((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(38, Math.min(52, prev + delta));
      });

      // Subscription users slight organic fluctuation (±1)
      setBaseSubscriptionUsers((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(115, Math.min(145, prev + delta));
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate live profits:
  // Tenant fee is R299,99 per tenant. If current session tenant is approved, add 1.
  const totalActiveTenants = baseOnlineTenants + (tenantPoP?.status === 'approved' ? 1 : 0);
  const tenantSubscriptionProfit = totalActiveTenants * 299.99;

  // User subscription fee (e.g. R99,00 per user)
  const userSubscriptionProfit = baseSubscriptionUsers * 99.0;

  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleOpenReject = (type: 'verification' | 'tenantPoP') => {
    setRejectDialog({ type, isOpen: true });
    setRejectionReasonInput('');
  };

  const handleConfirmReject = () => {
    if (rejectDialog.type === 'verification') {
      onRejectVerification(rejectionReasonInput.trim() || 'Verification documents could not be validated.');
    } else {
      onRejectTenantPoP(rejectionReasonInput.trim() || 'Payment proof could not be verified against bank transfer.');
    }
    setRejectDialog({ type: 'verification', isOpen: false });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Screen"
      className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col justify-between animate-in fade-in duration-150 select-none overflow-hidden"
    >
      {/* Top bar with Admin title, active tab indicator & Exit button */}
      <div className="w-full px-4 sm:px-6 py-3.5 flex justify-between items-center border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider uppercase text-slate-700">
            Admin Console · {tabLabels[activeAdminTab]}
          </span>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
            Live Stream
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin screen"
          className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5 text-xs font-medium"
          title="Exit Admin (Esc)"
        >
          <span>Exit Admin</span>
          <X className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Main Feature Content Container */}
      <main
        className="flex-1 w-full bg-white flex flex-col overflow-y-auto"
        role="tabpanel"
        aria-label={`${tabLabels[activeAdminTab]} view`}
      >
        {/* TAB 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-4">
            {/* Header with live ticker status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Admin Real-Time Dashboard
                </h2>
                <p className="text-[11px] text-slate-500">
                  Live monitoring for Tenant & User profits, online presence, and concurrent visits
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Feed</span>
              </div>
            </div>

            {/* SECTION 1: LIVE SUBSCRIPTION PROFIT CARDS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Live Subscription Profit
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Monthly Run Rate (ZAR)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Live Tenant Subscription Profit */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-white border border-indigo-100 shadow-2xs relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          Live Tenant Subscription Profit
                        </span>
                        <span className="text-[10px] text-indigo-600 font-medium">
                          R299,99 / tenant / month
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  <div className="my-1">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                      {formatZAR(tenantSubscriptionProfit)}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-indigo-50 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Active Paying Tenants:</span>
                    <strong className="font-mono text-indigo-700 font-bold">
                      {totalActiveTenants} Tenants
                    </strong>
                  </div>
                </div>

                {/* 2. Live User Subscription Profit */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-white border border-purple-100 shadow-2xs relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          Live User Subscription Profit
                        </span>
                        <span className="text-[10px] text-purple-600 font-medium">
                          R99,00 / user / month
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  <div className="my-1">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                      {formatZAR(userSubscriptionProfit)}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Subscribed Active Users:</span>
                    <strong className="font-mono text-purple-700 font-bold">
                      {baseSubscriptionUsers} Users
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: LIVE ONLINE PRESENCE & VISITS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Real-Time Traffic & Presence
                </h3>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Auto-syncing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 3. Live Online Tenants */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Live Online Tenants
                    </span>
                    <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Building2 className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums my-0.5">
                    {totalActiveTenants}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Active Now</span>
                  </div>
                </div>

                {/* 4. Live Subscription Users */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Live Subscription Users
                    </span>
                    <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Users className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums my-0.5">
                    {baseSubscriptionUsers}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Subscribers Online</span>
                  </div>
                </div>

                {/* 5. Live Online Visits */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Live Online Visits
                    </span>
                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Globe className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums my-0.5">
                    {liveVisits}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Concurrent Visitors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: PENDING APPROVAL QUEUES */}
            <div className="space-y-2 pt-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Action Queues
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Verification Queue Shortcut */}
                <div
                  onClick={() => setActiveAdminTab('verification')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Identity Verification</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        verification?.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : verification?.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {verification?.status === 'pending'
                        ? '1 Pending'
                        : verification?.status === 'approved'
                        ? 'Approved'
                        : 'Queue Empty'}
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mb-0.5">
                    {verification ? '1 Document Review' : '0 Submissions'}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>Inspect profile face photo & ID doc</span>
                    <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                  </p>
                </div>

                {/* Tenant PoP Queue Shortcut */}
                <div
                  onClick={() => setActiveAdminTab('tenant_pop')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tenant Proof of Payment</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tenantPoP?.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : tenantPoP?.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tenantPoP?.status === 'pending'
                        ? '1 Review Pending'
                        : tenantPoP?.status === 'approved'
                        ? 'Approved'
                        : 'Queue Empty'}
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mb-0.5">
                    {tenantPoP ? 'R299,99 (Ten29)' : '0 Submissions'}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>Capitec Bank transfers (15-25 min SLA)</span>
                    <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                  </p>
                </div>

                {/* Referred Users Queue Shortcut */}
                <div
                  onClick={() => {
                    const el = document.getElementById('referred-users-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin Link Users</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        referredUsers.filter((u) => u.status === 'pending').length > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {referredUsers.filter((u) => u.status === 'pending').length > 0
                        ? `${referredUsers.filter((u) => u.status === 'pending').length} Pending`
                        : 'Reviewed'}
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mb-0.5">
                    {referredUsers.length} Total Users
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>Manage & approve accounts</span>
                    <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: ADMIN SOCIAL MEDIA SHARE LINK (STARTS FROM SCRATCH) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-white border border-indigo-200/80 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Admin Social Media Share Link
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Anyone who joins through this link starts completely from scratch
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full font-semibold w-fit">
                  Fresh Onboarding Link
                </span>
              </div>

              {/* Link Input & Copy Button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={adminShareUrl}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-700 focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyAdminLink}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                  title="Copy Admin Link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Social Media Share Buttons */}
              <div className="pt-2 border-t border-indigo-100/70 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  Share directly to:
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join our platform now! Click to get started: ${adminShareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join our platform now! Start here:`)}&url=${encodeURIComponent(adminShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Twitter / X</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adminShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(adminShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(adminShareUrl)}&text=${encodeURIComponent('Join our platform now!')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SECTION 5: USERS JOINED THROUGH ADMIN LINK (MANAGE & APPROVE) */}
            <div
              id="referred-users-section"
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Users Joined Through Admin Link
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Review, manage, and approve new accounts registered via your personal link
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      referredUsers.filter((u) => u.status === 'pending').length > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {referredUsers.filter((u) => u.status === 'pending').length} Pending Approval
                  </span>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-base font-extrabold font-mono text-slate-900">
                    {referredUsers.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Total Joined</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="text-base font-extrabold font-mono text-amber-700">
                    {referredUsers.filter((u) => u.status === 'pending').length}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">Pending</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="text-base font-extrabold font-mono text-emerald-700">
                    {referredUsers.filter((u) => u.status === 'approved').length}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">Approved</div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="text-base font-extrabold font-mono text-rose-700">
                    {referredUsers.filter((u) => u.status === 'rejected').length}
                  </div>
                  <div className="text-[10px] text-rose-700 font-medium">Rejected</div>
                </div>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                    const count =
                      filter === 'all'
                        ? referredUsers.length
                        : referredUsers.filter((u) => u.status === filter).length;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setReferredFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer capitalize ${
                          referredFilter === filter
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {filter} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-48">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={referredSearch}
                    onChange={(e) => setReferredSearch(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs pl-7 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2 pt-1">
                {referredUsers
                  .filter((u) => {
                    if (referredFilter !== 'all' && u.status !== referredFilter) return false;
                    if (referredSearch.trim()) {
                      const q = referredSearch.toLowerCase();
                      return (
                        u.email.toLowerCase().includes(q) ||
                        u.subscriptionType.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((user) => (
                    <div
                      key={user.id}
                      className="p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/40 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      {/* User Info */}
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            user.subscriptionType === 'tenant'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {user.subscriptionType === 'tenant' ? (
                            <Building2 className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {user.email}
                            </span>

                            {/* Plan badge */}
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                user.subscriptionType === 'tenant'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {user.subscriptionType === 'tenant'
                                ? 'Tenant Subscription'
                                : 'User Subscription'}
                            </span>

                            {/* Status badge */}
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                user.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : user.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {user.status === 'pending'
                                ? 'Pending Approval'
                                : user.status === 'approved'
                                ? 'Approved'
                                : 'Rejected'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                            <span>Joined: {user.joinedAt}</span>
                            {user.notes && (
                              <span className="text-slate-400">· {user.notes}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {user.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onRejectReferredUser(user.id)}
                              className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onApproveReferredUser(user.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </>
                        )}

                        {user.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => onRejectReferredUser(user.id)}
                            className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Revoke / Reject</span>
                          </button>
                        )}

                        {user.status === 'rejected' && (
                          <button
                            type="button"
                            onClick={() => onApproveReferredUser(user.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Re-approve</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {referredUsers.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs italic">
                    No users have joined via your admin link yet. Share the link above to invite members.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION FEATURE */}
        {activeAdminTab === 'verification' && (
          <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Identity Verification Queue
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Review submitted face photo and ID documents from device. Approve or Reject.
                </p>
              </div>
              {verification && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    verification.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : verification.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {verification.status.toUpperCase()}
                </span>
              )}
            </div>

            {!verification ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                  <BadgeCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Verification Queue is Empty
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  No identity verification documents have been submitted yet. When a tenant uploads their face photo and ID, they will appear here for review.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-4 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                  <span>ID: <strong className="font-mono text-slate-800">{verification.id}</strong></span>
                  <span>Submitted: {new Date(verification.submittedAt).toLocaleTimeString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Face photo */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        1. Face Picture (Face Only)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewItem({
                            title: 'Face Profile Picture',
                            url: verification.facePhotoUrl,
                          })
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Enlarge</span>
                      </button>
                    </div>

                    <div className="h-36 sm:h-40 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group flex items-center justify-center">
                      <img
                        src={verification.facePhotoUrl}
                        alt="Profile Face preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {verification.facePhotoName}
                    </span>
                  </div>

                  {/* ID Document */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        2. National ID Document
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewItem({
                            title: 'ID Document',
                            url: verification.idDocUrl,
                          })
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Enlarge</span>
                      </button>
                    </div>

                    <div className="h-36 sm:h-40 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group flex items-center justify-center">
                      {verification.idDocUrl.startsWith('data:image') ? (
                        <img
                          src={verification.idDocUrl}
                          alt="ID Document preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center">
                          <FileText className="w-8 h-8 text-indigo-500 mb-1" />
                          <span className="text-xs font-medium text-slate-700">
                            PDF Document
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {verification.idDocName}
                    </span>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="text-[11px] text-slate-500">
                    {verification.status === 'pending' && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="w-3 h-3" />
                        Awaiting your decision
                      </span>
                    )}
                    {verification.status === 'approved' && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved by Admin
                      </span>
                    )}
                    {verification.status === 'rejected' && (
                      <span className="flex items-center gap-1 text-rose-600 font-medium">
                        <XCircle className="w-3 h-3" />
                        Rejected: {verification.rejectionReason}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReject('verification')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      onClick={onApproveVerification}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Identity</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TENANT POP (PROOF OF PAYMENT) FEATURE */}
        {activeAdminTab === 'tenant_pop' && (
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Tenant Proof of Payment (PoP)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify R299,99 Capitec Bank transfers with reference Ten29. Review SLA: 15 to 25 minutes.
                </p>
              </div>
              {tenantPoP && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    tenantPoP.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : tenantPoP.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  Status: {tenantPoP.status.toUpperCase()}
                </span>
              )}
            </div>

            {!tenantPoP ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                  <Building2 className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">
                  Tenant PoP Queue is Empty
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  No tenant proof of payment documents have been uploaded yet. When a tenant transfers R299,99 and submits proof of payment, it will appear here for review.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bank Transfer</span>
                    <strong className="text-slate-900 font-semibold">{tenantPoP.bank}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Account & Holder</span>
                    <strong className="text-slate-900 font-semibold">{tenantPoP.accountName} ({tenantPoP.accountNumber})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Required Amount</span>
                    <strong className="text-indigo-600 font-mono font-bold">{tenantPoP.amount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Reference Check</span>
                    <strong className="text-emerald-700 font-mono font-bold">{tenantPoP.reference}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Uploaded Proof of Payment Document from Device
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewItem({
                          title: 'Proof of Payment Document',
                          url: tenantPoP.popDocumentUrl,
                        })
                      }
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Screen</span>
                    </button>
                  </div>

                  <div className="w-full max-h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative group">
                    {tenantPoP.popDocumentUrl.startsWith('data:image') ? (
                      <img
                        src={tenantPoP.popDocumentUrl}
                        alt="PoP Document preview"
                        className="max-h-80 w-auto object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <FileText className="w-16 h-16 text-indigo-500 mb-2" />
                        <span className="text-xs font-medium text-slate-700">
                          {tenantPoP.popDocumentName}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          Click View Full Screen to inspect
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>File: {tenantPoP.popDocumentName}</span>
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Review SLA: 15 to 25 minutes
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {tenantPoP.status === 'pending' && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Waiting for Admin verification of Capitec payment
                      </span>
                    )}
                    {tenantPoP.status === 'approved' && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Payment approved! Monthly passive income unlocked.
                      </span>
                    )}
                    {tenantPoP.status === 'rejected' && (
                      <span className="flex items-center gap-1 text-rose-600 font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        Payment rejected: {tenantPoP.rejectionReason}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playCoinSound()}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Play payment coin sound"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span>Coin Sound</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenReject('tenantPoP')}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject PoP</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleApprovePoPWithSound}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve PoP (R299,99)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USER POP (EMPTY INSIDE) */}
        {activeAdminTab === 'user_pop' && (
          <div className="flex-1 w-full bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="text-center opacity-30 select-none">
              <p className="text-xs uppercase tracking-widest font-mono text-slate-400">
                User PoP · Empty
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Admin Bottom Menu Bar */}
      <AdminBottomNavBar
        activeTab={activeAdminTab}
        onTabChange={setActiveAdminTab}
      />

      {/* Full-Screen Image Preview Modal */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold">{previewItem.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center overflow-auto bg-slate-950">
              {previewItem.url.startsWith('data:image') ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
              ) : (
                <iframe
                  src={previewItem.url}
                  title={previewItem.title}
                  className="w-full h-[70vh] rounded-xl border border-slate-800"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reject {rejectDialog.type === 'verification' ? 'Identity Verification' : 'Proof of Payment'}
            </h3>
            <p className="text-xs text-slate-500">
              Provide an explanation to the user so they know what to fix when re-uploading:
            </p>
            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Image was blurry, face was obscured, or payment reference did not match Ten29."
              className="w-full h-24 p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialog({ type: 'verification', isOpen: false })}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
