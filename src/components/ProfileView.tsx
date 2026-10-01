import React, { useState } from 'react';
import {
  User,
  Building2,
  Download,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import type { UserProfile, SocialLink, VerificationSubmission } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  verification: VerificationSubmission | null;
  onOpenTenantPortal: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  verification,
  onOpenTenantPortal,
  isAdmin = false,
  onLogout,
}) => {
  // Form state initialized from profile or verification
  const [name, setName] = useState(profile.name || 'Matthews');
  const [middleName, setMiddleName] = useState(profile.middleName || '');
  const [surname, setSurname] = useState(profile.surname || 'Dlamini');
  const [contactNumber, setContactNumber] = useState(profile.contactNumber || '082 123 4567');
  const [email, setEmail] = useState(profile.email || 'timegig2026@gmail.com');
  const [address, setAddress] = useState(profile.address || '42 Sandton Drive');
  const [location, setLocation] = useState(profile.location || 'Sandton, Johannesburg');
  const [province, setProvince] = useState(profile.province || 'Gauteng');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    profile.socialMediaLinks || [
      { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/tenant' },
      { id: '2', platform: 'Twitter / X', url: 'https://x.com/timegig' },
    ]
  );

  // New social link form inputs
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showAddSocial, setShowAddSocial] = useState(false);

  // Profile picture state
  // Preference: profilePicUrl -> verification facePhotoUrl -> null
  const currentPic = profile.profilePicUrl || verification?.facePhotoUrl || '';
  const currentIdDoc = profile.idDocUrl || verification?.idDocUrl || '';
  const currentIdDocName = profile.idDocName || verification?.idDocName || 'identity_document.pdf';

  const [picStatus, setPicStatus] = useState<'approved' | 'pending' | 'rejected'>(
    profile.profilePicApprovalStatus || (verification?.status === 'approved' ? 'approved' : 'pending')
  );
  const [lastChangedDate, setLastChangedDate] = useState<string | null>(
    profile.lastProfilePicChangeDate || null
  );

  // Toast feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [picError, setPicError] = useState<string | null>(null);

  // Check 30 days restriction rule for profile picture change
  const canChangeProfilePicture = () => {
    if (!lastChangedDate) return true;
    const lastDate = new Date(lastChangedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 30;
  };

  const getDaysUntilNextChange = () => {
    if (!lastChangedDate) return 0;
    const lastDate = new Date(lastChangedDate);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canChangeProfilePicture()) {
      setPicError(`Profile picture can only be changed once every month. Next change available in ${getDaysUntilNextChange()} days.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newPicUrl = event.target?.result as string;
      setPicStatus('pending');
      setLastChangedDate(new Date().toISOString());
      setPicError(null);

      // Save immediately into updated profile
      const updated: UserProfile = {
        name,
        middleName,
        surname,
        contactNumber,
        email,
        socialMediaLinks: socialLinks,
        address,
        location,
        province,
        profilePicUrl: newPicUrl,
        lastProfilePicChangeDate: new Date().toISOString(),
        profilePicApprovalStatus: 'pending',
        idDocUrl: currentIdDoc,
        idDocName: currentIdDocName,
      };
      onSaveProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSocialLink = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: newPlatform.trim(),
      url: newUrl.trim(),
    };
    setSocialLinks([...socialLinks, newLink]);
    setNewPlatform('');
    setNewUrl('');
    setShowAddSocial(false);
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name,
      middleName,
      surname,
      contactNumber,
      email,
      socialMediaLinks: socialLinks,
      address,
      location,
      province,
      profilePicUrl: currentPic,
      lastProfilePicChangeDate: lastChangedDate || undefined,
      profilePicApprovalStatus: picStatus,
      idDocUrl: currentIdDoc,
      idDocName: currentIdDocName,
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-2 sm:py-4 px-2 sm:px-4 space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Profile Title and Tenant Portal icon feature at the top corner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            User Profile
          </h1>
          <p className="text-xs text-slate-500">
            Manage your personal credentials, contact info and verified documents
          </p>
        </div>

        {/* Tenant Portal icon feature at top corner - Only visible to admin (timegig2026@gmail.com) */}
        {isAdmin && (
          <button
            type="button"
            onClick={onOpenTenantPortal}
            title="Open Tenant Portal (Full Screen)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tenant Portal</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Profile details saved successfully!</span>
        </div>
      )}

      {/* Profile Picture Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* User profile picture logo using uploaded picture */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-100 bg-slate-100 shadow-sm flex items-center justify-center">
            {currentPic ? (
              <img
                src={currentPic}
                alt="User Profile face"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-400 stroke-[1.5]" />
            )}
          </div>

          {/* Change Photo Overlay Button */}
          <label
            htmlFor="profile-pic-input"
            className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
            title="Upload new face picture (Once per month, requires Admin approval)"
          >
            <Camera className="w-3.5 h-3.5" />
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {name} {surname}
            </h2>
            {/* Approval badge */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                picStatus === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {picStatus === 'approved' ? 'Face Verified & Approved' : 'Face Pending Admin Approval'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            {email} · {location}
          </p>

          <p className="text-[10px] text-slate-400 flex items-center justify-center sm:justify-start gap-1 pt-0.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Profile picture can only be changed once every month and must be approved by admin.</span>
          </p>

          {picError && (
            <p className="text-[11px] text-rose-600 font-semibold pt-1">
              {picError}
            </p>
          )}
        </div>
      </div>

      {/* ID Document Download Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Uploaded ID Document
              </h3>
              <p className="text-[11px] text-slate-500">
                National ID / Passport verified with Admin
              </p>
            </div>
          </div>

          {currentIdDoc ? (
            <a
              href={currentIdDoc}
              download={currentIdDocName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Download ID document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ID</span>
            </a>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Not uploaded yet
            </span>
          )}
        </div>

        {currentIdDoc && (
          <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60 truncate">
            File: {currentIdDocName}
          </div>
        )}
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Personal Information (Editable anytime)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Name (First Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                placeholder="Enter first name"
              />
            </div>

            {/* Middle Name (Optional) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Middle Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                placeholder="Enter middle name (optional)"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Surname *
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                placeholder="Enter surname"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Contact Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900 pl-8"
                  placeholder="e.g. 082 123 4567"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900 pl-8"
                  placeholder="name@example.com"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Address, Location & Province */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Address & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Street Address */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Address (Street / Building) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900 pl-8"
                  placeholder="e.g. 42 Sandton Drive"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Location (City / Town / Suburb) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Location (City / Suburb) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                placeholder="e.g. Sandton, Johannesburg"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Province *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900 cursor-pointer"
              >
                {SA_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Social Media Links (User can add more) */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Social Media Links
              </h3>
              <p className="text-[11px] text-slate-400">
                Add your social channels, portfolio or business profiles
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSocial(!showAddSocial)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          {/* Social Links List */}
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-slate-800 shrink-0">
                    {link.platform}:
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-indigo-600 truncate flex items-center gap-1"
                  >
                    <span>{link.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(link.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {socialLinks.length === 0 && (
              <p className="text-[11px] text-slate-400 italic">
                No social links added yet. Click &quot;Add Link&quot; above to connect profiles.
              </p>
            )}

            {/* Add Social Link Form */}
            {showAddSocial && (
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Platform (e.g. LinkedIn, Instagram, TikTok)"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="url"
                    placeholder="Profile URL (e.g. https://...)"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSocial(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-100 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Save Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Changes Button & Logout Button */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out / Sign Out</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
