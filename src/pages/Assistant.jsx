import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import AnimatedPage from '../components/ui/AnimatedPage';

/* ─── Mock AI responses ──────────────────────────────────── */
const AI_RESPONSES = {
    'hello': "Hello! I'm your DoseWise Assistant. How can I help you with your medications today?",
    'hi': "Hi there! 👋 I can help you with pill identification, medication schedules, and health questions. What would you like to know?",
    'what is this pill': "To identify a pill, please go to the **Scan Pill** page and use your camera. I can help you understand the results once you scan it!",
    'when should i take medicine': "Check your **Adherence** page for today's schedule. Generally, take medications at the same time each day. Set reminders in the app to stay on track! ⏰",
    'side effects': "Side effects vary by medication. Always read the label and consult your doctor. If you experience severe side effects, seek medical attention immediately. 🏥",
    'missed dose': "If you missed a dose, take it as soon as you remember unless it's close to your next dose. Never double up without checking with your pharmacist. 💊",
    'interaction': "Drug interactions can be serious. Check the **My Meds** page — we automatically flag known interactions. Always inform your doctor about all medications you take.",
    'reminder': "You can set up reminders in the app! Go to **My Meds**, set your schedule times, and we'll send browser notifications when it's time to take your meds. 🔔",
};

function getAIResponse(input) {
    const lower = input.toLowerCase().trim();
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) return response;
    }
    return "I'm here to help with medication questions! You can ask me about:\n• Pill identification\n• Medication schedules\n• Side effects\n• Drug interactions\n• Missed doses\n• Setting reminders";
}

/* ─── Chat Bubble ────────────────────────────────────────── */
function ChatBubble({ message, sender, timestamp }) {
    const isUser = sender === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-primary-100 text-primary-600' : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-glow'
                }`}>
                {isUser ? <span className="text-sm font-bold">You</span> : <Bot size={18} />}
            </div>
            <div className={`max-w-[75%] px-5 py-3.5 text-sm leading-relaxed ${isUser
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-md shadow-btn'
                : 'rounded-2xl rounded-bl-md themed-text'
                }`}
                style={!isUser ? {
                    background: 'var(--color-surface)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'var(--color-border)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 16px var(--color-card-shadow), inset 0 1px 0 var(--color-inset)',
                } : {}}
            >
                <p className="whitespace-pre-wrap">{message}</p>
                {timestamp && (
                    <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/50' : 'themed-text-muted opacity-60'}`}>{timestamp}</p>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Typing dots indicator ─────────────────────────────── */
function TypingIndicator() {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex gap-3">
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
            message: "Hello! I'm your DoseWise Assistant 🤖 I can help you with pill identification, medication questions, and health reminders. What would you like to know?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const generateDoseWiseReply = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('pill') || msg.includes('what is this pill')) {
            return "This looks like a medication-related question. You can scan a pill or add it to My Meds for better tracking.";
        }
        if (msg.includes('when should i take')) {
            return "Medication timing depends on your prescription. Check your schedule inside My Meds.";
        }
        if (msg.includes('side effects')) {
            return "Side effects vary by medication. Always consult a professional for medical advice.";
        }
        return "I'm your DoseWise Assistant. I can help with medicines, reminders, and pill identification.";
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const query = input.trim();
        const userMsg = {
            sender: 'user',
            message: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Small random delay for "alive" feel
        setTimeout(() => {
            setIsTyping(false);
            const reply = generateDoseWiseReply(query);
            setMessages((prev) => [...prev, {
                sender: 'ai',
                message: reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 800 + Math.random() * 500);
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    const quickQuestions = ['What is this pill?', 'When should I take medicine?', 'Missed dose', 'Side effects', 'Drug interaction', 'Set a reminder'];

    return (
        <AnimatedPage className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-4">
                <h1 className="text-elder-2xl font-bold themed-text flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow">
                        <Bot size={20} className="text-white" />
                    </div>
                    DoseWise Assistant
                    <Sparkles size={18} className="text-primary-400 animate-pulse-slow" />
                </h1>
                <p className="text-sm themed-text-muted mt-1 font-medium">Your Health Analytics & Medication Companion</p>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto rounded-2xl p-5 space-y-4 mb-4"
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

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.map((q) => (
                    <motion.button key={q} whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setInput(q)}
                        className="text-xs font-medium px-3.5 py-1.5 rounded-full border text-primary-600 transition-colors"
                        style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-surface)' }}>
                        {q}
                    </motion.button>
                ))}
            </div>

            {/* Input area */}
            <div className="flex gap-3 p-2 rounded-2xl"
                style={{ background: 'var(--color-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--color-border)', boxShadow: '0 8px 32px var(--color-card-shadow)' }}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Ask about your medications..."
                    className="flex-1 px-4 py-3 rounded-xl bg-transparent outline-none text-elder-sm themed-text"
                    style={{ color: 'var(--color-text)' }} />
                <motion.button onClick={handleSend} disabled={!input.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-xl shadow-btn hover:shadow-btn-hover transition-shadow disabled:opacity-40 disabled:cursor-not-allowed">
                    <Send size={20} />
                </motion.button>
            </div>
        </AnimatedPage>
    );
}
