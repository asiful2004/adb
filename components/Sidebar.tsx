
import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { ICONS, NAV_ITEMS } from '../constants';
import { User, BrandingConfig } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  onLogout: () => void;
  branding?: BrandingConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, user, branding }) => {
  const location = useLocation();

  if (!user) return null;

  // Render all nav items since auth is removed
  const filteredNavItems = NAV_ITEMS;

  return (
    <aside 
      className={`
        relative bg-zinc-950 border-r border-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40
        ${isOpen ? 'w-64' : 'w-20'}
        flex flex-col h-screen
      `}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-900/50">
        <Link 
          to="/" 
          className={`flex items-center gap-3 transition-all duration-500 overflow-hidden group ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105 overflow-hidden">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <ICONS.Security className="w-4 h-4 text-zinc-950" />
            )}
          </div>
          <span className="font-bold text-lg text-white whitespace-nowrap">
            {branding?.title || 'Eorvex'}
          </span>
        </Link>
        
        <button 
          onClick={toggleSidebar}
          className={`
            p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all
            ${!isOpen ? 'mx-auto' : ''}
          `}
        >
          {isOpen ? <ICONS.ChevronLeft className="w-4 h-4" /> : <ICONS.Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        {filteredNavItems.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const isItemActive = item.path ? location.pathname === item.path : item.children?.some(c => location.pathname === c.path);

          return (
            <div key={item.id} className="space-y-1">
              {!item.children ? (
                <NavLink
                  to={item.path || '/'}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-cyan-500/10 text-cyan-400 font-bold' 
                      : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200'}
                    ${!isOpen ? 'justify-center px-0' : ''}
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isItemActive ? 'text-cyan-400' : ''}`} />
                  {isOpen && <span className="text-xs font-semibold">{item.label}</span>}
                  {isItemActive && (
                    <div className="absolute left-0 w-1 h-5 bg-cyan-400 rounded-r-full shadow-lg" />
                  )}
                </NavLink>
              ) : (
                <div className="pt-3 first:pt-0">
                  {isOpen ? (
                    <div className="px-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span>{item.label}</span>
                       <div className="h-px flex-1 bg-zinc-900" />
                    </div>
                  ) : (
                    <div className="h-px w-8 mx-auto bg-zinc-900 mb-3" />
                  )}
                  {item.children.map(child => {
                    const ChildIcon = ICONS[child.icon as keyof typeof ICONS] || ICONS.Layers;
                    const isActive = location.pathname === child.path;
                    return (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={`
                          flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all text-xs group relative
                          ${isActive 
                            ? 'text-cyan-400 font-bold' 
                            : 'text-zinc-600 hover:text-zinc-200 hover:bg-zinc-900/30'}
                          ${!isOpen ? 'justify-center px-0' : ''}
                        `}
                      >
                        <div className={`
                          flex-shrink-0 transition-all duration-300 flex items-center justify-center
                          ${!isOpen ? 'w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800' : 'w-5 h-5'}
                          ${isActive ? (isOpen ? '' : 'border-cyan-500 text-cyan-400 bg-cyan-500/5') : ''}
                        `}>
                          <ChildIcon className="w-4 h-4" />
                        </div>
                        {isOpen && <span className="font-medium">{child.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Simplified Footer - Brand Identity Only */}
      <div className="p-6 bg-zinc-950/50 border-t border-zinc-900 text-center">
        <p className="text-[9px] text-zinc-800 font-mono font-bold uppercase tracking-widest">
          {isOpen ? `${branding?.title.toUpperCase() || 'EORVEX'} CORE v1.1.0` : 'E.C.'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
