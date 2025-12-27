# DevSync - Real-Time Collaborative Code Editor

DevSync is a collaborative IDE that allows multiple users to edit code in real-time, similar to Google Docs or VS Code Live Share.

## Key Features
- **Real-Time Synchronization**: Instantly see what others are typing.
- **Room System**: Create unique rooms for private collaboration.
- **Code Execution**: Run code directly in the browser (supports JS, Python, Java, C++).
- **Active User Tracking**: See how many people are in the room.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Editor**: Monaco Editor (VS Code core)
- **Backend/Real-Time**: Node.js Custom Server + Socket.io
- **Code Runner**: Piston API

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm run dev
    ```
    (Runs on http://localhost:3001)

3.  **Usage**:
    - Open `http://localhost:3001` in your browser.
    - Click **"Start Coding"** to create a new room.
    - Copy the URL (or Room ID) and open it in a **Incognito Window** or another browser.
    - Type in one window -> See it appear in the other!
    - Click **Run** to execute the code.

## Troubleshooting
- If you see "Loading Editor...", give it a second to load Monaco resources.
- If code doesn't sync, ensure you are running `npm run dev` (which runs the custom `server.ts`) and NOT `next dev`.
