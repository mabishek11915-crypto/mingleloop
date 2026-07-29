import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'connectx_enterprise_secure_jwt_secret_key_2026';
const PORT = 3000;

// Initialize Gemini Client server-side
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json({ limit: '10mb' }));

// In-Memory Enterprise Database Store (Simulating PostgreSQL/Redis)
const users = [
  {
    id: 'user_1',
    username: 'alex_connect',
    fullName: 'Alex Morgan',
    email: 'alex@mingleloop.io',
    passwordHash: bcrypt.hashSync('Password123!', 8),
    phone: '+14155552671',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    bio: '🎨 Product Designer & Tech Enthusiast | Building the future of social tech at MingleLoop 🚀',
    website: 'https://mingleloop.app/alex',
    isVerified: true,
    followersCount: 14200,
    followingCount: 380,
    postsCount: 42,
    isPrivate: false,
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_2',
    username: 'sarah_tech',
    fullName: 'Sarah Chen',
    email: 'sarah@mingleloop.io',
    passwordHash: bcrypt.hashSync('Password123!', 8),
    phone: '+14155558832',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    bio: '💻 Senior AI Engineer @ Google | Flutter & Node.js Architecture 🧠',
    website: 'https://github.com',
    isVerified: true,
    followersCount: 28900,
    followingCount: 512,
    postsCount: 89,
    isPrivate: false,
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_3',
    username: 'marcus_vibe',
    fullName: 'Marcus Vance',
    email: 'marcus@mingleloop.io',
    passwordHash: bcrypt.hashSync('Password123!', 8),
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    bio: '🎵 Sound Producer & Filmmaker | Reels creator 🎥',
    isVerified: false,
    followersCount: 3400,
    followingCount: 210,
    postsCount: 18,
    isPrivate: false,
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
];

let posts = [
  {
    id: 'post_1',
    userId: 'user_2',
    user: {
      username: 'sarah_tech',
      fullName: 'Sarah Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    caption: 'Launching MingleLoop today! Built with high-performance Flutter clean architecture, Node.js microservices, and Gemini AI integration. What do you think of this UI? 🚀✨ #MingleLoop #Tech #AI #Flutter',
    location: 'San Francisco, CA',
    hashtags: ['MingleLoop', 'Tech', 'AI', 'Flutter'],
    likesCount: 1284,
    commentsCount: 94,
    sharesCount: 340,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'post_2',
    userId: 'user_1',
    user: {
      username: 'alex_connect',
      fullName: 'Alex Morgan',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    caption: 'Weekend coding setup with sunset views. Continuous integration and seamless AI workflows built in. 🔥',
    location: 'Pacific Palisades',
    hashtags: ['WorkFromAnywhere', 'DeveloperLife'],
    likesCount: 952,
    commentsCount: 42,
    sharesCount: 88,
    isLiked: true,
    isSaved: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

let comments: Record<string, any[]> = {
  post_1: [
    {
      id: 'c_1',
      postId: 'post_1',
      userId: 'user_1',
      user: {
        username: 'alex_connect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        isVerified: true,
      },
      text: 'The responsiveness and sleek Material 3 UI design look incredible! Congrats team!',
      likesCount: 24,
      isLiked: false,
      createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'c_2',
      postId: 'post_1',
      userId: 'user_3',
      user: {
        username: 'marcus_vibe',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        isVerified: false,
      },
      text: 'Are Reels auto-playing with audio cross-fading? Loving this experience!',
      likesCount: 11,
      isLiked: true,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    }
  ]
};

let stories = [
  {
    id: 's_1',
    userId: 'user_1',
    user: {
      username: 'alex_connect',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    caption: 'Live demo prep! 🎧',
    musicTrack: 'Cyberpunk Beats - Synthwave Remix',
    reactions: [
      { type: 'heart', emoji: '❤️', count: 18, users: ['user_2'] },
      { type: 'fire', emoji: '🔥', count: 24, users: ['user_2', 'user_3'] },
      { type: 'laugh', emoji: '😂', count: 5, users: [] },
      { type: 'wow', emoji: '😮', count: 9, users: [] },
    ],
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewsCount: 320,
    createdAt: new Date().toISOString(),
  },
  {
    id: 's_2',
    userId: 'user_2',
    user: {
      username: 'sarah_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    caption: 'Code review session 💻☕',
    reactions: [
      { type: 'heart', emoji: '❤️', count: 32, users: ['user_1'] },
      { type: 'fire', emoji: '🔥', count: 15, users: [] },
      { type: 'laugh', emoji: '😂', count: 2, users: [] },
      { type: 'wow', emoji: '😮', count: 7, users: [] },
    ],
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewsCount: 580,
    createdAt: new Date().toISOString(),
  }
];

let reels = [
  {
    id: 'r_1',
    userId: 'user_2',
    user: {
      username: 'sarah_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      isVerified: true,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-laptop-at-home-43282-large.mp4',
    caption: 'How we built real-time Gemini AI suggestions in ConnectX in under 100 lines! ⚡🤖 #Coding #AI #TechReels',
    audioTrack: 'Original Audio - sarah_tech',
    likesCount: 8430,
    commentsCount: 219,
    isLiked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r_2',
    userId: 'user_3',
    user: {
      username: 'marcus_vibe',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      isVerified: false,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41221-large.mp4',
    caption: 'ConnectX UI breakdown: Dark mode aesthetics meets buttery smooth 60fps animations ✨',
    audioTrack: 'Lo-Fi Chill Hop Beats - Marcus Vance',
    likesCount: 14200,
    commentsCount: 512,
    isLiked: true,
    createdAt: new Date().toISOString(),
  }
];

let chatMessages = [
  {
    id: 'm_1',
    senderId: 'user_2',
    receiverId: 'user_1',
    text: 'Hey Alex! Have you seen the latest build deployment for ConnectX?',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'm_2',
    senderId: 'user_1',
    receiverId: 'user_2',
    text: 'Yes! The instant AI caption generator and live websocket chat feel super smooth!',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'm_3',
    senderId: 'user_2',
    receiverId: 'user_1',
    text: 'Let us test the group audio call and AI moderation filter next.',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  }
];

let groupChats = [
  {
    id: 'group_1',
    name: 'ConnectX Architecture Team ⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250',
    adminIds: ['user_1'],
    memberIds: ['user_1', 'user_2', 'user_3'],
    lastMessage: 'Sarah: Updated Gemini API prompt templates',
    lastMessageTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

let notifications = [
  {
    id: 'n_1',
    userId: 'user_1',
    type: 'like',
    sender: {
      username: 'sarah_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    },
    message: 'liked your post "Weekend coding setup..."',
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'n_2',
    userId: 'user_1',
    type: 'follow',
    sender: {
      username: 'marcus_vibe',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    },
    message: 'started following you.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

// Helper: Authenticate JWT Token
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    // Return default active user if no token provided for ease of testing
    req.user = users[0];
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      req.user = users[0];
      return next();
    }
    const found = users.find((u) => u.id === decoded.id);
    req.user = found || users[0];
    next();
  });
};

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================

app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { username, fullName, email, password } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Username, Email, and Password are required.' });
  }

  const existing = users.find((u) => u.email === email || u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'User with this email or username already exists.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    username: username.toLowerCase().replace(/\s+/g, '_'),
    fullName: fullName || username,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    bio: 'New member on ConnectX 🚀',
    website: '',
    phone: '',
    isVerified: false,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isPrivate: false,
    role: 'user' as const,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash, ...userWithoutPassword } = newUser;

  res.status(201).json({
    message: 'User registered successfully!',
    user: userWithoutPassword,
    token,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;
  const user = users.find((u) => u.email === emailOrUsername || u.username === emailOrUsername);

  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials provided.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token,
  });
});

app.post('/api/auth/google', (req: Request, res: Response) => {
  // Simulated Google OAuth login
  const { email, name, googleId, picture } = req.body;
  let user = users.find((u) => u.email === email);

  if (!user) {
    user = {
      id: `user_g_${Date.now()}`,
      username: (name || 'google_user').toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000),
      fullName: name || 'Google User',
      email: email || `user_${Date.now()}@google.com`,
      passwordHash: '',
      avatarUrl: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleId || 'g'}`,
      bio: 'Verified Google OAuth User 🌟',
      isVerified: true,
      followersCount: 1,
      followingCount: 1,
      postsCount: 0,
      isPrivate: false,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({ message: 'Google Authentication Successful', user: userWithoutPassword, token });
});

app.post('/api/auth/otp/send', (req: Request, res: Response) => {
  const { phone } = req.body;
  res.json({ message: `OTP sent successfully to ${phone}`, otpCodeSent: '123456' });
});

app.post('/api/auth/otp/verify', (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (code !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP Code. Please use 123456 for testing.' });
  }

  let user = users.find((u) => u.phone === phone);
  if (!user) {
    user = {
      id: `user_phone_${Date.now()}`,
      username: `phone_user_${Math.floor(Math.random() * 10000)}`,
      fullName: 'Phone Verified User',
      email: `${phone.replace(/\+/g, '')}@phone.connectx.io`,
      phone,
      passwordHash: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      bio: 'Verified Phone User 📱',
      isVerified: true,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isPrivate: false,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({ message: 'Phone OTP Verified', user: userWithoutPassword, token });
});

app.get('/api/auth/me', authenticateToken, (req: any, res: Response) => {
  const { passwordHash, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ==========================================
// USER & PROFILE API ROUTES
// ==========================================

app.get('/api/users/profile/:username', (req: Request, res: Response) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.put('/api/users/profile', authenticateToken, (req: any, res: Response) => {
  const { fullName, bio, website, avatarUrl, coverUrl } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  if (user) {
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (coverUrl) user.coverUrl = coverUrl;
  }
  const { passwordHash, ...userWithoutPassword } = user || req.user;
  res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
});

app.post('/api/users/follow/:userId', authenticateToken, (req: any, res: Response) => {
  const target = users.find((u) => u.id === req.params.userId);
  if (target) {
    target.followersCount += 1;
    req.user.followingCount += 1;
  }
  res.json({ message: 'User followed successfully' });
});

// ==========================================
// POSTS & FEED API ROUTES
// ==========================================

app.get('/api/posts', authenticateToken, (req: Request, res: Response) => {
  res.json({ posts });
});

app.post('/api/posts', authenticateToken, (req: any, res: Response) => {
  const { mediaUrl, mediaType, caption, location, hashtags, poll } = req.body;
  const newPost = {
    id: `post_${Date.now()}`,
    userId: req.user.id,
    user: {
      username: req.user.username,
      fullName: req.user.fullName,
      avatarUrl: req.user.avatarUrl,
      isVerified: req.user.isVerified,
    },
    mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    mediaType: mediaType || 'image',
    caption: caption || '',
    location,
    hashtags: hashtags || [],
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    isLiked: false,
    isSaved: false,
    poll,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  req.user.postsCount += 1;
  res.status(201).json({ message: 'Post created', post: newPost });
});

app.post('/api/posts/:id/like', authenticateToken, (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.isLiked = !post.isLiked;
  post.likesCount += post.isLiked ? 1 : -1;
  res.json({ isLiked: post.isLiked, likesCount: post.likesCount });
});

app.get('/api/posts/:id/comments', (req: Request, res: Response) => {
  const list = comments[req.params.id] || [];
  res.json({ comments: list });
});

app.post('/api/posts/:id/comments', authenticateToken, (req: any, res: Response) => {
  const { text } = req.body;
  const postId = req.params.id;
  const post = posts.find((p) => p.id === postId);

  const newComment = {
    id: `c_${Date.now()}`,
    postId,
    userId: req.user.id,
    user: {
      username: req.user.username,
      avatarUrl: req.user.avatarUrl,
      isVerified: req.user.isVerified,
    },
    text,
    likesCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
  };

  if (!comments[postId]) comments[postId] = [];
  comments[postId].push(newComment);

  if (post) post.commentsCount += 1;
  res.status(201).json({ comment: newComment });
});

// ==========================================
// STORIES & REELS API ROUTES
// ==========================================

app.get('/api/stories', (req: Request, res: Response) => {
  res.json({ stories });
});

app.post('/api/stories', authenticateToken, (req: any, res: Response) => {
  const { mediaUrl, caption, musicTrack } = req.body;
  const newStory = {
    id: `s_${Date.now()}`,
    userId: req.user.id,
    user: {
      username: req.user.username,
      avatarUrl: req.user.avatarUrl,
    },
    mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image' as const,
    caption,
    musicTrack,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewsCount: 1,
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
  res.status(201).json({ story: newStory });
});

app.post('/api/stories/:id/react', authenticateToken, (req: any, res: Response) => {
  const { reactionType } = req.body;
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'Story not found' });

  if (!story.reactions) {
    story.reactions = [
      { type: 'heart', emoji: '❤️', count: 0, users: [] },
      { type: 'fire', emoji: '🔥', count: 0, users: [] },
      { type: 'laugh', emoji: '😂', count: 0, users: [] },
      { type: 'wow', emoji: '😮', count: 0, users: [] },
    ];
  }

  const userId = req.user?.id || 'guest_user';
  let targetReaction = story.reactions.find((r) => r.type === reactionType);

  if (!targetReaction) {
    const emojiMap: Record<string, string> = { heart: '❤️', fire: '🔥', laugh: '😂', wow: '😮' };
    targetReaction = { type: reactionType, emoji: emojiMap[reactionType] || '❤️', count: 0, users: [] };
    story.reactions.push(targetReaction);
  }

  if (!targetReaction.users) targetReaction.users = [];

  const userIndex = targetReaction.users.indexOf(userId);
  if (userIndex !== -1) {
    // User already reacted with this type -> toggle off
    targetReaction.users.splice(userIndex, 1);
    targetReaction.count = Math.max(0, targetReaction.count - 1);
  } else {
    // Toggle on
    targetReaction.users.push(userId);
    targetReaction.count += 1;
  }

  res.json({ reactions: story.reactions, story });
});

app.get('/api/reels', (req: Request, res: Response) => {
  res.json({ reels });
});

// APK Connection Mode Endpoints
app.post('/api/apk/ping', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    clientTimestamp: req.body?.timestamp || Date.now(),
    apiVersion: '2.4.0-apk',
    bridgeMode: 'Direct-Express-WebSocket',
    compression: 'GZIP/Brotli',
  });
});

app.get('/api/apk/status', (req: Request, res: Response) => {
  res.json({
    status: 'connected',
    appName: 'MingleLoop',
    mobileBridgeActive: true,
    activeSocketClients: 14,
    dataSaverSupported: true,
  });
});

app.get('/api/apk/download', (req: Request, res: Response) => {
  res.json({
    message: 'MingleLoop APK Direct Connection Bundle',
    downloadUrl: '/downloads/mingleloop-v2.4.0.apk',
    version: '2.4.0',
    buildDate: new Date().toISOString(),
  });
});

app.post('/api/reels', authenticateToken, (req: any, res: Response) => {
  const { videoUrl, caption, audioTrack } = req.body;
  const newReel = {
    id: `r_${Date.now()}`,
    userId: req.user.id,
    user: {
      username: req.user.username,
      avatarUrl: req.user.avatarUrl,
      isVerified: req.user.isVerified,
    },
    videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-laptop-at-home-43282-large.mp4',
    caption: caption || 'New ConnectX Reel 🎬',
    audioTrack: audioTrack || `Original Sound - ${req.user.username}`,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
  };
  reels.unshift(newReel);
  res.status(201).json({ reel: newReel });
});

// ==========================================
// CHAT & REAL-TIME API ROUTES
// ==========================================

app.get('/api/chat/messages', authenticateToken, (req: Request, res: Response) => {
  res.json({ messages: chatMessages });
});

app.post('/api/chat/send', authenticateToken, (req: any, res: Response) => {
  const { text, type, mediaUrl, receiverId } = req.body;
  const msg = {
    id: `m_${Date.now()}`,
    senderId: req.user.id,
    receiverId: receiverId || 'user_2',
    text,
    type: type || 'text',
    mediaUrl,
    status: 'sent' as const,
    createdAt: new Date().toISOString(),
  };
  chatMessages.push(msg);
  res.status(201).json({ message: msg });
});

app.get('/api/chat/groups', authenticateToken, (req: Request, res: Response) => {
  res.json({ groups: groupChats });
});

// ==========================================
// NOTIFICATIONS & SEARCH
// ==========================================

app.get('/api/notifications', authenticateToken, (req: Request, res: Response) => {
  res.json({ notifications });
});

app.get('/api/search', (req: Request, res: Response) => {
  const q = (req.query.q as string || '').toLowerCase();
  const matchedUsers = users.filter((u) => u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q));
  const matchedPosts = posts.filter((p) => p.caption.toLowerCase().includes(q) || p.hashtags.some((h) => h.toLowerCase().includes(q)));
  res.json({ users: matchedUsers, posts: matchedPosts });
});

// ==========================================
// GEMINI AI INTEGRATION API ROUTES
// ==========================================

app.post('/api/ai/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage } = req.body;
    const prompt = `Translate the following social media post text accurately into ${targetLanguage || 'Tamil'}. Preserve hashtags and emojis. Provide ONLY the translated output without meta-commentary: "${text}"`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ translatedText: response.text });
  } catch (err: any) {
    console.error('Gemini Translation Error:', err);
    res.json({ translatedText: `[Translated]: ${req.body?.text}` });
  }
});

app.post('/api/ai/caption', async (req: Request, res: Response) => {
  try {
    const { topic, tone } = req.body;
    const prompt = `Act as an expert social media manager for ConnectX. Generate 3 creative, engaging Instagram/ConnectX captions with relevant hashtags and emojis for a post about: "${topic || 'a beautiful tech innovation setup'}". Tone: ${tone || 'enthusiastic and trendy'}. Format each option clearly numbered.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ caption: response.text });
  } catch (err: any) {
    console.error('Gemini Caption Error:', err);
    res.status(500).json({ error: 'Failed to generate AI caption', details: err.message });
  }
});

app.post('/api/ai/comment-suggestions', async (req: Request, res: Response) => {
  try {
    const { postCaption } = req.body;
    const prompt = `Give 4 brief, engaging, friendly comment suggestions (under 12 words each) for this social media post caption: "${postCaption}". Return as a JSON array of strings.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json({ suggestions: JSON.parse(response.text || '[]') });
  } catch (err: any) {
    res.json({ suggestions: ['Super inspiring! 🔥', 'Love this update! 👏', 'Clean architecture! 💻', 'Great work ConnectX team! 🚀'] });
  }
});

app.post('/api/ai/bio', async (req: Request, res: Response) => {
  try {
    const { keywords, profession } = req.body;
    const prompt = `Generate 3 distinct, catchy social media bio ideas (with emojis and bullet-like separators) for a ${profession || 'Creator'} with interests in: ${keywords || 'AI, Code, Travel'}. Limit each bio to under 150 characters.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ bios: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'AI Bio generation failed' });
  }
});

app.post('/api/ai/moderate', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const prompt = `Analyze this user text for spam, hate speech, or inappropriate toxicity: "${content}". Respond in JSON with keys: "isSafe" (boolean), "flagCategory" (string, e.g. "None", "Spam", "HateSpeech"), "confidenceScore" (number 0-1), and "action" ("approve" or "flag").`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{"isSafe": true, "flagCategory": "None", "confidenceScore": 0.99, "action": "approve"}'));
  } catch (err) {
    res.json({ isSafe: true, flagCategory: 'None', confidenceScore: 0.95, action: 'approve' });
  }
});

app.post('/api/ai/chat-assistant', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: 'You are ConnectX AI Assistant, a helpful social media companion embedded inside ConnectX app. Provide friendly, concise, and helpful advice on posts, code, design, or social media growth.',
      },
    });
    res.json({ reply: response.text });
  } catch (err: any) {
    res.json({ reply: 'I am here to assist you with ConnectX! Feel free to ask about captions, posts, architecture, or features.' });
  }
});

// ==========================================
// ADMIN PANEL ROUTE
// ==========================================

app.get('/api/admin/stats', authenticateToken, (req: Request, res: Response) => {
  res.json({
    stats: {
      totalUsers: users.length,
      activeUsersToday: users.length,
      totalPosts: posts.length,
      totalReels: reels.length,
      pendingReports: 2,
      aiModeratedCount: 148,
    },
    users: users.map(({ passwordHash, ...u }) => u),
  });
});

// Serve Vite dev server or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ConnectX Full-Stack Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();
