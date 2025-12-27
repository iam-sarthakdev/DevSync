"use client";

import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
    language?: string;
    theme?: string;
    value: string;
    onChange?: (value: string | undefined) => void;
    onMount?: OnMount;
    socket?: any;
    roomId?: string;
    userName?: string;
    userColor?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    language = 'javascript',
    theme = 'vs-dark',
    value,
    onChange,
    onMount,
    socket,
    roomId,
    userName,
    userColor
}) => {

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        if (onMount) onMount(editor, monaco);

        // Cursor & Selection Sync Logic
        if (socket && roomId) {

            // 1. Emit local cursor moves and selections
            editor.onDidChangeCursorPosition((e) => {
                socket.emit('cursor-move', {
                    roomId,
                    position: {
                        lineNumber: e.position.lineNumber,
                        column: e.position.column
                    }
                });
            });

            editor.onDidChangeCursorSelection((e) => {
                socket.emit('selection-change', {
                    roomId,
                    selection: {
                        startLineNumber: e.selection.startLineNumber,
                        startColumn: e.selection.startColumn,
                        endLineNumber: e.selection.endLineNumber,
                        endColumn: e.selection.endColumn
                    }
                });
            });

            // 2. Listen for remote events
            const remoteCursors = new Map<string, string[]>(); // userId -> decorationIds
            const remoteSelections = new Map<string, string[]>(); // userId -> decorationIds

            // Handle Cursor Move
            socket.on('cursor-move', ({ userId, userName, userColor, position }: any) => {
                const currentDecorations = remoteCursors.get(userId) || [];

                // Clear old decoration
                const newDecorations = editor.deltaDecorations(currentDecorations, [
                    {
                        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                        options: {
                            className: `remote-cursor-${userId}`,
                            beforeContentClassName: `remote-cursor-label-${userId}`,
                            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                        }
                    }
                ]);
                remoteCursors.set(userId, newDecorations);

                // Inject dynamic CSS for this user if not exists
                injectUserStyles(userId, userColor || '#10b981', userName || 'Anonymous');
            });

            // Handle Selection Change
            socket.on('selection-change', ({ userId, userColor, selection }: any) => {
                const currentDecorations = remoteSelections.get(userId) || [];

                const newDecorations = editor.deltaDecorations(currentDecorations, [
                    {
                        range: new monaco.Range(
                            selection.startLineNumber,
                            selection.startColumn,
                            selection.endLineNumber,
                            selection.endColumn
                        ),
                        options: {
                            className: `remote-selection-${userId}`,
                            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                        }
                    }
                ]);
                remoteSelections.set(userId, newDecorations);

                // Ensure styles exist (in case selection comes before cursor move)
                injectUserStyles(userId, userColor || '#10b981', 'Anonymous');
            });

            function injectUserStyles(userId: string, color: string, name: string) {
                const styleId = `cursor-style-${userId}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    const rgbaColor = hexToRgba(color, 0.3);
                    style.innerHTML = `
                        .remote-cursor-${userId} {
                            border-left: 2px solid ${color};
                            height: 20px !important;
                        }
                        .remote-cursor-label-${userId}::before {
                            content: "${name}";
                            position: absolute;
                            top: -20px;
                            left: 0;
                            background: ${color};
                            color: white;
                            font-size: 10px;
                            padding: 2px 4px;
                            border-radius: 4px;
                            pointer-events: none;
                            white-space: nowrap;
                            z-index: 100;
                        }
                        .remote-selection-${userId} {
                            background-color: ${rgbaColor};
                        }
                    `;
                    document.head.appendChild(style);
                }
            }

            // Helper to convert hex to rgba
            function hexToRgba(hex: string, alpha: number) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
        }
    };

    return (
        <div className="w-full h-full border rounded-md overflow-hidden bg-zinc-950">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                theme={theme}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                loading={
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span>Loading Editor...</span>
                    </div>
                }
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: 'JetBrains Mono, monospace',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                }}
            />
        </div>
    );
};

export default CodeEditor;
