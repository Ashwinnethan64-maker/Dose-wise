import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AnimatedPage from '../components/ui/AnimatedPage';
import { sendMessageToGLM } from '../ai/chatService';

/* ─── Helper for user-friendly error messages ───────────── */
function getErrorMessage(errType) {
    switch (errType) {
        case 'API_KEY_MISSING':
            return 'API Key is missing. Please check your `.env` configuration for `VITE_GLM_API_KEY`.';
        case 'INVALID_API_KEY':
            return 'Invalid NVIDIA GLM API Key. Please verify your key in the `.env` file.';
        case 'RATE_LIMIT':
            return 'You have reached the API rate limit or quota. Please wait a moment and try again.';
        case 'TIMEOUT':
            return 'The request timed out. Please check your network connection and try again.';
        case 'OFFLINE':
        case 'NETWORK_ERROR':
            return 'Network error or offline. Please check your internet connection.';
        default:
            return 'An unexpected error occurred while communicating with DoseWise AI. Please try again.';
    }
}

/* ─── Chat Bubble ────────────────────────────────────────── */
function ChatBubble({ message, sender, timestamp, isError }) {
    const isUser = sender === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-2 items-start ${isUser ? 'flex-row-reverse' : ''}`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isUser 
                    ? 'bg-primary-100 text-primary-600' 
                    : isError
                        ? 'bg-red-500 text-white shadow-glow'
                        : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-glow'
            }`}>
                {isUser ? <span className="text-sm font-bold">You</span> : isError ? <AlertCircle size={18} /> : <Bot size={18} />}
            </div>
            <div className={`text-xs sm:text-sm leading-relaxed ${
                isUser
                    ? 'w-fit max-w-[82%] sm:max-w-[52%] px-3.5 sm:px-4 py-3 sm:py-[14px] bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-md shadow-btn'
                    : isError
                        ? 'max-w-[85%] sm:max-w-[68%] p-3.5 sm:p-4 rounded-2xl rounded-bl-md text-red-600 bg-red-500/10 border border-red-500/20'
                        : 'max-w-[85%] sm:max-w-[68%] p-3.5 sm:p-4 rounded-2xl rounded-bl-md themed-text'
            }`}
            style={(!isUser && !isError) ? {
                background: 'var(--color-surface)',
                backdropFilter: 'blur(12px)',
                borderColor: 'var(--color-border)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 16px var(--color-card-shadow), inset 0 1px 0 var(--color-inset)',
            } : {}}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-current space-y-2">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="leading-normal">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-primary-500">{children}</strong>,
                                code: ({ children }) => <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs">{children}</code>,
                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">{children}</a>,
                            }}
                        >
                            {message}
                        </ReactMarkdown>
                    </div>
                )}
                {timestamp && (
                    <p className={`text-[10px] mt-2 ${isUser ? 'text-white/60 text-right' : 'themed-text-muted opacity-60'}`}>{timestamp}</p>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Typing dots indicator ─────────────────────────────── */
function TypingIndicator() {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex gap-3 items-end">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-glow">
                <Bot size={18} />
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-bl-md flex items-center gap-1.5"
                style={{ background: 'var(--color-surface)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-border)' }}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
        </motion.div>
    );
}

/* ─── Assistant Page ────────────────────────────────────── */
export default function Assistant() {
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            message: "Hello! I'm your DoseWise AI Assistant 🤖 I can help you with pill identification, medication questions, side effects, and health guidance. What would you like to know?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { 
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }, [messages, isTyping]);

    const handleSend = async () => {
        const query = input.trim();
        if (!query || isTyping) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
            sender: 'user',
            message: query,
            timestamp: timeStr
        };

        const currentHistory = [...messages];
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Prepare placeholder AI message for streaming
        const aiMsgIndex = currentHistory.length + 1;

        try {
            const replyText = await sendMessageToGLM(currentHistory, query, (chunkText) => {
                setIsTyping(false); // Hide typing dots once first chunk arrives
                setMessages((prev) => {
                    const newArr = [...prev];
                    if (newArr[aiMsgIndex]) {
                        newArr[aiMsgIndex] = {
                            ...newArr[aiMsgIndex],
                            message: chunkText
                        };
                    } else {
                        newArr.push({
                            sender: 'ai',
                            message: chunkText,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                    }
                    return newArr;
                });
            });

            // Ensure response is set even if streaming callback didn't fire
            if (replyText) {
                setMessages((prev) => {
                    const newArr = [...prev];
                    if (newArr[aiMsgIndex]) {
                        newArr[aiMsgIndex] = {
                            ...newArr[aiMsgIndex],
                            message: replyText
                        };
                    } else {
                        newArr.push({
                            sender: 'ai',
                            message: replyText,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                    }
                    return newArr;
                });
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            setIsTyping(false);
            const friendlyErr = getErrorMessage(error.message) + (error.rawDetails ? ` (${error.rawDetails})` : '');
            setMessages((prev) => [
                ...prev.filter((_, idx) => idx !== aiMsgIndex),
                {
                    sender: 'ai',
                    message: friendlyErr,
                    isError: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
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

    const quickQuestions = [
        'What is this pill?', 
        'When should I take medicine?', 
        'Missed dose guidance', 
        'Side effects overview', 
        'Drug interactions', 
        'Storage instructions'
    ];

    return (
        <AnimatedPage className="flex flex-col flex-1 h-[calc(100dvh-10.5rem)] sm:h-[calc(100vh-9.5rem)] min-h-[480px]">
            <div className="mb-3 sm:mb-6">
                <h1 className="text-xl sm:text-3xl font-bold themed-text flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow shrink-0">
                        <Bot size={18} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <span>DoseWise Assistant</span>
                    <Sparkles size={16} className="text-primary-400 animate-pulse-slow sm:w-[18px] sm:h-[18px]" />
                </h1>
                <p className="text-xs sm:text-base themed-text-muted mt-1 font-medium">Your Health Analytics & Medication Companion</p>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto rounded-2xl p-3 sm:p-6 space-y-3.5 sm:space-y-4 mb-2.5 sm:mb-4"
                style={{
                    background: 'var(--color-surface)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-border)',
                }}
            >
                {messages.map((msg, i) => <ChatBubble key={i} {...msg} />)}
                <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Quick chips - scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 mb-2.5 sm:mb-4 scrollbar-none whitespace-nowrap -mx-1 px-1">
                {quickQuestions.map((q) => (
                    <motion.button key={q} whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        disabled={isTyping}
                        onClick={() => setInput(q)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border text-primary-600 hover:bg-primary-50/40 transition-colors disabled:opacity-50 shrink-0 min-h-[36px] flex items-center"
                        style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-surface)' }}>
                        {q}
                    </motion.button>
                ))}
            </div>

            {/* Input area */}
            <div className="flex gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl items-center"
                style={{ background: 'var(--color-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--color-border)', boxShadow: '0 8px 32px var(--color-card-shadow)' }}>
                <textarea 
                    rows={1}
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    placeholder="Ask about your medications..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-transparent outline-none text-xs sm:text-sm themed-text focus-visible:outline-2 focus-visible:outline-primary-500 resize-none min-h-[44px]"
                    style={{ color: 'var(--color-text)' }} 
                />
                <motion.button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isTyping} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white w-11 h-11 rounded-xl shadow-btn hover:shadow-btn-hover transition-shadow disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 flex items-center justify-center shrink-0 min-w-[44px] min-h-[44px]"
                    aria-label="Send message"
                >
                    <Send size={18} />
                </motion.button>
            </div>
        </AnimatedPage>
    );
}
