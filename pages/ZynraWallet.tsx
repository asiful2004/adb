
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

const ZynraWallet: React.FC = () => {
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('eorvex_zynra_wallets');
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({ wallet: '', cost: '', price: '', note: '' });

  useEffect(() => {
    localStorage.setItem('eorvex_zynra_wallets', JSON.stringify(history));
  }, [history]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wallet || !formData.cost || !formData.price) return;
    const profit = Number(formData.price) - Number(formData.cost);
    const record = {
      id: Date.now().toString(),
      wallet: formData.wallet,
      cost: formData.cost,
      price: formData.price,
      profit: profit.toFixed(2),
      note: formData.note,
      date: new Date().toLocaleDateString()
    };
    setHistory([record, ...history]);
    setFormData({ wallet: '', cost: '', price: '', note: '' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Zynra Wallet</h1>
        <p className="text-zinc-500 text-sm font-medium">Profit & Loss calculator for specialized wallets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-amber-500">
              <ICONS.Zynra className="w-5 h-5" />
              New Calculation
            </h2>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-600 mb-1.5 block tracking-widest">Wallet Identifier</label>
                <input 
                  type="text" 
                  value={formData.wallet}
                  onChange={e => setFormData({...formData, wallet: e.target.value})}
                  placeholder="e.g. Binance-A1" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-600 mb-1.5 block tracking-widest">Purchase Cost</label>
                  <input 
                    type="number" 
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white shadow-inner" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-600 mb-1.5 block tracking-widest">Sale Price</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white shadow-inner" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-600 mb-1.5 block tracking-widest">Note</label>
                <textarea 
                  rows={3} 
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  placeholder="Optional details..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500/50 outline-none transition-all resize-none text-white shadow-inner" 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all mt-4">
                Calculate & Save
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[400px] shadow-sm">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20">
               <h2 className="text-lg font-bold text-white">Audit Trail</h2>
               <button onClick={() => setHistory([])} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Wipe History</button>
            </div>
            {history.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-950/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Wallet</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profit</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {history.map((item, i) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4 font-bold text-sm text-white">{item.wallet}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold ${Number(item.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {Number(item.profit) >= 0 ? '+' : ''}${item.profit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500 font-mono">{item.date}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setHistory(history.filter(h => h.id !== item.id))} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><ICONS.Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                 <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-800">
                   <ICONS.Zynra className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">No calculation records available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZynraWallet;
