import React, { useState } from 'react';
import { Search, TrendingUp, Sparkles, UserPlus, CheckCircle2 } from 'lucide-react';
import { Post, User } from '../types';

interface ExploreProps {
  posts: Post[];
  onFollowUser: (userId: string) => void;
}

export const Explore: React.FC<ExploreProps> = ({ posts, onFollowUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ users: User[]; posts: Post[] }>({
    users: [],
    posts: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const trendingHashtags = [
    { tag: 'ConnectX', postsCount: '142K' },
    { tag: 'AI_Architecture', postsCount: '89K' },
    { tag: 'FlutterDev', postsCount: '64K' },
    { tag: 'Gemini3_6', postsCount: '210K' },
    { tag: 'NodeJS', postsCount: '52K' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white pb-16">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search users, hashtags, posts, reels..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-2xl text-sm outline-none shadow-xl transition-all"
        />
      </div>

      {isSearching ? (
        /* Search Results Display */
        <div className="space-y-6">
          {searchResults.users.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="font-bold text-sm text-slate-300">Users Found</h3>
              <div className="divide-y divide-slate-800">
                {searchResults.users.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={u.avatarUrl} alt={u.username} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-sm">{u.fullName}</span>
                          {u.isVerified && <CheckCircle2 size={14} className="text-purple-400" />}
                        </div>
                        <span className="text-xs text-purple-300">@{u.username}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onFollowUser(u.id)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Found Grid */}
          <div className="grid grid-cols-3 gap-2">
            {searchResults.posts.map((p) => (
              <div key={p.id} className="aspect-square bg-slate-800 rounded-2xl overflow-hidden">
                <img src={p.mediaUrl} alt="Result" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default Explore Feed & Trending Topics */
        <div className="space-y-6">
          {/* Trending Hashtags Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-sm text-slate-300 mb-4 flex items-center space-x-2">
              <TrendingUp size={18} className="text-purple-400" />
              <span>Trending Topics on ConnectX</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {trendingHashtags.map((h, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearch(h.tag)}
                  className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 cursor-pointer hover:border-purple-500/50 transition-all"
                >
                  <span className="font-bold text-xs text-purple-300 block">#{h.tag}</span>
                  <span className="text-[10px] text-slate-400">{h.postsCount} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explore Masonry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square bg-slate-800 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img src={post.mediaUrl} alt="Explore" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-xs font-bold">
                  <span>@{post.user.username}</span>
                  <p className="text-[10px] font-normal line-clamp-1 opacity-80">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
