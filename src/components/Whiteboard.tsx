import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Undo, Palette, Eraser, PenTool, Highlighter, Download, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Point {
    x: number;
    y: number;
}

interface DrawProps {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    width: number;
}

interface WhiteboardProps {
    roomId: string;
    socket: any;
}

export default function Whiteboard({ roomId, socket }: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Tools: 'pen', 'highlighter', 'eraser'
    const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
    const [color, setColor] = useState('#ffffff');
    const [lineWidth, setLineWidth] = useState(3);
    const prevPoint = useRef<Point | null>(null);

    // Dynamic sizing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        };

        resize();
        window.addEventListener('resize', resize);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        return () => window.removeEventListener('resize', resize);
    }, []);

    // Socket Events
    useEffect(() => {
        if (!socket) return;

        const handleDrawLine = ({ prevPoint, currentPoint, color, width }: DrawProps) => {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx) return;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;

            // For highlighter effect
            if (width > 10 && color !== '#1e1e1e') {
                ctx.globalAlpha = 0.5;
            } else {
                ctx.globalAlpha = 1.0;
            }

            if (prevPoint) {
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(currentPoint.x, currentPoint.y);
                ctx.stroke();
            } else {
                ctx.fillStyle = color;
                ctx.arc(currentPoint.x, currentPoint.y, width / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0; // Reset
        };

        const handleClear = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        socket.on('draw-line', handleDrawLine);
        socket.on('clear-board', handleClear);

        return () => {
            socket.off('draw-line', handleDrawLine);
            socket.off('clear-board', handleClear);
        };
    }, [socket]);

    const computePointInCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        prevPoint.current = computePointInCanvas(e);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const currentPoint = computePointInCanvas(e);
        if (!currentPoint || !prevPoint.current) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        let drawColor = color;
        let drawWidth = lineWidth;
        let isHighlighter = false;

        if (tool === 'eraser') {
            drawColor = '#1e1e1e'; // Match background
            drawWidth = 20;
        } else if (tool === 'highlighter') {
            drawWidth = 15;
            isHighlighter = true;
        }

        ctx.beginPath();
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;

        if (isHighlighter) ctx.globalAlpha = 0.5;

        ctx.moveTo(prevPoint.current.x, prevPoint.current.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        // Emit
        socket.emit('draw-line', {
            roomId,
            prevPoint: prevPoint.current,
            currentPoint,
            color: drawColor,
            width: drawWidth
        });

        prevPoint.current = currentPoint;
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        prevPoint.current = null;
    };

    const clearBoard = () => {
        socket.emit('clear-board', { roomId });
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const downloadBoard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `devsync-board-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    // Curated Palette
    const colors = [
        '#ffffff', // White
        '#ef4444', // Red
        '#f97316', // Orange
        '#eab308', // Yellow
        '#22c55e', // Green
        '#06b6d4', // Cyan
        '#3b82f6', // Blue
        '#a855f7', // Purple
        '#ec4899', // Pink
    ];

    return (
        <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden cursor-crosshair">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.1]"
                style={{
                    backgroundImage: 'radial-gradient(#888 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0 z-10"
            />

            {/* Floating Dock */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
            >
                {/* Tools & Colors Container */}
                <div className="flex flex-col items-center gap-2 p-2 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">

                    {/* Tool Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-black/20 rounded-2xl mb-2">
                        <button
                            onClick={() => setTool('pen')}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-200 relative group",
                                tool === 'pen' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            <PenTool className="w-5 h-5" />
                            {tool === 'pen' && <motion.div layoutId="active-tool" className="absolute inset-0 border-2 border-white/20 rounded-xl" />}
                        </button>
                        <button
                            onClick={() => setTool('highlighter')}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-200 relative group",
                                tool === 'highlighter' ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            <Highlighter className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setTool('eraser')}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-200 relative group",
                                tool === 'eraser' ? "bg-zinc-700 text-zinc-100 shadow-lg" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            <Eraser className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Color Swatches (Only for pen/highlighter) */}
                    {(tool === 'pen' || tool === 'highlighter') && (
                        <div className="flex items-center gap-2 px-2 py-1 overflow-x-auto max-w-xs custom-scrollbar">
                            {colors.map((c) => (
                                <motion.button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 transition-all flex-none shadow-sm",
                                        color === c ? "border-white scale-110 shadow-md ring-2 ring-white/20" : "border-transparent opacity-80 hover:opacity-100"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Brush Size (Only for Pen) */}
                    {tool === 'pen' && (
                        <div className="w-full px-4 py-2 flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Size</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={lineWidth}
                                    onChange={(e) => setLineWidth(Number(e.target.value))}
                                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-3">
                    <motion.button
                        onClick={clearBoard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold transition-colors backdrop-blur-md"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                    </motion.button>

                    <motion.button
                        onClick={downloadBoard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-zinc-300 border border-white/10 text-xs font-bold transition-colors backdrop-blur-md"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Save Image
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}
