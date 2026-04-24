import React from 'react';
import { Users, UserX, Clock, BadgeDollarSign, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm interactive-hover">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
        {icon}
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`flex items-center font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-slate-500'}`}>
        {trend === 'up' && <ArrowUpRight size={16} className="mr-1" />}
        {subtext}
      </span>
    </div>
  </div>
);

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="1,248" 
          subtext="+12 this month" 
          icon={<Users size={24} />} 
          trend="up" 
        />
        <StatCard 
          title="Daily Attendance" 
          value="96.2%" 
          subtext="On time today" 
          icon={<Clock size={24} />} 
          trend="up" 
        />
        <StatCard 
          title="Absent Today" 
          value="48" 
          subtext="Requires reviewing" 
          icon={<UserX size={24} />} 
          trend="none" 
        />
         <StatCard 
          title="Fee Collection" 
          value="82%" 
          subtext="+4% vs last term" 
          icon={<BadgeDollarSign size={24} />} 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50 text-slate-400">
             Chart Area (Coming Soon)
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {['Record Attendance', 'Collect Fee', 'Issue Library Book', 'Publish Notice'].map((action, i) => (
              <button key={i} className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-colors group flex justify-between items-center">
                <span className="font-medium text-slate-700 group-hover:text-brand-700">{action}</span>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
