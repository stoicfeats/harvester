import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextureOverlay } from './components/TextureOverlay';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MasonryGrid } from './components/MasonryGrid';
import { Tweet } from './types';
import { COLORS, SEGMENTS, TEXT, LINKS } from './constants';

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [activeSegment, setActiveSegment] = useState(SEGMENTS[0].id);

  const handleDataLoaded = (newTweets: Tweet[]) => {
    setTweets(newTweets);
  };

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? COLORS.DARK.BG : COLORS.LIGHT.BG;
  }, [darkMode]);

  const filteredTweets = tweets.filter(t => {
    if (activeSegment === 'MEDIA') return t.extended_entities?.media && t.extended_entities.media.length > 0;
    if (activeSegment === 'FAVORITES') return (t.favorite_count || 0) > 0;
    if (activeSegment === 'THREADS') return t.full_text.length > 200;
    return true;
  });

  const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

  return (
    <>
      <TextureOverlay />

      <motion.div
        animate={{ backgroundColor: theme.BG, color: theme.TEXT }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full h-screen flex flex-col overflow-hidden"
      >
        <motion.div
          animate={{ backgroundColor: theme.BG }}
          transition={{ duration: 0.5 }}
          className="px-8 pt-6 pb-2 flex-shrink-0"
        >
          <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        </motion.div>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            onDataLoaded={handleDataLoaded}
            totalTweets={tweets.length}
            tweets={tweets}
            darkMode={darkMode}
            columnCount={columnCount}
            setColumnCount={setColumnCount}
          />

          <motion.main
            animate={{ backgroundColor: theme.BG }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-y-auto scrollbar-hide relative flex flex-col"
          >
            <div className="sticky top-0 z-30 w-full flex justify-center py-4 pointer-events-none">
              <div
                className="pointer-events-auto flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-md shadow-lg transition-colors duration-500"
                style={{
                  backgroundColor: darkMode ? 'rgba(42,42,42,0.8)' : 'rgba(255,255,255,0.6)',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderWidth: 1
                }}
              >
                {SEGMENTS.map(seg => (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold font-['Space_Grotesk'] tracking-tight transition-all`}
                    style={{
                      color: activeSegment === seg.id
                        ? (darkMode ? COLORS.LIGHT.TEXT : COLORS.DARK.TEXT)
                        : (darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT)
                    }}
                  >
                    {activeSegment === seg.id && (
                      <motion.div
                        layoutId="segment-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{seg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`absolute top-0 left-0 w-full h-12 z-10 pointer-events-none transition-colors duration-500`}
              style={{ background: `linear-gradient(to bottom, ${theme.BG}, transparent)` }}
            />

            <MasonryGrid tweets={filteredTweets} columnCount={columnCount} darkMode={darkMode} />

            <div
              className={`absolute bottom-0 left-0 w-full h-8 z-10 pointer-events-none transition-colors duration-500`}
              style={{ background: `linear-gradient(to top, ${theme.BG}, transparent)` }}
            />
          </motion.main>
        </div>

        <footer
          className="flex-shrink-0 px-6 py-2 border-t flex justify-between items-center z-20 transition-colors duration-500"
          style={{
            backgroundColor: theme.BG,
            borderColor: theme.BORDER
          }}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${tweets.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">
              {tweets.length > 0 ? `${TEXT.STREAM_ACTIVE} // ${activeSegment}_FILTER` : `${TEXT.STREAM_IDLE} // ${TEXT.AWAITING_INPUT}`}
            </span>
          </div>
          <a href={LINKS.STOICFEATS} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] opacity-40 hover:opacity-100 transition-opacity">
            {TEXT.FOOTER_CREDIT}
          </a>
        </footer>
      </motion.div>
    </>
  );
};

export default App;
