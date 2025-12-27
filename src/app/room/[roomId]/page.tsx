"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../../../components/CodeEditor';
import { useSocket } from '../../../hooks/useSocket';
import { Terminal, Play, Share2, Users, Loader2, Code2, Monitor, Box, Sparkles, Command, Sidebar as SidebarIcon, Moon, Sun, PenTool } from 'lucide-react';
import { executeCode } from '../../../lib/piston';
import { cn } from '../../../lib/utils';
import Sidebar from '../../../components/Sidebar';
import LanguageSelector from '../../../components/LanguageSelector';
import ThemeSelector from '../../../components/ThemeSelector';
import Chat from '../../../components/Chat';
import Whiteboard from '../../../components/Whiteboard';

export default function RoomPage() {
    const { roomId } = useParams();
    const socket = useSocket();

    // View Mode
    const [viewMode, setViewMode] = useState<'code' | 'whiteboard'>('code');

    // State for File System
    const [files, setFiles] = useState<any>({
        "main.js": { name: "main.js", language: "javascript", content: "// Start coding here...\nconsole.log('Hello DevSync!');" }
    });
    const [openFiles, setOpenFiles] = useState<string[]>(["main.js"]);
    const [activeFile, setActiveFile] = useState("main.js");

    // Identity & Chat
    const [userName, setUserName] = useState("");
    const [isNameSet, setIsNameSet] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'files' | 'chat'>('files');
    const [users, setUsers] = useState<any[]>([]);

    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [theme, setTheme] = useState("vs-dark");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // Initial file sync and socket listeners
    useEffect(() => {
        if (!socket || !roomId || !isNameSet) return;

        // Join with Name
        socket.emit('join-room', { roomId, userName });

        socket.on('sync-files', (serverFiles: any) => {
            if (serverFiles && Object.keys(serverFiles).length > 0) {
                setFiles(serverFiles);
                if (!serverFiles[activeFile]) {
                    const firstFile = Object.keys(serverFiles)[0];
                    setActiveFile(firstFile);
                    if (!openFiles.includes(firstFile)) {
                        setOpenFiles(prev => [...prev, activeFile]);
                    }
                }
            }
        });

        socket.on('active-users', (roomUsers: any[]) => {
            setUsers(roomUsers);
        });

        socket.on('file-created', (newFile: any) => {
            setFiles((prev: any) => ({ ...prev, [newFile.name]: newFile }));
        });

        socket.on('file-deleted', (fileName: string) => {
            setFiles((prev: any) => {
                const newFiles = { ...prev };
                delete newFiles[fileName];
                return newFiles;
            });
            setOpenFiles(prev => prev.filter(f => f !== fileName));

            if (activeFile === fileName) {
                setActiveFile(prevActive => {
                    const remaining = openFiles.filter(f => f !== fileName);
                    return remaining.length > 0 ? remaining[remaining.length - 1] : "main.js";
                });
            }
        });

        socket.on('code-change', ({ fileName, code }: any) => {
            setFiles((prev: any) => {
                if (!prev[fileName]) return prev;
                return {
                    ...prev,
                    [fileName]: { ...prev[fileName], content: code }
                };
            });
        });

        return () => {
            socket.off('sync-files');
            socket.off('active-users');
            socket.off('file-created');
            socket.off('file-deleted');
            socket.off('code-change');
        };
    }, [socket, roomId, isNameSet]);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            setIsNameSet(true);
        }
    };

    const handleCodeChange = (newCode: string | undefined) => {
        const val = newCode || "";
        setFiles((prev: any) => ({
            ...prev,
            [activeFile]: { ...prev[activeFile], content: val }
        }));

        if (socket) {
            socket.emit('code-change', { roomId, fileName: activeFile, code: val });
        }
    };

    const handleFileSelect = (name: string) => {
        if (!openFiles.includes(name)) {
            setOpenFiles(prev => [...prev, name]);
        }
        setActiveFile(name);
        setViewMode('code'); // Switch to code view when selecting a file
    };

    const handleCreateFile = (name: string) => {
        if (files[name]) return;
        const lang = name.endsWith('.js') ? 'javascript' :
            name.endsWith('.py') ? 'python' :
                name.endsWith('.java') ? 'java' :
                    name.endsWith('.cpp') ? 'cpp' : 'javascript';

        const newFile = { name, language: lang, content: "" };
        setFiles((prev: any) => ({ ...prev, [name]: newFile }));

        if (!openFiles.includes(name)) {
            setOpenFiles(prev => [...prev, name]);
        }
        setActiveFile(name);

        socket?.emit('create-file', { roomId, fileName: name, language: lang });
    };

    const handleDeleteFile = (name: string) => {
        if (name === 'main.js') return;
        socket?.emit('delete-file', { roomId, fileName: name });
    };

    const handleCloseFile = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        const newOpenFiles = openFiles.filter(f => f !== name);
        setOpenFiles(newOpenFiles);
        if (activeFile === name) {
            if (newOpenFiles.length > 0) {
                setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
            } else {
                setActiveFile("");
            }
        }
    };

    const currentFileFn = files[activeFile];
    const activeContent = currentFileFn?.content || "";
    const activeLanguage = currentFileFn?.language || "javascript";

    const runCode = async () => {
        if (!activeFile) return;
        setIsRunning(true);
        setOutput(`running ${activeFile}...\n`);
        try {
            const { run: result } = await executeCode(activeLanguage, activeContent);
            setOutput(result.output || "No output returned.");
        } catch (error) {
            setOutput("Error executing code. Please try again.");
        } finally {
            setIsRunning(false);
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleSetLanguage = (vid: string) => {
        setFiles((prev: any) => ({
            ...prev,
            [activeFile]: { ...prev[activeFile], language: vid }
        }));
    };

    if (!isNameSet) {
        return (
            <div className="h-screen w-full bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>

                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleNameSubmit}
                    className="relative z-10 bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Join Room</h2>
                    <p className="text-zinc-400 text-center mb-8 text-sm">Enter your name to start collaborating</p>

                    <div className="space-y-4">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Your Name (e.g. Alex)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!userName.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-500/20"
                        >
                            Join Now
                        </button>
                    </div>
                </motion.form>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#030304] text-zinc-100 font-sans overflow-hidden selection:bg-indigo-500/30">
            {/* Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* Navbar */}
            <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-white/[0.08] bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                        <SidebarIcon className="w-5 h-5" />
                    </button>
                    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-white/90">DevSync</span>
                    </a>

                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

                    {/* View Toggle - Now in Top Navbar */}
                    <div className="flex items-center p-1 rounded-lg bg-white/5 border border-white/5">
                        <button
                            onClick={() => setViewMode('code')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                                viewMode === 'code' ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <Code2 className="w-3.5 h-3.5" />
                            Code
                        </button>
                        <button
                            onClick={() => setViewMode('whiteboard')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                                viewMode === 'whiteboard' ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <PenTool className="w-3.5 h-3.5" />
                            Board
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                    <LanguageSelector language={activeLanguage} setLanguage={handleSetLanguage} />

                    <div className="h-6 w-px bg-white/10 mx-2"></div>

                    <motion.button onClick={copyRoomId} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/5 transition-all text-zinc-400 hover:text-white">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                    </motion.button>

                    <motion.button onClick={runCode} disabled={isRunning} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group overflow-hidden px-5 py-1.5 rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:opacity-90 transition-opacity"></div>
                        <div className="relative flex items-center gap-2 text-white text-xs font-bold tracking-wide">
                            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            Run
                        </div>
                    </motion.button>

                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {userName[0] ? userName[0].toUpperCase() : '?'}
                    </div>
                </div>
            </header>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden z-10">
                <AnimatePresence initial={false}>
                    {sidebarOpen && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 250, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-[#09090b]/50 border-r border-white/5 overflow-hidden backdrop-blur-sm">
                            <Sidebar
                                activeCount={users.length}
                                files={files}
                                activeFile={activeFile}
                                onFileSelect={handleFileSelect}
                                onCreateFile={handleCreateFile}
                                onDeleteFile={handleDeleteFile}
                                activeTab={sidebarTab}
                                onTabChange={setSidebarTab}
                                users={users}
                            >
                                <Chat roomId={roomId as string} socket={socket} userName={userName} />
                            </Sidebar>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]/50 backdrop-blur-sm relative">
                    <div className="flex-1 flex overflow-hidden">
                        {viewMode === 'code' ? (
                            <>
                                {/* Editor Area */}
                                <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
                                    {/* Tabs Container */}
                                    <div className="flex-none h-9 flex items-center bg-[#09090b] border-b border-white/5 px-2 gap-1 overflow-x-auto custom-scrollbar">
                                        {openFiles.map((fileName) => (
                                            <div
                                                key={fileName}
                                                onClick={() => setActiveFile(fileName)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-l border-r text-xs font-medium min-w-[120px] cursor-pointer transition-colors max-w-[200px] group relative select-none",
                                                    activeFile === fileName
                                                        ? "bg-[#1e1e1e] border-white/10 text-white"
                                                        : "bg-transparent border-transparent text-zinc-500 hover:bg-white/5"
                                                )}
                                            >
                                                <span className={cn(activeFile === fileName ? "text-yellow-400" : "text-zinc-600")}>
                                                    {fileName.endsWith('js') ? 'JS' : fileName.endsWith('py') ? 'PY' : '#'}
                                                </span>
                                                <span className="truncate flex-1">{fileName}</span>
                                                <span
                                                    onClick={(e) => handleCloseFile(e, fileName)}
                                                    className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-sm p-0.5 transition-all text-zinc-400 hover:text-white"
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex-1 relative">
                                        {activeFile ? (
                                            <CodeEditor
                                                value={activeContent}
                                                onChange={handleCodeChange}
                                                language={activeLanguage}
                                                theme={theme}
                                                socket={socket}
                                                roomId={roomId as string}
                                                userName={userName}
                                                userColor={users.find(u => u.id === socket?.id)?.color}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                                                No file is open
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Terminal Area */}
                                <div className="w-1/3 min-w-[300px] flex flex-col border-l border-white/5 bg-[#09090b]">
                                    <div className="flex-none h-9 flex items-center px-4 border-b border-white/5 bg-[#09090b] justify-between">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <Terminal className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">Terminal</span>
                                        </div>
                                        {output && (
                                            <button
                                                onClick={() => setOutput("")}
                                                className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4 font-mono text-xs overflow-auto custom-scrollbar bg-[#0c0c0e]">
                                        {output ? (
                                            <div className="text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                                                <div className="flex items-center gap-2 text-zinc-500 mb-3 border-b border-white/5 pb-2">
                                                    <span className="text-green-500">➜</span>
                                                    <span>node {activeFile}</span>
                                                </div>
                                                {output}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-3">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Command className="w-6 h-6 opacity-50" />
                                                </div>
                                                <p className="text-sm">Ready to compile...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Whiteboard Mode
                            <div className="flex-1 relative bg-[#1e1e1e]">
                                <Whiteboard roomId={roomId as string} socket={socket} />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <div className="flex-none h-6 bg-[#007acc] flex items-center justify-between px-3 text-[10px] text-white">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        <span>{activeFile || 'No file'}</span>
                    </div>
                    <span>{users.length} users active</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>UTF-8</span>
                    <span>{activeLanguage.toUpperCase()}</span>
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black font-semibold rounded-full shadow-2xl z-50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Link Copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
