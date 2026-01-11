import React from 'react';
import { motion } from 'framer-motion';
import { TEXT, COLORS } from '../constants';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

  return (
    <header className="flex justify-between items-end border-b-2 pb-4 select-none transition-colors duration-500" style={{ borderColor: darkMode ? theme.TEXT : 'black' }}>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest mb-2 opacity-60">{TEXT.SYSTEM_PROTOCOL}</p>
        <h1 className="font-['Space_Grotesk'] text-6xl font-bold tracking-tighter uppercase leading-none">
          {TEXT.TITLE}
        </h1>
      </div>
      <div className="flex items-center gap-6 mb-2">
        <div
          onClick={toggleDarkMode}
          className={`w-14 h-8 rounded-full relative cursor-pointer flex items-center px-1 transition-colors duration-300`}
          style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center"
            style={{
              backgroundColor: darkMode ? COLORS.DARK.BG : COLORS.LIGHT.BG,
              marginLeft: darkMode ? 'auto' : 0,
              marginRight: darkMode ? 0 : 'auto'
            }}
          >
            {darkMode ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 text-orange-500"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-live-dot" style={{ backgroundColor: COLORS.LIGHT.ACCENT }}></div>
          <span className="font-mono text-sm font-bold uppercase tracking-tighter">{TEXT.LIVE_STREAM}</span>
        </div>
      </div>
    </header>
  );
};