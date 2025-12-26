import React, { useState } from 'react';
import { TextureOverlay } from './components/TextureOverlay';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MasonryGrid } from './components/MasonryGrid';
import { Tweet } from './types';

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const handleDataLoaded = (newTweets: Tweet[]) => {
    // Basic deduplication if loading multiple files, or just replace
    setTweets(newTweets);
  };

  return (
    <>
      <TextureOverlay />
      
      <div className="relative z-10 w-full h-screen flex flex-col overflow-hidden">
        {/* Full width header */}
        <div className="px-8 pt-6 pb-2 flex-shrink-0 bg-[#e2e0d9]">
          <Header />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar onDataLoaded={handleDataLoaded} totalTweets={tweets.length} />

          {/* Main Feed Area */}
          <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#e2e0d9] relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#e2e0d9] to-transparent z-10 pointer-events-none" />
            
            <MasonryGrid tweets={tweets} />
            
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#e2e0d9] to-transparent z-10 pointer-events-none" />
          </main>
        </div>

        {/* Status Bar */}
        <footer className="flex-shrink-0 px-6 py-2 border-t border-black/10 flex justify-between items-center bg-[#e2e0d9] z-20">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${tweets.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">
              {tweets.length > 0 ? 'STREAM_ACTIVE // PROCESSING' : 'STREAM_IDLE // AWAITING_INPUT'}
            </span>
          </div>
          <span className="font-mono text-[9px] opacity-40">HARVESTER_SYS_V4.0.2</span>
        </footer>
      </div>
    </>
  );
};

export default App;
