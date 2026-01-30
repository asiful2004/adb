
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { AppleAccount, SubscriptionStatus } from '../types';

const VolAppleAccounts: React.FC = () => {
  const [data, setData] = useState<AppleAccount[]>(() => {
    const saved = localStorage.getItem('eorvex_vol_apple');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AppleAccount | null>(null);
  const [newAcc, setNewAcc] = useState<Partial<AppleAccount>>({
    status: SubscriptionStatus.ACTIVE,
    balance: 0
  });

  useEffect(() => {
    localStorage.setItem('eorvex_vol_apple', JSON.stringify(data));
  }, [data]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewAcc({
      status: SubscriptionStatus.ACTIVE,
      balance: 0,
      apple_id: '',
      apple_password: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AppleAccount) => {
    setEditingItem(item);
    setNewAcc(item);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newAcc.apple_id || !newAcc.apple_password) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...newAcc } as AppleAccount : item));
    } else {
      const account: AppleAccount = {
        id: Date.now().toString(),
        apple_id: newAcc.apple_id!,
        apple_password: newAcc.apple_password!,
        security_q1: newAcc.security_q1 || '',
        security_q2: newAcc.security_q2 || '',
        security_q3: newAcc.security_q3 || '',
        balance: Number(newAcc.balance) || 0,
        status: SubscriptionStatus.ACTIVE,
        ...newAcc
      } as AppleAccount;
      setData([...data, account]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setNewAcc({ status: SubscriptionStatus.ACTIVE, balance: 0 });
  };

  const columns = [
    { key: 'apple_id' as const, label: 'Apple ID' },
    { key: 'balance' as const, label: 'Balance', render: (val: number) => (
      <span className="font-mono text-emerald-400 font-bold">${val?.toFixed(2) || '0.00'}</span>
    )},
    { key: 'security_q1' as const, label: 'Q1 Answer', render: (val: string) => val ? '••••••••' : '-' },
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Apple Vault</h1>
          <p className="text-zinc-500 text-sm font-medium">Apple ID assets and security keys.</p>
        </div>
      </div>
      <DataTable 
        title="Apple Accounts" 
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
              {editingItem ? 'Edit Apple Vault' : 'Register Apple Vault'}
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Apple ID</label>
                <input 
                  type="text" 
                  value={newAcc.apple_id}
                  placeholder="Apple ID" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-purple-500 transition-colors"
                  onChange={e => setNewAcc({...newAcc, apple_id: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Password</label>
                <input 
                  type="password" 
                  value={newAcc.apple_password}
                  placeholder="Password" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-purple-500 transition-colors"
                  onChange={e => setNewAcc({...newAcc, apple_password: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Current Balance ($)</label>
                  <input 
                    type="number" 
                    value={newAcc.balance}
                    placeholder="Initial Balance ($)" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-purple-500 transition-colors"
                    onChange={e => setNewAcc({...newAcc, balance: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Status</label>
                  <select 
                    value={newAcc.status}
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-purple-500 transition-colors"
                    onChange={e => setNewAcc({...newAcc, status: e.target.value as SubscriptionStatus})}
                  >
                    <option value={SubscriptionStatus.ACTIVE}>Active</option>
                    <option value={SubscriptionStatus.ARCHIVED}>Archived</option>
                    <option value={SubscriptionStatus.DISABLED}>Disabled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-purple-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-purple-500 transition-colors">
                  {editingItem ? 'Update Vault' : 'Secure Asset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolAppleAccounts;
