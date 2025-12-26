import React, { useRef, useState } from 'react';
import { ExportFormat, Tweet } from '../types';

const formats: ExportFormat[] = [
  { label: 'JSON STRUCTURE', subLabel: 'DEF: 01', id: 'json' },
  { label: 'MARKDOWN ARCHIVE', subLabel: 'DEF: 02', id: 'md' },
  { label: 'CSV SPREADSHEET', subLabel: 'DEF: 03', id: 'csv' },
];

// Sample data to verify UI without needing a file immediately
const SAMPLE_TWEETS: Tweet[] = [
  {
    id: '1',
    created_at: 'Fri May 10 12:00:00 +0000 2024',
    full_text: 'The brutalist aesthetic in web design is not just about raw concrete textures, it is about honesty in structural layout. #design #web',
    user: { name: 'Archivar_Bot', screen_name: 'archivar_x', profile_image_url_https: 'https://ui-avatars.com/api/?name=A+B&background=1a1a1a&color=e2e0d9' },
    favorite_count: 142,
    retweet_count: 32
  },
  {
    id: '2',
    created_at: 'Fri May 10 14:30:00 +0000 2024',
    full_text: 'Building reliable data pipelines requires a shift from object-oriented thinking to stream-based processing.',
    user: { name: 'System Core', screen_name: 'sys_core', profile_image_url_https: 'https://ui-avatars.com/api/?name=S+C&background=1a1a1a&color=e2e0d9' },
    extended_entities: {
      media: [{ type: 'photo', media_url_https: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', url: '' }]
    },
    favorite_count: 891,
    retweet_count: 120
  },
  {
    id: '3',
    created_at: 'Fri May 11 09:15:00 +0000 2024',
    full_text: 'Memory safety in systems programming: A thread 🧵',
    user: { name: 'Rustacean', screen_name: 'ferris_wheel', profile_image_url_https: 'https://ui-avatars.com/api/?name=R+U&background=1a1a1a&color=e2e0d9' },
    favorite_count: 2300,
    retweet_count: 500
  },
  {
    id: '4',
    created_at: 'Fri May 11 11:20:00 +0000 2024',
    full_text: 'Captured this grid alignment yesterday. Pure satisfaction.',
    user: { name: 'Grid Master', screen_name: 'pixel_perf', profile_image_url_https: 'https://ui-avatars.com/api/?name=G+M&background=1a1a1a&color=e2e0d9' },
    extended_entities: {
        media: [{ type: 'photo', media_url_https: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', url: '' }]
    },
    favorite_count: 56,
    retweet_count: 4
  }
];

// Helper to normalize inconsistent JSON structures (API vs Archive vs Raw)
const normalizeData = (raw: any): Tweet[] => {
  let list: any[] = [];
  
  // Determine if it's an array directly or nested
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.data)) list = raw.data;
    else if (Array.isArray(raw.tweets)) list = raw.tweets;
    else list = [raw]; // Try treating single object as item
  }

  return list.map((item) => {
    // Twitter archives often wrap the tweet object in a "tweet" property
    const t = item.tweet || item;

    // Construct a safe Tweet object, providing fallbacks for missing fields
    return {
      // FORCE STRING TYPE FOR ID TO PREVENT .substring() ERRORS
      id: String(t.id_str || t.id || `gen_${Math.random().toString(36).slice(2)}`),
      created_at: t.created_at || new Date().toISOString(),
      full_text: t.full_text || t.text || 'Error: Content undefined',
      // User object is often missing in own-archive data
      user: t.user || {
        name: 'Archive User',
        screen_name: 'me',
        profile_image_url_https: '' 
      },
      extended_entities: t.extended_entities,
      favorite_count: t.favorite_count || 0,
      retweet_count: t.retweet_count || 0
    } as Tweet;
  }).filter(t => t.full_text); // Basic validation
};

interface SidebarProps {
  onDataLoaded: (tweets: Tweet[]) => void;
  totalTweets: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDataLoaded, totalTweets }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasteMode, setIsPasteMode] = useState(false);
  const [pastedContent, setPastedContent] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const normalized = normalizeData(json);
        onDataLoaded(normalized);
      } catch (err) {
        alert("PROTOCOL_ERROR: Invalid JSON structure detected.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteProcess = () => {
    if (!pastedContent.trim()) return;
    try {
        // Simple attempt to strip JS variable assignment if user pasted full file content like 'window.YTD.tweet.part0 = ...'
        const cleanContent = pastedContent.replace(/^[a-zA-Z0-9_.$]+\s*=\s*/, '');
        const json = JSON.parse(cleanContent);
        const normalized = normalizeData(json);
        onDataLoaded(normalized);
        setPastedContent('');
        setIsPasteMode(false);
    } catch (err) {
        alert("PROTOCOL_ERROR: Malformed JSON sequence.");
        console.error(err);
    }
  };

  return (
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 p-6 border-r border-black/10 bg-[#e2e0d9] h-full overflow-y-auto scrollbar-hide">
      
      {/* Input Section */}
      <div className="bg-[#e2e0d9] p-6 rounded-[2px] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]">
        <label className="font-mono text-[10px] uppercase font-bold opacity-50 block mb-4">Ingest Data</label>
        
        <input 
          type="file" 
          accept=".json,.js" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
        />
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="embossed-button w-full py-4 px-4 text-left flex justify-between items-center bg-[#e2e0d9] hover:bg-[#dcdad3] transition-colors rounded-[1px] shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] active:scale-[0.98]"
          >
            <span className="text-sm font-bold font-['Space_Grotesk'] tracking-tight">UPLOAD JSON</span>
            <span className="font-mono text-[10px] opacity-50">.json</span>
          </button>

          {/* Paste Toggle Button */}
          <button 
            onClick={() => setIsPasteMode(!isPasteMode)}
            className={`
                embossed-button w-full py-3 px-4 text-left flex justify-between items-center transition-colors rounded-[1px]
                ${isPasteMode ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] bg-[#dcdad3]' : 'shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] bg-[#e2e0d9]'}
            `}
          >
            <span className="text-xs font-bold font-['Space_Grotesk'] tracking-tight opacity-70">MANUAL INPUT</span>
            <span className="font-mono text-[10px] opacity-50">{isPasteMode ? 'ACTIVE' : 'OFFLINE'}</span>
          </button>

          {/* Paste Area */}
          {isPasteMode && (
             <div className="animate-reveal flex flex-col gap-2 mt-1">
                <textarea 
                    value={pastedContent}
                    onChange={(e) => setPastedContent(e.target.value)}
                    placeholder='[{"tweet": {...}}, ...]'
                    className="w-full h-32 bg-[#1a1a1a] text-[#e2e0d9] font-mono text-[10px] p-3 rounded-[1px] resize-none focus:outline-none border border-transparent focus:border-[#ff4d00]"
                />
                <button 
                    onClick={handlePasteProcess}
                    className="w-full bg-[#1a1a1a] text-[#e2e0d9] py-2 font-mono text-[10px] uppercase font-bold hover:bg-[#ff4d00] hover:text-[#1a1a1a] transition-colors"
                >
                    Inject Data Stream
                </button>
             </div>
          )}

          <div className="h-px bg-black/10 w-full my-1"></div>

          <button 
            onClick={() => onDataLoaded(SAMPLE_TWEETS)}
            className="embossed-button w-full py-3 px-4 text-left flex justify-between items-center bg-[#e2e0d9] hover:bg-[#dcdad3] transition-colors rounded-[1px] shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] active:scale-[0.98]"
          >
            <span className="text-xs font-bold font-['Space_Grotesk'] tracking-tight opacity-50">LOAD SAMPLE SET</span>
            <span className="font-mono text-[10px] opacity-30">DEV_MODE</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 border border-black/10 flex justify-between items-center bg-black/5">
        <span className="font-mono text-[10px] font-bold">BUFFER_COUNT</span>
        <span className="font-mono text-[10px] font-bold text-[#ff4d00]">{totalTweets}</span>
      </div>

      {/* Export Section */}
      <div className="bg-[#e2e0d9] p-6 rounded-[2px] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]">
        <label className="font-mono text-[10px] uppercase font-bold opacity-50 block mb-4">Export Buffer</label>
        <div className="flex flex-col gap-3">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              className="group relative py-3 px-4 text-left flex justify-between items-center bg-[#e2e0d9] rounded-[1px] shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] active:scale-[0.98] transition-all"
            >
              <span className="text-sm font-bold font-['Space_Grotesk'] tracking-tight">{fmt.label}</span>
              <span className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                {fmt.subLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-[#1a1a1a] text-[#e2e0d9] p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">System Ready</p>
        </div>
      </div>
    </div>
  );
};