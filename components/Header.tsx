import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-end border-b-2 border-black pb-4 select-none">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest mb-2 opacity-60">System Protocol: 88-X</p>
        <h1 className="font-['Space_Grotesk'] text-6xl font-bold tracking-tighter uppercase leading-none">
          Harvester
        </h1>
      </div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-2 h-2 bg-[#ff4d00] rounded-full animate-live-dot"></div>
        <span className="font-mono text-sm font-bold uppercase tracking-tighter">Live Stream Active</span>
      </div>
    </header>
  );
};