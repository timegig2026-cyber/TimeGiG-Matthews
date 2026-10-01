export type TabType = 'seekers' | 'gigs' | 'profile';

export type AdminTabType = 'overview' | 'verification' | 'tenant_pop' | 'user_pop';

export type SubscriptionType = 'tenant' | 'user';

export type EmptyStyle = 'minimalist' | 'blank';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface UserProfile {
  name: string;
  middleName?: string;
  surname: string;
  contactNumber: string;
  email: string;
  socialMediaLinks: SocialLink[];
  address: string;
  location: string;
  province: string;
  profilePicUrl?: string;
  lastProfilePicChangeDate?: string; // ISO string
  profilePicApprovalStatus?: 'approved' | 'pending' | 'rejected';
  idDocUrl?: string;
  idDocName?: string;
}

export interface VerificationSubmission {
  id: string;
  facePhotoUrl: string;
  facePhotoName: string;
  idDocUrl: string;
  idDocName: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface TenantPoPSubmission {
  id: string;
  amount: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  reference: string;
  popDocumentUrl: string;
  popDocumentName: string;
  popDocumentType: string;
  status: SubmissionStatus;
  submittedAt: string;
  estimatedReviewTime: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface ReferredUser {
  id: string;
  email: string;
  subscriptionType: SubscriptionType;
  joinedAt: string;
  status: SubmissionStatus;
  reviewedAt?: string;
  notes?: string;
}

export interface TabConfig {
  id: TabType;
  label: string;
  description: string;
}
