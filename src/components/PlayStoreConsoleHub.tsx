import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Sliders, 
  Code2, 
  Layers, 
  Globe, 
  BarChart3, 
  AlertTriangle, 
  UploadCloud, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Lock,
  Zap,
  X
} from 'lucide-react';

interface PlayStoreConsoleHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreConsoleHub: React.FC<PlayStoreConsoleHubProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'store-listing' | 'android-build' | 'privacy-safety' | 'release-guide' | 'analytics'>('store-listing');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // App Specs
  const appPackage = "com.mingleloop.app";
  const versionCode = "24";
  const versionName = "2.4.0";
  const iconUrl = "/src/assets/images/mingleloop_playstore_icon_1785317122719.jpg";
  const featureGraphicUrl = "/src/assets/images/playstore_feature_graphic_1785317137723.jpg";

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-5xl w-full bg-[#111113] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-6 text-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <img 
              src={iconUrl} 
              alt="MingleLoop App Icon" 
              className="w-14 h-14 rounded-2xl shadow-xl border border-white/20 object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Google Play Store Release Console</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready for Production (.AAB)
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center space-x-3">
                <span>Package: <code className="text-indigo-300 font-mono">{appPackage}</code></span>
                <span>•</span>
                <span>Version: <span className="text-white font-bold">{versionName}</span> (v{versionCode})</span>
                <span>•</span>
                <span>Target SDK: <span className="text-emerald-400 font-bold">34 (Android 14)</span></span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-black/40 border-b border-white/10 px-6 py-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('store-listing')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'store-listing'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe size={15} />
            <span>Store Listing & Assets</span>
          </button>

          <button
            onClick={() => setActiveTab('android-build')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'android-build'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 size={15} />
            <span>Gradle & Manifest Config</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy-safety')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'privacy-safety'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Privacy & Data Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('release-guide')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'release-guide'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UploadCloud size={15} />
            <span>Play Console Step-by-Step</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={15} />
            <span>Firebase Analytics & Crashlytics</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: STORE LISTING & ASSETS */}
          {activeTab === 'store-listing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text Metadata */}
                <div className="space-y-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                    <span>Play Store Metadata</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Category: Social</span>
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400">App Name (max 30 chars)</label>
                    <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-medium text-white">
                      <span>MingleLoop: Global Social & AI Chat</span>
                      <button onClick={() => handleCopy("MingleLoop: Global Social & AI Chat", "appName")} className="text-indigo-400 hover:text-indigo-300">
                        {copiedKey === "appName" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400">Short Description (max 80 chars)</label>
                    <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-medium text-white">
                      <span>Connect, share stories, watch short reels, and chat globally with Gemini AI live translation.</span>
                      <button onClick={() => handleCopy("Connect, share stories, watch short reels, and chat globally with Gemini AI live translation.", "shortDesc")} className="text-indigo-400 hover:text-indigo-300">
                        {copiedKey === "shortDesc" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-400">Content Rating & Age Classification</label>
                    <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Teen 12+ (IARC Certified)</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">User Interaction, Digital Purchases, Moderated Content</div>
                      </div>
                      <ShieldCheck size={20} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Visual Graphics Preview */}
                <div className="space-y-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Generated Play Store Graphics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-semibold">Launcher Icon (512x512)</span>
                      <div className="relative group overflow-hidden rounded-2xl border border-white/15 aspect-square">
                        <img src={iconUrl} alt="App Icon" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={iconUrl} download="mingleloop_icon.jpg" className="p-2 bg-indigo-600 rounded-xl text-white text-xs font-bold flex items-center space-x-1">
                            <Download size={14} />
                            <span>Save 512px</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-semibold">Feature Banner (1024x500)</span>
                      <div className="relative group overflow-hidden rounded-2xl border border-white/15 aspect-[1024/500] w-full h-full">
                        <img src={featureGraphicUrl} alt="Feature Graphic" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={featureGraphicUrl} download="mingleloop_feature_graphic.jpg" className="p-2 bg-indigo-600 rounded-xl text-white text-xs font-bold flex items-center space-x-1">
                            <Download size={14} />
                            <span>Save 1024px</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Description Box */}
              <div className="space-y-2 bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Full Store Description (Formatted for Google Play)</h3>
                  <button
                    onClick={() => handleCopy(`MingleLoop is the ultimate global social media & real-time messaging application designed to connect friends, creators, and communities worldwide.

🌟 KEY FEATURES:
• Instant Feed & Stories: Share high-definition photos, polls, and video updates with interactive story reactions.
• Short Reels Studio: Discover and post trending short video content with audio tracks and creator effects.
• Real-Time Messaging & Voice/Video Calls: Stay close with end-to-end socket messaging, voice notes, and high-definition video calls.
• Gemini AI Live Translation: Break language barriers! Translate posts and messages instantly into Tamil, Spanish, Hindi, French, Arabic, German, Japanese, Chinese, and Portuguese.
• Privacy & Safety First: Built-in block/report systems, customizable privacy controls, and encrypted communications.
• Android APK & Mobile Optimization: Smooth performance on all Android devices with Data Saver mode and light/dark theme toggles.

Join millions on MingleLoop today and experience seamless global connection!`, "fullDesc")}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {copiedKey === "fullDesc" ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedKey === "fullDesc" ? "Copied Full Text" : "Copy Description"}</span>
                  </button>
                </div>

                <div className="bg-black/70 border border-white/10 rounded-xl p-4 text-xs font-sans text-gray-300 space-y-2 leading-relaxed">
                  <p className="font-bold text-white">MingleLoop is the ultimate global social media & real-time messaging application designed to connect friends, creators, and communities worldwide.</p>
                  <p className="font-semibold text-indigo-300">🌟 KEY FEATURES:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                    <li><strong className="text-white">Instant Feed & Stories:</strong> Share high-definition photos, polls, and video updates with interactive story reactions.</li>
                    <li><strong className="text-white">Short Reels Studio:</strong> Discover and post trending short video content with audio tracks and creator effects.</li>
                    <li><strong className="text-white">Real-Time Messaging & Calls:</strong> Stay close with end-to-end socket messaging, voice notes, and high-definition video calls.</li>
                    <li><strong className="text-white">Gemini AI Live Translation:</strong> Break language barriers! Translate posts and messages instantly into 10+ global languages.</li>
                    <li><strong className="text-white">Privacy & Safety First:</strong> Built-in block/report systems, customizable privacy controls, and encrypted communications.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRADLE & MANIFEST CONFIG */}
          {activeTab === 'android-build' && (
            <div className="space-y-6">
              {/* Build Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-xs text-gray-400 font-medium">Application ID</div>
                  <div className="text-sm font-mono font-bold text-indigo-300 mt-1">com.mingleloop.app</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-xs text-gray-400 font-medium">Version Name & Code</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 mt-1">v2.4.0 (VersionCode: 24)</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-xs text-gray-400 font-medium">Min & Target SDK</div>
                  <div className="text-sm font-mono font-bold text-purple-400 mt-1">Min SDK 24 • Target SDK 34</div>
                </div>
              </div>

              {/* AndroidManifest.xml */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">AndroidManifest.xml (Production Permissions)</label>
                  <button
                    onClick={() => handleCopy(`<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mingleloop.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MingleLoopApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="MingleLoop"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MingleLoop"
        android:usesCleartextTraffic="false">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`, "manifest")}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold"
                  >
                    {copiedKey === "manifest" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>Copy XML</span>
                  </button>
                </div>

                <div className="bg-[#080808] border border-white/10 rounded-2xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto">
                  <pre>{`<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mingleloop.app">

    <!-- Play Store Hardware & Network Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MingleLoopApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="MingleLoop"
        android:supportsRtl="true"
        android:theme="@style/Theme.MingleLoop">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}</pre>
                </div>
              </div>

              {/* build.gradle (Module :app) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">app/build.gradle.kts (Release & ProGuard Optimization)</label>
                  <button
                    onClick={() => handleCopy(`android {
    namespace = "com.mingleloop.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mingleloop.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 24
        versionName = "2.4.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
    }
}`, "gradle")}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold"
                  >
                    {copiedKey === "gradle" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>Copy Gradle</span>
                  </button>
                </div>

                <div className="bg-[#080808] border border-white/10 rounded-2xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto">
                  <pre>{`android {
    namespace = "com.mingleloop.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mingleloop.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 24
        versionName = "2.4.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY & DATA SAFETY */}
          {activeTab === 'privacy-safety' && (
            <div className="space-y-6">
              {/* Play Store Data Safety Grid */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span>Google Play Data Safety Declaration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <Lock size={14} className="text-emerald-400" />
                      <span>Data Encrypted in Transit</span>
                    </div>
                    <p className="text-[11px] text-gray-400">All data transferred between MingleLoop client & Cloud backend is encrypted via HTTPS/TLS 1.3.</p>
                  </div>

                  <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <X size={14} className="text-emerald-400" />
                      <span>Account & Data Deletion Request</span>
                    </div>
                    <p className="text-[11px] text-gray-400">Users can delete their account & all associated posts/messages directly in Settings or via URL.</p>
                  </div>

                  <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>Zero Data Sold to Third Parties</span>
                    </div>
                    <p className="text-[11px] text-gray-400">MingleLoop strictly never sells user contact info, messages, or media files to data brokers.</p>
                  </div>

                  <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <Zap size={14} className="text-emerald-400" />
                      <span>UGC Content Safety System</span>
                    </div>
                    <p className="text-[11px] text-gray-400">Real-time Gemini AI moderation detects spam, hate speech, and inappropriate media upload.</p>
                  </div>
                </div>
              </div>

              {/* Privacy Policy & Terms Link Builder */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">MingleLoop Production Privacy Policy Document</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Required URL field for Play Console Store Listing submission</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    STATUS: PUBLISHED & COMPLIANT
                  </span>
                </div>

                <div className="bg-black/80 border border-white/15 rounded-xl p-3 flex items-center justify-between font-mono text-xs text-indigo-200">
                  <span>https://mingleloop.app/privacy-policy</span>
                  <button
                    onClick={() => handleCopy("https://mingleloop.app/privacy-policy", "privacyUrl")}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-sans font-bold"
                  >
                    {copiedKey === "privacyUrl" ? "Copied" : "Copy Privacy URL"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RELEASE GUIDE */}
          {activeTab === 'release-guide' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Play Console Publishing Step-by-Step Checklist</h3>
              
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Generate Production Signing Keystore (.jks)</h4>
                    <p className="text-[11px] text-gray-400">Run terminal command to build release keystore:</p>
                    <code className="block bg-black/70 p-2 rounded-lg text-[11px] font-mono text-indigo-300 border border-white/10">
                      keytool -genkey -v -keystore mingleloop-release.jks -alias mingleloop -keyalg RSA -keysize 2048 -validity 10000
                    </code>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Compile Android App Bundle (.aab)</h4>
                    <p className="text-[11px] text-gray-400">Generate optimized bundle file in Android Studio or CLI:</p>
                    <code className="block bg-black/70 p-2 rounded-lg text-[11px] font-mono text-emerald-300 border border-white/10">
                      ./gradlew bundleRelease
                    </code>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Upload .AAB to Play Console Internal Testing Track</h4>
                    <p className="text-[11px] text-gray-400">Go to Play Console &gt; Testing &gt; Internal testing &gt; Create new release &gt; Drag and drop generated <code className="text-indigo-300">app-release.aab</code>.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">4</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Complete App Content Questionnaire & Target Audience</h4>
                    <p className="text-[11px] text-gray-400">Complete Privacy Policy, Data Safety, News Apps, Advertising ID, and IARC Content Rating questionnaires.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">5</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">Promote to Production Track & Start Rollout</h4>
                    <p className="text-[11px] text-gray-400">Review release summary, confirm 100% production rollout, and click "Start rollout to Production". Approval takes 24-48 hours!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & CRASH REPORTING */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Firebase Analytics & Crashlytics Mobile Integration</h3>
                
                <div className="bg-[#080808] border border-white/10 rounded-2xl p-4 font-mono text-xs text-indigo-200">
                  <pre>{`// Firebase Analytics Event Loggers for MingleLoop Android
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics();

export const trackPostCreated = (mediaType: string) => {
  logEvent(analytics, 'create_post', {
    media_type: mediaType,
    client: 'Android-APK-Mode'
  });
};

export const trackChatSent = () => {
  logEvent(analytics, 'send_chat_message');
};

export const trackAiTranslation = (targetLang: string) => {
  logEvent(analytics, 'ai_translation_used', {
    target_language: targetLang
  });
};`}</pre>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-black/80 p-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-400 flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>MingleLoop Build Engine v2.4.0 • Play Store Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
          >
            Done & Export App Specs
          </button>
        </div>

      </div>
    </div>
  );
};
