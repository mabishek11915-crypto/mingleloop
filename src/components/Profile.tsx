import React, { useState } from 'react';
import { Settings, Edit2, Grid, Bookmark, Film, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { User, Post } from '../types';

interface ProfileProps {
  currentUser: User | null;
  posts: Post[];
  onUpdateProfile: (updated: Partial<User>) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  currentUser,
  posts,
  onUpdateProfile,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reels'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [website, setWebsite] = useState(currentUser?.website || '');

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ fullName, bio, website });
    setIsEditing(false);
  };

  const userPosts = posts.filter((p) => p.userId === currentUser.id || p.user.username === currentUser.username);

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white pb-16">
      {/* Cover & Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative">
        {/* Cover Photo */}
        <div className="h-44 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative">
          {currentUser.coverUrl && (
            <img src={currentUser.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Avatar & Main Info Bar */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-12 mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-end space-x-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-900 shadow-2xl bg-slate-800"
              />
              <div className="mb-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold">{currentUser.fullName}</h1>
                  {currentUser.isVerified && (
                    <CheckCircle2 size={18} className="text-purple-400 fill-purple-400/20" />
                  )}
                </div>
                <p className="text-xs text-purple-300 font-medium">@{currentUser.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                <Edit2 size={14} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold border border-red-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Bio & Link */}
          <div className="space-y-2 mt-2">
            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">{currentUser.bio}</p>
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-purple-400 hover:underline font-medium"
              >
                <LinkIcon size={12} />
                <span>{currentUser.website}</span>
              </a>
            )}
          </div>

          {/* Social Stats Row */}
          <div className="flex items-center space-x-8 mt-6 pt-4 border-t border-slate-800/80 text-center">
            <div>
              <span className="font-extrabold text-lg block">{userPosts.length}</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Posts</span>
            </div>
            <div>
              <span className="font-extrabold text-lg block">{currentUser.followersCount.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Followers</span>
            </div>
            <div>
              <span className="font-extrabold text-lg block">{currentUser.followingCount.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Tabs */}
      <div className="flex justify-center border-b border-slate-800 space-x-8 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center space-x-2 py-3 border-b-2 transition-all ${
            activeTab === 'posts' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Grid size={16} />
          <span>Posts Grid</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center space-x-2 py-3 border-b-2 transition-all ${
            activeTab === 'reels' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Film size={16} />
          <span>Reels</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 py-3 border-b-2 transition-all ${
            activeTab === 'saved' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Bookmark size={16} />
          <span>Saved</span>
        </button>
      </div>

      {/* Posts Media Grid */}
      <div className="grid grid-cols-3 gap-2">
        {userPosts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-slate-800 rounded-2xl overflow-hidden group">
            <img src={post.mediaUrl} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 text-xs font-bold">
              <span>❤️ {post.likesCount}</span>
              <span>💬 {post.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <h2 className="font-bold text-lg">Edit Profile Details</h2>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
