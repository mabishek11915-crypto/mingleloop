import React, { useState, useEffect } from 'react';
import { Send, Image, Mic, Sparkles, Phone, Video, MoreVertical, Users, CheckCheck } from 'lucide-react';
import { ChatMessage, GroupChat, User } from '../types';

interface ChatProps {
  currentUser: User | null;
  onStartCall: () => void;
}

export const Chat: React.FC<ChatProps> = ({ currentUser, onStartCall }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState<'direct' | 'group' | 'ai'>('direct');
  const [aiResponseLoading, setAiResponseLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser?.id || 'user_1',
      receiverId: 'user_2',
      text: messageText,
      type: 'text',
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    const userPrompt = messageText;
    setMessageText('');

    if (activeTab === 'ai') {
      setAiResponseLoading(true);
      try {
        const res = await fetch('/api/ai/chat-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userPrompt }),
        });
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            senderId: 'gemini_bot',
            text: data.reply || 'I am here to assist you!',
            type: 'text',
            status: 'seen',
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setAiResponseLoading(false);
      }
    } else {
      // Backend sync
      fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userPrompt }),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[700px] flex text-white">
      {/* Sidebar Channels / Direct List */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <h2 className="font-bold text-lg">Messages</h2>
          <div className="flex bg-slate-800 p-1 rounded-xl mt-3 text-xs">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
                activeTab === 'direct' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
                activeTab === 'group' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'ai' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-purple-400'
              }`}
            >
              <Sparkles size={12} />
              <span>AI Bot</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === 'direct' && (
            <div className="p-3 bg-slate-800/80 rounded-2xl flex items-center space-x-3 cursor-pointer border border-purple-500/30">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250"
                  alt="Sarah Chen"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">Sarah Chen</span>
                  <span className="text-[10px] text-slate-400">12:45 PM</span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">Testing the MingleLoop audio calls...</p>
              </div>
            </div>
          )}

          {activeTab === 'group' && (
            <div className="p-3 bg-slate-800/80 rounded-2xl flex items-center space-x-3 cursor-pointer border border-purple-500/30">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs truncate block">MingleLoop Core Team</span>
                <p className="text-xs text-slate-400 truncate mt-0.5">3 Members Online</p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl flex items-center space-x-3 cursor-pointer border border-purple-500/40">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs truncate block text-purple-200">Gemini 3.6 AI Assistant</span>
                <p className="text-xs text-purple-300/80 truncate mt-0.5">Instant AI social partner</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Active Chat Stream */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Chat Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            {activeTab === 'ai' ? (
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250"
                alt="Sarah Chen"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500"
              />
            )}
            <div>
              <h3 className="font-bold text-sm">
                {activeTab === 'ai' ? 'Gemini 3.6 Flash Assistant' : 'Sarah Chen'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">● Online | Socket.IO Connected</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onStartCall}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <Phone size={18} />
            </button>
            <button
              onClick={onStartCall}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <Video size={18} />
            </button>
          </div>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isMe = m.senderId === (currentUser?.id || 'user_1');
            const isAI = m.senderId === 'gemini_bot';

            return (
              <div
                key={m.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                      : isAI
                      ? 'bg-purple-900/60 border border-purple-500/40 text-purple-100 rounded-bl-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {isAI && (
                    <span className="text-[10px] font-bold text-purple-300 block mb-1 flex items-center space-x-1">
                      <Sparkles size={12} />
                      <span>Gemini AI Response</span>
                    </span>
                  )}
                  <p>{m.text}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] opacity-70">
                    <span>Just now</span>
                    {isMe && <CheckCheck size={12} className="text-emerald-300" />}
                  </div>
                </div>
              </div>
            );
          })}

          {aiResponseLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-purple-900/40 rounded-2xl border border-purple-500/30 text-xs text-purple-300 flex items-center space-x-2">
                <Sparkles size={14} className="animate-spin text-purple-400" />
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Message Input Controls */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center space-x-2">
          <button type="button" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <Image size={20} />
          </button>
          <button type="button" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <Mic size={20} />
          </button>
          <input
            type="text"
            placeholder={activeTab === 'ai' ? 'Ask Gemini AI assistant anything...' : 'Type message...'}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="p-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
