# Deployment Guide for DevSync

**⚠️ IMPORTANT: Vercel vs. WebSockets**
DevSync uses a **custom Node.js server** (`server.ts`) to handle real-time WebSockets (`socket.io`).
**Vercel does not support custom servers** or long-running WebSocket processes (it is a Serverless platform).

If you try to deploy to Vercel, the website will load, but **active collaboration (cursors, chat, code sync) will fail.**

## Recommended Option: Render (Free & Easy)
Render allows you to run "Web Services" which stay online and support WebSockets.

### Step 1: Push to GitHub
Make sure your latest code is pushed to your GitHub repository:
`https://github.com/iam-sarthakdev/DevSync`

### Step 2: Create Service on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.

### Step 3: Configure Settings
Use these exact settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `devsync` (or any name) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

> **Note:** Our `package.json` has a `start` script that runs `ts-node server.ts`, which is exactly what we need.

### Step 4: Environment Variables
Add these environment variables in the Render dashboard:
-   `NODE_ENV`: `production`

### Step 5: Deploy
Click **Create Web Service**. Render will build your app and start the server.
Once done, you will get a URL like `https://devsync-xyz.onrender.com`.

---

## Alternative: Railway (Faster, but may cost $)
1.  Go to [railway.app](https://railway.app/).
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select `DevSync`.
4.  Railway will automatically detect `npm start` and deploy it.
5.  Go to **Settings** -> **Generate Domain** to get your public URL.

## Summary
-   **Frontend**: Next.js (Served by `server.ts`)
-   **Backend**: Socket.IO (Served by `server.ts`)
-   **Platform**: Render or Railway (Supports persistent servers)
