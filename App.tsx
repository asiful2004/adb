
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
import SetupWizard from './pages/SetupWizard';
import Login from './pages/Login';
import { User, UserRole, BrandingConfig } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSetupDone, setIsSetupDone] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [branding, setBranding] = useState<BrandingConfig>({
    title: 'Eorvex',
    logoUrl: '',
    faviconUrl: ''
  });

  useEffect(() => {
    // Check system status with a small delay to ensure DOM and storage readiness
    const checkState = () => {
      try {
        const setupStatus = localStorage.getItem('eorvex_setup_done') === 'true';
        const authStatus = localStorage.getItem('eorvex_auth_session') === 'true';
        
        setIsSetupDone(setupStatus);
        setIsAuthenticated(authStatus);

        const saved = localStorage.getItem('eorvex_branding');
        if (saved) setBranding(JSON.parse(saved));
      } catch (err) {
        console.error("Storage access error:", err);
        setIsSetupDone(false); // Default to setup if error
      }
    };

    const timer = setTimeout(checkState, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('eorvex_auth_session', 'true');
    setIsAuthenticated(true);
  };

  const handleSetupComplete = () => {
    setIsSetupDone(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('eorvex_auth_session');
    setIsAuthenticated(false);
  };

  // Prevent "Black Screen" while checking storage
  if (isSetupDone === null) {
    return (
      <div className="h-screen w-screen bg-[#060608] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
        <div className="flex flex-col items-center gap-2">
           <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Initializing Kernel</span>
           <span className="text-[8px] font-mono text-zinc-700 uppercase">Checking Environment States...</span>
        </div>
      </div>
    );
  }

  // 1. Force Setup if not done
  if (!isSetupDone) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  // 2. Force Login if setup done but not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // 3. Main Application Flow
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
          onLogout={handleLogout} 
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