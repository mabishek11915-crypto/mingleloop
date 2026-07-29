import React, { useState } from 'react';
import { X, Sparkles, MapPin, Hash, BarChart2, Image, AlertCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (postData: {
    mediaUrl: string;
    caption: string;
    location?: string;
    hashtags: string[];
    poll?: { question: string; options: { text: string; votes: number }[] };
  }) => Promise<void>;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmitPost }) => {
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtagInput, setHashtagInput] = useState('ConnectX, AI, SocialApp');
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAICaption = async () => {
    setGeneratingCaption(true);
    try {
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: caption || 'Tech innovation and design', tone: 'trendy and inspiring' }),
      });
      const data = await res.json();
      if (data.caption) setCaption(data.caption);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setModerationWarning(null);

    try {
      // AI Moderation check
      const modRes = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: caption }),
      });
      const modData = await modRes.json();

      if (!modData.isSafe) {
        setModerationWarning(`Post flagged by AI Moderation: ${modData.flagCategory}`);
        setLoading(false);
        return;
      }

      const tags = hashtagInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const pollData = showPoll && pollQuestion ? {
        question: pollQuestion,
        options: pollOptions.map((opt) => ({ text: opt, votes: 0 })),
      } : undefined;

      await onSubmitPost({
        mediaUrl,
        caption,
        location,
        hashtags: tags,
        poll: pollData,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <span>Create New Post</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">ConnectX</span>
        </h2>

        {moderationWarning && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{moderationWarning}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image URL / Selector */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-medium">Image URL</label>
            <div className="flex space-x-2">
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
              />
            </div>
            {mediaUrl && (
              <img
                src={mediaUrl}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-xl border border-slate-800"
              />
            )}
          </div>

          {/* Caption Input + AI Caption Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400 font-medium">Caption</label>
              <button
                type="button"
                onClick={handleGenerateAICaption}
                disabled={generatingCaption}
                className="flex items-center space-x-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 bg-purple-900/30 px-2.5 py-1 rounded-lg border border-purple-500/30"
              >
                <Sparkles size={13} className="animate-pulse" />
                <span>{generatingCaption ? 'Generating AI Caption...' : 'Gemini AI Caption'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              required
              placeholder="Write a caption or let Gemini AI draft one for you..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Hashtags & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Hashtags (Comma separated)</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="ConnectX, AI, Tech"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Toggle Interactive Poll */}
          <div>
            <button
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <BarChart2 size={16} />
              <span>{showPoll ? 'Remove Interactive Poll' : '+ Attach Interactive Poll'}</span>
            </button>

            {showPoll && (
              <div className="mt-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Poll Question (e.g., Which stack do you prefer?)"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                />
                <div className="space-y-1.5">
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[idx] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg transition-all text-sm mt-4"
          >
            {loading ? 'Publishing Post...' : 'Publish Post to Feed'}
          </button>
        </form>
      </div>
    </div>
  );
};
