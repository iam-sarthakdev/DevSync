"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // In production, might need to point to specific URL
        // For now, it connects to the same origin (localhost:3000)
        const socketInstance = io({
            path: '/socket.io', // Ensure this matches server config if set
        });

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return socket;
};
