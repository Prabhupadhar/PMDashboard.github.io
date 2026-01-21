
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activeTab: 'upload' | 'saved' | 'current';
  setActiveTab: (tab: 'upload' | 'saved' | 'current') => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const navItems = [
    { id: 'upload', label: 'Create New', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )},
    { id: 'current', label: 'Active Draft', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )},
    { id: 'saved', label: 'Brain Folder', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950 text-white flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-4 lg:p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div className="flex-shrink-0 w-10 h-10 brain-gradient rounded-xl flex items-center justify-center font-extrabold text-white text-xl brain-glow">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="hidden lg:block font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PM BRAIN</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 w-1 h-6 brain-gradient rounded-r-full"></div>
              )}
              <div className={`${activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex-shrink-0 w-9 h-9 brain-gradient rounded-lg flex items-center justify-center font-bold text-white text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold truncate leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate mt-1">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-400 rounded-lg transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden lg:block">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
