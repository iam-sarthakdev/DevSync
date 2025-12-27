"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Palette, Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
    theme: string;
    setTheme: (theme: string) => void;
}

const themes = [
    { id: 'vs-dark', name: 'VS Dark', icon: <Moon className="w-3.5 h-3.5" />, color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
    { id: 'vs-light', name: 'VS Light', icon: <Sun className="w-3.5 h-3.5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
    { id: 'hc-black', name: 'High Contrast', icon: <MonitorSmartphone className="w-3.5 h-3.5" />, color: 'text-zinc-400', bg: 'bg-zinc-400/10 border-zinc-400/20' },
];

export default function ThemeSelector({ theme, setTheme }: ThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
            >
                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border", currentTheme.bg, currentTheme.color)}>
                    {currentTheme.icon}
                </div>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {currentTheme.name}
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
                                    <Palette className="w-3 h-3" />
                                    Select Theme
                                </div>
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTheme(t.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-xs font-medium transition-all",
                                            theme === t.id
                                                ? "bg-white/10 text-white"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border", t.bg, t.color)}>
                                            {t.icon}
                                        </div>
                                        <span className="flex-1 text-left">{t.name}</span>
                                        {theme === t.id && <Check className="w-3.5 h-3.5 text-white" />}
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
