
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import VolGoogleAccounts from './pages/VolGoogleAccounts';
import VolAppleAccounts from './pages/VolAppleAccounts';
import VolClients from './pages/VolClients';
import ArodxSubscriptions from './pages/ArodxSubscriptions';
import ArodxStock from './pages/ArodxStock';
import ZynraWallet from './pages/ZynraWallet';
import ValorantStore from './pages/ValorantStore';
import Settings from './pages/Settings';
import { User, UserRole, BrandingConfig } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [branding, setBranding] = useState<BrandingConfig>({
    title: 'Eorvex',
    logoUrl: '',
    faviconUrl: ''
  });

  useEffect(() => {
    // Listen for branding changes in local storage (cross-tab or internal updates)
    const updateBranding = () => {
      const saved = localStorage.getItem('eorvex_branding');
      if (saved) {
        setBranding(JSON.parse(saved));
      }
    };

    updateBranding();
    window.addEventListener('storage', updateBranding);
    
    // Also poll slightly if local storage doesn't trigger 'storage' event on the same page
    const interval = setInterval(updateBranding, 1000);

    return () => {
      window.removeEventListener('storage', updateBranding);
      clearInterval(interval);
    };
  }, []);

  // Default system user with full access
  const currentUser: User = {
    id: 'system-root',
    username: 'AyonAhmed',
    role: UserRole.OWNER,
    avatarUrl: 'https://ui-avatars.com/api/?name=Ayon+Ahmed&background=06b6d4&color=fff'
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <HashRouter>
      <div className="flex h-screen bg-[#060608] text-[#fafafa] overflow-hidden selection:bg-cyan-500/30">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          user={currentUser} 
          onLogout={() => {}} 
          branding={branding}
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar scroll-smooth">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/volmerix/google" element={<VolGoogleAccounts />} />
              <Route path="/volmerix/apple" element={<VolAppleAccounts />} />
              <Route path="/volmerix/clients" element={<VolClients />} />
              <Route path="/arodx/subscriptions" element={<ArodxSubscriptions />} />
              <Route path="/arodx/stock" element={<ArodxStock />} />
              <Route path="/zynra" element={<ZynraWallet />} />
              <Route path="/valorant" element={<ValorantStore />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
