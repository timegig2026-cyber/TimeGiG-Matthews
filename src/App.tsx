/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type {
  TabType,
  EmptyStyle,
  SubscriptionType,
  VerificationSubmission,
  TenantPoPSubmission,
  UserProfile,
  ReferredUser,
} from './types';
import { BottomNavBar } from './components/BottomNavBar';
import { EmptyView } from './components/EmptyView';
import { AdminFloatingButton } from './components/AdminFloatingButton';
import { AdminOverlay } from './components/AdminOverlay';
import { SubscriptionSelectionScreen } from './components/SubscriptionSelectionScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { LoginScreen } from './components/LoginScreen';
import { TenantOnboardingModal } from './components/TenantOnboardingModal';
import { ProfileView } from './components/ProfileView';
import { Building2, Clock, CheckCircle2 } from 'lucide-react';
import { playCoinSound } from './utils/audio';

const ADMIN_EMAIL = 'timegig2026@gmail.com';

export default function App() {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionType | null>(() => {
    try {
      const saved = localStorage.getItem('timegig_selectedSubscription');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pendingSubscription, setPendingSubscription] = useState<SubscriptionType | null>(null);

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('timegig_isRegistered');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [authMode, setAuthMode] = useState<'select' | 'register' | 'login'>('select');
  const [activeTab, setActiveTab] = useState<TabType>('seekers');
  const [emptyStyle, setEmptyStyle] = useState<EmptyStyle>('minimalist');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Tenant Workflow State
  const [isTenantModalOpen, setIsTenantModalOpen] = useState<boolean>(false);
  const [verification, setVerification] = useState<VerificationSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('timegig_verification');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tenantPoP, setTenantPoP] = useState<TenantPoPSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('timegig_tenantPoP');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Referred Users from Admin Link State
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(() => {
    try {
      const saved = localStorage.getItem('timegig_referredUsers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('timegig_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Matthews',
        middleName: '',
        surname: 'Dlamini',
        contactNumber: '082 123 4567',
        email: 'timegig2026@gmail.com',
        socialMediaLinks: [
          { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/matthews-tenant' },
          { id: '2', platform: 'Twitter / X', url: 'https://x.com/timegig' },
        ],
        address: '42 Sandton Drive',
        location: 'Sandton, Johannesburg',
        province: 'Gauteng',
        profilePicApprovalStatus: 'pending',
      };
    } catch {
      return {
        name: 'Matthews',
        middleName: '',
        surname: 'Dlamini',
        contactNumber: '082 123 4567',
        email: 'timegig2026@gmail.com',
        socialMediaLinks: [
          { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/matthews-tenant' },
          { id: '2', platform: 'Twitter / X', url: 'https://x.com/timegig' },
        ],
        address: '42 Sandton Drive',
        location: 'Sandton, Johannesburg',
        province: 'Gauteng',
        profilePicApprovalStatus: 'pending',
      };
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('timegig_selectedSubscription', JSON.stringify(selectedSubscription));
    } catch {}
  }, [selectedSubscription]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_isRegistered', JSON.stringify(isRegistered));
    } catch {}
  }, [isRegistered]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_verification', JSON.stringify(verification));
    } catch {}
  }, [verification]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_tenantPoP', JSON.stringify(tenantPoP));
    } catch {}
  }, [tenantPoP]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_referredUsers', JSON.stringify(referredUsers));
    } catch {}
  }, [referredUsers]);

  // Admin access strictly restricted to timegig2026@gmail.com
  const isAdminUser = profile.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // If user is not admin, ensure admin overlay is closed
  useEffect(() => {
    if (!isAdminUser && isAdminOpen) {
      setIsAdminOpen(false);
    }
  }, [isAdminUser, isAdminOpen]);

  // Check URL params on load: if user joins via admin referral link, start fresh registration session without wiping admin records
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('ref') === 'admin' ||
        urlParams.get('start') === 'fresh' ||
        urlParams.get('reset') === 'true'
      ) {
        setSelectedSubscription(null);
        setPendingSubscription(null);
        setIsRegistered(false);
        setIsAdminOpen(false);
        setIsTenantModalOpen(false);
      }
    }
  }, []);

  // Keyboard shortcut: Escape closes modal or admin screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAdminOpen) setIsAdminOpen(false);
        if (isTenantModalOpen) setIsTenantModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, isTenantModalOpen]);

  // When any tab is clicked, it sets the active tab
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleResetToEmpty = () => {
    setEmptyStyle((prev) => (prev === 'minimalist' ? 'blank' : 'minimalist'));
  };

  // Selection handler: User chooses subscription first, then proceeds to register
  const handleSelectSubscription = (sub: SubscriptionType) => {
    setPendingSubscription(sub);
  };

  // Registration handler: user registers with email & password, accepts terms and conditions, then clicks signup
  const handleSignup = (data: { email: string; password: string }) => {
    if (!pendingSubscription) return;
    setProfile((prev) => ({
      ...prev,
      email: data.email,
    }));
    setIsRegistered(true);
    setSelectedSubscription(pendingSubscription);

    // If registering as a referred user (or non-admin), add to referred users queue for admin management & approval
    if (data.email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const newReferred: ReferredUser = {
        id: `REF-${Date.now().toString().slice(-4)}`,
        email: data.email,
        subscriptionType: pendingSubscription,
        joinedAt: 'Just now',
        status: 'pending',
        notes: 'Joined through Admin link',
      };
      setReferredUsers((prev) => [newReferred, ...prev]);
    }

    if (pendingSubscription === 'tenant') {
      // Prompt tenant onboarding workflow
      setIsTenantModalOpen(true);
    }
  };

  // Fast-track Admin Skip Handler: lets admin skip through all setup steps instantly
  const handleSkipAdmin = () => {
    setProfile((prev) => ({
      ...prev,
      email: ADMIN_EMAIL,
    }));
    setPendingSubscription('tenant');
    setSelectedSubscription('tenant');
    setIsRegistered(true);
    setIsAdminOpen(true);
  };

  // Login Handler: lets registered users sign in with their credentials
  const handleLogin = (data: { email: string; password: string }) => {
    const isAdmin = data.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    setProfile((prev) => ({
      ...prev,
      email: data.email,
    }));
    setSelectedSubscription('tenant');
    setIsRegistered(true);
    if (isAdmin) {
      setIsAdminOpen(true);
    }
  };

  // Logout Handler: resets session back to subscription selection / sign out
  const handleLogout = () => {
    setSelectedSubscription(null);
    setPendingSubscription(null);
    setIsRegistered(false);
    setIsAdminOpen(false);
    setIsTenantModalOpen(false);
    setAuthMode('select');
    setProfile((prev) => ({
      ...prev,
      email: '',
    }));
    try {
      localStorage.removeItem('timegig_selectedSubscription');
      localStorage.removeItem('timegig_isRegistered');
      localStorage.removeItem('timegig_profile');
    } catch {}
  };

  // Step 1: User submits Verification (Profile face picture & ID document)
  const handleSubmitVerification = (data: {
    facePhotoUrl: string;
    facePhotoName: string;
    idDocUrl: string;
    idDocName: string;
  }) => {
    const newSubmission: VerificationSubmission = {
      id: `VER-${Date.now().toString().slice(-6)}`,
      facePhotoUrl: data.facePhotoUrl,
      facePhotoName: data.facePhotoName,
      idDocUrl: data.idDocUrl,
      idDocName: data.idDocName,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setVerification(newSubmission);

    // Sync into profile
    setProfile((prev) => ({
      ...prev,
      profilePicUrl: data.facePhotoUrl,
      profilePicApprovalStatus: 'pending',
      idDocUrl: data.idDocUrl,
      idDocName: data.idDocName,
    }));
  };

  // Step 2: User submits Tenant Proof of Payment (PoP)
  const handleSubmitPoP = (data: {
    popDocumentUrl: string;
    popDocumentName: string;
    popDocumentType: string;
  }) => {
    const newPoP: TenantPoPSubmission = {
      id: `POP-${Date.now().toString().slice(-6)}`,
      amount: 'R299,99',
      bank: 'Capitec',
      accountName: 'Matthews',
      accountNumber: '1334067366',
      reference: 'Ten29',
      popDocumentUrl: data.popDocumentUrl,
      popDocumentName: data.popDocumentName,
      popDocumentType: data.popDocumentType,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      estimatedReviewTime: '15 to 25 minutes',
    };
    // Play authentic coin sound effect when proof of payment is submitted
    playCoinSound();
    setTenantPoP(newPoP);
  };

  // Admin Verification Actions
  const handleApproveVerification = () => {
    if (!verification) return;
    setVerification({
      ...verification,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    });
    setProfile((prev) => ({
      ...prev,
      profilePicApprovalStatus: 'approved',
    }));
  };

  const handleRejectVerification = (reason: string) => {
    if (!verification) return;
    setVerification({
      ...verification,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason,
    });
    setProfile((prev) => ({
      ...prev,
      profilePicApprovalStatus: 'rejected',
    }));
  };

  // Admin Tenant PoP Actions
  const handleApproveTenantPoP = () => {
    if (!tenantPoP) return;
    setTenantPoP({
      ...tenantPoP,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    });
  };

  const handleRejectTenantPoP = (reason: string) => {
    if (!tenantPoP) return;
    setTenantPoP({
      ...tenantPoP,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason,
    });
  };

  // Admin Referred Users Actions
  const handleApproveReferredUser = (id: string) => {
    setReferredUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'approved', reviewedAt: new Date().toISOString() } : u
      )
    );
  };

  const handleRejectReferredUser = (id: string) => {
    setReferredUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'rejected', reviewedAt: new Date().toISOString() } : u
      )
    );
  };

  // Save profile updates
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);

    // If profile picture was updated, create/update verification item so admin can review
    if (updatedProfile.profilePicUrl && updatedProfile.profilePicUrl !== verification?.facePhotoUrl) {
      setVerification({
        id: `VER-${Date.now().toString().slice(-6)}`,
        facePhotoUrl: updatedProfile.profilePicUrl,
        facePhotoName: 'updated_profile_photo.jpg',
        idDocUrl: updatedProfile.idDocUrl || verification?.idDocUrl || '',
        idDocName: updatedProfile.idDocName || verification?.idDocName || 'identity_document.pdf',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      });
    }
  };

  // Flow:
  // Step 1: Subscription Choice (Tenant Subscription or User Subscription)
  // Step 2: Register Account with Email & Password + Accept Terms and Conditions then click Signup
  if (!isRegistered || !selectedSubscription) {
    if (authMode === 'login') {
      return (
        <LoginScreen
          onBack={() => setAuthMode('select')}
          onLogin={handleLogin}
        />
      );
    }

    if (!pendingSubscription) {
      return (
        <SubscriptionSelectionScreen
          onSelect={handleSelectSubscription}
          onOpenLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <RegisterScreen
        subscription={pendingSubscription}
        onBack={() => {
          setPendingSubscription(null);
          setAuthMode('select');
        }}
        onSignup={handleSignup}
        onSkipAdmin={handleSkipAdmin}
        onOpenLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-between relative transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Left: Permanent badge of chosen subscription (User can only choose one) */}
      <div className="fixed top-4 left-4 z-40 sm:top-5 sm:left-5">
        {selectedSubscription === 'tenant' ? (
          <button
            type="button"
            onClick={() => setIsTenantModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-lg text-xs font-semibold cursor-pointer hover:border-indigo-400 transition-all"
            title="Click to view Tenant Verification & Payment status"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Tenant Subscription</span>
            {tenantPoP?.status === 'approved' ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            ) : tenantPoP?.status === 'pending' ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                PoP Review (15-25m)
              </span>
            ) : verification?.status === 'approved' ? (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                Step 2: Pay R299,99
              </span>
            ) : verification?.status === 'pending' ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ID Reviewing
              </span>
            ) : (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md text-xs font-semibold select-none">
            <span>User Subscription</span>
          </div>
        )}
      </div>

      {/* Floating Admin Icon - Only visible to timegig2026@gmail.com */}
      {isAdminUser && (
        <AdminFloatingButton onClick={() => setIsAdminOpen(true)} />
      )}

      {/* Full-Screen Admin Screen (Only accessible to timegig2026@gmail.com) */}
      {isAdminUser && (
        <AdminOverlay
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          verification={verification}
          onApproveVerification={handleApproveVerification}
          onRejectVerification={handleRejectVerification}
          tenantPoP={tenantPoP}
          onApproveTenantPoP={handleApproveTenantPoP}
          onRejectTenantPoP={handleRejectTenantPoP}
          referredUsers={referredUsers}
          onApproveReferredUser={handleApproveReferredUser}
          onRejectReferredUser={handleRejectReferredUser}
          selectedSubscription={selectedSubscription}
        />
      )}

      {/* Tenant Onboarding & Proof of Payment Modal */}
      {selectedSubscription === 'tenant' && (
        <TenantOnboardingModal
          isOpen={isTenantModalOpen}
          onClose={() => setIsTenantModalOpen(false)}
          verification={verification}
          tenantPoP={tenantPoP}
          onSubmitVerification={handleSubmitVerification}
          onSubmitPoP={handleSubmitPoP}
        />
      )}

      {/* Main App Container without top bar */}
      <div className="w-full flex-1 max-w-md mx-auto flex flex-col justify-between bg-white dark:bg-slate-900 shadow-xl md:my-6 md:rounded-3xl md:border md:border-slate-200/80 md:dark:border-slate-800 overflow-hidden relative min-h-screen md:min-h-[720px]">
        {/* Content View: Renders ProfileView for 'profile' or EmptyView for 'seekers' / 'gigs' */}
        <main
          className="flex-1 flex flex-col justify-start overflow-y-auto px-4 py-6"
          id={`view-${activeTab}`}
          tabIndex={0}
          role="tabpanel"
          aria-label={`${activeTab} feature view`}
        >
          {activeTab === 'profile' ? (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              verification={verification}
              onOpenTenantPortal={() => {
                if (isAdminUser) setIsAdminOpen(true);
              }}
              isAdmin={isAdminUser}
              onLogout={handleLogout}
            />
          ) : (
            <div className="flex-1 flex flex-col justify-center">
              <EmptyView
                activeTab={activeTab}
                emptyStyle={emptyStyle}
                onResetToEmpty={handleResetToEmpty}
              />
            </div>
          )}
        </main>

        {/* Fixed Bottom Menu Bar containing only: Seekers, GiGs, Profile */}
        <div className="w-full sticky bottom-0 z-30">
          <BottomNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
}
