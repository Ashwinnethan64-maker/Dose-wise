import { Bot, User } from 'lucide-react';

/**
 * ChatBubble — Chat message bubble for the DoseWise Assistant.
 * Props:
 *  - message: string
 *  - sender: 'user' | 'ai'
 *  - timestamp: string (optional)
 */
export default function ChatBubble({ message, sender = 'ai', timestamp }) {
    const isUser = sender === 'user';

    return (
        <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUser
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
                    }`}
            >
                {isUser ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-elder-sm leading-relaxed ${isUser
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-white border border-primary-100 text-medical-text rounded-bl-md shadow-card'
                    }`}
            >
                <p>{message}</p>
                {timestamp && (
                    <p className={`text-xs mt-1.5 ${isUser ? 'text-white/60' : 'text-medical-muted'}`}>
                        {timestamp}
                    </p>
                )}
            </div>
        </div>
    );
}
