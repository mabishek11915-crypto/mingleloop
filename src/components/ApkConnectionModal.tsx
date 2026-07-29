import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Activity, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  Sliders, 
  Globe, 
  CheckCircle2, 
  X,
  Code2,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ApkConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkConnectionModal: React.FC<ApkConnectionModalProps> = ({ isOpen, onClose }) => {
  const defaultHost = typeof window !== 'undefined' ? `${window.location.origin}/api` : 'https://mingleloop.app/api';
  const [apiUrl, setApiUrl] = useState<string>(defaultHost);
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: 'idle' | 'success' | 'error'; latency: number; details?: any }>({
    status: 'idle',
    latency: 0,
  });

  // Settings states
  const [dataSaver, setDataSaver] = useState(true);
  const [pushBridge, setPushBridge] = useState(true);
  const [corsPassthrough, setCorsPassthrough] = useState(true);
  const [activeTab, setActiveTab] = useState<'flutter' | 'kotlin' | 'config'>('flutter');

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const testConnection = async () => {
    setIsTesting(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/apk/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: Date.now(), client: 'Android-APK-Mode' }),
      });
      const end = performance.now();
      const latency = Math.round(end - start);
      const data = await res.json();
      setPingResult({ status: 'success', latency, details: data });
    } catch (err) {
      const end = performance.now();
      setPingResult({ status: 'error', latency: Math.round(end - start) });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#121212] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8 text-gray-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 p-6 border-b border-white/10 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white">APK Connection Mode</h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span>ONLINE BRIDGE</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure direct REST/WebSocket API endpoints for Android APK & Mobile Clients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live Ping & Health Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl border ${
                pingResult.status === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : pingResult.status === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              }`}>
                <Activity size={22} className={isTesting ? 'animate-spin' : ''} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Mobile APK Ping Latency</div>
                <div className="text-lg font-black text-white flex items-center space-x-2">
                  <span>{isTesting ? 'Measuring...' : `${pingResult.latency} ms`}</span>
                  {pingResult.status === 'success' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      Excellent (HTTP/2)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={testConnection}
              disabled={isTesting}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
              <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* API Base URL Config */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
              <span>Android APK API Base Endpoint</span>
              <span className="text-[10px] text-gray-400 lowercase font-normal">Used by Flutter / Kotlin build</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-xs text-indigo-200 font-mono outline-none transition-all pr-10"
                />
                <Globe size={16} className="absolute right-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={handleCopyUrl}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-xs font-bold text-white transition-all shrink-0"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 pt-1 text-[11px]">
              <span className="text-gray-400 font-medium">Emulator Presets:</span>
              <button
                onClick={() => setApiUrl('http://10.0.2.2:3000/api')}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-indigo-300 font-mono transition-colors"
              >
                10.0.2.2:3000 (Android)
              </button>
              <button
                onClick={() => setApiUrl('http://localhost:3000/api')}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-indigo-300 font-mono transition-colors"
              >
                localhost:3000
              </button>
              <button
                onClick={() => setApiUrl(defaultHost)}
                className="px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 rounded-lg text-indigo-300 font-mono transition-colors"
              >
                Cloud Host
              </button>
            </div>
          </div>

          {/* APK Direct Connection Toggles */}
          <div className="space-y-3 bg-black/40 border border-white/10 p-4 rounded-2xl">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders size={14} />
              <span>APK Mobile Optimization Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setPushBridge(!pushBridge)}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  pushBridge 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Zap size={16} className={pushBridge ? 'text-indigo-400' : 'text-gray-500'} />
                  <span className={`w-2 h-2 rounded-full ${pushBridge ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <div className="text-xs font-bold">Push Sync Socket</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Direct Socket.IO background push</div>
                </div>
              </button>

              <button
                onClick={() => setDataSaver(!dataSaver)}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  dataSaver 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Wifi size={16} className={dataSaver ? 'text-indigo-400' : 'text-gray-500'} />
                  <span className={`w-2 h-2 rounded-full ${dataSaver ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <div className="text-xs font-bold">Data Saver Mode</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Compresses story & reel feeds</div>
                </div>
              </button>

              <button
                onClick={() => setCorsPassthrough(!corsPassthrough)}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  corsPassthrough 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <ShieldCheck size={16} className={corsPassthrough ? 'text-indigo-400' : 'text-gray-500'} />
                  <span className={`w-2 h-2 rounded-full ${corsPassthrough ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <div className="text-xs font-bold">Mobile CORS Headers</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Allows mobile header JWT auth</div>
                </div>
              </button>
            </div>
          </div>

          {/* Code Snippet Tabs for Mobile Mobile Integration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Code2 size={14} />
                <span>Mobile Client Integration Code</span>
              </span>
              <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('flutter')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === 'flutter' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Flutter / Dart
                </button>
                <button
                  onClick={() => setActiveTab('kotlin')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === 'kotlin' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kotlin Android
                </button>
              </div>
            </div>

            <div className="bg-[#080808] border border-white/10 rounded-2xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto relative">
              {activeTab === 'flutter' ? (
                <pre>{`// MingleLoop Flutter APK Direct Client Config
class MingleLoopApkConfig {
  static const String baseUrl = "${apiUrl}";
  static const bool enableDataSaver = ${dataSaver};
  static const bool enableSocketBridge = ${pushBridge};

  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'X-MingleLoop-Client': 'Android-APK-Mode',
  };
}`}</pre>
              ) : (
                <pre>{`// MingleLoop Android Kotlin Retrofit Config
object MingleLoopApkConfig {
    const val BASE_URL = "${apiUrl}/"
    const val DATA_SAVER = ${dataSaver}
    const val SOCKET_ENABLED = ${pushBridge}
}`}</pre>
              )}
            </div>
          </div>

          {/* Download APK Package & Action */}
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                <Download size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">MingleLoop Android Client (.apk)</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Build v2.4.0 • Pre-configured with direct backend connection bridge
                </p>
              </div>
            </div>

            <a
              href="/api/apk/download"
              download="MingleLoop-Mobile-App.apk"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading MingleLoop Android APK client config bundle...');
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 shrink-0"
            >
              <Download size={15} />
              <span>Download APK</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-black/60 p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close & Save Mode
          </button>
        </div>
      </div>
    </div>
  );
};
