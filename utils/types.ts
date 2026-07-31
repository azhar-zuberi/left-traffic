// Shapes for sample-data/*.json. No business logic here — just types so
// screens can consume the mocked JSON safely.

export type PostCategory =
  | 'upgrade'
  | 'flight'
  | 'inspection'
  | 'milestone'
  | 'overhaul'
  | 'flyout'
  | 'event'
  | 'trip';

export type AircraftStatus = 'flying' | 'grounded' | 'maintenance';

export type User = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  homeAirport: string;
  bio: string;
  joinedAt: string;
  followersCount: number;
  followingCount: number;
};

export type OwnershipRecord = {
  userId: string;
  startDate: string;
  endDate: string | null;
};

export type Aircraft = {
  id: string;
  registration: string;
  manufacturer: string;
  model: string;
  year: number;
  serialNumber: string;
  engine: string;
  horsepower: number;
  propeller: string;
  usefulLoad: number;
  cruiseSpeed: number;
  range: number;
  homeAirport: string;
  totalHours: number;
  status: AircraftStatus;
  heroPhotoUrl: string;
  photos: string[];
  currentOwnerId: string;
  ownershipHistory: OwnershipRecord[];
};

export type PostLocation = {
  airportCode: string;
  city: string;
  state: string;
};

export type Post = {
  id: string;
  aircraftId: string;
  authorId: string;
  category: PostCategory;
  title: string;
  body: string;
  location: PostLocation;
  createdAt: string;
  photoUrl: string;
  likeCount: number;
  commentCount: number;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  likeCount: number;
};

export type ActivityType = 'like' | 'comment' | 'follow';

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actorUserId: string;
  actorAircraftId: string | null;
  targetPostId: string | null;
  targetUserId: string | null;
  createdAt: string;
  read: boolean;
};

// The demo/current user for this no-backend prototype. Alex owns the two
// aircraft shown in My Hangar (N739JP, N2154U) in the look-and-feel reference.
export const CURRENT_USER_ID = 'u1';
