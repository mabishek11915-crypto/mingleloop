import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Sparkles, 
  MapPin, 
  Send,
  CheckCircle2,
  Globe,
  Languages
} from 'lucide-react';
import { Post, PostComment, User } from '../types';
import { LANGUAGES, SupportedLanguage } from '../lib/i18n';

interface FeedProps {
  posts: Post[];
  currentUser: User | null;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => Promise<void>;
  onGetAICommentSuggestions: (postCaption: string) => Promise<string[]>;
  currentLang?: SupportedLanguage;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  currentUser,
  onLikePost,
  onAddComment,
  onGetAICommentSuggestions,
  currentLang = 'en',
}) => {
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [commentsList, setCommentsList] = useState<PostComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [translationsMap, setTranslationsMap] = useState<Record<string, string>>({});
  const [translatingMap, setTranslatingMap] = useState<Record<string, boolean>>({});

  const handleTranslatePost = async (postId: string, text: string) => {
    if (translationsMap[postId]) {
      // Toggle off if already translated
      const updated = { ...translationsMap };
      delete updated[postId];
      setTranslationsMap(updated);
      return;
    }

    setTranslatingMap((prev) => ({ ...prev, [postId]: true }));
    try {
      const targetLangName = LANGUAGES.find((l) => l.code === currentLang)?.name || 'Tamil';
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: targetLangName }),
      });
      const data = await res.json();
      setTranslationsMap((prev) => ({ ...prev, [postId]: data.translatedText || text }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslatingMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleOpenComments = async (postId: string, caption: string) => {
    setSelectedPostComments(postId);
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setCommentsList(data.comments || []);

      const suggestions = await onGetAICommentSuggestions(caption);
      setAiSuggestions(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handlePostCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostComments || !commentInput.trim()) return;
    await onAddComment(selectedPostComments, commentInput);
    setCommentsList((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        postId: selectedPostComments,
        userId: currentUser?.id || 'anon',
        user: {
          username: currentUser?.username || 'you',
          avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          isVerified: currentUser?.isVerified || false,
        },
        text: commentInput,
        likesCount: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentInput('');
  };

  const handleVotePoll = (postId: string, optionIdx: number) => {
    setPollVotes((prev) => ({ ...prev, [postId]: optionIdx }));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-gray-100 transition-all duration-200 hover:border-white/20"
        >
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatarUrl}
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-sm hover:underline cursor-pointer text-white">
                    {post.user.username}
                  </span>
                  {post.user.isVerified && (
                    <CheckCircle2 size={14} className="text-indigo-400 fill-indigo-400/20" />
                  )}
                </div>
                {post.location && (
                  <p className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
                    <MapPin size={10} className="text-indigo-400" />
                    <span>{post.location}</span>
                  </p>
                )}
              </div>
            </div>
            <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Media View */}
          <div className="relative bg-[#050505] group overflow-hidden max-h-[550px] flex items-center justify-center">
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full h-auto object-cover max-h-[550px] transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          {/* Post Actions Bar */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center space-x-1.5 text-sm font-semibold transition-all ${
                    post.isLiked ? 'text-pink-500 scale-110' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart size={22} className={post.isLiked ? 'fill-pink-500' : ''} />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() => handleOpenComments(post.id, post.caption)}
                  className="flex items-center space-x-1.5 text-gray-300 hover:text-white text-sm font-semibold transition-all"
                >
                  <MessageCircle size={22} />
                  <span>{post.commentsCount}</span>
                </button>

                <button className="text-gray-300 hover:text-white transition-all">
                  <Share2 size={22} />
                </button>
              </div>

              <button className="text-gray-300 hover:text-white transition-all">
                <Bookmark size={22} />
              </button>
            </div>

            {/* Poll Component (if present) */}
            {post.poll && (
              <div className="mt-3 p-3.5 bg-white/[0.04] rounded-xl border border-white/10 space-y-2">
                <p className="text-xs font-bold text-indigo-400">{post.poll.question}</p>
                <div className="space-y-1.5">
                  {post.poll.options.map((opt, idx) => {
                    const isVoted = pollVotes[post.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleVotePoll(post.id, idx)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                          isVoted
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/5'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span className="text-[10px] opacity-80">{opt.votes + (isVoted ? 1 : 0)} votes</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Caption & Hashtags */}
            <div className="text-sm leading-relaxed space-y-2">
              <p>
                <span className="font-bold mr-2 text-white">{post.user.username}</span>
                <span className="text-gray-200">{post.caption}</span>
              </p>

              {/* AI Translate Caption Trigger */}
              <div className="pt-0.5">
                <button
                  onClick={() => handleTranslatePost(post.id, post.caption)}
                  disabled={translatingMap[post.id]}
                  className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Languages size={13} className={translatingMap[post.id] ? 'animate-spin' : ''} />
                  <span>
                    {translatingMap[post.id]
                      ? 'Translating with Gemini AI...'
                      : translationsMap[post.id]
                      ? 'Show Original Caption'
                      : `See Translation (${LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Tamil'})`}
                  </span>
                </button>

                {translationsMap[post.id] && (
                  <div className="mt-2 p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 animate-fade-in space-y-1">
                    <div className="flex items-center space-x-1 text-[10px] uppercase font-bold text-indigo-400">
                      <Sparkles size={11} />
                      <span>Gemini AI Translation ({LANGUAGES.find((l) => l.code === currentLang)?.name})</span>
                    </div>
                    <p className="font-medium italic">{translationsMap[post.id]}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {post.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* View Comments Button */}
            <button
              onClick={() => handleOpenComments(post.id, post.caption)}
              className="text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors pt-1 block"
            >
              View all {post.commentsCount} comments...
            </button>
          </div>
        </article>
      ))}

      {/* Comments Drawer / Modal */}
      {selectedPostComments && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <span>Comments</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {commentsList.length}
                </span>
              </h3>
              <button
                onClick={() => setSelectedPostComments(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[350px] no-scrollbar">
              {commentsList.map((c) => (
                <div key={c.id} className="flex space-x-3 items-start">
                  <img
                    src={c.user.avatarUrl}
                    alt={c.user.username}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex-1 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-indigo-300">{c.user.username}</span>
                      <span className="text-[10px] text-gray-500">Just now</span>
                    </div>
                    <p className="text-xs text-gray-200">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gemini AI Comment Suggestions Chips */}
            <div className="py-2.5 border-t border-white/10 bg-indigo-500/5 p-3 rounded-xl mb-3 border border-indigo-500/20">
              <div className="flex items-center space-x-1.5 mb-2">
                <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  AI Quick Replies
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {loadingSuggestions ? (
                  <span className="text-xs text-gray-500 italic">Generating smart replies...</span>
                ) : (
                  aiSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCommentInput(sug)}
                      className="px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 rounded-full text-xs text-indigo-200 transition-all"
                    >
                      {sug}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handlePostCommentSubmit} className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
