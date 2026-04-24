import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, BookOpen, Clock, BadgeDollarSign, FileCheck, LogOut } from 'lucide-react';

const SidebarLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-100'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
    }`}
  >
    <div className={`mr-3 ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>{icon}</div>
    {label}
  </Link>
);

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { to: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { to: '/students', label: 'Students Directory', icon: <Users size={20} /> },
    { to: '/attendance', label: 'Attendance Check', icon: <Clock size={20} /> },
    { to: '/fees', label: 'Fee Management', icon: <BadgeDollarSign size={20} /> },
    { to: '/library', label: 'Library Issue', icon: <BookOpen size={20} /> },
    { to: '/exams', label: 'Exam Results', icon: <FileCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md mr-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Eduverse</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-4">Menu</div>
          {navLinks.map((link) => (
            <SidebarLink 
              key={link.to} 
              {...link} 
              isActive={location.pathname === link.to} 
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
             <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold mr-3 flex-shrink-0">
               {user.first_name?.[0]}{user.last_name?.[0]}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-slate-500 capitalize truncate">{user.role.replace('_', ' ')}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
          <div className="md:hidden">
            <span className="text-xl font-bold text-slate-800">Eduverse</span>
          </div>
          <div className="flex-1 flex justify-end">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold tracking-wide border border-brand-200 uppercase">
              {user.school_name || 'Greenfield Academy'} 
            </span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-surface-50">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
