import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from 'lucide-react';
import { User } from '../types';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full h-[600px] relative overflow-hidden shadow-2xl flex flex-col justify-between text-white">
        {/* Call Stream Display Area */}
        <div className="relative flex-1 bg-slate-950 flex flex-col items-center justify-center p-6">
          {callType === 'video' && !isVideoOff ? (
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"
                alt="Call Stream"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ) : (
            <div className="text-center relative z-10">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250"
                alt="Sarah Chen"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500 mx-auto shadow-2xl mb-4"
              />
              <h3 className="font-bold text-xl">Sarah Chen</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                ● Live Connected ({formatTime(seconds)})
              </p>
            </div>
          )}

          {/* Self View Floating Camera */}
          {callType === 'video' && !isVideoOff && (
            <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl z-20 bg-slate-800">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Call Bottom Controls */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-around z-30">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl transition-all ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-2xl transition-all ${
              isVideoOff ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>

          <button
            onClick={() => setCallType(callType === 'voice' ? 'video' : 'voice')}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs"
          >
            {callType === 'voice' ? 'Switch Video' : 'Switch Voice'}
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all"
          >
            <PhoneOff size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
