
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

const ArodxStock: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>(() => {
    const saved = localStorage.getItem('eorvex_arodx_stock');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStock, setNewStock] = useState({ name: '', count: 0 });

  useEffect(() => {
    localStorage.setItem('eorvex_arodx_stock', JSON.stringify(stocks));
  }, [stocks]);

  const handleAdd = () => {
    if (!newStock.name) return;
    setStocks([...stocks, { ...newStock, id: Date.now().toString(), threshold: 5 }]);
    setIsModalOpen(false);
    setNewStock({ name: '', count: 0 });
  };

  const adjustStock = (id: string, delta: number) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, count: Math.max(0, s.count + delta) } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Stock Manager</h1>
          <p className="text-zinc-500 text-sm font-medium">Real-time inventory levels for digital keys and slots.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-cyan-400 hover:border-cyan-500/40 transition-all shadow-sm"
        >
          New Product
        </button>
      </div>

      {stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stocks.map((item, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group shadow-sm transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                   <ICONS.Stock className={`w-6 h-6 ${item.count <= item.threshold ? 'text-red-500' : 'text-cyan-400'}`} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => adjustStock(item.id, -1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-red-400 transition-colors"><ICONS.ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => adjustStock(item.id, 1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-emerald-400 transition-colors"><ICONS.Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1 text-zinc-400">{item.name}</h3>
              <div className="flex items-end justify-between">
                 <p className="text-4xl font-bold tracking-tight text-white">{item.count}</p>
                 <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">In Stock</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-[32px] p-24 text-center">
           <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-800">
             <ICONS.Stock className="w-8 h-8" />
           </div>
           <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-xs">Registry is currently empty</p>
           <button onClick={() => setIsModalOpen(true)} className="mt-6 text-xs text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline-offset-4 hover:underline">Provision Initial Asset</button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Inventory Sync</h2>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Product Name" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                onChange={e => setNewStock({...newStock, name: e.target.value})}
              />
              <input 
                type="number" placeholder="Initial Count" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none text-white focus:border-cyan-500 transition-colors"
                onChange={e => setNewStock({...newStock, count: Number(e.target.value)})}
              />
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">Abort</button>
                <button onClick={handleAdd} className="flex-1 py-4 rounded-xl bg-cyan-500 text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400/90 transition-colors">Commit Stock</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArodxStock;
