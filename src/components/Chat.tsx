import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
    roomId: string;
    socket: any;
    userName: string;
}

export default function Chat({ roomId, socket, userName }: ChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('chat-message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
            // Scroll to bottom
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => {
            socket.off('chat-message');
        };
    }, [socket]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socket.emit('chat-message', { roomId, message: newMessage, userName });
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e]/30">
            <div className="flex-none h-10 px-4 flex items-center border-b border-white/5 bg-[#09090b]/50">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Room Chat
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs mt-10">
                        <p>No messages yet.</p>
                        <p>Say hello! 👋</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className={`text-[10px] font-bold ${msg.sender === userName ? 'text-indigo-400' : 'text-zinc-400'}`}>
                                {msg.sender}
                            </span>
                            <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] break-words ${msg.sender === userName
                                ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none border border-indigo-500/20'
                                : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5'
                            }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={sendMessage} className="flex-none p-3 border-t border-white/5 bg-[#09090b]">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1.5 p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
