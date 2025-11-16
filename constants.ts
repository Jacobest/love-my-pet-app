import { User, Pet, FoundPetStory, ChatMessage, ChatThread, Comment, Post, Advertiser, Advert, Policy, AppSettings } from './types';

// FIX: Expanded MOCK_USERS to include all required fields as per the User type, resolving a TypeScript error.
const MOCK_USERS_DATA: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    displayName: 'Alex D.',
    city: 'San Francisco, CA',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    vettingStatus: 'Verified',
    email: 'alex.doe@example.com',
    mobileNumber: '555-0101',
    contactPreference: 'email',
    role: 'Admin',
    status: 'Active',
    joinDate: '2023-01-15T10:00:00Z',
    memberVettedPhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    displayName: 'Jane S.',
    city: 'New York, NY',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b2912a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    vettingStatus: 'Verified',
    email: 'jane.smith@example.com',
    mobileNumber: '555-0102',
    contactPreference: 'mobile',
    role: 'User',
    status: 'Active',
    joinDate: '2023-02-20T11:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Sam Wilson',
    displayName: 'Sam W.',
    city: 'Chicago, IL',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    vettingStatus: 'Pending',
    email: 'sam.wilson@example.com',
    mobileNumber: '555-0103',
    contactPreference: 'both',
    role: 'User',
    status: 'Active',
    joinDate: '2023-03-10T09:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Maria Garcia',
    displayName: 'Maria G.',
    city: 'Miami, FL',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80',
    vettingStatus: 'Not Verified',
    email: 'maria.garcia@example.com',
    mobileNumber: '555-0104',
    contactPreference: 'none',
    role: 'User',
    status: 'Blocked',
    joinDate: '2023-04-05T14:00:00Z',
  },
];

export const MOCK_USERS = MOCK_USERS_DATA;
// FIX: Added MOCK_USER export for the demo login functionality.
export const MOCK_USER = MOCK_USERS_DATA[0];

// FIX: Added MOCK_PETS export.
export const MOCK_PETS: Pet[] = [
    {
        id: 'pet-1',
        ownerId: 'user-1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        color: 'Golden',
        age: 5,
        photoUrls: ['https://images.unsplash.com/photo-1568572933382-74d440642117?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80'],
        description: 'A very good boy who loves to play fetch and swim.',
        keywords: ['friendly', 'energetic', 'golden retriever', 'large'],
        status: 'Safe',
        roamingArea: 'Golden Gate Park',
    },
    {
        id: 'pet-2',
        ownerId: 'user-2',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Siamese',
        color: 'Cream with dark points',
        age: 3,
        photoUrls: ['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'],
        description: 'A curious and vocal cat. Loves sunbathing and high places.',
        keywords: ['siamese', 'vocal', 'curious', 'cat'],
        status: 'Lost',
        lastSeenLocation: 'Near Times Square',
        lastSeenTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        missingReportMessage: 'Whiskers slipped out the door last night. He is very friendly but might be scared. Please call if you see him!',
    },
    {
        id: 'pet-3',
        ownerId: 'user-1',
        name: 'Rocky',
        species: 'Dog',
        breed: 'French Bulldog',
        color: 'Fawn',
        age: 2,
        photoUrls: ['https://images.unsplash.com/photo-1598875706250-21fa76815753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'],
        description: 'A playful and sometimes stubborn bulldog. Loves everyone he meets.',
        keywords: ['french bulldog', 'playful', 'small dog', 'fawn'],
        status: 'Reunited',
    },
    {
        id: 'pet-4',
        ownerId: 'user-2',
        name: 'Gizmo',
        species: 'Cat',
        breed: 'Domestic Shorthair',
        color: 'Tuxedo',
        age: 4,
        photoUrls: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80'],
        description: 'A shy but sweet tuxedo cat. Loves naps in sunny spots.',
        keywords: ['tuxedo', 'cat', 'shy', 'black and white'],
        status: 'Review',
        lastSeenLocation: 'Brooklyn Bridge Park',
        lastSeenTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
];

// FIX: Added MOCK_CHAT_THREADS export.
export const MOCK_CHAT_THREADS: ChatThread[] = [
    { id: 'chat-1', participantIds: ['user-1', 'user-2'] },
];

// FIX: Added MOCK_CHAT_MESSAGES export.
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg-1', chatId: 'chat-1', senderId: 'user-2', text: 'Hi Alex, I think I might have seen Whiskers near my apartment building.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'msg-2', chatId: 'chat-1', senderId: 'user-1', text: 'Oh my gosh, really? Where is that?', timestamp: new Date(Date.now() - 3540000).toISOString() },
];

// FIX: Added MOCK_FOUND_PETS export.
export const MOCK_FOUND_PETS: FoundPetStory[] = [
    {
        id: 'story-1',
        pet: MOCK_PETS[2],
        reunionDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        ownerTestimonial: 'I was devastated when Rocky went missing. This app connected me with the person who found him in just a few hours. I am so incredibly grateful for this community!',
        ownerRating: 5,
        finderName: 'A Kind Stranger',
        finderTestimonial: 'I saw Rocky wandering near the park and recognized him from an alert on the app. It felt amazing to help him get back home safely.',
        finderTestimonialStatus: 'Approved',
        likes: 128,
        commentIds: ['comment-1', 'comment-2'],
    },
    {
        id: 'story-2',
        pet: MOCK_PETS[3],
        reunionDate: new Date().toISOString(),
        ownerTestimonial: "I'm overjoyed to have Gizmo back! He was found just a few blocks from home. This app is a lifesaver.",
        ownerRating: 5,
        finderTestimonialStatus: 'NotSubmitted',
        finderUniqueToken: 'token_gizmo_12345',
        likes: 0,
        commentIds: [],
    }
];

// FIX: Added MOCK_COMMENTS export.
export const MOCK_COMMENTS: Comment[] = [
    { id: 'comment-1', storyId: 'story-1', authorId: 'user-1', text: 'This is such a wonderful story! So glad Rocky is home!', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'comment-2', storyId: 'story-1', authorId: 'user-2', text: 'Yay Rocky! ❤️', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
];

// FIX: Added MOCK_POSTS export.
export const MOCK_POSTS: Post[] = [
    {
        id: 'post-admin-1',
        authorId: 'user-1', // Admin user
        text: 'Welcome to the new and improved LoveMyPet community feed! We\'re excited to share updates and news with you here.',
        imageUrl: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
        timestamp: new Date().toISOString(),
        likes: 150,
        isAdminPost: true,
        category: 'Announcement',
        status: 'Active',
        startDate: new Date(Date.now() - 86400000 * 7).toISOString(), // a week ago
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(), // a month from now
    },
    {
        id: 'post-admin-2',
        authorId: 'user-1', // Admin user
        text: 'There will be a scheduled maintenance on Sunday from 2 AM to 4 AM. The app might be temporarily unavailable.',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
        likes: 35,
        isAdminPost: true,
        category: 'Important Message',
        status: 'Active',
        startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    },
    {
        id: 'post-1',
        authorId: 'user-2',
        text: 'Just adopted this little guy! Everyone, meet Leo. He\'s a bit shy but so sweet. Any tips for a first-time cat owner?',
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69841006?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        likes: 42,
    },
    {
        id: 'post-2',
        authorId: 'user-1',
        text: 'Buddy had the best day at the beach today!',
        imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        likes: 77,
    },
];

// FIX: Added MOCK_ADVERTISERS export.
export const MOCK_ADVERTISERS: Advertiser[] = [
    {
        id: 'adv-1',
        companyName: 'Premium Pet Foods',
        contactPerson: 'John Chewy',
        email: 'john@premiumpet.com',
        phone: '555-0201',
        billingAddress: '123 Kibble Way, Foodville, USA',
        createdAt: new Date().toISOString(),
        status: 'Active',
    }
];

// FIX: Added MOCK_ADVERTS export.
export const MOCK_ADVERTS: Advert[] = [
    {
        id: 'ad-1',
        advertiserId: 'adv-1',
        name: 'Spring Sale 2024',
        category: 'Pet Food',
        imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // placeholder
        url: 'https://example.com',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        frequency: '10/day',
        budget: 5000,
        displayPages: ['Feed', 'Found'],
        format: 'full',
        status: 'Active',
    }
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    status: 'Active',
    lastUpdated: new Date(Date.now() - 86400000 * 10).toISOString(),
    content: `Welcome to LoveMyPet. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. This policy applies to all information collected through our application and/or any related services, sales, marketing, or events.

## 1. What Information Do We Collect?

We collect personal information that you voluntarily provide to us when you register on the app, express an interest in obtaining information about us or our products and services, when you participate in activities on the app, or otherwise when you contact us.

### Personal Information Provided by You:
- **Identity Data:** Full name, display name, and city.
- **Contact Data:** Email address and mobile number.
- **Profile Data:** Profile photo, pet details (name, breed, photos, etc.), and vetting verification photos.
- **Communications:** Information you provide when you contact us.

## 2. How Do We Use Your Information?

We use personal information collected via our app for a variety of business purposes described below.

- **To provide and manage your account:** To create and secure your account with us.
- **To facilitate our services:** To display your pet's profile, post alerts for missing pets, and connect you with other users who may have found your pet.
- **To protect our community:** To verify user identities (vetting) to maintain a safe environment.
- **To communicate with you:** To send you service-related notifications or respond to your inquiries.

## 3. Will Your Information Be Shared With Anyone?

We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.

- **With Other Users:** When you report a pet as lost, your display name and pet's details become visible. If a finder initiates contact, we will share your preferred contact details with them securely.
- **Compliance with Laws:** We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, or legal process.

## 4. How Long Do We Keep Your Information?

We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.

## 5. Contact Us

If you have questions or comments about this policy, you may email us at privacy@lovemypet.com.`
  },
  {
    id: 'community-guidelines',
    title: 'Community Guidelines',
    status: 'Active',
    lastUpdated: new Date(Date.now() - 86400000 * 15).toISOString(),
    content: `Welcome to LoveMyPet! To ensure a safe, supportive, and positive environment for everyone, we ask that you follow these guidelines.

### Be Kind and Respectful
Treat all members of the LoveMyPet community with kindness and respect. We do not tolerate harassment, bullying, hate speech, or any form of discrimination. We are all here to support each other as fellow pet lovers.

### Prioritize Pet Welfare
The safety and well-being of pets are our top priorities. Do not post or share content that depicts or encourages animal cruelty. When sharing information about lost or found pets, ensure it is accurate and helpful. If you suspect an animal is in immediate danger, contact your local animal control authorities.

### Be Honest and Authentic
Represent yourself and your pets truthfully. Do not create fake profiles, impersonate others, or spread misinformation. Authenticity builds trust, which is essential for a strong and effective community network.

### Keep Our Community Safe
Protect your personal information. Be cautious when arranging to meet someone in person. We recommend meeting in a public place. Report any suspicious activity, scams, or inappropriate behavior to our moderation team immediately.

### Report Violations
If you see something that violates our guidelines, please report it. Your reports are confidential and help us maintain a safe and supportive environment for everyone. Use the reporting tools within the app or contact our support team.

Violations of these guidelines may result in content removal, temporary suspension, or permanent account deletion. Thank you for helping us build a wonderful community where pets and their people can thrive.`
  }
];


export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    appName: "LoveMyPet",
    contactEmail: "support@lovemypet.com",
    contactAddress: "123 Paw Print Lane, San Francisco, CA 94105, United States",
    maintenanceMode: false,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    }
  },
  userPetManagement: {
    defaultUserRole: "User",
    alertDurationDays: 30,
  },
  contentModeration: {
    requireStoryApproval: true,
    profanityList: ["badword", "curse", "swearword"],
  }
};