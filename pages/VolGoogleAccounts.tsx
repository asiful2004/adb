
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { GoogleAccount, SubscriptionStatus } from '../types';
import { ICONS } from '../constants';

const VolGoogleAccounts: React.FC = () => {
  const [data, setData] = useState<GoogleAccount[]>(() => {
    const saved = localStorage.getItem('eorvex_vol_google');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GoogleAccount | null>(null);
  const [newAcc, setNewAcc] = useState<Partial<GoogleAccount>>({
    plan_duration: '1_MONTH',
    subscription_phase: 'NEW_BUY',
    status: SubscriptionStatus.ACTIVE
  });

  useEffect(() => {
    localStorage.setItem('eorvex_vol_google', JSON.stringify(data));
  }, [data]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewAcc({
      plan_duration: '1_MONTH',
      subscription_phase: 'NEW_BUY',
      status: SubscriptionStatus.ACTIVE,
      gmail_id: '',
      gmail_password: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GoogleAccount) => {
    setEditingItem(item);
    setNewAcc(item);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newAcc.gmail_id || !newAcc.gmail_password) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...newAcc } as GoogleAccount : item));
    } else {
      const account: GoogleAccount = {
        id: Date.now().toString(),
        gmail_id: newAcc.gmail_id!,
        gmail_password: newAcc.gmail_password!,
        subscription_phase: newAcc.subscription_phase!,
        plan_duration: newAcc.plan_duration as any,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: SubscriptionStatus.ACTIVE,
        ...newAcc
      } as GoogleAccount;
      setData([...data, account]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setNewAcc({ plan_duration: '1_MONTH', subscription_phase: 'NEW_BUY', status: SubscriptionStatus.ACTIVE });
  };

  const columns = [
    { key: 'gmail_id' as const, label: 'Gmail ID' },
    { key: 'subscription_phase' as const, label: 'Phase', render: (val: string) => (
      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase">
        {val}
      </span>
    )},
    { key: 'plan_duration' as const, label: 'Plan', render: (val: string) => (
      <span className={`text-[10px] font-bold uppercase ${val === '1_YEAR' ? 'text-purple-400' : 'text-zinc-500'}`}>
        {val?.replace('_', ' ')}
      </span>
    )},
    { key: 'start_date' as const, label: 'Start' },
    { key: 'end_date' as const, label: 'Expires', render: (val: string) => (
      <span className="font-mono text-zinc-400 text-xs">{val}</span>
    )},
    { key: 'status' as const, label: 'Status', render: (val: SubscriptionStatus) => (
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${val === SubscriptionStatus.ACTIVE ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
        <span className={`text-xs font-bold ${val === SubscriptionStatus.ACTIVE ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {val}
        </span>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Google Registry</h1>
          <p className="text-zinc-500 text-sm font-medium">Volmerix Subscription Database.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-2 flex flex-col items-center min-w-[100px] shadow-sm">
             <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 tracking-wider">Active Nodes</span>
             <span className="text-xl font-bold text-emerald-400">{data.filter(x => x.status === SubscriptionStatus.ACTIVE).length}</span>
           </div>
        </div>
      </div>

      <DataTable 
        title="Google Accounts" 
        data={data} 
        columns={columns} 
        onAdd={handleOpenAddModal}
        onEdit={handleOpenEditModal}
        onDelete={(item) => setData(data.filter(x => x.id !== item.id))}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingItem ? 'Edit Account Node' : 'Provision New Account'}
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Gmail ID</label>
                <input 
                  type="text" 
                  value={newAcc.gmail_id}
                  placeholder="Gmail ID" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                  onChange={e => setNewAcc({...newAcc, gmail_id: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Password</label>
                <input 
                  type="password" 
                  value={newAcc.gmail_password}
                  placeholder="Password" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                  onChange={e => setNewAcc({...newAcc, gmail_password: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Plan Duration</label>
                  <select 
                    value={newAcc.plan_duration}
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                    onChange={e => setNewAcc({...newAcc, plan_duration: e.target.value as any})}
                  >
                    <option value="1_MONTH">1 Month</option>
                    <option value="1_YEAR">1 Year</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Current Phase</label>
                  <select 
                    value={newAcc.subscription_phase}
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                    onChange={e => setNewAcc({...newAcc, subscription_phase: e.target.value})}
                  >
                    <option value="NEW_BUY">NEW_BUY</option>
                    <option value="RENEWAL">RENEWAL</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-cyan-500 text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400/90 transition-colors">
                  {editingItem ? 'Update Registry' : 'Deploy Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolGoogleAccounts;
