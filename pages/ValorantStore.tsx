
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { ValorantAccount, ValorantStatus } from '../types';

const ValorantStore: React.FC = () => {
  const [data, setData] = useState<ValorantAccount[]>(() => {
    const saved = localStorage.getItem('eorvex_valo_depot');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ValorantAccount | null>(null);
  const [newAcc, setNewAcc] = useState<Partial<ValorantAccount>>({
    status: ValorantStatus.UNSOLD,
    level: 20
  });

  useEffect(() => {
    localStorage.setItem('eorvex_valo_depot', JSON.stringify(data));
  }, [data]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewAcc({ status: ValorantStatus.UNSOLD, level: 20, username: '', price: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ValorantAccount) => {
    setEditingItem(item);
    setNewAcc(item);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newAcc.username || !newAcc.price) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...newAcc } as ValorantAccount : item));
    } else {
      const account: ValorantAccount = {
        id: Date.now().toString(),
        username: newAcc.username!,
        password: newAcc.password || '••••••••',
        email: newAcc.email || '-',
        price: Number(newAcc.price),
        level: Number(newAcc.level) || 20,
        status: ValorantStatus.UNSOLD,
        ...newAcc
      } as ValorantAccount;
      setData([...data, account]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setNewAcc({ status: ValorantStatus.UNSOLD, level: 20 });
  };

  const columns = [
    { key: 'username' as const, label: 'Game ID' },
    { key: 'level' as const, label: 'Level', render: (val: number) => (
      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-orange-500">
        LVL {val}
      </span>
    )},
    { key: 'price' as const, label: 'Price', render: (val: number) => (
      <span className="font-bold text-sm text-white">৳{val?.toLocaleString() || '0'}</span>
    )},
    { key: 'status' as const, label: 'Status', render: (val: ValorantStatus) => (
      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${val === ValorantStatus.UNSOLD ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
        {val}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Valorant Depot</h1>
          <p className="text-zinc-500 text-sm font-medium">Digital asset inventory and sales tracker.</p>
        </div>
      </div>
      <DataTable 
        title="Account Inventory" 
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
              {editingItem ? 'Edit Valo Asset' : 'Add Valo Asset'}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                value={newAcc.username}
                placeholder="Username / Riot ID" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-orange-500 transition-colors"
                onChange={e => setNewAcc({...newAcc, username: e.target.value})}
              />
              <input 
                type="number" 
                value={newAcc.level}
                placeholder="Level" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-orange-500 transition-colors"
                onChange={e => setNewAcc({...newAcc, level: Number(e.target.value)})}
              />
              <input 
                type="number" 
                value={newAcc.price}
                placeholder="Price (BDT)" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-orange-500 transition-colors"
                onChange={e => setNewAcc({...newAcc, price: Number(e.target.value)})}
              />
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Back</button>
                <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-orange-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-colors">
                  {editingItem ? 'Update Registry' : 'Store Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValorantStore;
