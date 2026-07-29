import React, { useState } from 'react';
import { Layers, Database, Code, ShieldCheck, Cpu, Server, Terminal, CheckCircle2 } from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'flutter' | 'backend' | 'devops'>('architecture');

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-purple-600/30 text-purple-300 rounded-2xl border border-purple-500/40">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
              MingleLoop Enterprise System Architecture
            </h1>
            <p className="text-xs text-slate-400">
              Master Full-Stack Specification & Technical Documentation
            </p>
          </div>
        </div>
      </div>

      {/* Spec Navigation */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 min-w-max py-2.5 px-4 rounded-xl transition-all ${
            activeTab === 'architecture' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          1. System Architecture
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 min-w-max py-2.5 px-4 rounded-xl transition-all ${
            activeTab === 'database' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          2. PostgreSQL Schema
        </button>
        <button
          onClick={() => setActiveTab('flutter')}
          className={`flex-1 min-w-max py-2.5 px-4 rounded-xl transition-all ${
            activeTab === 'flutter' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          3. Flutter Setup
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          className={`flex-1 min-w-max py-2.5 px-4 rounded-xl transition-all ${
            activeTab === 'backend' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          4. Node.js Backend
        </button>
        <button
          onClick={() => setActiveTab('devops')}
          className={`flex-1 min-w-max py-2.5 px-4 rounded-xl transition-all ${
            activeTab === 'devops' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          5. DevOps & Security
        </button>
      </div>

      {/* Tab 1: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-bold text-lg text-purple-300 flex items-center space-x-2">
              <Cpu size={20} />
              <span>Clean Multi-Tier Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              High-availability design combining event-driven WebSocket streaming, REST API Gateway, PostgreSQL relational persistence, and Gemini AI inference server.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{`
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FLUTTER / WEB CLIENT FRONTEND                         │
│  [ Material 3 Design | Riverpod State | GoRouter | Socket.IO Client ]       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTPS / WSS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MINGLELOOP NODE.JS EXPRESS GATEWAY                      │
│  [ JWT Auth Middleware | Helmet Security | Rate Limiting | Socket.IO Hub ]   │
└──────────────┬──────────────────────┬───────────────────────┬───────────────┘
               │                      │                       │
               ▼                      ▼                       ▼
┌────────────────────────┐  ┌───────────────────┐   ┌────────────────────────┐
│  POSTGRESQL DATABASE   │  │   REDIS CACHE     │   │     GEMINI 3.6 AI      │
│ (User, Feed, Chat,     │  │ (Session Store,   │   │  (Captions, Bio, Mod,  │
│  Reels, Stories Tables)│  │  Rate Limiter)    │   │   Assistant & Audio)   │
└────────────────────────┘  └───────────────────┘   └────────────────────────┘
            `}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <h3 className="font-bold text-sm text-indigo-300 mb-2">Frontend Architecture</h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Flutter Clean Architecture (Domain, Data, Presentation)</li>
                <li>Material 3 Adaptive UI System</li>
                <li>Riverpod 2.x for Reactive State Management</li>
                <li>GoRouter for Declarative Nested Route Management</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <h3 className="font-bold text-sm text-pink-300 mb-2">Backend Architecture</h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Node.js + Express.js API Gateway</li>
                <li>Socket.IO WebSocket for sub-10ms chat & call signaling</li>
                <li>PostgreSQL Relational DB with foreign key constraints</li>
                <li>Server-Side @google/genai SDK Integration</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PostgreSQL Schema */}
      {activeTab === 'database' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-lg text-purple-300 flex items-center space-x-2">
            <Database size={20} />
            <span>PostgreSQL Database Relational Schema</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise schema definition with indexes, foreign key constraints, and cascade delete behavior.
          </p>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-purple-200 overflow-x-auto">
            <pre>{`-- CONNECTX PRODUCTION POSTGRESQL SCHEMA

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    caption TEXT,
    location VARCHAR(100),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stories (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    group_id VARCHAR(64),
    text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);`}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Flutter Setup */}
      {activeTab === 'flutter' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-lg text-purple-300 flex items-center space-x-2">
            <Code size={20} />
            <span>Flutter Clean Architecture Folder Structure</span>
          </h2>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
            <pre>{`lib/
├── main.dart
├── core/
│   ├── config/app_config.dart
│   ├── network/api_client.dart
│   ├── theme/material3_theme.dart
│   └── utils/validators.dart
├── features/
│   ├── auth/
│   │   ├── domain/usecases/login_usecase.dart
│   │   ├── presentation/controllers/auth_controller.dart
│   │   └── presentation/screens/login_screen.dart
│   ├── feed/
│   │   ├── domain/models/post_model.dart
│   │   ├── presentation/controllers/feed_controller.dart
│   │   └── presentation/screens/feed_screen.dart
│   ├── chat/
│   │   ├── presentation/screens/chat_screen.dart
│   │   └── services/socket_service.dart
│   └── reels/
│       └── presentation/screens/reels_screen.dart
└── router/app_router.dart`}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Backend Setup */}
      {activeTab === 'backend' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-lg text-purple-300 flex items-center space-x-2">
            <Server size={20} />
            <span>Node.js Express Server Setup</span>
          </h2>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            <pre>{`src/
├── server.ts
├── config/
│   ├── db.ts (PostgreSQL Pool)
│   └── redis.ts (Redis Client)
├── controllers/
│   ├── authController.ts
│   ├── postController.ts
│   └── aiController.ts
├── middlewares/
│   ├── authMiddleware.ts
│   └── rateLimiter.ts
├── socket/
│   └── chatSocket.ts
└── services/
    └── geminiService.ts (@google/genai)`}</pre>
          </div>
        </div>
      )}

      {/* Tab 5: DevOps & Security */}
      {activeTab === 'devops' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-lg text-purple-300 flex items-center space-x-2">
            <Terminal size={20} />
            <span>Docker & Production Deployment</span>
          </h2>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-200 overflow-x-auto">
            <pre>{`# DOCKER-COMPOSE PRODUCTION SPEC
version: '3.8'

services:
  connectx-backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - JWT_SECRET=\${JWT_SECRET}
      - DATABASE_URL=postgres://connectx:secret@postgres:5432/connectx_db
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: connectx
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: connectx_db
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
