import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendSignInLinkToEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { COLORS } from '../constants';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode: boolean;
}

type AuthMode = 'GOOGLE' | 'EMAIL' | 'MAGIC';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, darkMode }) => {
    const [mode, setMode] = useState<AuthMode>('GOOGLE');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const theme = darkMode ? COLORS.DARK : COLORS.LIGHT;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth!, googleProvider!);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth!, email, password);
            } else {
                await signInWithEmailAndPassword(auth!, email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const actionCodeSettings = {
            url: window.location.origin, // Redirect back to here
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth!, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setMessage("Check your email for the magic link!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-md p-6 rounded-none border shadow-2xl relative overflow-hidden"
                    style={{
                        backgroundColor: theme.BG,
                        borderColor: theme.BORDER,
                        color: theme.TEXT
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Tabs */}
                    <div className="flex border-b mb-6" style={{ borderColor: theme.BORDER }}>
                        {(['GOOGLE', 'EMAIL', 'MAGIC'] as AuthMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(null); setMessage(null); }}
                                className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${mode === m ? 'text-blue-500 border-b-2 border-blue-500' : 'opacity-40 hover:opacity-100'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[200px] flex flex-col justify-center">
                        {error && <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">{error}</div>}
                        {message && <div className="mb-4 p-2 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-mono">{message}</div>}

                        {mode === 'GOOGLE' && (
                            <div className="text-center space-y-4">
                                <p className="text-xs opacity-60">Secure standard access using Google Protocol.</p>
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full py-3 border border-current hover:bg-white hover:text-black transition-colors font-mono text-xs font-bold uppercase disabled:opacity-50"
                                >
                                    {loading ? 'Connecting...' : 'Continue with Google'}
                                </button>
                            </div>
                        )}

                        {mode === 'EMAIL' && (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-mono mb-1 opacity-50">Identity (Email)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border p-2 text-xs outline-none focus:border-blue-500 transition-colors"
                                        style={{ borderColor: theme.BORDER }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-mono mb-1 opacity-50">Passcode</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent border p-2 text-xs outline-none focus:border-blue-500 transition-colors"
                                        style={{ borderColor: theme.BORDER }}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 border border-current hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all font-mono text-xs font-bold uppercase disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : (isRegistering ? 'Register New ID' : 'Authenticate')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(!isRegistering)}
                                    className="w-full text-[10px] font-mono opacity-50 hover:opacity-100 hover:underline"
                                >
                                    {isRegistering ? 'Have an account? Login' : 'No ID? Create one'}
                                </button>
                            </form>
                        )}

                        {mode === 'MAGIC' && (
                            <form onSubmit={handleMagicLink} className="space-y-4">
                                <p className="text-xs opacity-60 mb-2">Receive a one-time access link via secure transmission.</p>
                                <div>
                                    <label className="block text-[10px] uppercase font-mono mb-1 opacity-50">Target (Email)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border p-2 text-xs outline-none focus:border-blue-500 transition-colors"
                                        style={{ borderColor: theme.BORDER }}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 border border-current hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all font-mono text-xs font-bold uppercase disabled:opacity-50"
                                >
                                    {loading ? 'Sending Transmission...' : 'Send Magic Link'}
                                </button>
                            </form>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-xs opacity-30 hover:opacity-100 font-mono"
                    >
                        [ESC]
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
