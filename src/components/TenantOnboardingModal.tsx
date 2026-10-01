import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import type { VerificationSubmission, TenantPoPSubmission } from '../types';
import { playCoinSound } from '../utils/audio';

interface TenantOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  verification: VerificationSubmission | null;
  tenantPoP: TenantPoPSubmission | null;
  onSubmitVerification: (data: {
    facePhotoUrl: string;
    facePhotoName: string;
    idDocUrl: string;
    idDocName: string;
  }) => void;
  onSubmitPoP: (data: {
    popDocumentUrl: string;
    popDocumentName: string;
    popDocumentType: string;
  }) => void;
}

export const TenantOnboardingModal: React.FC<TenantOnboardingProps> = ({
  isOpen,
  onClose,
  verification,
  tenantPoP,
  onSubmitVerification,
  onSubmitPoP,
}) => {
  // Verification form state
  const [faceFile, setFaceFile] = useState<{ url: string; name: string } | null>(null);
  const [idFile, setIdFile] = useState<{ url: string; name: string } | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // PoP form state
  const [popFile, setPopFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [popError, setPopError] = useState<string | null>(null);

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFaceFile({
        url: event.target?.result as string,
        name: file.name,
      });
      setVerificationError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setIdFile({
        url: event.target?.result as string,
        name: file.name,
      });
      setVerificationError(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePoPUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPopFile({
        url: event.target?.result as string,
        name: file.name,
        type: file.type,
      });
      setPopError(null);
    };
    reader.readAsDataURL(file);
  };

  const submitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceFile) {
      setVerificationError('Please upload your profile picture (face only).');
      return;
    }
    if (!idFile) {
      setVerificationError('Please upload your ID document.');
      return;
    }
    onSubmitVerification({
      facePhotoUrl: faceFile.url,
      facePhotoName: faceFile.name,
      idDocUrl: idFile.url,
      idDocName: idFile.name,
    });
  };

  const submitPoP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popFile) {
      setPopError('Please select and upload your proof of payment document.');
      return;
    }
    // Play crisp coin chime upon submitting proof of payment
    playCoinSound();
    onSubmitPoP({
      popDocumentUrl: popFile.url,
      popDocumentName: popFile.name,
      popDocumentType: popFile.type,
    });
  };

  // Determine current step:
  // Step 1: Verification required (if not submitted, or rejected)
  // Step 1 Pending: Verification submitted, waiting for admin approval
  // Step 2: Verification approved! Bank transfer & PoP required
  // Step 2 Pending: PoP submitted, review takes 15-25 mins
  // Step 3: All approved! Active tenant earning passive income.

  const isVerificationApproved = verification?.status === 'approved';
  const isVerificationPending = verification?.status === 'pending';
  const isVerificationRejected = verification?.status === 'rejected';

  const isPoPApproved = tenantPoP?.status === 'approved';
  const isPoPPending = tenantPoP?.status === 'pending';
  const isPoPRejected = tenantPoP?.status === 'rejected';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tenant Subscription Setup"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Tenant Subscription Setup
              </h2>
              <p className="text-xs text-slate-500">
                Earn monthly passive income for R299,99 / month
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-xs">
            {/* Step 1 indicator */}
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isVerificationApproved
                    ? 'bg-emerald-600 text-white'
                    : isVerificationPending
                    ? 'bg-amber-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isVerificationApproved ? '✓' : '1'}
              </span>
              <span
                className={
                  isVerificationApproved
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-800 dark:text-slate-200'
                }
              >
                ID & Face Verification
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400" />

            {/* Step 2 indicator */}
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isPoPApproved
                    ? 'bg-emerald-600 text-white'
                    : isPoPPending
                    ? 'bg-amber-500 text-white'
                    : isVerificationApproved
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {isPoPApproved ? '✓' : '2'}
              </span>
              <span
                className={
                  isPoPApproved
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : isVerificationApproved
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400'
                }
              >
                Payment & Tenant PoP
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: IDENTITY VERIFICATION */}
          {!isVerificationApproved ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Step 1: Identity Verification Required First
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      Before proceeding to payment, you must upload your profile picture (face only) and your ID document from your device. The admin will review and verify your identity in the Verification feature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status banner if pending or rejected */}
              {isVerificationPending && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Verification Submitted · In Review
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Your face photo and ID document have been sent to Admin. Admin will review and approve your submission in the Verification feature.
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-mono">
                      Submitted: {new Date(verification!.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {isVerificationRejected && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-900 dark:text-rose-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Verification Rejected
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                      {verification?.rejectionReason || 'Your documents could not be verified. Please re-upload a clear face photo and valid ID document.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload form for Step 1 (active if not pending) */}
              {!isVerificationPending && (
                <form onSubmit={submitVerification} className="space-y-4">
                  {/* Upload 1: Profile picture (face only) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      1. Profile Picture <span className="text-indigo-600 font-bold">(Face Only)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 text-indigo-500 mb-1" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {faceFile ? faceFile.name : 'Upload face photo from device'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          JPG, PNG, WebP (Clear face portrait)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaceUpload}
                          className="hidden"
                        />
                      </label>
                      {faceFile && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          <img
                            src={faceFile.url}
                            alt="Face preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload 2: ID document from device */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      2. ID Document <span className="text-indigo-600 font-bold">(National ID / Passport)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors">
                        <FileText className="w-5 h-5 text-indigo-500 mb-1" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {idFile ? idFile.name : 'Upload ID document from device'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Image or PDF document
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleIdUpload}
                          className="hidden"
                        />
                      </label>
                      {idFile && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-sm shrink-0">
                          {idFile.url.startsWith('data:image') ? (
                            <img
                              src={idFile.url}
                              alt="ID document preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-indigo-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {verificationError && (
                    <p className="text-xs text-rose-500 font-medium">
                      {verificationError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit Verification to Admin</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* STEP 2: BANK TRANSFER & PROOF OF PAYMENT */
            <div className="space-y-5">
              {/* Verification approved banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">
                    Identity Verification Approved by Admin
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  Verified
                </span>
              </div>

              {/* Passive income promo card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Monthly Passive Income
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tenant Subscription Fee: R299,99 / month
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Complete your bank transfer with the details below, upload proof of payment, and start earning.
                </p>
              </div>

              {/* Bank Transfer Details Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Capitec Bank Transfer Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Bank */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bank</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Capitec</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('Capitec', 'bank')}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Bank"
                    >
                      {copiedField === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Account Name</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Matthews</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('Matthews', 'accountName')}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Account Name"
                    >
                      {copiedField === 'accountName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Account Number */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Account Number</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">1334067366</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('1334067366', 'accountNumber')}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'accountNumber' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Reference */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block">
                        Payment Reference (Must Use)
                      </span>
                      <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                        Ten29
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('Ten29', 'ref')}
                      className="p-1.5 rounded-md hover:bg-indigo-100 text-indigo-500 hover:text-indigo-800 transition-colors"
                      title="Copy Reference"
                    >
                      {copiedField === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200">
                  <p>
                    <strong>Important:</strong> Amount must be exactly <strong>R299,99</strong> and the reference must be <strong>Ten29</strong>.
                  </p>
                </div>
              </div>

              {/* Status banner for PoP */}
              {isPoPPending && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Proof of Payment Under Review
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-semibold">
                      Review takes 15 to 25 minutes.
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                      Your document has been sent to Admin. You will receive activation as soon as the Admin approves your payment in the Tenant PoP feature.
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-mono">
                      Submitted: {new Date(tenantPoP!.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {isPoPApproved && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Tenant Subscription Active!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Your proof of payment has been approved by Admin. Your monthly passive income entitlement is now active!
                    </p>
                  </div>
                </div>
              )}

              {isPoPRejected && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-900 dark:text-rose-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Proof of Payment Rejected
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                      {tenantPoP?.rejectionReason || 'The payment receipt could not be verified. Please check that R299,99 was transferred to Capitec Account 1334067366 with Ref Ten29 and re-upload.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Proof of Payment Form */}
              {!isPoPPending && !isPoPApproved && (
                <form onSubmit={submitPoP} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Upload Proof of Payment (PoP) Document
                    </label>
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-indigo-500 mb-1.5" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {popFile ? popFile.name : 'Select Proof of Payment from device'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Bank receipt screenshot, PDF statement, or image
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handlePoPUpload}
                        className="hidden"
                      />
                    </label>

                    {popFile && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">
                          {popFile.name}
                        </span>
                        <span className="text-emerald-600 font-semibold text-[11px]">
                          Ready to submit
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>
                      After clicking submit, review takes <strong>15 to 25 minutes</strong>.
                    </span>
                  </div>

                  {popError && (
                    <p className="text-xs text-rose-500 font-medium">
                      {popError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit Proof of Payment for Review</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
