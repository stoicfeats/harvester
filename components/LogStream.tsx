import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';

const INITIAL_LOGS: LogEntry[] = [
  { id: '1785', timestamp: 1715421190, message: 'WAITING...', status: 'waiting' },
  { id: '1784', timestamp: 1715421112, message: 'Thread: 12 ways to optimize CSS...', status: 'fetched' },
  { id: '1783', timestamp: 1715421045, message: 'The future of structuralism in...', status: 'fetched' },
  { id: '1782', timestamp: 1715421002, message: 'Design systems are just...', status: 'fetched' },
];

const MESSAGES = [
  "Buffered entry segment...",
  "Recalibrating node structure...",
  "Analyzing semantic density...",
  "Packet verify: OK...",
  "Intercepted signal fragment...",
  "Re-routing thorough proxy 9...",
  "Handshake authorized..."
];

export const LogStream: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [count, setCount] = useState(142);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCount(prev => prev + 1);
        
        const newLog: LogEntry = {
          id: Math.floor(Math.random() * 10000).toString(),
          timestamp: Math.floor(Date.now() / 1000),
          message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
          status: 'fetched'
        };

        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = count % 100;

  return (
    <div className="col-span-12 md:col-span-8">
      {/* Debossed Container */}
      <div className="bg-[#e2e0d9] h-[420px] relative overflow-hidden flex flex-col rounded-[2px] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]">
        
        {/* Header */}
        <div className="p-4 border-b border-black/5 flex justify-between items-center bg-white/5 select-none">
          <span className="font-mono text-[10px] font-bold">MANIFEST_QUEUE</span>
          <span className="font-mono text-[10px] font-bold">LOADED: {count}</span>
        </div>
        
        {/* Stream Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-scroll p-6 scrollbar-hide font-mono text-[11px] leading-relaxed space-y-2 opacity-80"
        >
          {logs.map((log, index) => (
            <div 
              key={`${log.id}-${log.timestamp}`}
              className={`
                p-2 border-l-2 transition-all duration-500 cursor-default animate-reveal
                ${log.status === 'fetched' ? 'border-black/20 hover:border-black opacity-100' : ''}
                ${log.status === 'waiting' ? 'border-black/10 opacity-40' : ''}
                ${log.status === 'pending' ? 'border-black/5 opacity-20' : ''}
              `}
            >
              <span className="opacity-50 mr-2">[TIMESTAMP: {log.timestamp}]</span>
              <span className="opacity-70 mr-2">ID_{log.id}...</span>
              <span className={log.status === 'fetched' ? 'font-bold' : 'italic'}>
                {log.status === 'fetched' ? 'FETCHED ->' : ''} "{log.message}"
              </span>
            </div>
          ))}
          <div className="p-2 border-l-2 border-black/5 opacity-20 cursor-default">
             [PENDING STREAM...]
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
          <div 
            className="h-full bg-black transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex justify-between items-start select-none">
        <div className="max-w-[200px]">
          <p className="font-mono text-[9px] uppercase leading-tight opacity-50">
            Warning: Direct structural extraction from API endpoint 12.A requires authenticated session handshake.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold leading-none tracking-tighter">72.4%</div>
          <div className="font-mono text-[10px] uppercase font-bold opacity-40">Total Buffer Capacity</div>
        </div>
      </div>
    </div>
  );
};