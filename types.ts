export interface User {
  id: string;
  name: string;
  displayName: string;
  city: string;
  profilePhotoUrl: string;
  vettingStatus: 'Verified' | 'Pending' | 'Not Verified';
  email: string;
  mobileNumber: string;
  contactPreference: 'email' | 'mobile' | 'both' | 'none';
  memberVettedPhotoUrl?: string;
  role: 'Admin' | 'Moderator' | 'User';
  status: 'Active' | 'Paused' | 'Blocked' | 'Archived';
  joinDate: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  age: number;
  photoUrls: string[];
  description: string;
  keywords: string[];
  status: 'Safe' | 'Lost' | 'Reunited' | 'Review' | 'Archived';
  roamingArea?: string;
  roamingAreaLat?: number;
  roamingAreaLng?: number;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  lastSeenLat?: number;
  lastSeenLng?: number;
  missingReportMessage?: string;
}

export interface Alert {
  id: string;
  pet: Pet;
  message: string;
}

export interface FoundPetStory {
  id: string;
  pet: Pet;
  reunionDate: string;
  ownerTestimonial: string;
  ownerRating: number;
  finderName?: string;
  finderTestimonial?: string;
  // FIX: Added optional finderTestimonialStatus to track the state of the finder's story submission.
  finderTestimonialStatus?: 'NotSubmitted' | 'AwaitingModeration' | 'Approved';
  finderUniqueToken?: string;
  likes: number;
  commentIds: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id:string;
  participantIds: string[];
}

export interface Notification {
  id: string;
  type: 'chat' | 'alert';
  title: string;
  message: string;
  link: string; // The path to navigate to, e.g., /chat/chat-1 or /pet/pet-3
  imageUrl?: string; // Profile photo for chat, pet photo for alert
}

export interface HealthRecord {
  id: string;
  petId: string;
  type: 'Vaccination' | 'Vet Visit' | 'Medication' | 'Allergy' | 'Other';
  date: string; // YYYY-MM-DD
  notes: string;
  vetName?: string;
}

export interface Comment {
  id: string;
  storyId: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  // Admin post fields
  isAdminPost?: boolean;
  category?: 'Important Message' | 'Announcement';
  status?: 'Active' | 'Archived';
  startDate?: string; // ISO Date string
  endDate?: string; // ISO Date string
}

export interface PinnedItem {
  itemId: string;
  itemType: 'alert' | 'story' | 'post';
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
}

export interface Advertiser {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  taxId?: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
  website?: string;
  notes?: string;
}

export type AdFormat = 'full' | 'half' | 'banner' | 'strip';
export type AdDisplayPage = 'Feed' | 'Alerts' | 'Found';

export interface Advert {
  id: string;
  advertiserId: string;
  name: string;
  description?: string;
  category: string;
  geolocation?: string;
  imageUrl: string; // base64 data URL
  url: string;
  startDate: string;
  endDate: string;
  frequency: string; // e.g. "1/hour", "5/day"
  budget: number;
  displayPages: AdDisplayPage[];
  format: AdFormat;
  status: 'Active' | 'Paused' | 'Archived' | 'Under Review';
}

export interface Policy {
  id: 'privacy-policy' | 'community-guidelines';
  title: string;
  content: string;
  status: 'Active' | 'Archived';
  lastUpdated: string;
}

export interface SiteSettings {
  appName: string;
  contactEmail: string;
  contactAddress: string;
  maintenanceMode: boolean;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface AppSettings {
  general: SiteSettings;
  userPetManagement: {
    defaultUserRole: User['role'];
    alertDurationDays: number;
  };
  contentModeration: {
    requireStoryApproval: boolean;
    profanityList: string[];
  };
}