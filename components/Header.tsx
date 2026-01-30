
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { DatabaseConfig } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => {
    const saved = localStorage.getItem('eorvex_db_config');
    return saved ? JSON.parse(saved) : {
      host: 'bot.qbitnode.com',
      status: 'CONNECTED'
    };
  });

  useEffect(() => {
    const updateHeader = () => {
      const saved = localStorage.getItem('eorvex_db_config');
      if (saved) setDbConfig(JSON.parse(saved));
    };
    const interval = setInterval(updateHeader, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative group max-w-md w-full hidden md:block">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search records, accounts, logs..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-11 pr-5 text-xs outline-none focus:border-cyan-500/40 transition-all text-white placeholder:text-zinc-700 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5 border-r border-zinc-900 pr-6 h-10">
          <div className="hidden sm:flex flex-col items-end justify-center">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none mb-1 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               DB: {dbConfig.host}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-tight">Handshake Verified</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900/50 border border-zinc-800/50 hover:border-cyan-500/20 rounded-xl transition-all shadow-sm">
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            <ICONS.Security className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-900/50 border border-zinc-800/50 rounded-xl transition-all shadow-sm"
          >
            <ICONS.Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
