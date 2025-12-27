"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown, Check, Sparkles, Box } from 'lucide-react';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
    language: string;
    setLanguage: (lang: string) => void;
}

const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'JS', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
    { id: 'python', name: 'Python', icon: 'PY', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { id: 'java', name: 'Java', icon: 'JV', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
    { id: 'cpp', name: 'C++', icon: 'C++', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
];

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = languages.find(l => l.id === language) || languages[0];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
            >
                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border", currentLang.bg, currentLang.color)}>
                    {currentLang.icon}
                </div>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {currentLang.name}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform duration-200", isOpen && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                        >
                            <div className="p-1">
                                <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    Select Language
                                </div>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => {
                                            setLanguage(lang.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-xs font-medium transition-all",
                                            language === lang.id
                                                ? "bg-white/10 text-white"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border", lang.bg, lang.color)}>
                                            {lang.icon}
                                        </div>
                                        <span className="flex-1 text-left">{lang.name}</span>
                                        {language === lang.id && <Check className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
