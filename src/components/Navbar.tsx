import React, { useState } from 'react';
import { 
  Home, 
  Film, 
  MessageSquare, 
  Compass, 
  PlusSquare, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  User as UserIcon,
  Phone,
  Smartphone,
  UploadCloud,
  Globe,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import { User } from '../types';
import { LANGUAGES, SupportedLanguage, TIMEZONES } from '../lib/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenCreatePost: () => void;
  onOpenAIPanel: () => void;
  onOpenAuth: () => void;
  onStartCall: () => void;
  onOpenApkConnection?: () => void;
  onOpenPlayStoreConsole?: () => void;
  unreadNotifications: number;
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  currentTimeZone?: string;
  onTimeZoneChange?: (tz: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreatePost,
  onOpenAIPanel,
  onOpenAuth,
  onStartCall,
  onOpenApkConnection,
  onOpenPlayStoreConsole,
  unreadNotifications,
  currentLang = 'en',
  onLanguageChange,
  currentTimeZone = 'Asia/Kolkata',
  onTimeZoneChange,
  isDarkMode = true,
  onToggleTheme,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A]/90 border-white/10 text-gray-100' : 'bg-white/90 border-gray-200 text-gray-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center space-x-2.5 cursor-pointer group"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl tracking-tighter text-white">ML</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MingleLoop
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Global AI
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className={`hidden md:flex items-center space-x-1 p-1.5 rounded-2xl border ${
          isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-gray-100 border-gray-200'
        }`}>
          <button
            id="nav-tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'feed'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Home size={18} />
            <span>Feed</span>
          </button>

          <button
            id="nav-tab-reels"
            onClick={() => setActiveTab('reels')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'reels'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Film size={18} />
            <span>Reels</span>
          </button>

          <button
            id="nav-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={18} />
            <span>Chats</span>
          </button>

          <button
            id="nav-tab-explore"
            onClick={() => setActiveTab('explore')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'explore'
                ? 'bg-indigo-600 text-white shadow-md'
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Compass size={18} />
            <span>Explore</span>
          </button>

          <button
            id="nav-tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : isDarkMode ? 'text-gray-400 hover:text-indigo-300 hover:bg-white/5' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-200'
            }`}
          >
            <span>Architecture</span>
          </button>
        </nav>

        {/* Action Controls & Language Selector */}
        <div className="flex items-center space-x-2">
          {/* Global Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10' 
                  : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'
              }`}
              title="Change App Language"
            >
              <span>{selectedLangObj.flag}</span>
              <span className="hidden lg:inline">{selectedLangObj.nativeName}</span>
              <Globe size={14} className="text-indigo-400 ml-0.5" />
            </button>

            {isLangMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-50 p-2 space-y-1 ${
                isDarkMode ? 'bg-[#121212] border-white/15 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Select Global Language
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (onLanguageChange) onLanguageChange(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                        currentLang === lang.code
                          ? 'bg-indigo-600 text-white font-bold'
                          : isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[10px] opacity-60 lowercase font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10' 
                  : 'bg-gray-100 border-gray-200 text-indigo-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            id="quick-create-post-btn"
            onClick={onOpenCreatePost}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-[1.02]"
          >
            <PlusSquare size={18} />
            <span className="hidden sm:inline">Create</span>
          </button>

          <button
            id="quick-ai-assistant-btn"
            onClick={onOpenAIPanel}
            className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center justify-center relative"
            title="Gemini AI Studio Assistant"
          >
            <Sparkles size={19} className="text-indigo-400 animate-pulse" />
          </button>

          <button
            id="apk-connection-btn"
            onClick={onOpenApkConnection}
            className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center relative"
            title="APK Mobile Connection Mode Settings"
          >
            <Smartphone size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </button>

          <button
            id="playstore-console-btn"
            onClick={onOpenPlayStoreConsole}
            className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all flex items-center justify-center relative"
            title="Google Play Store Release Console & Deployment Hub"
          >
            <UploadCloud size={19} />
            <span className="absolute -top-1 -right-1 px-1 bg-purple-600 text-white text-[9px] font-black rounded-md">
              AAB
            </span>
          </button>

          <button
            id="notifications-btn"
            onClick={() => setActiveTab('notifications')}
            className={`p-2.5 rounded-xl border transition-all relative ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' 
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-indigo-400 animate-ping" />
            )}
          </button>

          {currentUser?.role === 'admin' && (
            <button
              id="admin-panel-btn"
              onClick={() => setActiveTab('admin')}
              className={`p-2.5 rounded-xl border transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:text-amber-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck size={19} />
            </button>
          )}

          {/* User Profile Avatar / Login */}
          {currentUser ? (
            <div 
              id="user-profile-avatar-btn"
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2 pl-1 cursor-pointer group"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/50 group-hover:ring-indigo-400 transition-all"
              />
            </div>
          ) : (
            <button
              id="login-modal-open-btn"
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all"
            >
              <UserIcon size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden flex items-center justify-around border-t py-2.5 px-2 ${
        isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center space-y-1 text-xs ${activeTab === 'feed' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
        >
          <Home size={20} />
          <span>Feed</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center space-y-1 text-xs ${activeTab === 'reels' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
        >
          <Film size={20} />
          <span>Reels</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center space-y-1 text-xs ${activeTab === 'chat' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
        >
          <MessageSquare size={20} />
          <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center space-y-1 text-xs ${activeTab === 'explore' ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
        >
          <Compass size={20} />
          <span>Explore</span>
        </button>
      </div>
    </header>
  );
};

