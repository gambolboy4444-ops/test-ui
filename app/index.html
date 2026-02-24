'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LogEntry } from './types';

export default function App() {
  const [torusCash, setTorusCash] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  const sync = useCallback(async () => {
    if (!baseUrl) return;
    try {
      const res = await fetch(`${baseUrl}/api/ingress?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setTorusCash(data.current_count);
      setIsOnline(true);
    } catch { setIsOnline(false); }
  }, [baseUrl]);

  const pulse = useCallback(async () => {
    if (!baseUrl) return;
    const txId = `TX-${Math.random().toString(36).substring(7).toUpperCase()}`;
    try {
      const res = await fetch(`${baseUrl}/api/ingress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'INGRESS', payload: { id: txId } }),
      });
      const data = await res.json();
      setTorusCash(data.current_count);
    } catch { setIsOnline(false); }
  }, [baseUrl]);

  useEffect(() => {
    const timer = setInterval(sync, 2000);
    return () => clearInterval(timer);
  }, [sync]);

  return (
    <div style={{backgroundColor:'#020617',minHeight:'100vh',color:'#f8fafc',fontFamily:'monospace',display:'flex',flexDirection:'column',alignItems:'center',padding:'20px'}}>
      <header style={{width:'100%',maxWidth:'400px',backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'15px',padding:'15px',marginBottom:'15px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontWeight:'900',letterSpacing:'2px'}}>TORUS GENESIS 1.0</div>
        <div style={{fontSize:'10px',fontWeight:'900',color:isOnline?'#34d399':'#f87171'}}>
          {isOnline ? '● ONLINE' : '○ OFFLINE'}
        </div>
      </header>

      <div style={{width:'100%',maxWidth:'400px',backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'15px',padding:'40px',textAlign:'center',marginBottom:'15px',boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:'10px',color:'#3b82f6',fontWeight:'900',marginBottom:'10px',letterSpacing:'3px'}}>CORE_COUNT ❤️</div>
        <div style={{fontSize:'56px',fontWeight:'900',textShadow:'0 0 20px rgba(59,130,246,0.3)'}}>
          {torusCash.toLocaleString()}
        </div>
      </div>

      <button 
        onClick={pulse} 
        style={{width:'100%',maxWidth:'400px',padding:'30px',borderRadius:'25px',fontSize:'24px',fontWeight:'900',backgroundColor:'#fff',color:'#020617',border:'none',cursor:'pointer',boxShadow:'0 8px 0 #cbd5e1',transition:'all 0.1s'}}
      >
        SINGLE PULSE
      </button>

      <footer style={{marginTop:'30px',fontSize:'8px',color:'#334155',letterSpacing:'5px'}}>
        AMAZON-CLASS LOAD BALANCING ACTIVE
      </footer>
    </div>
  );
}
