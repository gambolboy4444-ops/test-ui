'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type LogEntry = { id: string; type: string; name: string; timestamp: number; };

export default function App() {
  const [identity, setIdentity] = useState('TORUS_OPERATOR');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  // 🚀 クラウド上の「脳」の住所を固定
  const CORE_URL = "https://torus-genesis-core.vercel.app"; 
  const [torusCash, setTorusCash] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const timerRef = useRef<any>(null);

  const addLog = useCallback((type: string, name: string) => {
    const newLog = { id: Math.random().toString(36).substring(7), type, name, timestamp: Date.now() };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  }, []);

  const dispatchToCore = useCallback(async (targetName: string, silent = false) => {
    try {
      const res = await fetch(`${CORE_URL}/api/ingress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'INGRESS', roomId: 'TORUS-SYNC-01', payload: { name: targetName }, timestamp: Date.now() }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsOnline(true);
        // 🧠 サーバーの「真実」のみを反映（UIでの捏造を禁止）
        if (data.current_count !== undefined) setTorusCash(data.current_count);
        setNodeCount(v => v + 1);
        if (!silent) addLog('SYSTEM', "✅ CORE_SYNC");
      }
    } catch (e) {
      if (!silent) { setIsOnline(false); addLog('ERROR', "❌ LOST"); }
    }
  }, [addLog]);

  useEffect(() => {
    if (isBurstActive) {
      timerRef.current = setInterval(() => dispatchToCore(`NODE_${Math.random().toString(16).substring(10)}`, true), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isBurstActive, dispatchToCore]);

  return (
    <div style={{backgroundColor:'#020617',minHeight:'100vh',color:'#f8fafc',fontFamily:'monospace',display:'flex',flexDirection:'column',alignItems:'center',padding:'24px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',maxWidth:'440px',backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'24px',padding:'16px 24px',marginBottom:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'40px',height:'40px',backgroundColor:'#1e293b',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:'bold'}}>T</div>
          <div>
            <div style={{fontSize:'8px',color:'#64748b',fontWeight:'bold'}}>SATELLITE UI</div>
            <div style={{fontWeight:'900',fontSize:'14px'}}>TORUS V17.0</div>
          </div>
        </div>
        <div style={{padding:'4px 12px',borderRadius:'99px',border:`1px solid ${isOnline?'#10b98155':'#ef444455'}`,color:isOnline?'#34d399':'#f87171',fontSize:'10px',fontWeight:'900'}}>
          {isOnline?'ONLINE':'OFFLINE'}
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',width:'100%',maxWidth:'440px',marginBottom:'16px'}}>
        <div style={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'24px',padding:'24px',textAlign:'center'}}>
          <div style={{fontSize:'10px',color:'#3b82f6',fontWeight:'900',marginBottom:'8px'}}>CORE_CASH ❤️</div>
          <div style={{fontSize:'32px',fontWeight:'900'}}>{torusCash.toLocaleString()}</div>
        </div>
        <div style={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'24px',padding:'24px',textAlign:'center'}}>
          <div style={{fontSize:'10px',color:'#10b981',fontWeight:'900',marginBottom:'8px'}}>NODES ❤️</div>
          <div style={{fontSize:'32px',fontWeight:'900'}}>{nodeCount.toLocaleString()}</div>
        </div>
      </div>

      <button onClick={()=>setIsBurstActive(true)} disabled={isBurstActive} style={{width:'100%',maxWidth:'440px',padding:'60px 0',borderRadius:'32px',fontSize:'32px',fontWeight:'900',cursor:isBurstActive?'default':'pointer',backgroundColor:isBurstActive?'#1e293b':'#ffffff',color:isBurstActive?'#475569':'#020617',border:'none',boxShadow:isBurstActive?'none':'0 12px 0 #cbd5e1',marginBottom:'16px'}}>⚡ BURST</button>

      <button onClick={()=>dispatchToCore(identity)} style={{width:'100%',maxWidth:'440px',padding:'32px 0',borderRadius:'24px',fontSize:'24px',fontWeight:'900',border:'1px solid #1e293b',backgroundColor:'#0f172a',color:'#ffffff',cursor:'pointer',letterSpacing:'8px',textShadow:'0 0 20px #ffffff',marginBottom:'16px'}}>SINGLE PULSE</button>

      <div style={{display:'flex',gap:'16px',width:'100%',maxWidth:'440px',marginBottom:'16px'}}>
        <button onClick={()=>setIsBurstActive(false)} disabled={!isBurstActive} style={{padding:'24px 0',borderRadius:'16px',fontSize:'12px',fontWeight:'bold',border:'1px solid #1e293b',backgroundColor:'#0f172a',color:isBurstActive?'#3b82f6':'#1e293b',flex:1,cursor:'pointer'}}>STOP</button>
        <button onClick={()=>{setTorusCash(0);setNodeCount(0);setLogs([]);setIsBurstActive(false);}} style={{padding:'24px 0',borderRadius:'16px',fontSize:'12px',fontWeight:'bold',border:'1px solid #1e293b',backgroundColor:'#0f172a',color:'#64748b',flex:1,cursor:'pointer'}}>RESET</button>
      </div>

      <div style={{width:'100%',maxWidth:'440px',backgroundColor:'#000',border:'1px solid #1e293b',borderRadius:'24px',padding:'20px',height:'150px',overflowY:'auto'}}>
        <div style={{fontSize:'10px',fontWeight:'900',color:'#64748b',marginBottom:'12px'}}>TELEMETRY FEED</div>
        {logs.map(log=>(<div key={log.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'4px',fontSize:'11px',color:'#94a3b8'}}><span>{log.name}</span><span style={{opacity:0.3}}>{new Date(log.timestamp).toLocaleTimeString()}</span></div>))}
      </div>
    </div>
  );
}
