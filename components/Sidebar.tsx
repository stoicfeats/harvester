import React, { useRef, useState } from 'react';
import { Tweet } from '../types';
import { TEXT, COLORS } from '../constants';

const normalizeData = (raw: any): Tweet[] => {
  let list: any[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.data)) list = raw.data;
    else if (Array.isArray(raw.tweets)) list = raw.tweets;
    else list = [raw];
  }

  return list.map((item) => {
    const t = item.tweet || item;
    return {
      id: String(t.id_str || t.id || `gen_${Math.random().toString(36).slice(2)}`),
      created_at: t.created_at || new Date().toISOString(),
      full_text: t.full_text || t.text || 'Error: Content undefined',
      user: t.user || {
        name: 'Archive User',
        screen_name: 'me',
        profile_image_url_https: ''
      },
      extended_entities: t.extended_entities,
      favorite_count: t.favorite_count || 0,
      retweet_count: t.retweet_count || 0
    } as Tweet;
  }).filter(t => t.full_text);
};

interface SidebarProps {
  onDataLoaded: (tweets: Tweet[]) => void;
  totalTweets: number;
  tweets: Tweet[];
  darkMode: boolean;
  columnCount: number;
  setColumnCount: (n: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onDataLoaded,
  totalTweets,
  tweets,
  darkMode,
  columnCount,
  setColumnCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasteMode, setIsPasteMode] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [isScriptMode, setIsScriptMode] = useState(false);
  const [targetCount, setTargetCount] = useState(50);
  const [generatedScript, setGeneratedScript] = useState('');

  const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

  const bgMain = theme.BG;
  const bgSurface = theme.BG;
  const textMain = theme.TEXT;
  const borderSubtle = darkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER;
  const shadowNeu = theme.SHADOW;
  const shadowNeuActive = theme.SHADOW_ACTIVE;
  const shadowNeuInset = theme.SHADOW_INSET;



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

  const handleDownloadJSON = () => {
    if (tweets.length === 0) return;
    const blob = new Blob([JSON.stringify(tweets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harvester_full_export_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateScraperScript = () => {
    const script = `
(async function harvest() {
    console.clear();
    const TARGET = ${targetCount};
    console.log("%c[HARVESTER] INITIALIZED - TARGET: " + TARGET, "color: #ff4d00; font-weight: bold;");
    
    const scraped = new Map();
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    
    let retries = 0;
    
    while(scraped.size < TARGET && retries < 10) {
        const articles = document.querySelectorAll('article[data-testid="tweet"]');
        let newFound = false;

        for(const article of articles) {
            if(scraped.size >= TARGET) break;
            
            try {
                const timeEl = article.querySelector('time');
                const textEl = article.querySelector('div[data-testid="tweetText"]');
                const userEl = article.querySelector('div[data-testid="User-Name"]');
                const avatarEl = article.querySelector('img[src*="profile_images"]');
                const linkEl = timeEl?.parentElement;
                
                if(!timeEl || !textEl || !userEl) continue;

                const id = linkEl?.getAttribute('href')?.split('/').pop() || Math.random().toString(36).slice(2);
                
                if(scraped.has(id)) continue;

                const mediaItems = [];
                const imgs = article.querySelectorAll('img[src*="media"]');
                imgs.forEach(img => {
                    mediaItems.push({ type: 'photo', media_url_https: img.src });
                });

                const tweet = {
                    id: id,
                    created_at: timeEl.getAttribute('datetime'),
                    full_text: textEl.innerText,
                    user: {
                        name: userEl.innerText.split('\\n')[0],
                        screen_name: userEl.innerText.split('@')[1]?.split('\\n')[0] || 'sub_protocol',
                        profile_image_url_https: avatarEl?.src || ''
                    },
                    extended_entities: mediaItems.length > 0 ? { media: mediaItems } : undefined,
                    favorite_count: 0,
                    retweet_count: 0
                };
                
                scraped.set(id, tweet);
                newFound = true;
                console.log(\`%c[CAPTURED] \${scraped.size}/\${TARGET} :: \${tweet.id}\`, "color: #00fa9a");
            } catch(e) {}
        }
        
        if(!newFound) retries++;
        else retries = 0;
        
        window.scrollTo(0, document.body.scrollHeight);
        await wait(2000);
    }
    
    const data = Array.from(scraped.values());
    console.log("%c[COMPLETE] DOWNLOADING PAYLOAD...", "color: #ff4d00; font-weight: bold; font-size: 14px;");
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harvest_dump_" + new Date().getTime() + ".json";
    a.click();
})();
    `.trim();

    setGeneratedScript(script);
  };

  return (
    <div
      className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 p-6 border-r h-full overflow-y-auto scrollbar-hide transition-colors duration-500"
      style={{
        backgroundColor: theme.BG,
        borderColor: theme.BORDER
      }}
    >
      <div
        className="p-6 rounded-[2px] transition-shadow duration-500"
        style={{ backgroundColor: theme.BG }}
      >
        <label className="font-mono text-[10px] uppercase font-bold opacity-50 block mb-4" style={{ color: theme.TEXT }}>Ingest Data</label>

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
            className={`w-full py-4 px-4 text-left flex justify-between items-center hover:brightness-95 transition-all rounded-[1px] ${darkMode ? theme.SHADOW : theme.SHADOW} active:${theme.SHADOW_ACTIVE} active:scale-[0.98]`}
            style={{ backgroundColor: theme.BG, color: theme.TEXT }}
          >
            <span className="text-sm font-bold font-['Space_Grotesk'] tracking-tight">{TEXT.DRAG_DROP}</span>
            <span className="font-mono text-[10px] opacity-50">.json</span>
          </button>

          <button
            onClick={() => { setIsPasteMode(!isPasteMode); setIsScriptMode(false); }}
            className={`w-full py-3 px-4 text-left flex justify-between items-center transition-all rounded-[1px]`}
            style={{
              backgroundColor: theme.BG,
              color: theme.TEXT,
              boxShadow: isPasteMode ? undefined : theme.SHADOW
            }}
          >
            <span className="text-xs font-bold font-['Space_Grotesk'] tracking-tight opacity-70">{TEXT.OR_PASTE}</span>
            <span className="font-mono text-[10px] opacity-50">{isPasteMode ? 'ACTIVE' : 'OFFLINE'}</span>
          </button>

          {isPasteMode && (
            <div className="animate-reveal flex flex-col gap-2 mt-1">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder='[{"tweet": {...}}, ...]'
                className="w-full h-32 font-mono text-[10px] p-3 rounded-[1px] resize-none focus:outline-none border border-transparent focus:border-[#ff4d00]"
                style={{
                  backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : '#1a1a1a',
                  color: '#e2e0d9'
                }}
              />
              <button
                onClick={handlePasteProcess}
                className="w-full py-2 font-mono text-[10px] uppercase font-bold hover:bg-[#ff4d00] hover:text-[#1a1a1a] transition-colors"
                style={{ backgroundColor: darkMode ? '#e2e0d9' : '#1a1a1a', color: darkMode ? '#1a1a1a' : '#e2e0d9' }}
              >
                {TEXT.LOAD_BUFFER}
              </button>
            </div>
          )}

          <div className="h-px w-full my-1" style={{ backgroundColor: theme.BORDER }}></div>
        </div>
      </div>

      <div className={`p-6 rounded-[2px] transition-shadow duration-500`} style={{ backgroundColor: theme.BG }}>
        <label className="font-mono text-[10px] uppercase font-bold opacity-50 block mb-4" style={{ color: theme.TEXT }}>{TEXT.VIEW_CONFIG}</label>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[9px] uppercase opacity-60" style={{ color: theme.TEXT }}>{TEXT.GRID_DENSITY}</span>
            <span className="font-mono text-[9px] font-bold text-[#ff4d00]">{columnCount} COL</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={columnCount}
            onChange={(e) => setColumnCount(Number(e.target.value))}
            className="w-full h-1 bg-black/10 rounded-none appearance-none cursor-pointer accent-[#ff4d00]"
          />
          <div className="flex justify-between mt-1 opacity-30 font-mono text-[8px]" style={{ color: theme.TEXT }}>
            <span>EXPAND</span>
            <span>DENSE</span>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-[2px] transition-shadow duration-500`} style={{ backgroundColor: theme.BG }}>
        <label className="font-mono text-[10px] uppercase font-bold opacity-50 block mb-4" style={{ color: theme.TEXT }}>Utility Protocols</label>

        <button
          onClick={() => { setIsScriptMode(!isScriptMode); setIsPasteMode(false); }}
          className={`w-full py-3 px-4 text-left flex justify-between items-center transition-all rounded-[1px]`}
          style={{
            backgroundColor: theme.BG,
            color: theme.TEXT,
            boxShadow: isScriptMode ? undefined : theme.SHADOW
          }}
        >
          <span className="text-xs font-bold font-['Space_Grotesk'] tracking-tight opacity-70">{TEXT.GENERATE_SCRAPER}</span>
          <span className="font-mono text-[10px] opacity-50">{isScriptMode ? 'ACTIVE' : 'SCRIPT'}</span>
        </button>

        {isScriptMode && (
          <div className="animate-reveal flex flex-col gap-3 mt-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] uppercase opacity-60" style={{ color: theme.TEXT }}>{TEXT.TARGET_COUNT}</label>
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-full border-b font-mono text-sm py-1 focus:outline-none focus:border-[#ff4d00]"
                style={{
                  backgroundColor: theme.BG,
                  borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: theme.TEXT
                }}
              />
            </div>

            <button
              onClick={generateScraperScript}
              className="w-full py-2 font-mono text-[10px] uppercase font-bold hover:bg-[#ff4d00] hover:text-[#1a1a1a] transition-colors"
              style={{ backgroundColor: darkMode ? '#e2e0d9' : '#1a1a1a', color: darkMode ? '#1a1a1a' : '#e2e0d9' }}
            >
              {TEXT.COMPILE_SCRIPT}
            </button>

            {generatedScript && (
              <div className="relative group">
                <textarea
                  readOnly
                  value={generatedScript}
                  className="w-full h-24 text-[10px] font-mono p-2 rounded-[1px] resize-none focus:outline-none border"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                    borderColor: theme.BORDER,
                    color: theme.TEXT
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`p-4 border flex justify-between items-center transition-colors`} style={{ borderColor: theme.BORDER, backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: theme.TEXT }}>{TEXT.BUFFER_COUNT}</span>
        <span className="font-mono text-[10px] font-bold text-[#ff4d00]">{totalTweets}</span>
      </div>

      <div className="mt-auto">
        <div className="p-4 text-center transition-colors duration-500" style={{ backgroundColor: darkMode ? '#e2e0d9' : '#1a1a1a' }}>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-60" style={{ color: darkMode ? '#1a1a1a' : '#e2e0d9' }}>{TEXT.SYSTEM_READY}</p>
        </div>
      </div>
    </div>
  );
};