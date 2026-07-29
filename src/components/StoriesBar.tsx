import React, { useState } from 'react';
import { Plus, Play } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User | null;
  onOpenCreateStory: () => void;
  onSelectStory: (story: Story) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenCreateStory,
  onSelectStory,
}) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 shadow-xl overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-5 min-w-max">
        {/* Create Your Story Item */}
        <div 
          onClick={onOpenCreateStory}
          className="flex flex-col items-center cursor-pointer group"
          id="create-story-btn"
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-indigo-500/30 group-hover:bg-indigo-500 transition-all flex items-center justify-center">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt="Your Story"
              className="w-full h-full rounded-full object-cover border border-[#0A0A0A]"
            />
            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 border-2 border-[#0A0A0A] shadow-md">
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 mt-1.5 truncate max-w-[68px]">Your Story</span>
        </div>

        {/* Existing Active Stories List */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-500 group-hover:scale-105 transition-transform flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <img
                src={story.user.avatarUrl}
                alt={story.user.username}
                className="w-full h-full rounded-full object-cover border-2 border-[#0A0A0A]"
              />
            </div>
            <span className="text-[11px] font-medium text-gray-400 mt-1.5 truncate max-w-[68px]">
              {story.user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
