export const COLORS = {
    LIGHT: {
        BG: '#e2e0d9',
        TEXT: '#1a1a1a',
        ACCENT: '#ff4d00',
        BORDER: 'rgba(0,0,0,0.1)',
        CARD_BG: '#e2e0d9',
        SHADOW: 'shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]',
        SHADOW_ACTIVE: 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]',
        SHADOW_INSET: 'shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]',
        SHADOW_HOVER: 'hover:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)]',
    },
    DARK: {
        BG: '#1a1a1a',
        TEXT: '#e2e0d9',
        ACCENT: '#ff4d00',
        BORDER: 'rgba(226,224,217,0.1)',
        CARD_BG: '#222222',
        SHADOW: 'shadow-[4px_4px_8px_rgba(0,0,0,0.6),-1px_-1px_2px_rgba(255,255,255,0.05)]',
        SHADOW_ACTIVE: 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]',
        SHADOW_INSET: 'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]',
        SHADOW_HOVER: 'hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-1px_-1px_2px_rgba(255,255,255,0.1)]',
    }
};

export const TEXT = {
    SYSTEM_PROTOCOL: 'System Protocol: 88-X',
    TITLE: 'Harvester',
    LIVE_STREAM: 'Live Stream Active',
    STREAM_ACTIVE: 'STREAM_ACTIVE',
    STREAM_IDLE: 'STREAM_IDLE',
    PROCESSING: 'PROCESSING',
    AWAITING_INPUT: 'AWAITING_INPUT',
    FOOTER_CREDIT: 'MADE BY @STOICFEATS',
    SYSTEM_READY: 'System Ready',
    BUFFER_COUNT: 'BUFFER_COUNT',
    DRAG_DROP: 'DRAG & DROP JSON',
    OR_PASTE: 'OR PASTE RAW DATA',
    LOAD_BUFFER: 'LOAD TO BUFFER',
    VIEW_CONFIG: 'View Configuration',
    GRID_DENSITY: 'Grid Density',
    GENERATE_SCRAPER: 'Generate Scraper',
    TARGET_COUNT: 'Target Count',
    COMPILE_SCRIPT: 'Compile Script',
    UNKNOWN_USER: 'Unknown User',
    UNKNOWN_DATE: 'UNKNOWN_DATE',
    OPEN_SOURCE: 'OPEN_SOURCE',
};

export const SEGMENTS = [
    { id: 'ALL', label: 'All Updates' },
    { id: 'MEDIA', label: 'Media & Visuals' },
    { id: 'FAVORITES', label: 'Top Rated' },
    { id: 'THREADS', label: 'Long Form' }
];

export const LINKS = {
    STOICFEATS: 'https://twitter.com/stoicfeats',
    X_BASE: 'https://x.com',
};
