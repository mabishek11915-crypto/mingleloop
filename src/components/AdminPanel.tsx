import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, FileText, AlertTriangle, Activity, Ban, CheckCircle } from 'lucide-react';
import { SystemStats, User } from '../types';

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats);
      setUserList(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBan = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white pb-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="font-bold text-xl">MingleLoop Admin Control Panel</h1>
            <p className="text-xs text-slate-400">Enterprise Moderation & Telemetry Dashboard</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
          Super Admin Privileges
        </span>
      </div>

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Registered</span>
            <span className="text-xl font-extrabold block text-purple-400">{stats.totalUsers}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active Posts</span>
            <span className="text-xl font-extrabold block text-indigo-400">{stats.totalPosts}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending Reports</span>
            <span className="text-xl font-extrabold block text-pink-400">{stats.pendingReports}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">AI Audited Items</span>
            <span className="text-xl font-extrabold block text-emerald-400">{stats.aiModeratedCount}</span>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="font-bold text-base flex items-center space-x-2">
          <Users size={18} className="text-purple-400" />
          <span>User Accounts Management</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">User</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userList.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-2 flex items-center space-x-2">
                    <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold block text-slate-200">{u.fullName}</span>
                      <span className="text-[10px] text-purple-300">@{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono uppercase text-[10px] text-slate-300">{u.role}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'banned' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleToggleBan(u.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        u.status === 'banned'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {u.status === 'banned' ? 'Unban User' : 'Ban User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
