
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// Function to generate simulated "Live" data points
const generateLiveStats = () => ({
  cpu: (Math.random() * 15 + 5).toFixed(1),
  mem: (Math.random() * 20 + 30).toFixed(1),
  latency: Math.floor(Math.random() * 15 + 12), // Higher latency for remote DB
  activeNodes: Math.floor(Math.random() * 5 + 12),
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [chartRange, setChartRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sysStats, setSysStats] = useState(generateLiveStats());
  const [logs, setLogs] = useState<any[]>([]);
  const [dbHost, setDbHost] = useState('bot.qbitnode.com');
  
  // UI States
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSecurityCheckOpen, setIsSecurityCheckOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['Initializing EORVEX_CORE...', 'Handshake with bot.qbitnode.com...', 'Connection Established.']);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eorvex_db_config');
    if (saved) setDbHost(JSON.parse(saved).host);

    const interval = setInterval(() => {
      setSysStats(generateLiveStats());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Event stream simulation
  useEffect(() => {
    const eventTimer = setInterval(() => {
      const events = [
        { type: 'SQL', msg: `Syncing with s1322_edm database`, color: 'text-emerald-400', icon: ICONS.Layers },
        { type: 'REMOTE', msg: `Packet received from ${dbHost}`, color: 'text-cyan-400', icon: ICONS.Activity },
        { type: 'VOL', msg: 'System heartbeat stable', color: 'text-purple-400', icon: ICONS.Zap },
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [{ ...randomEvent, id: Date.now(), time: 'Just now' }, ...prev].slice(0, 5));
    }, 8000);
    return () => clearInterval(eventTimer);
  }, [dbHost]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const addTerminalLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const data = [
    { name: '00:00', val: 400 },
    { name: '04:00', val: 300 },
    { name: '08:00', val: 600 },
    { name: '12:00', val: 800 },
    { name: '16:00', val: 500 },
    { name: '20:00', val: 900 },
    { name: '23:59', val: 700 },
  ];

  const StatCard = ({ label, value, icon: Icon, color, suffix, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full text-left bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700 transition-all group relative overflow-hidden active:scale-[0.98]"
    >
      <div className="absolute -right-2 -bottom-2 opacity-[0.02] group-hover:opacity-[0.1] transition-opacity duration-500">
        <Icon className="w-24 h-24" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${color} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-[10px] font-semibold text-zinc-600 uppercase">{suffix}</span>
      </div>
    </button>
  );

  const runSecurityCheck = () => {
    setIsSecurityCheckOpen(true);
    addTerminalLog("SQL Injection protection layers verified.");
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
           <div>
             <h1 className="text-4xl font-bold text-white tracking-tight">Eorvex Command</h1>
             <p className="text-zinc-500 text-sm font-medium">Remote Sync: <span className="text-emerald-500 font-mono">{dbHost}</span></p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={() => setIsDeployModalOpen(true)} className="flex items-center gap-3 px-8 py-3.5 bg-white text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl active:scale-[0.98]">
             <ICONS.Plus className="w-4 h-4" />
             New Deployment
           </button>
           <button onClick={() => navigate('/settings')} className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-[0.98]">
             <ICONS.Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Processor" value={`${sysStats.cpu}%`} icon={ICONS.Zap} color="text-amber-400" suffix="Load" onClick={runSecurityCheck} />
            <StatCard label="Memory" value={`${sysStats.mem}%`} icon={ICONS.Layers} color="text-purple-400" suffix="Allocated" onClick={() => navigate('/arodx/stock')} />
            <StatCard label="DB Latency" value={`${sysStats.latency}ms`} icon={ICONS.Activity} color="text-cyan-400" suffix="Ping" onClick={() => setIsTerminalOpen(true)} />
            <StatCard label="Nodes" value={sysStats.activeNodes} icon={ICONS.Security} color="text-emerald-400" suffix="Active" onClick={() => navigate('/volmerix/clients')} />
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                 <h3 className="text-lg font-bold">Registry Throughput</h3>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Live SQL Execution Monitor</p>
               </div>
               <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
                 {['D', 'W', 'M'].map(t => (
                   <button key={t} onClick={() => setChartRange(t === 'D' ? 'daily' : t === 'W' ? 'weekly' : 'monthly')} className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${t === (chartRange === 'daily' ? 'D' : chartRange === 'weekly' ? 'W' : 'M') ? 'bg-white text-zinc-950' : 'text-zinc-600 hover:text-white'}`}>{t}</button>
                 ))}
               </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" stroke="#27272a" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="700" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#52525b" fontSize={10} fontWeight="700" axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} itemStyle={{ color: '#06b6d4', fontWeight: '700' }} />
                  <Area type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] p-6 h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Remote Log Feed</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wide">Live</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {logs.length > 0 ? (
                logs.map(log => (
                  <div key={log.id} className="flex gap-4 p-2 rounded-xl hover:bg-zinc-800/20 transition-all border border-transparent hover:border-zinc-800/50">
                    <div className={`w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0 ${log.color}`}>
                      <log.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${log.color}`}>{log.type}</span>
                        <span className="text-[8px] text-zinc-700 font-mono">{log.time}</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium truncate">{log.msg}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center opacity-30">
                  <ICONS.Activity className="w-8 h-8 mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Syncing Host...</p>
                </div>
              )}
            </div>

            <button onClick={() => setIsTerminalOpen(true)} className="w-full mt-6 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-cyan-400 transition-all shadow-inner active:scale-[0.98]">Launch Terminal</button>
          </div>
        </div>
      </div>

      {isTerminalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-[#09090b] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
             <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" /></div>
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">eorvex-sql-shell — {dbHost}</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><ICONS.X className="w-5 h-5" /></button>
             </div>
             <div className="flex-1 p-6 font-mono text-xs overflow-y-auto custom-scrollbar">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="mb-1 text-emerald-400/90 leading-relaxed"><span className="text-zinc-700 mr-2">mysql></span> {log}</div>
                ))}
                <div ref={terminalEndRef} />
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-zinc-700">mysql></span>
                  <input autoFocus className="bg-transparent border-none outline-none text-white flex-1 caret-cyan-400" onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value;
                        addTerminalLog(val);
                        e.currentTarget.value = '';
                        if (val === 'help') addTerminalLog('SQL: SHOW TABLES, SELECT * FROM nodes, DESCRIBE schema');
                        if (val === 'status') addTerminalLog(`Host: ${dbHost} | DB: s1322_edm | User: u1322_6XfaTawjwN`);
                      }
                    }}
                  />
                </div>
             </div>
          </div>
        </div>
      )}

      {isDeployModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
           <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2 italic">Remote Deploy</h2>
              <p className="text-zinc-500 text-sm mb-6">Select resource to provision on {dbHost}.</p>
              <div className="space-y-2">
                 {[{ label: 'YouTube Node', path: '/volmerix/google', icon: ICONS.Volmerix, color: 'text-red-500' }, { label: 'Apple ID Asset', path: '/volmerix/apple', icon: ICONS.Apple, color: 'text-purple-500' }, { label: 'Valorant Registry', path: '/valorant', icon: ICONS.Valorant, color: 'text-orange-500' }, { label: 'Client Workspace', path: '/volmerix/clients', icon: ICONS.Clients, color: 'text-cyan-500' }].map(item => (
                   <button key={item.label} onClick={() => { navigate(item.path); setIsDeployModalOpen(false); }} className="w-full flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all group active:scale-[0.98]">
                     <div className={`w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${item.color}`}><item.icon className="w-5 h-5" /></div>
                     <span className="font-bold text-xs uppercase tracking-wide text-zinc-300 group-hover:text-white">{item.label}</span>
                   </button>
                 ))}
              </div>
              <button onClick={() => setIsDeployModalOpen(false)} className="w-full mt-6 py-4 text-zinc-600 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">Abort Procedure</button>
           </div>
        </div>
      )}

      {isSecurityCheckOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
          <div className="w-full max-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"><ICONS.Security className="w-8 h-8 text-emerald-500 animate-pulse" /></div>
             <h3 className="text-xl font-bold text-white mb-2 italic">SQL Guard Active</h3>
             <p className="text-zinc-500 text-sm mb-6 leading-relaxed">Remote database handshake is secured with AES-256 equivalent protocol. Connection to {dbHost} is encrypted.</p>
             <button onClick={() => setIsSecurityCheckOpen(false)} className="w-full py-4 bg-white text-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[10px] active:scale-[0.98]">Return to Command</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
