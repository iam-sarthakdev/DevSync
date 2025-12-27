# 🚀 DevSync

<div align="center">
  
  **Real-time Collaborative Code Editor with Integrated Development Environment**
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://your-railway-url.up.railway.app)
  [![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/iam-sarthakdev/DevSync)
  [![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
  
  *Code together, build together, succeed together*
  
</div>

---

## ✨ Features

### 🎯 Core Capabilities
- **Real-time Code Collaboration** - Multiple developers can edit code simultaneously with live cursor tracking
- **Integrated Code Execution** - Run code directly in the browser with support for JavaScript, Python, Java, and C++
- **Live Chat** - Built-in messaging system for team communication
- **Interactive Whiteboard** - Visual collaboration space for sketching ideas and diagrams
- **File Management** - Create, organize, and manage project files and folders
- **Theme Customization** - Multiple editor themes (VS Dark, VS Light, High Contrast)
- **Language Support** - Syntax highlighting for all major programming languages

### 🔥 Advanced Features
- **Real-time Cursor Tracking** - See where your teammates are editing in real-time
- **Code Syntax Highlighting** - Powered by Monaco Editor (VS Code's editor)
- **Room-based Collaboration** - Create private rooms with unique sharable links
- **Auto-save & Sync** - Changes are automatically synchronized across all users
- **Download Projects** - Export your entire project as a ZIP file
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Monaco Editor** - VS Code's powerful code editor
- **Lucide Icons** - Beautiful iconography

### Backend
- **Node.js 20+** - JavaScript runtime
- **Socket.IO** - Real-time bidirectional communication
- **Custom Next.js Server** - Express-like server with WebSocket support

### Code Execution
- **Piston API** - Secure code execution engine supporting 40+ languages

### Deployment
- **Railway** - Cloud platform for deployment
- **GitHub Actions** - CI/CD pipeline

---

## 🎥 Demo

> **Live Demo**: [DevSync on Railway](https://your-railway-url.up.railway.app)

### How It Works
1. **Create a Room** - Click "Create New Room" to start a collaborative session
2. **Share the Link** - Copy the room URL and share it with your team
3. **Start Coding** - Write code together in real-time
4. **Execute & Test** - Run your code directly in the browser
5. **Communicate** - Use the integrated chat and whiteboard

---

## 📦 Installation

### Prerequisites
- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm**
- **Git**

### Local Development

```bash
# Clone the repository
git clone https://github.com/iam-sarthakdev/DevSync.git

# Navigate to the project directory
cd DevSync

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Deploy to Railway (Recommended)

1. **Sign up** at [railway.app](https://railway.app/)
2. **Connect GitHub** and authorize Railway
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select** `iam-sarthakdev/DevSync`
5. **Deploy** - Railway auto-configures everything!

**Your app will be live in ~2 minutes** ✨

For detailed instructions, see [RAILWAY.md](RAILWAY.md)

### Environment Variables

No environment variables required! The app works out of the box.

Optional configurations:
```env
NODE_ENV=production
PORT=3000
```

---

## 📖 Usage

### Creating a Room
1. Open the application homepage
2. Click **"Create New Room"**
3. You'll be redirected to a unique room with a shareable URL

### Joining a Room
1. Open the room URL shared by a teammate
2. Enter your username
3. Start collaborating immediately

### Features Guide

#### Code Editor
- **Write Code** - Full syntax highlighting and autocomplete
- **Select Language** - Choose from JavaScript, Python, Java, C++
- **Choose Theme** - Switch between VS Dark, VS Light, or High Contrast
- **Run Code** - Click the ▶️ play button to execute

#### File Management
- **Create Files** - Click the "+" icon next to Files
- **Create Folders** - Click the folder icon
- **Organize** - Drag and drop files into folders
- **Delete** - Right-click → Delete
- **Download** - Export entire project as ZIP

#### Chat
- Real-time messaging with all room participants
- See who sent each message
- Auto-scroll to latest messages

#### Whiteboard
- **Draw** - Freehand drawing tool
- **Highlight** - Semi-transparent highlighter
- **Erase** - Remove unwanted marks
- **Colors** - Multiple color options
- **Clear** - Reset the entire board
- **Download** - Save whiteboard as PNG image

---

## 🏗️ Project Structure

```
devsync/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── room/[roomId]/
│   │   │   └── page.tsx          # Collaboration room
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   ├── Chat.tsx              # Chat component
│   │   ├── Whiteboard.tsx        # Drawing canvas
│   │   ├── Sidebar.tsx           # File explorer
│   │   ├── LanguageSelector.tsx  # Language picker
│   │   └── ThemeSelector.tsx     # Theme switcher
│   ├── hooks/
│   │   └── useSocket.ts          # Socket.IO hook
│   └── lib/
│       ├── utils.ts              # Utility functions
│       └── piston.ts             # Code execution API
├── server.ts                     # Custom Next.js server
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Known Issues
- Large file uploads may be slow (working on optimization)
- Mobile keyboard may overlap editor on some devices

### Roadmap
- [ ] User authentication (GitHub OAuth)
- [ ] Persistent room storage (MongoDB/PostgreSQL)
- [ ] Video/voice chat integration
- [ ] Git integration
- [ ] AI code suggestions
- [ ] More programming languages
- [ ] Custom themes
- [ ] File version history

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sarthak Dev**

- GitHub: [@iam-sarthakdev](https://github.com/iam-sarthakdev)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- Portfolio: [Your Website](https://your-website.com)

---

## 🙏 Acknowledgments

- **Monaco Editor** - The amazing code editor from VS Code
- **Socket.IO** - Real-time engine
- **Piston API** - Code execution service
- **Railway** - Deployment platform
- **Next.js Team** - For the incredible framework

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️ on GitHub!

---

<div align="center">
  
  **Made with ❤️ by Sarthak Dev**
  
  [Report Bug](https://github.com/iam-sarthakdev/DevSync/issues) · [Request Feature](https://github.com/iam-sarthakdev/DevSync/issues)
  
</div>
