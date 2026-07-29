export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  coverUrl?: string;
  bio: string;
  website?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  user: {
    username: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  text: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string | null;
  replies?: PostComment[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: {
    username: string;
    fullName: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  carouselUrls?: string[];
  caption: string;
  location?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    userVotedIndex?: number;
  };
  createdAt: string;
}

export interface StoryReaction {
  type: 'heart' | 'fire' | 'laugh' | 'wow' | string;
  emoji: string;
  count: number;
  users?: string[];
}

export interface Story {
  id: string;
  userId: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  musicTrack?: string;
  poll?: {
    question: string;
    options: string[];
    votes: number[];
  };
  reactions?: StoryReaction[];
  expiresAt: string;
  viewsCount: number;
  createdAt: string;
}

export interface Reel {
  id: string;
  userId: string;
  user: {
    username: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  videoUrl: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  text: string;
  type: 'text' | 'image' | 'voice' | 'video' | 'document';
  mediaUrl?: string;
  status: 'sent' | 'delivered' | 'seen';
  replyToId?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  createdAt: string;
}

export interface GroupChat {
  id: string;
  name: string;
  avatarUrl: string;
  adminIds: string[];
  memberIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'call' | 'story';
  sender: {
    username: string;
    avatarUrl: string;
  };
  message: string;
  isRead: boolean;
  targetId?: string;
  createdAt: string;
}

export interface CallSession {
  id: string;
  caller: User;
  receiver: User;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'declined';
  startTime?: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsersToday: number;
  totalPosts: number;
  totalReels: number;
  pendingReports: number;
  aiModeratedCount: number;
}
