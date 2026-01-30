
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(token);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6 selection:bg-cyan-500/30">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cyan-600/5 blur-[160px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/5 blur-[160px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800/50 shadow-2xl mb-8 relative group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <ICONS.Security className="w-10 h-10 text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-white">Eorvex</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">System Authentication Required</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[40px] p-10 shadow-3xl backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-2">
                Secure Token Access
              </label>
              <div className="relative group">
                <input 
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter 64-character hash..."
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-cyan-500/50 rounded-2xl py-5 px-6 text-sm outline-none transition-all placeholder:text-zinc-800 text-white font-mono shadow-inner"
                  required
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                   <ICONS.Security className={`w-5 h-5 transition-all duration-500 ${token ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-zinc-900'}`} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full bg-white text-zinc-950 font-bold py-5 rounded-2xl transition-all transform active:scale-95 shadow-2xl hover:bg-cyan-400 flex items-center justify-center gap-4 uppercase tracking-widest text-xs disabled:opacity-30"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <ICONS.ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center relative z-10">
            <p className="text-[10px] text-zinc-600 font-bold mb-4 uppercase tracking-widest">
              Manual Generator
            </p>
            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/30 group hover:border-cyan-500/20 transition-all cursor-default">
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Direct request <span className="text-cyan-400 font-bold tracking-widest">/token</span> within the Eorvex core Discord node.
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[9px] text-zinc-800 font-mono font-bold uppercase tracking-widest">
          &copy; 2026 Eorvex Ltd. Grid Auth Persistent
        </p>
      </div>
    </div>
  );
};

export default Login;
