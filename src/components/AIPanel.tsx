import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, ShieldAlert, UserCheck, Copy, Check } from 'lucide-react';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'caption' | 'bio' | 'moderate' | 'assistant'>('caption');
  
  // Caption tool state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('enthusiastic');
  const [captionResult, setCaptionResult] = useState('');

  // Bio tool state
  const [keywords, setKeywords] = useState('AI, Design, Code');
  const [profession, setProfession] = useState('Senior Product Engineer');
  const [bioResult, setBioResult] = useState('');

  // Moderation state
  const [sampleText, setSampleText] = useState('Check out this amazing release! https://mingleloop.app');
  const [modResult, setModResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCaption = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      });
      const data = await res.json();
      setCaptionResult(data.caption || 'Failed to generate');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, profession }),
      });
      const data = await res.json();
      setBioResult(data.bios || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateText = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: sampleText }),
      });
      const data = await res.json();
      setModResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 shadow-2xl flex flex-col text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-base">Gemini AI Studio</h2>
              <p className="text-[10px] text-slate-400">Server-Side @google/genai Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-2xl my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('caption')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'caption' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Caption AI
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'bio' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Bio AI
          </button>
          <button
            onClick={() => setActiveTab('moderate')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'moderate' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Moderator
          </button>
        </div>

        {/* Tool Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {activeTab === 'caption' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Post Topic / Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Flutter mobile app launch with Gemini AI"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none"
                >
                  <option value="enthusiastic">Enthusiastic & Trendy</option>
                  <option value="professional">Professional Tech Lead</option>
                  <option value="witty">Witty & Casual</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>

              <button
                onClick={handleGenerateCaption}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-xs shadow-lg"
              >
                {loading ? 'Generating Captions...' : 'Generate 3 AI Captions'}
              </button>

              {captionResult && (
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 relative text-xs leading-relaxed space-y-2">
                  <button
                    onClick={() => copyToClipboard(captionResult)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <pre className="whitespace-pre-wrap font-sans text-slate-200">{captionResult}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Profession / Role</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Keywords / Passions</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>

              <button
                onClick={handleGenerateBio}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-xs shadow-lg"
              >
                {loading ? 'Crafting Bios...' : 'Generate AI Bio Suggestions'}
              </button>

              {bioResult && (
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans text-slate-200">{bioResult}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'moderate' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Content to Audit</label>
                <textarea
                  rows={3}
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none resize-none"
                />
              </div>

              <button
                onClick={handleModerateText}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-lg"
              >
                {loading ? 'Auditing Content...' : 'Run Gemini Toxicity Audit'}
              </button>

              {modResult && (
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Safety Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        modResult.isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {modResult.isSafe ? 'Safe / Approved' : 'Flagged Content'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Category:</span>
                    <span className="text-slate-200">{modResult.flagCategory}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Confidence Score:</span>
                    <span className="text-slate-200">{(modResult.confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
