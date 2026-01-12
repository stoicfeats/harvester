import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tweet } from '../types';
import { TweetCard } from './TweetCard';
import { TEXT, COLORS } from '../constants';

interface MasonryGridProps {
  tweets: Tweet[];
  columnCount: number;
  darkMode: boolean;
  onToggleStar: (tweetId: string) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ tweets, columnCount, darkMode, onToggleStar }) => {
  if (tweets.length === 0) {
    return (
      <div className={`h-full flex flex-col items-center justify-center select-none transition-opacity duration-1000 ${darkMode ? 'opacity-30' : 'opacity-40'}`}>
        <div className={`w-16 h-16 border-2 mb-4 animate-pulse rounded-full flex items-center justify-center`} style={{ borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
          <div className={`w-2 h-2`} style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}></div>
        </div>
        <p className={`font-mono text-xs uppercase tracking-widest`} style={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}>{TEXT.AWAITING_INPUT}</p>
        <p className={`font-mono text-[9px] mt-2`} style={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT, opacity: 0.6 }}>Upload JSON archive via Sidebar</p>
      </div>
    );
  }

  return (
    <div
      className="w-full gap-6 p-6 pb-20 items-start "
      style={{ columnCount: columnCount }}
    >
      <AnimatePresence>
        {tweets.map((tweet, i) => (
          <motion.div
            key={tweet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="break-inside-avoid mb-6"
          >
            <TweetCard tweet={tweet} darkMode={darkMode} onToggleStar={onToggleStar} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
