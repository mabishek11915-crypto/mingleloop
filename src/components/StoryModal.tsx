import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Story, User } from '../types';

interface StoryModalProps {
  stories: Story[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onReaction: (storyId: string, reactionType: string) => void;
  onSendReply: (storyId: string, text: string) => void;
  replySuccessMsg?: string | null;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  stories,
  initialStoryIndex,
  isOpen,
  onClose,
  currentUser,
  onReaction,
  onSendReply,
  replySuccessMsg,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Touch Swipe Handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync index if initialStoryIndex changes
  useEffect(() => {
    setCurrentIndex(initialStoryIndex);
    setProgress(0);
  }, [initialStoryIndex]);

  const activeStory = stories[currentIndex] || stories[0];

  // Auto-play Progress Bar Effect (5 seconds per story = 5000ms)
  useEffect(() => {
    if (!isOpen || isPaused || !activeStory) return;

    const DURATION = 5000; // 5s
    const INTERVAL = 50; // update every 50ms
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          // Time's up -> Next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            // End of all stories -> close
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, stories.length, activeStory, onClose]);

  // Reset progress on story change
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, stories.length]);

  if (!isOpen || !activeStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  // Touch handlers for Swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // minimum pixels to count as swipe

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next story
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous story
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleReactionClick = (reactionType: string) => {
    const emojiMap: Record<string, string> = { heart: '❤️', fire: '🔥', laugh: '😂', wow: '😮' };
    const emoji = emojiMap[reactionType] || '❤️';
    const newFloat = { id: Date.now() + Math.random(), emoji, x: Math.random() * 60 + 20 };
    setFloatingEmojis((prev) => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 1200);

    onReaction(activeStory.id, reactionType);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(activeStory.id, replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none">
      
      {/* Background Dim Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Story Container */}
      <div 
        className="relative max-w-sm w-full h-[660px] bg-[#0d0d0d] rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col justify-between p-4 z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header: Segmented Progress Bar & User Header */}
        <div className="relative z-30 space-y-2.5">
          {/* Segmented Progress Bars */}
          <div className="flex items-center space-x-1.5 w-full px-0.5">
            {stories.map((s, idx) => {
              let fillPercentage = 0;
              if (idx < currentIndex) fillPercentage = 100;
              else if (idx === currentIndex) fillPercentage = progress;
              else fillPercentage = 0;

              return (
                <div 
                  key={s.id} 
                  className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  title={`Story ${idx + 1}`}
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-75 ease-linear shadow-sm shadow-white/50"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Profile Info & Controls */}
          <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={activeStory.user.avatarUrl}
                alt={activeStory.user.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500 shrink-0"
              />
              <div className="truncate">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-xs text-white truncate">{activeStory.user.username}</span>
                  <span className="text-[10px] text-gray-400 font-mono">• {activeStory.timeAgo || 'Just now'}</span>
                </div>
                {activeStory.musicTrack && (
                  <span className="text-[10px] text-indigo-300 font-medium flex items-center space-x-1 truncate">
                    <span>🎵 {activeStory.musicTrack}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              {/* Play / Pause Timer Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1.5 text-gray-300 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                title={isPaused ? "Play Story" : "Pause Story"}
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
              </button>

              {/* Mute Audio Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 text-gray-300 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 text-gray-300 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors ml-1"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Story Background Media Image */}
        <img
          src={activeStory.mediaUrl}
          alt="Story Media"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Gradient Overlay for Readable Text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Touch / Click Regions for Left/Right Story Navigation */}
        <div 
          className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer flex items-center justify-start pl-2 group"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          {currentIndex > 0 && (
            <div className="p-2 rounded-full bg-black/40 text-white/80 group-hover:bg-indigo-600 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10">
              <ChevronLeft size={20} />
            </div>
          )}
        </div>

        <div 
          className="absolute inset-y-16 right-0 w-1/3 z-20 cursor-pointer flex items-center justify-end pr-2 group"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <div className="p-2 rounded-full bg-black/40 text-white/80 group-hover:bg-indigo-600 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10">
            <ChevronRight size={20} />
          </div>
        </div>

        {/* Floating Emoji Particles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
          {floatingEmojis.map((f) => (
            <div
              key={f.id}
              style={{ left: `${f.x}%`, bottom: '130px' }}
              className="absolute text-4xl animate-float-up drop-shadow-xl"
            >
              {f.emoji}
            </div>
          ))}
        </div>

        {/* Bottom Content Area: Caption, Reactions, Quick Reply Form */}
        <div className="relative z-30 space-y-2.5">
          {/* Story Caption */}
          {activeStory.caption && (
            <div className="bg-black/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 text-xs font-semibold text-center text-white shadow-xl">
              {activeStory.caption}
            </div>
          )}

          {/* Quick Reaction Bar */}
          <div className="bg-black/75 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-2xl">
            <div className="text-[10px] uppercase font-bold text-indigo-400 text-center mb-1 tracking-wider flex items-center justify-center space-x-1">
              <Sparkles size={11} />
              <span>Quick Reaction</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { type: 'heart', emoji: '❤️', label: 'Heart' },
                { type: 'fire', emoji: '🔥', label: 'Fire' },
                { type: 'laugh', emoji: '😂', label: 'Laugh' },
                { type: 'wow', emoji: '😮', label: 'Wow' },
              ].map((item) => {
                const reactionData = activeStory.reactions?.find((r) => r.type === item.type);
                const count = reactionData?.count || 0;
                const userHasReacted = currentUser && reactionData?.users?.includes(currentUser.id);

                return (
                  <button
                    key={item.type}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionClick(item.type);
                    }}
                    className={`group flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                      userHasReacted
                        ? 'bg-indigo-600/60 border border-indigo-400 text-white scale-105 shadow-md shadow-indigo-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 hover:scale-105'
                    }`}
                    title={`React with ${item.label}`}
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform duration-200">
                      {item.emoji}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300">
                      {count > 0 ? count : '0'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Message Input */}
          <form 
            onSubmit={handleFormSubmit}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="relative flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Send reply to ${activeStory.user.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-black/85 backdrop-blur-md border border-white/20 focus:border-indigo-400 focus:bg-black/95 rounded-full px-4 py-2 text-xs text-white placeholder-gray-400 outline-none shadow-lg transition-all"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-full transition-all shadow-lg flex items-center justify-center shrink-0 active:scale-95"
              title="Send reply"
            >
              <Send size={13} />
            </button>
          </form>

          {replySuccessMsg && (
            <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-400 text-white text-[10px] font-bold text-center py-1 px-3 rounded-xl shadow-lg animate-fade-in">
              ✓ {replySuccessMsg}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
