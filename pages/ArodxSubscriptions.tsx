
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';

const ArodxSubscriptions: React.FC = () => {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('eorvex_arodx_subs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newSub, setNewSub] = useState({ client: '', product: '', expiry: '', price: '' });

  useEffect(() => {
    localStorage.setItem('eorvex_arodx_subs', JSON.stringify(data));
  }, [data]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewSub({ client: '', product: '', expiry: '', price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setNewSub({ client: item.client, product: item.product, expiry: item.expiry, price: item.price });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newSub.client || !newSub.product) return;
    
    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...newSub } : item));
    } else {
      setData([...data, { ...newSub, id: Date.now().toString() }]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setNewSub({ client: '', product: '', expiry: '', price: '' });
  };

  const columns = [
    { key: 'client' as const, label: 'Client' },
    { key: 'product' as const, label: 'Product' },
    { key: 'expiry' as const, label: 'Expiry Date' },
    { key: 'price' as const, label: 'Monthly' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Hub</h1>
        <p className="text-zinc-500 text-sm font-medium">General multi-platform subscription manager.</p>
      </div>
      <DataTable 
        title="Active Subscriptions" 
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
              {editingItem ? 'Edit Subscription' : 'New Subscription'}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                value={newSub.client}
                placeholder="Client" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors"
                onChange={e => setNewSub({...newSub, client: e.target.value})}
              />
              <input 
                type="text" 
                value={newSub.product}
                placeholder="Product" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors"
                onChange={e => setNewSub({...newSub, product: e.target.value})}
              />
              <input 
                type="date" 
                value={newSub.expiry}
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors"
                onChange={e => setNewSub({...newSub, expiry: e.target.value})}
              />
              <input 
                type="text" 
                value={newSub.price}
                placeholder="Price" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors"
                onChange={e => setNewSub({...newSub, price: e.target.value})}
              />
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-emerald-500 text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors">
                  {editingItem ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArodxSubscriptions;
