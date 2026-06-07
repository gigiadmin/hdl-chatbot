# Handy Dandy Lawns — AI Chatbot Website

A beautiful, responsive website for Handy Dandy Lawns LLC with an integrated AI-powered chatbot powered by Anthropic's Claude.

## Features

✨ **Responsive Design**
- Mobile-first, works on all devices
- Smooth animations and transitions
- Professional, modern aesthetic

💬 **AI Chatbot**
- Powered by Claude (Anthropic)
- Answers questions about services, pricing, and availability
- Deployed on Cloudflare Workers (serverless, fast, secure)
- Friendly, professional tone

🎨 **Beautiful UI**
- Dark theme with lime green accents
- Custom animations
- Optimized for conversion

📱 **Mobile Optimized**
- Touch-friendly buttons
- Responsive grid layouts
- Mobile navigation menu

---

## Quick Start

### Prerequisites

- GitHub account
- Cloudflare account
- Anthropic API key (free at [console.anthropic.com](https://console.anthropic.com))

### Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for step-by-step instructions.

**TL;DR:**
1. Deploy `chatbot-worker.js` to Cloudflare Workers
2. Add your Anthropic API key to the Worker
3. Update `chat-widget.js` with your Worker URL
4. Push to GitHub and enable GitHub Pages

---

## Project Structure

```
├── index.html              # Main website (HTML + CSS + JS)
├── chat-widget.js          # Chat widget (loads on page)
├── chatbot-worker.js       # Cloudflare Worker (backend API)
├── logo.png                # Company logo
├── lawn.png                # Hero image
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
└── README.md               # This file
```

---

## How It Works

1. **Website** (`index.html` + `chat-widget.js`)
   - Hosted on GitHub Pages or Cloudflare Pages
   - Chat widget loads automatically
   - Sends messages to the Worker

2. **Backend** (`chatbot-worker.js`)
   - Runs on Cloudflare Workers (serverless)
   - Receives chat messages
   - Calls Anthropic's Claude API
   - Returns responses to the widget

3. **Security**
   - API key stored securely on Cloudflare (never exposed to client)
   - CORS configured to accept requests from your domain
   - No backend database needed

---

## Customization

### Change Business Info

Edit `chatbot-worker.js` and update the `SYSTEM` prompt:

```javascript
const SYSTEM = `You are a friendly assistant for [YOUR BUSINESS]...
- Phone: [YOUR PHONE]
- Services: [YOUR SERVICES]
...`
```

### Update Website Content

Edit `index.html` to change:
- Company name and tagline
- Services list
- Contact information
- Images and colors

### Modify Chat Widget Style

Edit `chat-widget.js` to change:
- Colors (search for hex codes like `#72c229`)
- Position (bottom-right by default)
- Greeting message
- Quick question chips

---

## Environment Variables

### Cloudflare Worker

Set these in Cloudflare Workers Settings → Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `ANTHROPIC_API_KEY` | Your `sk-ant-...` key | ✅ Yes |
| `ALLOWED_ORIGIN` | `https://yourdomain.com` | ❌ No (defaults to `*`) |

---

## Troubleshooting

### Chat widget doesn't respond

1. Check `WORKER_URL` in `chat-widget.js` is correct
2. Verify API key is set in Cloudflare
3. Open browser console (F12) and check for errors

### Images not loading

- Ensure `logo.png` and `lawn.png` are in the same directory
- Check file names match exactly (case-sensitive)

### CORS errors

- Verify `ALLOWED_ORIGIN` is set correctly in Cloudflare
- Or leave it blank to allow all origins (less secure)

---

## Performance

- **Website:** Hosted on GitHub Pages (CDN-backed, instant)
- **Chat API:** Cloudflare Workers (sub-100ms latency worldwide)
- **LLM Response:** Claude API (typically 1-3 seconds)

---

## Security

✅ **API Key Protection**
- Stored securely on Cloudflare (never exposed to client)
- Never committed to GitHub

✅ **CORS**
- Configurable to your domain
- Prevents unauthorized API access

✅ **No Database**
- Stateless design
- No user data stored
- No privacy concerns

---

## License

This project is provided as-is for Handy Dandy Lawns LLC.

---

## Support

For questions or issues:

1. **Deployment:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. **Anthropic API:** [console.anthropic.com](https://console.anthropic.com)
3. **Cloudflare:** [dash.cloudflare.com](https://dash.cloudflare.com)
4. **GitHub Pages:** [docs.github.com/pages](https://docs.github.com/pages)

---

**Built with ❤️ for Handy Dandy Lawns**
