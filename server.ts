import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // Store room state
    // rooms: { [roomId]: { files: {...}, users: { [socketId]: { name, color } } } }
    const rooms = new Map();

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-room", (payload) => {
            console.log("join-room payload:", payload);
            const { roomId, userName } = payload || {};

            if (!roomId) {
                console.log("Invalid roomId in join-room");
                return;
            }

            socket.join(roomId);
            const user = {
                id: socket.id,
                name: userName || `User ${socket.id.slice(0, 4)}`,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
            };

            console.log(`${user.name} joined room ${roomId}`);

            if (!rooms.has(roomId)) {
                rooms.set(roomId, {
                    files: {
                        "main.js": { name: "main.js", language: "javascript", content: "// Start coding here..." }
                    },
                    users: {}
                });
            }

            // Add user to room
            const roomData = rooms.get(roomId);
            roomData.users[socket.id] = user;

            // Sync initial data
            socket.emit("sync-files", roomData.files);

            // Broadcast active users list
            io.to(roomId).emit("active-users", Object.values(roomData.users));
        });

        // Handle cursor movement
        socket.on("cursor-move", ({ roomId, position }) => {
            const room = rooms.get(roomId);
            const user = room?.users[socket.id];

            if (user) {
                // Broadcast to others excluding sender
                socket.to(roomId).emit("cursor-move", {
                    userId: socket.id,
                    userName: user.name,
                    userColor: user.color,
                    position
                });
            }
        });

        // Handle selection change
        socket.on("selection-change", ({ roomId, selection }) => {
            const room = rooms.get(roomId);
            const user = room?.users[socket.id];

            if (user) {
                socket.to(roomId).emit("selection-change", {
                    userId: socket.id,
                    userName: user.name,
                    userColor: user.color,
                    selection
                });
            }
        });

        socket.on("chat-message", ({ roomId, message, userName }) => {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            io.to(roomId).emit("chat-message", {
                sender: userName,
                message,
                timestamp,
                isSystem: false
            });
        });

        socket.on("code-change", ({ roomId, fileName, code }) => {
            if (rooms.has(roomId)) {
                const roomData = rooms.get(roomId);
                if (roomData.files[fileName]) {
                    roomData.files[fileName].content = code;
                }
            }
            socket.to(roomId).emit("code-change", { fileName, code });
        });

        // ... (create/delete file listeners remain the same)
        socket.on("create-file", ({ roomId, fileName, language }) => {
            if (rooms.has(roomId)) {
                const roomFiles = rooms.get(roomId).files;
                if (!roomFiles[fileName]) {
                    roomFiles[fileName] = { name: fileName, language, content: "" };
                    io.to(roomId).emit("file-created", roomFiles[fileName]);
                }
            }
        });

        socket.on("delete-file", ({ roomId, fileName }) => {
            if (rooms.has(roomId)) {
                delete rooms.get(roomId).files[fileName];
                io.to(roomId).emit("file-deleted", fileName);
            }
        });

        socket.on("draw-line", ({ roomId, prevPoint, currentPoint, color, width }) => {
            socket.to(roomId).emit("draw-line", { prevPoint, currentPoint, color, width });
        });

        socket.on("clear-board", ({ roomId }) => {
            io.to(roomId).emit("clear-board");
        });

        socket.on("disconnect", () => {
            // Find which room this socket was in
            rooms.forEach((roomData, roomId) => {
                if (roomData.users[socket.id]) {
                    delete roomData.users[socket.id];
                    // Broadcast updated user list
                    io.to(roomId).emit("active-users", Object.values(roomData.users));
                }
            });
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
