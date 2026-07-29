import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Feed } from './components/Feed';
import { StoriesBar } from './components/StoriesBar';
import { CreatePostModal } from './components/CreatePostModal';
import { Reels } from './components/Reels';
import { Chat } from './components/Chat';
import { CallModal } from './components/CallModal';
import { AIPanel } from './components/AIPanel';
import { AuthModal } from './components/AuthModal';
import { Profile } from './components/Profile';
import { Explore } from './components/Explore';
import { AdminPanel } from './components/AdminPanel';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { ApkConnectionModal } from './components/ApkConnectionModal';
import { PlayStoreConsoleHub } from './components/PlayStoreConsoleHub';
import { StoryModal } from './components/StoryModal';
import { User, Post, Story, Reel, NotificationItem } from './types';
import { SupportedLanguage } from './lib/i18n';
import { Heart, MessageSquare, UserPlus, Bell, X, Check, Send } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Global App Settings (i18n & Theme)
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [currentTimeZone, setCurrentTimeZone] = useState<string>('Asia/Kolkata');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isApkConnectionOpen, setIsApkConnectionOpen] = useState(false);
  const [isPlayStoreConsoleOpen, setIsPlayStoreConsoleOpen] = useState(false);
  const [activeStoryViewer, setActiveStoryViewer] = useState<Story | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [storyReplyText, setStoryReplyText] = useState('');
  const [storyReplySuccess, setStoryReplySuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Get current logged-in user or active session
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData.user) setCurrentUser(userData.user);

      // 2. Get Feed Posts
      const postsRes = await fetch('/api/posts');
      const postsData = await postsRes.json();
      setPosts(postsData.posts || []);

      // 3. Get Stories
      const storiesRes = await fetch('/api/stories');
      const storiesData = await storiesRes.json();
      setStories(storiesData.stories || []);

      // 4. Get Reels
      const reelsRes = await fetch('/api/reels');
      const reelsData = await reelsRes.json();
      setReels(reelsData.reels || []);

      // 5. Get Notifications
      const notifRes = await fetch('/api/notifications');
      const notifData = await notifRes.json();
      setNotifications(notifData.notifications || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  const handleGetAICommentSuggestions = async (postCaption: string): Promise<string[]> => {
    try {
      const res = await fetch('/api/ai/comment-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postCaption }),
      });
      const data = await res.json();
      return data.suggestions || [];
    } catch (err) {
      return ['Awesome update! 🔥', 'Clean design! 👏', 'Love ConnectX 🚀'];
    }
  };

  const handleCreatePostSubmit = async (postData: any) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (data.post) {
      setPosts((prev) => [data.post, ...prev]);
    }
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, isLiked: !r.isLiked, likesCount: r.likesCount + (r.isLiked ? -1 : 1) }
          : r
      )
    );
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  };

  const handleFollowUser = (userId: string) => {
    fetch(`/api/users/follow/${userId}`, { method: 'POST' });
  };

  const handleStoryReaction = async (storyId: string, reactionType: string) => {
    if (!activeStoryViewer) return;

    // Trigger floating emoji particle animation
    const emojiMap: Record<string, string> = { heart: '❤️', fire: '🔥', laugh: '😂', wow: '😮' };
    const emoji = emojiMap[reactionType] || '❤️';
    const newFloat = { id: Date.now() + Math.random(), emoji, x: Math.random() * 60 + 20 };
    setFloatingEmojis((prev) => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 1200);

    // Optimistic UI update
    const currentUserId = currentUser?.id || 'guest_user';
    const defaultReactions = [
      { type: 'heart', emoji: '❤️', count: 0, users: [] },
      { type: 'fire', emoji: '🔥', count: 0, users: [] },
      { type: 'laugh', emoji: '😂', count: 0, users: [] },
      { type: 'wow', emoji: '😮', count: 0, users: [] },
    ];
    const currentReactions = activeStoryViewer.reactions && activeStoryViewer.reactions.length > 0
      ? activeStoryViewer.reactions
      : defaultReactions;

    const updatedReactions = currentReactions.map((r) => {
      if (r.type === reactionType) {
        const users = r.users || [];
        const userHasReacted = users.includes(currentUserId);
        const newUsers = userHasReacted
          ? users.filter((u) => u !== currentUserId)
          : [...users, currentUserId];
        const newCount = userHasReacted ? Math.max(0, r.count - 1) : r.count + 1;
        return { ...r, count: newCount, users: newUsers };
      }
      return r;
    });

    const updatedStory = { ...activeStoryViewer, reactions: updatedReactions };
    setActiveStoryViewer(updatedStory);
    setStories((prev) => prev.map((s) => (s.id === storyId ? updatedStory : s)));

    try {
      const res = await fetch(`/api/stories/${storyId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType }),
      });
      const data = await res.json();
      if (data.reactions) {
        const syncedStory = { ...activeStoryViewer, reactions: data.reactions };
        setActiveStoryViewer(syncedStory);
        setStories((prev) => prev.map((s) => (s.id === storyId ? syncedStory : s)));
      }
    } catch (err) {
      console.error('Failed to send story reaction:', err);
    }
  };

  const handleSendStoryReply = async (storyId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const targetStory = stories.find((s) => s.id === storyId) || activeStoryViewer;
    if (!targetStory) return;

    const replyMsg = replyText.trim();
    const recipient = targetStory.user.username;

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `[Story Reply]: ${replyMsg}`,
          receiverId: targetStory.userId,
        }),
      });

      setStoryReplySuccess(`Message sent to @${recipient}`);
      setTimeout(() => {
        setStoryReplySuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to send story DM reply:', err);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAIPanel={() => setIsAIPanelOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onStartCall={() => setIsCallOpen(true)}
        onOpenApkConnection={() => setIsApkConnectionOpen(true)}
        onOpenPlayStoreConsole={() => setIsPlayStoreConsoleOpen(true)}
        unreadNotifications={notifications.filter((n) => !n.isRead).length}
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
        currentTimeZone={currentTimeZone}
        onTimeZoneChange={(tz) => setCurrentTimeZone(tz)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'feed' && (
          <div>
            <StoriesBar
              stories={stories}
              currentUser={currentUser}
              onOpenCreateStory={() => setIsCreatePostOpen(true)}
              onSelectStory={(story) => setActiveStoryViewer(story)}
            />
            <Feed
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onGetAICommentSuggestions={handleGetAICommentSuggestions}
              currentLang={currentLang}
            />
          </div>
        )}

        {activeTab === 'reels' && <Reels reels={reels} onLikeReel={handleLikeReel} />}

        {activeTab === 'chat' && <Chat currentUser={currentUser} onStartCall={() => setIsCallOpen(true)} />}

        {activeTab === 'explore' && <Explore posts={posts} onFollowUser={handleFollowUser} />}

        {activeTab === 'profile' && (
          <Profile
            currentUser={currentUser}
            posts={posts}
            onUpdateProfile={handleUpdateProfile}
            onLogout={() => setCurrentUser(null)}
          />
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="font-bold text-lg flex items-center space-x-2 text-white">
              <Bell size={20} className="text-indigo-400" />
              <span>Activity & Notifications</span>
            </h2>

            <div className="divide-y divide-white/10">
              {notifications.map((n) => (
                <div key={n.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={n.sender.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <p className="text-xs text-gray-200">
                        <span className="font-bold text-indigo-400">@{n.sender.username}</span> {n.message}
                      </p>
                      <span className="text-[10px] text-gray-500">Recently</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'architecture' && <ArchitectureDoc />}
      </main>

      {/* Story Full Screen Swipeable Modal with Progress Bars */}
      <StoryModal
        stories={stories}
        initialStoryIndex={activeStoryViewer ? Math.max(0, stories.findIndex((s) => s.id === activeStoryViewer.id)) : 0}
        isOpen={Boolean(activeStoryViewer)}
        onClose={() => setActiveStoryViewer(null)}
        currentUser={currentUser}
        onReaction={(storyId, type) => handleStoryReaction(storyId, type)}
        onSendReply={(storyId, text) => handleSendStoryReply(storyId, text)}
        replySuccessMsg={storyReplySuccess}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmitPost={handleCreatePostSubmit}
      />

      {/* Gemini AI Studio Drawer */}
      <AIPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />

      {/* Voice & Video Call Modal */}
      <CallModal isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} currentUser={currentUser} />

      {/* APK Connection Mode Settings Modal */}
      <ApkConnectionModal isOpen={isApkConnectionOpen} onClose={() => setIsApkConnectionOpen(false)} />

      {/* Play Store Release Console & Deployment Hub Modal */}
      <PlayStoreConsoleHub isOpen={isPlayStoreConsoleOpen} onClose={() => setIsPlayStoreConsoleOpen(false)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user, token) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
