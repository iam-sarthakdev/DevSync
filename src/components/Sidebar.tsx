import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileCode, Plus, Trash2, ChevronRight, ChevronDown, MessageSquare, Files, Folder, FolderOpen, FilePlus, FolderPlus, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface SidebarProps {
    activeCount: number;
    files: any; // { [name]: { name, language, content } }
    activeFile: string;
    onFileSelect: (name: string) => void;
    onCreateFile: (name: string) => void;
    onDeleteFile: (name: string) => void;
    activeTab: 'files' | 'chat';
    onTabChange: (tab: 'files' | 'chat') => void;
    users?: any[];
    children?: React.ReactNode;
}

// Helper to get icon based on extension
const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
            return <span className="text-yellow-400 font-bold text-[10px] w-3.5 text-center">JS</span>;
        case 'ts':
        case 'tsx':
            return <span className="text-blue-400 font-bold text-[10px] w-3.5 text-center">TS</span>;
        case 'py':
            return <span className="text-blue-300 font-bold text-[10px] w-3.5 text-center">PY</span>;
        case 'java':
            return <span className="text-red-400 font-bold text-[10px] w-3.5 text-center">JV</span>;
        case 'cpp':
        case 'c':
            return <span className="text-purple-400 font-bold text-[10px] w-3.5 text-center">C++</span>;
        case 'html':
            return <span className="text-orange-400 font-bold text-[10px] w-3.5 text-center">&lt;&gt;</span>;
        case 'css':
            return <span className="text-blue-300 font-bold text-[10px] w-3.5 text-center">#</span>;
        default:
            return <FileCode className="w-3.5 h-3.5 text-zinc-500" />;
    }
};

// Helper to build tree from flat file paths
const buildFileTree = (files: any) => {
    const tree: any = {};
    Object.keys(files).forEach((path) => {
        const parts = path.split('/');
        let current = tree;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = index === parts.length - 1 ? { ...files[path], type: 'file' } : { type: 'folder', children: {} };
            }
            current = current[part].children || current[part];
        });
    });
    return tree;
};

const FileTreeItem = ({ name, node, path, activeFile, onFileSelect, onDeleteFile, activeFolder, onFolderSelect, level = 0 }: any) => {
    const [isOpen, setIsOpen] = useState(true);

    if (node.type === 'file') {
        return (
            <div
                onClick={() => onFileSelect(path)}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                className={cn(
                    "group flex items-center gap-2 py-1.5 pr-2 rounded-r cursor-pointer transition-colors border-l-2",
                    activeFile === path
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                        : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
            >
                {getFileIcon(name)}
                <span className="text-xs truncate flex-1">{name}</span>
                {path !== 'main.js' && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteFile(path); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </div>
        );
    }

    // Folder
    return (
        <div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onFolderSelect(path);
                    setIsOpen(!isOpen);
                }}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                className={cn(
                    "flex items-center gap-2 py-1.5 pr-2 cursor-pointer transition-colors select-none",
                    activeFolder === path
                        ? "text-white bg-white/10"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
            >
                {isOpen ? <ChevronDown className="w-3 h-3 flex-none" /> : <ChevronRight className="w-3 h-3 flex-none" />}
                {isOpen ? <FolderOpen className="w-3.5 h-3.5 flex-none text-indigo-500/70" /> : <Folder className="w-3.5 h-3.5 flex-none" />}
                <span className="text-xs font-bold truncate">{name}</span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {Object.keys(node.children).sort((a, b) => {
                            const isAFolder = node.children[a].type === 'folder';
                            const isBFolder = node.children[b].type === 'folder';
                            if (isAFolder && !isBFolder) return -1;
                            if (!isAFolder && isBFolder) return 1;
                            return a.localeCompare(b);
                        }).map((childName) => (
                            <FileTreeItem
                                key={childName}
                                name={childName}
                                node={node.children[childName]}
                                path={`${path ? path + '/' : ''}${childName}`}
                                activeFile={activeFile}
                                onFileSelect={onFileSelect}
                                onDeleteFile={onDeleteFile}
                                activeFolder={activeFolder}
                                onFolderSelect={onFolderSelect}
                                level={level + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Sidebar({
    activeCount,
    files,
    activeFile,
    onFileSelect,
    onCreateFile,
    onDeleteFile,
    activeTab,
    onTabChange,
    users = [],
    children
}: SidebarProps) {
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [activeFolder, setActiveFolder] = useState<string>("");

    const handleCreateSubmit = (e: React.FormEvent, type: 'file' | 'folder') => {
        e.preventDefault();
        if (newItemName.trim()) {
            let finalPath = "";
            if (activeFolder) {
                finalPath = activeFolder + "/" + newItemName.trim();
            } else {
                finalPath = newItemName.trim();
            }

            if (type === 'folder') {
                finalPath += '/.keep';
            }

            onCreateFile(finalPath);
            setNewItemName("");
            setIsCreatingFile(false);
            setIsCreatingFolder(false);
        }
    };

    const handleDownload = async () => {
        const zip = new JSZip();

        Object.keys(files).forEach((path) => {
            if (!path.endsWith('/.keep')) { // Skip placeholder files
                zip.file(path, files[path].content);
            }
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "devsync-project.zip");
    };

    const fileTree = buildFileTree(files);

    return (
        <div className="w-64 bg-[#09090b]/50 border-r border-white/5 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center border-b border-white/5 bg-[#09090b]/50">
                <button
                    onClick={() => onTabChange('files')}
                    className={cn(
                        "flex-1 h-10 flex items-center justify-center gap-2 text-xs font-medium transition-colors border-b-2",
                        activeTab === 'files' ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                >
                    <Files className="w-3.5 h-3.5" />
                    Explorer
                </button>
                <button
                    onClick={() => onTabChange('chat')}
                    className={cn(
                        "flex-1 h-10 flex items-center justify-center gap-2 text-xs font-medium transition-colors border-b-2",
                        activeTab === 'chat' ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'files' ? (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="flex-1 p-2 space-y-4">
                            <div className="space-y-1">
                                <div
                                    className={cn(
                                        "px-2 pb-2 flex items-center justify-between group cursor-pointer rounded",
                                        activeFolder === "" ? "bg-white/5" : ""
                                    )}
                                    onClick={() => setActiveFolder("")}
                                >
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</span>
                                    <div className="flex items-center gap-1 opacity-100 transition-all">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                            className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-indigo-400"
                                            title="Download Project"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsCreatingFile(true); setIsCreatingFolder(false); }}
                                            className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white"
                                            title="New File"
                                        >
                                            <FilePlus className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsCreatingFolder(true); setIsCreatingFile(false); }}
                                            className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white"
                                            title="New Folder"
                                        >
                                            <FolderPlus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* New Input */}
                                <AnimatePresence>
                                    {(isCreatingFile || isCreatingFolder) && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={(e) => handleCreateSubmit(e, isCreatingFile ? 'file' : 'folder')}
                                            className="px-2 mb-2"
                                        >
                                            <div className="flex items-center gap-2 bg-[#1e1e1e] border border-indigo-500/50 rounded px-2 py-1">
                                                {isCreatingFolder ? <Folder className="w-3 h-3 text-zinc-400" /> : <FileCode className="w-3 h-3 text-zinc-400" />}
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newItemName}
                                                    onChange={(e) => setNewItemName(e.target.value)}
                                                    onBlur={() => {
                                                        if (!newItemName) { setIsCreatingFile(false); setIsCreatingFolder(false); }
                                                    }}
                                                    placeholder={
                                                        isCreatingFile
                                                            ? (activeFolder ? `${activeFolder}/file.js` : "filename.js")
                                                            : (activeFolder ? `${activeFolder}/folder` : "folder name")
                                                    }
                                                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                                                />
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                {/* Recursive File Tree */}
                                <div className="space-y-0.5">
                                    {Object.keys(fileTree).sort((a, b) => {
                                        const isAFolder = fileTree[a].type === 'folder';
                                        const isBFolder = fileTree[b].type === 'folder';
                                        if (isAFolder && !isBFolder) return -1;
                                        if (!isAFolder && isBFolder) return 1;
                                        return a.localeCompare(b);
                                    }).map((name) => (
                                        <FileTreeItem
                                            key={name}
                                            name={name}
                                            node={fileTree[name]}
                                            path={name}
                                            activeFile={activeFile}
                                            onFileSelect={onFileSelect}
                                            onDeleteFile={onDeleteFile}
                                            activeFolder={activeFolder}
                                            onFolderSelect={setActiveFolder}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Users */}
                        <div className="p-2 border-t border-white/5 bg-[#09090b]/30">
                            <div className="px-2 pb-2 flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Participants ({users.length || activeCount})
                                </span>
                            </div>
                            <div className="px-2 space-y-1">
                                {users.length > 0 ? (
                                    users.map((user: any, idx: number) => (
                                        <div key={user.id || idx} className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 border border-white/5 overflow-hidden">
                                            <div
                                                className="w-2 h-2 rounded-full flex-none"
                                                style={{ backgroundColor: user.color || '#10b981' }}
                                            />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-xs text-zinc-300 font-medium truncate">
                                                    {user.name || 'Anonymous'}
                                                </span>
                                                <span className="text-[9px] text-zinc-600 font-mono truncate">
                                                    ID: {user.id ? user.id.slice(0, 4) : '????'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-zinc-600 px-2 italic">Syncing users...</div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
