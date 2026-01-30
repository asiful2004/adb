
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { User, UserRole, BrandingConfig, DatabaseConfig } from '../types';
import DataTable from '../components/DataTable';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branding' | 'users' | 'database'>('branding');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  // Branding State
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    const saved = localStorage.getItem('eorvex_branding');
    return saved ? JSON.parse(saved) : {
      title: 'Eorvex',
      logoUrl: '',
      faviconUrl: ''
    };
  });

  // Database State
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => {
    const saved = localStorage.getItem('eorvex_db_config');
    return saved ? JSON.parse(saved) : {
      host: 'bot.qbitnode.com',
      user: 'u1322_6XfaTawjwN',
      pass: 'I0A1uC5JdbQkqpE^vJ.xIG=n',
      name: 's1322_edm',
      status: 'CONNECTED'
    };
  });

  // Users Management State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eorvex_users_list');
    return saved ? JSON.parse(saved) : [
      { id: 'system-root', username: 'AyonAhmed', role: UserRole.OWNER, avatarUrl: 'https://ui-avatars.com/api/?name=Ayon+Ahmed&background=06b6d4&color=fff' }
    ];
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({ username: '', role: UserRole.STAFF });

  useEffect(() => {
    localStorage.setItem('eorvex_branding', JSON.stringify(branding));
    document.title = `${branding.title} | Management Panel`;
    
    if (branding.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = branding.faviconUrl;
    }
  }, [branding]);

  useEffect(() => {
    localStorage.setItem('eorvex_db_config', JSON.stringify(dbConfig));
  }, [dbConfig]);

  useEffect(() => {
    localStorage.setItem('eorvex_users_list', JSON.stringify(users));
  }, [users]);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System branding updated successfully.');
  };

  const handleSaveDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    setDbConfig({ ...dbConfig, status: 'CONNECTED' });
    alert('Database configuration synchronized. Remote handshake established.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'logo') {
        setBranding(prev => ({ ...prev, logoUrl: base64String }));
      } else {
        setBranding(prev => ({ ...prev, faviconUrl: base64String }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({ username: '', role: UserRole.STAFF });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({ username: user.username, role: user.role });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.username) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { 
        ...u, 
        username: userFormData.username, 
        role: userFormData.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${userFormData.username}&background=06b6d4&color=fff`
      } : u));
    } else {
      const user: User = {
        id: Date.now().toString(),
        username: userFormData.username,
        role: userFormData.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${userFormData.username}&background=06b6d4&color=fff`
      };
      setUsers([...users, user]);
    }
    
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserFormData({ username: '', role: UserRole.STAFF });
  };

  const userColumns = [
    { key: 'username' as const, label: 'Username' },
    { key: 'role' as const, label: 'Access Role', render: (val: UserRole) => (
      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${val === UserRole.OWNER ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
        {val}
      </span>
    )},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
          <p className="text-zinc-500 text-sm">Manage core identity, white-labeling, and access control.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-900 pb-px">
        <button 
          onClick={() => setActiveTab('branding')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'branding' ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'}`}
        >
          Branding & Identity
          {activeTab === 'branding' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('database')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'database' ? 'text-emerald-400' : 'text-zinc-500 hover:text-white'}`}
        >
          Database Link
          {activeTab === 'database' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'users' ? 'text-purple-400' : 'text-zinc-500 hover:text-white'}`}
        >
          User Management
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full" />}
        </button>
      </div>

      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
              <ICONS.Settings className="w-5 h-5 text-cyan-400" />
              General Branding
            </h2>
            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">App Title</label>
                <input 
                  type="text" 
                  value={branding.title}
                  onChange={e => setBranding({...branding, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 transition-all text-white" 
                  placeholder="e.g. Eorvex"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Logo</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={branding.logoUrl}
                    onChange={e => setBranding({...branding, logoUrl: e.target.value})}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 transition-all text-white" 
                    placeholder="URL or browse local"
                  />
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-cyan-400 transition-all"><ICONS.FileUp className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Favicon</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={branding.faviconUrl}
                    onChange={e => setBranding({...branding, faviconUrl: e.target.value})}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 transition-all text-white" 
                    placeholder="URL or browse local"
                  />
                  <input type="file" ref={faviconInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'favicon')} />
                  <button type="button" onClick={() => faviconInputRef.current?.click()} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-cyan-400 transition-all"><ICONS.FileUp className="w-5 h-5" /></button>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-cyan-400 transition-all shadow-lg">Apply Branding</button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] h-full flex flex-col justify-center items-center text-center shadow-xl">
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 overflow-hidden relative group">
                {branding.logoUrl ? <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <ICONS.Security className="w-10 h-10 text-cyan-400" />}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-[8px] font-bold text-white uppercase tracking-tighter">Live Preview</span></div>
              </div>
              <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 animate-pulse">Preview Show</p>
              <h3 className="text-xl font-bold text-white mb-2">{branding.title}</h3>
              <p className="text-zinc-500 text-xs font-medium max-w-[240px]">This is how your system will be identified across the dashboard and client portals.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="animate-in slide-in-from-right-12 duration-500 max-w-2xl">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-bold text-white flex items-center gap-3">
                 <ICONS.Layers className="w-5 h-5 text-emerald-400" />
                 MySQL Connection
               </h2>
               <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                 <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Link</span>
               </div>
            </div>

            <form onSubmit={handleSaveDatabase} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Host</label>
                  <input 
                    type="text" 
                    value={dbConfig.host}
                    onChange={e => setDbConfig({...dbConfig, host: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500 transition-all text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Database Name</label>
                  <input 
                    type="text" 
                    value={dbConfig.name}
                    onChange={e => setDbConfig({...dbConfig, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500 transition-all text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Username</label>
                  <input 
                    type="text" 
                    value={dbConfig.user}
                    onChange={e => setDbConfig({...dbConfig, user: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500 transition-all text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Password</label>
                  <input 
                    type="password" 
                    value={dbConfig.pass}
                    onChange={e => setDbConfig({...dbConfig, pass: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500 transition-all text-white" 
                  />
                </div>
              </div>

              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-[10px] text-zinc-600 leading-relaxed italic">
                * Data is currently being managed via a simulated MySQL layer synchronized with local persistent memory. Future updates will support direct TCP/IP sockets for production clusters.
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-emerald-400 transition-all shadow-lg">Save Configuration</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <DataTable 
            title="Registry Users"
            data={users}
            columns={userColumns}
            onAdd={handleOpenAddUser}
            onEdit={handleOpenEditUser}
            onDelete={(item) => item.id !== 'system-root' && setUsers(users.filter(u => u.id !== item.id))}
          />
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingUser ? 'Update Registry User' : 'New User Node'}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Identifier</label>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={userFormData.username}
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors" 
                  onChange={e => setUserFormData({...userFormData, username: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-2">Access Level</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors" 
                  value={userFormData.role} 
                  onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})} 
                >
                  {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsUserModalOpen(false)} 
                  className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors"
                >
                  Abort
                </button>
                <button 
                  onClick={handleSaveUser} 
                  className="flex-1 py-4 rounded-xl bg-cyan-500 text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-colors"
                >
                  {editingUser ? 'Commit Changes' : 'Commit User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
