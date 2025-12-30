import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signInWithPopup, User, signOut } from 'firebase/auth';
import { auth, googleProvider, db, isFirebaseInitialized } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { TextureOverlay } from './components/TextureOverlay';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MasonryGrid } from './components/MasonryGrid';
import { LoginModal } from './components/LoginModal';
import { Tweet } from './types';
import { COLORS, SEGMENTS, TEXT, LINKS } from './constants';
// @ts-ignore
import localDump from './harvest_dump_1766768955732.json';

// Simple normalization for the dump file if needed
const normalizeLocalDump = (data: any[]): Tweet[] => {
  return data.map((item) => {
    const t = item.tweet || item;
    return {
      id: String(t.id_str || t.id || `gen_${Math.random().toString(36).slice(2)}`),
      created_at: t.created_at || new Date().toISOString(),
      full_text: t.full_text || t.text || 'Error: Content undefined',
      user: t.user || { name: 'Archive User', screen_name: 'offline_user', profile_image_url_https: '' },
      extended_entities: t.extended_entities,
      favorite_count: t.favorite_count || 0,
      retweet_count: t.retweet_count || 0
    } as Tweet;
  }).filter(t => t.full_text);
};


const LOCAL_STORAGE_KEY = 'harvester_local_tweets_v1';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [darkMode, setDarkMode] = useState(true); 
  const [columnCount, setColumnCount] = useState(3);
  const [activeSegment, setActiveSegment] = useState(SEGMENTS[0].id);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 

  // 1. Initial Load: Check Local Storage first
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setTweets(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to load local cache in memory", e);
      }
    }
  }, []);

  // 2. Auth Listener Here
  useEffect(() => {
    if (!isFirebaseInitialized || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Firestore Sync (Only if User)
  useEffect(() => {
    if (!user || !db) return;

    const q = query(collection(db, `users/${user.uid}/tweets`), orderBy('id', 'desc'));

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/tweets`), (snapshot) => {
      const loadedTweets: Tweet[] = [];
      snapshot.forEach((doc) => {
        loadedTweets.push(doc.data() as Tweet);
      });
      loadedTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTweets(loadedTweets);
    });

    return () => unsubscribe();
  }, [user]);

  // 4. Local Storage Sync (Only if Guest)
  useEffect(() => {
    if (!user && tweets.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tweets));
    }
  }, [tweets, user]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? COLORS.DARK.BG : COLORS.LIGHT.BG;
  }, [darkMode]);

  const handleLogin = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleDataLoaded = (newTweets: Tweet[]) => {
    setTweets(newTweets); // This will trigger the Local Storage Sync effect
  };

  const filteredTweets = tweets.filter(t => {
    if (activeSegment === 'MEDIA') return t.extended_entities?.media && t.extended_entities.media.length > 0;
    if (activeSegment === 'FAVORITES') return (t.favorite_count || 0) > 0;
    if (activeSegment === 'THREADS') return t.full_text.length > 200;
    return true;
  });

  const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: COLORS.DARK.BG, color: COLORS.DARK.TEXT }}>
        <TextureOverlay />
        <div className="w-16 h-16 border-2 mb-4 animate-pulse rounded-full flex items-center justify-center border-white/20">
          <div className="w-2 h-2 bg-white/40"></div>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Core...</p>
      </div>
    );
  }

  if (!isFirebaseInitialized) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden text-center p-8"
        style={{ backgroundColor: COLORS.DARK.BG, color: COLORS.DARK.TEXT }}>
        <TextureOverlay />
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-red-500 font-['Space_Grotesk']">SYSTEM ERROR</h1>
        <div className="border border-red-500/30 p-8 bg-red-500/5 backdrop-blur-sm max-w-lg mb-8">
          <p className="font-mono text-xs font-bold mb-4 uppercase">Configuration Missing</p>
          <p className="font-mono text-[10px] opacity-70 leading-relaxed">
            The automated deployment protocol failed to locate valid security credentials.
            <br /><br />
            1. Create <span className="text-white bg-white/10 px-1">.env</span> file in root.
            <br />
            2. Add <span className="text-white bg-white/10 px-1">VITE_FIREBASE_API_KEY</span> and other keys.
            <br />
            3. Restart configuration terminal (<span className="text-white bg-white/10 px-1">npm run dev</span>).
          </p>
        </div>

        <p className="font-mono text-[9px] mt-8 opacity-30">ERR_CODE: ENV_VARS_UNDEFINED</p>
      </div>
    )
  }

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
            // We no longer pass onDataLoaded for local state, but we pass user to save to DB
            user={user}
            onDataLoaded={handleDataLoaded} // RESTORED local handler
            onLoginClick={() => setIsLoginModalOpen(true)}
            totalTweets={tweets.length}
            tweets={tweets} // Still needed for export if we want export functionality
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

                {/* Login / Logout Button in Segment Bar */}
                {user ? (
                  <button
                    onClick={() => auth && signOut(auth)}
                    className="ml-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-2 px-3 py-1 rounded-full flex items-center justify-center hover:bg-green-500/20 text-green-500 transition-colors border border-green-500/30 text-[10px] font-mono uppercase"
                    title="Login to Sync"
                  >
                    Login / Sync
                  </button>
                )}
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
            {!user && tweets.length > 0 && (
              <span className="font-mono text-[9px] text-yellow-500 opacity-80 ml-2">
                [LOCAL_STORAGE_ACTIVE]
              </span>
            )}
          </div>
          <div className="font-mono text-[9px] opacity-40 flex gap-4">
            <span>USER: {user ? user.email : 'GUEST_ACCESS'}</span>
            <a href={LINKS.STOICFEATS} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              {TEXT.FOOTER_CREDIT}
            </a>
          </div>
        </footer>
      </motion.div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default App;
