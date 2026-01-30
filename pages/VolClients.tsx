
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';

const VolClients: React.FC = () => {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('eorvex_vol_clients');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newClient, setNewClient] = useState({ name: '', slug: '' });

  useEffect(() => {
    localStorage.setItem('eorvex_vol_clients', JSON.stringify(data));
  }, [data]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewClient({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setNewClient({ name: item.name, slug: item.slug });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newClient.name) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...newClient } : item));
    } else {
      const client = {
        id: Date.now().toString(),
        name: newClient.name,
        slug: newClient.slug || newClient.name.toLowerCase().replace(/\s+/g, '-'),
        accounts: 0,
        status: 'Active'
      };
      setData([...data, client]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setNewClient({ name: '', slug: '' });
  };

  const columns = [
    { key: 'name' as const, label: 'Client Name' },
    { key: 'slug' as const, label: 'Portal URL', render: (val: string) => (
      <span className="font-mono text-cyan-400 text-xs">/client/{val}</span>
    )},
    { key: 'accounts' as const, label: 'Total Accts' },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">{val}</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Client Hub</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage personalized workspaces and read-only portals.</p>
        </div>
      </div>
      <DataTable 
        title="Client Workspaces" 
        data={data} 
        columns={columns} 
        onAdd={handleOpenAddModal}
        onEdit={handleOpenEditModal}
        onDelete={(item) => setData(data.filter(x => x.id !== item.id))}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingItem ? 'Edit Workspace' : 'New Workspace'}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                value={newClient.name}
                placeholder="Client Name" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                onChange={e => setNewClient({...newClient, name: e.target.value})}
              />
              <input 
                type="text" 
                value={newClient.slug}
                placeholder="URL Slug (optional)" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                onChange={e => setNewClient({...newClient, slug: e.target.value})}
              />
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-4 rounded-xl bg-cyan-500 text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400/90 transition-colors">
                  {editingItem ? 'Save Changes' : 'Create Hub'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolClients;
