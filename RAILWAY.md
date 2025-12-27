# Deploy DevSync to Railway

This guide walks you through deploying your DevSync application to Railway.

## Prerequisites
- GitHub repository with your code (already done ✓)
- Railway account (we'll set this up)

---

## Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app/)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up using your **GitHub account** (recommended for easy integration)

---

## Step 2: Create New Project

1. Once logged in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. **Authorize Railway** to access your GitHub repositories
4. Search for and select: **`iam-sarthakdev/DevSync`**

---

## Step 3: Configure Your Service

Railway will automatically detect your Next.js project. You need to customize the build settings:

### Build & Start Commands

Railway should auto-detect, but verify these settings:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### Environment Variables

Click on **"Variables"** tab and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

> **Note:** Railway automatically provides a `PORT` variable, but we explicitly set it for consistency.

---

## Step 4: Deploy

1. Railway will **automatically start deploying** after you connect the repo
2. Watch the build logs in real-time
3. Once complete, Railway will provide a public URL: `https://your-app.up.railway.app`

---

## Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Generate Domain"** for a free Railway subdomain
3. Or add your **custom domain** if you have one

---

## Monitoring & Logs

- **Logs**: Click on your service → **"Deployments"** → View logs
- **Metrics**: See CPU, Memory, Network usage in the **"Metrics"** tab
- **Redeploy**: Push to GitHub `main` branch to auto-redeploy

---

## Expected Build Output

✅ You should see:
```
Building...
Running npm install
Running npm run build
✓ Compiled successfully
Deployment successful!
```

---

## Accessing Your App

Once deployed, your app will be available at:
- **Railway Domain**: `https://devsync-production.up.railway.app` (example)
- Real-time collaboration with Socket.IO will work automatically

---

## Troubleshooting

### If build fails:
1. Check **build logs** in Railway dashboard
2. Ensure `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "dev": "tsx server.ts",
       "build": "next build",
       "start": "NODE_ENV=production tsx server.ts"
     }
   }
   ```

### If Socket.IO doesn't work:
- Railway automatically handles WebSocket connections
- No additional configuration needed
- Ensure your client connects to the same domain

---

## Cost

- **Free Tier**: $5 starter credit (enough for testing)
- **Hobby Plan**: $5/month (recommended for production)
- Railway is typically cheaper and more reliable than other platforms for this type of app

---

## Summary

🎉 **That's it!** Railway handles:
- ✅ Automatic deployments from GitHub
- ✅ Custom server support (tsx/ts-node)
- ✅ WebSocket/Socket.IO 
- ✅ Environment variables
- ✅ HTTPS automatically

**Your DevSync app should be live in ~3 minutes!**
