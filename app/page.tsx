'use client';
import { useState, useEffect, useRef } from 'react';

export default function TorusSatellite() {
  const [cash, setCash] = useState(0);
  const [nodes, setNodes] = useState(0);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('OFFLINE');
  const [logs, setLogs] = useState<{msg: string, time: string}[]>([]);
  const [isBursting, setIsBursting] = useState(false);
  const burstInterval = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ msg, time }, ...prev].slice(0, 20));
  };

  const sendPulse = async (silent = false) => {
    if (!url) return;
    const cleanUrl = url.replace(/\/$/, "");
    try {
      const res = await fetch(`${cleanUrl}/api/ingress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'INGRESS', roomId: 'TORUS-01', timestamp: Date.now() }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus('ONLINE');
        if (data.current_count !== undefined) setCash(data.current_count);
        setNodes(prev => prev + 1);
        if (!silent) addLog('✅ PULSE_ACCEPTED');
      }
    } catch (e) {
      setStatus('OFFLINE');
      if (!silent) addLog('❌ CONN_ERROR');
    }
  };

  const toggleBurst = () => {
    if (isBursting) {
      if (burstInterval.current) clearInterval(burstInterval.current);
      setIsBursting(false);
      addLog('🛑 BURST_HALTED');
    } else {
      setIsBursting(true);
      addLog('🚀 BURST_MODE_ENGAGED');
      burstInterval.current = setInterval(() => sendPulse(true), 1000);
    }
  };

  const resetSystem = () => {
    if (!confirm('Reset System Statistics?')) return;
    setCash(0);
    setNodes(0);
    setLogs([]);
    addLog('♻️ SYSTEM_PURGED');
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#020617] text-[#f8fafc] font-mono overflow-x-hidden">
      {/* Header */}
      <header className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-4 rounded-3xl flex justify-between items-center mb-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-blue-500 border border-slate-700">T</div>
          <div>
            <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">Satellite UI</div>
            <div className="text-sm font-black text-white">TORUS V20.2</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black ${status === 'ONLINE' ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'}`}>
          {status}
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-4">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center">
          <div className="text-[8px] text-blue-400 font-black mb-1 uppercase tracking-widest">Core Cash ❤️</div>
          <div className="text-3xl font-black">{cash}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center">
          <div className="text-[8px] text-emerald-400 font-black mb-1 uppercase tracking-widest">Nodes ❤️</div>
          <div className="text-3xl font-black">{nodes}</div>
        </div>
      </div>

      {/* Burst Button */}
      <button 
        onClick={toggleBurst}
        className={`w-full max-w-md py-12 rounded-[40px] text-3xl font-black uppercase tracking-widest transition-all mb-4 ${
          isBursting 
          ? 'bg-slate-800 text-slate-500 translate-y-1 shadow-none' 
          : 'bg-white text-slate-950 shadow-[0_12px_0_#cbd5e1] active:translate-y-1 active:shadow-none'
        }`}
      >
        {isBursting ? '⚡ Bursting...' : '⚡ Burst'}
      </button>

      {/* Single Pulse */}
      <button 
        onClick={() => sendPulse()}
        className="w-full max-w-md py-8 bg-slate-900 border border-slate-800 rounded-3xl text-xl font-black text-white uppercase tracking-[0.4em] active:bg-slate-800 transition-all mb-4"
        style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.8)' }}
      >
        Single Pulse
      </button>

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-md mb-4">
        <button onClick={toggleBurst} className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-all">Stop</button>
        <button onClick={resetSystem} className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-all">Reset</button>
      </div>

      {/* Gateway Address */}
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-4 rounded-3xl mb-4">
        <label className="text-[8px] text-slate-600 font-black block mb-2 uppercase tracking-widest">Gateway Address (ngrok/local)</label>
        <input 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text" 
          placeholder="https://..." 
          className="w-full bg-black/60 border border-slate-700 rounded-xl p-4 text-blue-400 font-bold outline-none focus:border-blue-500 text-xs"
        />
      </div>

      {/* Telemetry Feed */}
      <div className="w-full max-w-md bg-black/60 border border-slate-800 rounded-3xl p-5 h-40 overflow-y-auto shadow-inner text-[10px]">
        <div className="font-black text-slate-700 mb-3 uppercase tracking-widest">Telemetry Feed</div>
        <div className="space-y-1 font-mono text-slate-500">
          {logs.map((log, i) => (
            <div key={i} className="flex justify-between border-b border-white/5 pb-1">
              <span>{log.msg}</span><span className="opacity-30">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
