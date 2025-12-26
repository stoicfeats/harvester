import React from 'react';
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
        <button
          onClick={toggleDarkMode}
          className="w-10 h-5 rounded-full relative transition-colors duration-300"
          style={{ backgroundColor: darkMode ? COLORS.LIGHT.BG : COLORS.DARK.BG }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
            style={{
              backgroundColor: darkMode ? COLORS.DARK.BG : COLORS.LIGHT.BG,
              transform: darkMode ? 'translateX(20px)' : 'translateX(2px)'
            }}
          />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-live-dot" style={{ backgroundColor: COLORS.LIGHT.ACCENT }}></div>
          <span className="font-mono text-sm font-bold uppercase tracking-tighter">{TEXT.LIVE_STREAM}</span>
        </div>
      </div>
    </header>
  );
};