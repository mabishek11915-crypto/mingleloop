import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Music, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '../types';

interface ReelsProps {
  reels: Reel[];
  onLikeReel: (reelId: string) => void;
}

export const Reels: React.FC<ReelsProps> = ({ reels, onLikeReel }) => {
  const [muted, setMuted] = useState(true);

  return (
    <div className="max-w-md mx-auto space-y-8 pb-16">
      {reels.map((reel) => (
        <div
          key={reel.id}
          className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[650px] flex flex-col justify-between text-white group"
        >
          {/* Reel Video Player */}
          <video
            src={reel.videoUrl}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Mute Overlay Button */}
          <button
            onClick={() => setMuted(!muted)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

          {/* Reel Content Overlay */}
          <div className="relative z-10 p-6 flex justify-between items-end h-full">
            {/* Left Info Column */}
            <div className="space-y-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <img
                  src={reel.user.avatarUrl}
                  alt={reel.user.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"
                />
                <span className="font-bold text-sm">{reel.user.username}</span>
                {reel.user.isVerified && (
                  <CheckCircle2 size={14} className="text-purple-400 fill-purple-400/20" />
                )}
                <button className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold rounded-full border border-white/30 transition-all">
                  Follow
                </button>
              </div>

              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">{reel.caption}</p>

              <div className="flex items-center space-x-2 text-[11px] text-purple-300 font-medium">
                <Music size={14} className="animate-spin" />
                <span className="truncate">{reel.audioTrack}</span>
              </div>
            </div>

            {/* Right Interactive Column */}
            <div className="flex flex-col items-center space-y-5">
              <button
                onClick={() => onLikeReel(reel.id)}
                className="flex flex-col items-center space-y-1 group"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    reel.isLiked ? 'bg-pink-500 text-white scale-110' : 'bg-black/40 text-white group-hover:bg-black/60'
                  }`}
                >
                  <Heart size={22} className={reel.isLiked ? 'fill-white' : ''} />
                </div>
                <span className="text-xs font-semibold">{reel.likesCount}</span>
              </button>

              <button className="flex flex-col items-center space-y-1">
                <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all">
                  <MessageCircle size={22} />
                </div>
                <span className="text-xs font-semibold">{reel.commentsCount}</span>
              </button>

              <button className="flex flex-col items-center space-y-1">
                <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all">
                  <Share2 size={22} />
                </div>
                <span className="text-xs font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
