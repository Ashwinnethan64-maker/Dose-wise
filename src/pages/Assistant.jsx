import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Bot, Sparkles, AlertCircle, Plus, Trash2, Edit3, 
    MessageSquare, Mic, MicOff, PanelLeft, PanelLeftClose, 
    Copy, Check, RotateCcw, X, Globe, ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AnimatedPage from '../components/ui/AnimatedPage';
import { sendMessageToGLM } from '../ai/chatService';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'dosewise_chat_sessions_v4';

const LANGUAGES = [
    { 
        id: 'en', 
        name: 'English', 
        flag: '🌐', 
        speechLang: 'en-IN', 
        welcomeMsg: "Hello! I'm your DoseWise AI Assistant 🤖 I can help you with pill identification, medication questions, side effects, and health guidance. What would you like to know?" 
    },
    { 
        id: 'hi', 
        name: 'हिंदी (Hindi)', 
        flag: '🇮🇳', 
        speechLang: 'hi-IN', 
        welcomeMsg: "नमस्ते! मैं आपका डोजवाइज AI सहायक हूँ 🤖 मैं दवाओं की जानकारी, खुराक, साइड इफेक्ट्स और स्वास्थ्य गाइड में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?" 
    },
    { 
        id: 'kn', 
        name: 'ಕನ್ನಡ (Kannada)', 
        flag: '🇮🇳', 
        speechLang: 'kn-IN', 
        welcomeMsg: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡೋಸ್‌ವೈಸ್ AI ಸಹಾಯಕ 🤖 ಔಷಧಿಗಳ ಮಾಹಿತಿ, ಡೋಸೇಜ್, ಅಡ್ಡಪರಿಣಾಮಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಸಲಹೆಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?" 
    }
];

const QUICK_QUESTIONS_BY_LANG = {
    en: [
        'What is this pill?',
        'When should I take medicine?',
        'Missed dose guidance',
        'Side effects overview',
        'Drug interactions',
        'Storage instructions'
    ],
    hi: [
        'यह दवा क्या है?',
        'दवा कब लेनी चाहिए?',
        'दवा छूट जाने पर क्या करें?',
        'साइड इफेक्ट्स की जानकारी',
        'दवाइयों का परस्पर प्रभाव',
        'दवा रखने के निर्देश'
    ],
    kn: [
        'ಈ ಮಾತ್ರೆ ಯಾವುದು?',
        'ಔಷಧಿಯನ್ನು ಯಾವಾಗ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?',
        'ಡೋಸ್ ತಪ್ಪಿದರೆ ಏನು ಮಾಡಬೇಕು?',
        'ಅಡ್ಡ ಪರಿಣಾಮಗಳ ವಿವರ',
        'ಔಷಧಿಗಳ ಸಂವಹನ',
        'ಔಷಧಿ ಶೇಖರಣಾ ಸೂಚನೆಗಳು'
    ]
};

const makeWelcomeMsg = (langId = 'en') => {
    const langObj = LANGUAGES.find(l => l.id === langId) || LANGUAGES[0];
    return {
        sender: 'ai',
        message: langObj.welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
};

/* ─── Helper for user-friendly error messages ───────────── */
function getErrorMessage(errType) {
    switch (errType) {
        case 'API_KEY_MISSING':    return 'API Key is missing. Please check your `.env` for `VITE_GLM_API_KEY`.';
        case 'INVALID_API_KEY':   return 'Invalid API Key. Please verify your NVIDIA GLM key in `.env`.';
        case 'RATE_LIMIT':        return 'Rate limit reached. Please wait a moment and try again.';
        case 'TIMEOUT':           return 'Request timed out. Please check your connection.';
        case 'OFFLINE':
        case 'NETWORK_ERROR':     return 'Network error. Please check your internet connection.';
        default:                  return 'An unexpected error occurred. Please try again.';
    }
}

/* ─── Chat Message Bubble Component ─────────────────────── */
function ChatBubble({ message, sender, timestamp, isError, onRegenerate }) {
    const { t } = useLanguage();
    const isUser = sender === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!message) return;
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2.5 sm:gap-3 items-start my-2.5 sm:my-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                isUser
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : isError
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-glow'
            }`}>
                {isUser ? 'You' : isError ? <AlertCircle size={15} /> : <Bot size={15} />}
            </div>

            {/* Bubble Content */}
            <div className={`flex flex-col group max-w-[88%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`text-xs sm:text-sm leading-relaxed px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl ${
                        isUser
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn rounded-tr-xs'
                            : isError
                                ? 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20 rounded-tl-xs'
                                : 'rounded-tl-xs themed-text'
                    }`}
                    style={(!isUser && !isError) ? {
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 2px 12px var(--color-card-shadow)',
                    } : {}}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message}</p>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-current space-y-2">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li>{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold text-primary-500 dark:text-primary-400">{children}</strong>,
                                    code: ({ children }) => <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">{children}</a>,
                                }}
                            >
                                {message}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    {timestamp && (
                        <span className="text-[10px] themed-text-muted opacity-60">{timestamp}</span>
                    )}
                    {!isUser && !isError && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={handleCopy} title={t('copyResponse')} className="p-1 rounded themed-text-muted hover:text-primary-500 transition-colors">
                                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                            </button>
                            {onRegenerate && (
                                <button onClick={onRegenerate} title={t('regenerateResponse')} className="p-1 rounded themed-text-muted hover:text-primary-500 transition-colors">
                                    <RotateCcw size={13} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Typing Dots Indicator ─────────────────────────────── */
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2.5 sm:gap-3 items-end my-3"
        >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-glow shrink-0">
                <Bot size={15} />
            </div>
            <div className="px-4 py-2.5 rounded-2xl flex items-center gap-1.5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </motion.div>
    );
}

/* ─── Main Assistant Component ───────────────────────────── */
export default function Assistant() {
    const { language, setLanguage, t } = useLanguage();
    const selectedLang = language;

    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    // Chat Sessions State from LocalStorage
    const [sessions, setSessions] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
        const id = Date.now().toString();
        return [{ id, title: 'New Conversation', createdAt: new Date().toISOString(), messages: [makeWelcomeMsg(selectedLang)] }];
    });

    const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    });

    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');

    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const initialInputRef = useRef('');
    const activeStreamRef = useRef(null);

    const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
    const messages = activeSession?.messages || [];
    const currentLangObj = LANGUAGES.find(l => l.id === selectedLang) || LANGUAGES[0];
    const quickQuestions = QUICK_QUESTIONS_BY_LANG[selectedLang] || QUICK_QUESTIONS_BY_LANG.en;

    const handleSelectLanguage = (langId) => {
        setLanguage(langId);
        setIsLangDropdownOpen(false);
    };

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    }, [sessions]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
            if (activeStreamRef.current) {
                try { activeStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
            }
        };
    }, []);

    const toggleListening = async () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (isListening) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
            if (activeStreamRef.current) {
                try { activeStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
                activeStreamRef.current = null;
            }
            setIsListening(false);
            setVoiceStatus('');
            return;
        }

        if (!SR) {
            alert('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        let stream;
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                activeStreamRef.current = stream;
            }
        } catch (mediaErr) {
            console.error('Microphone permission error:', mediaErr);
            alert('Microphone access was denied or not available. Please allow microphone permissions in your browser address bar.');
            return;
        }

        try {
            initialInputRef.current = input;
            const rec = new SR();
            rec.continuous = false;
            rec.interimResults = true;
            rec.lang = currentLangObj.speechLang;

            rec.onstart = () => {
                setIsListening(true);
                setVoiceStatus(t('listeningIn', { lang: currentLangObj.name }));
            };

            rec.onresult = (event) => {
                let fullSpeech = '';
                for (let i = 0; i < event.results.length; ++i) {
                    fullSpeech += event.results[i][0].transcript;
                }
                const prefix = initialInputRef.current ? initialInputRef.current.trim() + ' ' : '';
                if (fullSpeech) {
                    setInput(prefix + fullSpeech.trimStart());
                }
            };

            rec.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    alert('Microphone access was blocked. Please enable microphone permissions in your browser settings.');
                }
                setIsListening(false);
                setVoiceStatus('');
            };

            rec.onend = () => {
                setIsListening(false);
                setVoiceStatus('');
                if (activeStreamRef.current) {
                    try { activeStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
                    activeStreamRef.current = null;
                }
            };

            rec.start();
            recognitionRef.current = rec;
        } catch (err) {
            console.error('Failed to start speech recognition:', err);
            setIsListening(false);
            setVoiceStatus('');
            if (stream) stream.getTracks().forEach(t => t.stop());
        }
    };

    const updateActiveMessages = (updater) => {
        setSessions(prev => prev.map(s => {
            if (s.id !== activeSessionId) return s;
            const msgs = typeof updater === 'function' ? updater(s.messages) : updater;
            let title = s.title;
            if ((title === 'New Conversation' || title === 'नई बातचीत' || title === 'ಹೊಸ ಸಂಭಾಷಣೆ') && msgs.length > 1) {
                const firstUserMsg = msgs.find(m => m.sender === 'user');
                if (firstUserMsg) {
                    title = firstUserMsg.message.slice(0, 32) + (firstUserMsg.message.length > 32 ? '...' : '');
                }
            }
            return { ...s, title, messages: msgs };
        }));
    };

    const handleNewChat = () => {
        const newId = Date.now().toString();
        const newSession = {
            id: newId,
            title: t('newChat'),
            createdAt: new Date().toISOString(),
            messages: [makeWelcomeMsg(selectedLang)]
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
        setInput('');
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleDeleteSession = (id, e) => {
        e.stopPropagation();
        const filtered = sessions.filter(s => s.id !== id);
        if (filtered.length === 0) {
            const newId = Date.now().toString();
            const fresh = { id: newId, title: t('newChat'), createdAt: new Date().toISOString(), messages: [makeWelcomeMsg(selectedLang)] };
            setSessions([fresh]);
            setActiveSessionId(newId);
        } else {
            setSessions(filtered);
            if (activeSessionId === id) setActiveSessionId(filtered[0].id);
        }
    };

    const handleSaveTitle = (id) => {
        if (editingTitle.trim()) {
            setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editingTitle.trim() } : s));
        }
        setEditingSessionId(null);
    };

    const handleSend = async (overridePrompt) => {
        const rawQuery = (overridePrompt || input).trim();
        if (!rawQuery || isTyping) return;

        if (isListening && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
            if (activeStreamRef.current) {
                try { activeStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
                activeStreamRef.current = null;
            }
            setIsListening(false);
            setVoiceStatus('');
        }

        let modelQuery = rawQuery;
        if (selectedLang === 'hi') {
            modelQuery = `[Respond strictly in Hindi (हिंदी)]: ${rawQuery}`;
        } else if (selectedLang === 'kn') {
            modelQuery = `[Respond strictly in Kannada (ಕನ್ನಡ)]: ${rawQuery}`;
        } else {
            modelQuery = `[Respond strictly in English]: ${rawQuery}`;
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { sender: 'user', message: rawQuery, timestamp: timeStr };
        const currentHistory = [...messages];

        updateActiveMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const aiMsgIndex = currentHistory.length + 1;

        try {
            const replyText = await sendMessageToGLM(currentHistory, modelQuery, (chunkText) => {
                setIsTyping(false);
                updateActiveMessages(prev => {
                    const newArr = [...prev];
                    if (newArr[aiMsgIndex]) {
                        newArr[aiMsgIndex] = { ...newArr[aiMsgIndex], message: chunkText };
                    } else {
                        newArr.push({ sender: 'ai', message: chunkText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
                    }
                    return newArr;
                });
            });

            if (replyText) {
                updateActiveMessages(prev => {
                    const newArr = [...prev];
                    if (newArr[aiMsgIndex]) {
                        newArr[aiMsgIndex] = { ...newArr[aiMsgIndex], message: replyText };
                    } else {
                        newArr.push({ sender: 'ai', message: replyText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
                    }
                    return newArr;
                });
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            setIsTyping(false);
            const friendlyErr = getErrorMessage(error.message) + (error.rawDetails ? ` (${error.rawDetails})` : '');
            updateActiveMessages(prev => [
                ...prev.filter((_, idx) => idx !== aiMsgIndex),
                { sender: 'ai', message: friendlyErr, isError: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <AnimatedPage className="space-y-3 sm:space-y-4">
            {/* Top Title Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg sm:text-2xl font-bold themed-text flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-glow shrink-0">
                            <Bot size={16} />
                        </div>
                        <span>{t('assistantTitle')}</span>
                        <Sparkles size={15} className="text-primary-400 animate-pulse" />
                    </h1>
                    <p className="text-[11px] sm:text-sm themed-text-muted mt-0.5 font-medium">{t('assistantSub')}</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Multilingual Language Dropdown Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangDropdownOpen(prev => !prev)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold themed-text hover:bg-primary-50/50 dark:hover:bg-primary-950/30 transition-all"
                            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                        >
                            <span>{currentLangObj.flag}</span>
                            <span>{currentLangObj.name}</span>
                            <ChevronDown size={14} className={`opacity-60 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-xl border shadow-xl overflow-hidden py-1 themed-dropdown"
                                >
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => handleSelectLanguage(lang.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left font-medium transition-colors ${
                                                selectedLang === lang.id
                                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                                                    : 'themed-text hover:bg-primary-50/50 dark:hover:bg-primary-950/30'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </span>
                                            {selectedLang === lang.id && <Check size={14} className="text-primary-500" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleNewChat}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs sm:text-sm font-semibold shadow-btn hover:shadow-btn-hover transition-all shrink-0"
                    >
                        <Plus size={15} />
                        <span>{t('newChat')}</span>
                    </motion.button>
                </div>
            </div>

            {/* Main Unified Chat App Container */}
            <div 
                className="glass-card flex flex-col md:flex-row h-[calc(100vh-13.5rem)] min-h-[500px] max-h-[760px] overflow-hidden relative"
                style={{ background: 'var(--color-surface)' }}
            >
                {/* ── Mobile Full-Screen Sidebar Backdrop Overlay ── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* ── Sidebar (ChatGPT Drawer on Mobile / Panel on Desktop) ── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="
                                fixed top-0 left-0 bottom-0 z-50 w-[82vw] max-w-[300px] h-full shadow-2xl rounded-r-3xl border-r
                                md:static md:z-auto md:w-64 lg:w-72 md:h-full md:rounded-none md:shadow-none
                                flex flex-col shrink-0 border-teal-500/10 dark:border-teal-500/20
                            "
                            style={{ background: 'var(--color-surface-solid)' }}
                        >
                            {/* Sidebar Top Header & New Chat Button */}
                            <div className="p-3.5 border-b flex items-center justify-between gap-2" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    onClick={handleNewChat}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-xs shadow-btn hover:shadow-btn-hover transition-all"
                                >
                                    <Plus size={15} />
                                    <span>{t('newChat')}</span>
                                </button>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    title="Close sidebar"
                                    className="md:hidden p-2 rounded-lg themed-text-muted hover:bg-black/5 dark:hover:bg-white/10"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Saved Chats List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                <p className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-primary-600 dark:text-primary-400 uppercase">
                                    {t('savedConversations')}
                                </p>

                                {sessions.map((session) => {
                                    const isActive = session.id === activeSessionId;
                                    const isEditing = editingSessionId === session.id;

                                    return (
                                        <div
                                            key={session.id}
                                            onClick={() => {
                                                setActiveSessionId(session.id);
                                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                                            }}
                                            className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                                                isActive
                                                    ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300 font-semibold border border-primary-500/20'
                                                    : 'themed-text-muted hover:bg-primary-50/40 dark:hover:bg-primary-950/20'
                                            }`}
                                        >
                                            <MessageSquare size={14} className={`shrink-0 ${isActive ? 'text-primary-500' : 'opacity-60'}`} />

                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editingTitle}
                                                    onChange={(e) => setEditingTitle(e.target.value)}
                                                    onBlur={() => handleSaveTitle(session.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(session.id)}
                                                    autoFocus
                                                    className="flex-1 px-1.5 py-0.5 text-xs rounded border border-primary-500 bg-transparent outline-none themed-text"
                                                />
                                            ) : (
                                                <span className="flex-1 truncate pr-10">{session.title}</span>
                                            )}

                                            {!isEditing && (
                                                <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingSessionId(session.id);
                                                            setEditingTitle(session.title);
                                                        }}
                                                        title="Rename chat"
                                                        className="p-1 hover:text-primary-500"
                                                    >
                                                        <Edit3 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteSession(session.id, e)}
                                                        title="Delete chat"
                                                        className="p-1 hover:text-red-500"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-3 border-t text-[11px] themed-text-muted flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                                <span className="flex items-center gap-1">
                                    <Globe size={12} className="text-primary-500" /> {currentLangObj.name} Mode
                                </span>
                                <span className="text-xs text-primary-500 font-semibold">{t('chatsCount', { count: sessions.length })}</span>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ── Main Chat Feed Area ── */}
                <div className="flex-1 flex flex-col min-w-0 h-full">
                    {/* Top Bar inside Chat Card */}
                    <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <button
                                onClick={() => setIsSidebarOpen(prev => !prev)}
                                title={isSidebarOpen ? "Hide chat history" : "Show chat history"}
                                className="p-1.5 rounded-lg border hover:bg-primary-50/50 dark:hover:bg-primary-950/30 text-primary-600 transition-colors shrink-0"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                            </button>

                            <h2 className="text-xs sm:text-sm font-semibold themed-text truncate">
                                {activeSession?.title || t('assistantTitle')}
                            </h2>
                        </div>

                        <span className="text-[10px] sm:text-[11px] text-primary-600 font-medium bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full border border-primary-500/20 shrink-0">
                            {currentLangObj.flag} {t('aiLabel', { name: currentLangObj.name })}
                        </span>
                    </div>

                    {/* Chat Messages Feed Container */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full">
                            {messages.map((msg, i) => (
                                <ChatBubble
                                    key={i}
                                    {...msg}
                                    onRegenerate={
                                        (!isTyping && i === messages.length - 1 && msg.sender === 'ai')
                                            ? () => {
                                                const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
                                                if (lastUserMsg) handleSend(lastUserMsg.message);
                                            }
                                            : null
                                    }
                                />
                            ))}
                            <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Quick Chips & Input Toolbar Container */}
                    <div className="p-2.5 sm:p-4 border-t shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                        <div className="max-w-3xl mx-auto w-full space-y-2">
                            
                            {/* Quick Questions Horizontal Scroll Chips */}
                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none whitespace-nowrap -mx-1 px-1">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q}
                                        disabled={isTyping}
                                        onClick={() => handleSend(q)}
                                        className="text-[11px] sm:text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 transition-colors disabled:opacity-50 shrink-0"
                                        style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-input-bg)' }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Voice Status Alert Bar */}
                            <AnimatePresence>
                                {isListening && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400"
                                    >
                                        <span className="flex items-center gap-2 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                            {voiceStatus || t('listeningIn', { lang: currentLangObj.name })}
                                        </span>
                                        <button 
                                            onClick={toggleListening}
                                            className="font-semibold underline hover:text-red-700"
                                        >
                                            {t('stopVoice')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Bar */}
                            <div 
                                className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl border shadow-sm"
                                style={{ background: 'var(--color-input-bg)', borderColor: 'var(--color-border-input)' }}
                            >
                                <textarea
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTyping}
                                    placeholder={isListening ? t('listeningShort', { lang: currentLangObj.name }) : t('askPlaceholder')}
                                    className="flex-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-transparent outline-none text-xs sm:text-sm themed-text resize-none min-h-[36px] sm:min-h-[38px] max-h-28"
                                />

                                {/* Voice Microphone Icon Button */}
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    title={isListening ? t('stopVoice') : `Speak in ${currentLangObj.name}`}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                                        isListening
                                            ? 'bg-red-500 text-white shadow-glow animate-pulse'
                                            : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40'
                                    }`}
                                >
                                    {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                                </button>

                                {/* Send Button */}
                                <button
                                    type="button"
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isTyping}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-btn hover:shadow-btn-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                    aria-label="Send message"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
