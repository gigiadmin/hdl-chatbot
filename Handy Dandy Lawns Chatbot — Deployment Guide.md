# Handy Dandy Lawns Chatbot — Deployment Guide

This guide walks you through deploying the chatbot to Cloudflare Workers and hosting the website on GitHub Pages or Cloudflare Pages.

---

## **Step 1: Deploy the Cloudflare Worker**

### 1.1 Go to Cloudflare Workers

1. Open [workers.cloudflare.com](https://workers.cloudflare.com)
2. Log in with your Cloudflare account
3. Click **"Create"** → **"Create Worker"**
4. Give it a name (e.g., `hdl-chat`)
5. Click **"Deploy"**

### 1.2 Update the Worker Code

1. Click **"Edit code"**
2. Select all the default code and delete it
3. Open `chatbot-worker.js` from this project
4. Copy the entire contents
5. Paste it into the Cloudflare editor
6. Click **"Deploy"** again

### 1.3 Add Your Anthropic API Key

1. In your Worker, go to **Settings** → **Variables and Secrets**
2. Click **"Add variable"**
3. **Name:** `ANTHROPIC_API_KEY`
4. **Value:** Your API key from [console.anthropic.com](https://console.anthropic.com)
   - Get your key: Log in → API Keys → Create Key → Copy the `sk-ant-...` value
5. Click **"Encrypt"** (this hides it securely)
6. Click **"Save"**

### 1.4 (Optional) Lock to Your Domain

For security, you can restrict the Worker to only accept requests from your domain:

1. In **Variables and Secrets**, add another variable:
   - **Name:** `ALLOWED_ORIGIN`
   - **Value:** `https://gigitekai.xyz` (or your domain)
2. Click **"Encrypt"** and **"Save"**

### 1.5 Get Your Worker URL

1. Go back to your Worker overview
2. Copy the URL at the top (e.g., `https://hdl-chat.your-name.workers.dev`)
3. **Save this URL — you'll need it in the next step**

---

## **Step 2: Update the Chat Widget**

1. Open `chat-widget.js` in this project
2. Find line 5:
   ```javascript
   var WORKER_URL = 'https://hdl-chat.YOUR_SUBDOMAIN.workers.dev';
   ```
3. Replace with your actual Worker URL:
   ```javascript
   var WORKER_URL = 'https://hdl-chat.your-name.workers.dev';
   ```
4. Save the file

---

## **Step 3: Host on GitHub Pages**

### 3.1 Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New"** to create a new repository
3. Name it `hdl-chatbot` (or any name)
4. Make it **Public**
5. Click **"Create repository"**

### 3.2 Push Your Files to GitHub

In your terminal:

```bash
cd /path/to/hdl-chatbot
git init
git add .
git commit -m "Initial commit: Handy Dandy Lawns chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hdl-chatbot.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3.3 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", select **"Deploy from a branch"**
4. Select **main** branch
5. Click **"Save"**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://YOUR_USERNAME.github.io/hdl-chatbot/`

---

## **Step 4: (Optional) Use Your Custom Domain**

If you want to use `gigitekai.xyz` for the chatbot:

### 4.1 Update DNS Records

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add a CNAME record:
   - **Name:** `chat` (or whatever subdomain you want)
   - **Value:** `YOUR_USERNAME.github.io`
3. Save and wait 15-30 minutes for DNS to propagate

### 4.2 Configure GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under "Custom domain", enter: `chat.gigitekai.xyz`
3. Click **"Save"**
4. GitHub will automatically create an SSL certificate

Your chatbot will now be live at: `https://chat.gigitekai.xyz`

---

## **Step 5: Test Everything**

1. Open your website in a browser
2. Look for the green chat button in the bottom-right corner
3. Click it to open the chat
4. Ask a question like: "What services do you offer?"
5. The chatbot should respond with information about Handy Dandy Lawns

---

## **Troubleshooting**

### Chat button appears but doesn't respond

- Check that `WORKER_URL` in `chat-widget.js` is correct
- Verify your Anthropic API key is set in Cloudflare Workers
- Check browser console (F12 → Console) for errors

### "Connection issue" message

- Verify your Worker is deployed and running
- Check that your API key is correct
- Make sure CORS is configured (should be automatic)

### Images not loading

- Ensure `logo.png` and `lawn.png` are in the same directory as `index.html`
- Check file names match exactly (case-sensitive)

---

## **File Structure**

```
hdl-chatbot/
├── index.html              # Main website
├── chat-widget.js          # Chat widget (update WORKER_URL here)
├── chatbot-worker.js       # Cloudflare Worker code (deploy separately)
├── logo.png                # Company logo
├── lawn.png                # Hero image
├── DEPLOYMENT_GUIDE.md     # This file
└── README.md               # Project info
```

---

## **Next Steps**

1. ✅ Deploy Worker to Cloudflare
2. ✅ Add API key to Worker
3. ✅ Update `chat-widget.js` with Worker URL
4. ✅ Push files to GitHub
5. ✅ Enable GitHub Pages
6. ✅ Test the chatbot
7. ✅ (Optional) Set up custom domain

---

## **Support**

For questions:
- **Anthropic API issues:** [console.anthropic.com](https://console.anthropic.com)
- **Cloudflare Workers:** [dash.cloudflare.com](https://dash.cloudflare.com)
- **GitHub Pages:** [docs.github.com/pages](https://docs.github.com/pages)

---

**Last updated:** June 2025
