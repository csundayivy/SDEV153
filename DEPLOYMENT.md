# Deployment Guide for Preppy SDLC Companion

This application supports three deployment methods, each with different AI capabilities:

## 🚀 **Deployment Options**

### **1. Netlify (Recommended - Full Server-Side AI)**

**Features:**
- ✅ **Server-side OpenAI API calls** (secure, no API key exposure)
- ✅ **Serverless functions** handle AI processing
- ✅ **Environment variables** for API keys
- ✅ **Automatic deployments** from GitHub
- ✅ **Best performance** and security

**Setup Steps:**
1. **Create Netlify Account**: Sign up at [netlify.com](https://netlify.com)

2. **Connect GitHub Repository**:
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select this repository

3. **Configure Build Settings**:
   - Build command: `npm run build:netlify`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `OPENAI_API_KEY` = your OpenAI API key

5. **Deploy**:
   - Push to main branch for automatic deployment
   - Or manually trigger deploy from Netlify dashboard

**Custom Domain (Optional):**
- Go to Domain settings in Netlify
- Add your custom domain
- Netlify will handle SSL certificates automatically

---

### **2. Replit (Current Setup - Full Server-Side AI)**

**Features:**
- ✅ **Node.js server** with full OpenAI integration
- ✅ **Environment variables** via Secrets tab
- ✅ **Live development** environment
- ✅ **Instant deployment** and hosting

**Setup:**
- Already configured and running
- API key stored in Replit Secrets tab
- Accessible at your Replit URL

---

### **3. GitHub Pages (Client-Side AI)**

**Features:**
- ✅ **Static site hosting** (free)
- ⚠️ **Client-side AI** (users provide API key)
- ✅ **GitHub integration** with Actions
- ✅ **Custom domain support**

**Setup:**
1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **Set Repository Secrets**:
   - Go to Settings → Secrets and Variables → Actions
   - Add: `OPENAI_API_KEY` (for build process)

3. **Deploy**:
   - Push to main branch
   - GitHub Actions will build and deploy automatically

---

## 🔑 **API Key Management**

### **Netlify & Replit (Server-Side)**
- API keys stored securely in environment variables
- Users never see or need to provide API keys
- More secure and better user experience

### **GitHub Pages (Client-Side)**
- Users prompted to enter their own OpenAI API key
- Keys stored only in browser session (temporary)
- Users control their own API usage and costs

---

## 🌐 **Environment Detection**

The application automatically detects its environment and uses the appropriate AI integration:

- **Netlify**: Uses serverless functions (`/.netlify/functions/analyze`)
- **Replit**: Uses Node.js server endpoints (`/api/analyze`)
- **GitHub Pages**: Uses client-side OpenAI integration

---

## 📊 **Comparison**

| Feature | Netlify | Replit | GitHub Pages |
|---------|---------|---------|--------------|
| **Server-Side AI** | ✅ | ✅ | ❌ |
| **API Key Security** | ✅ Secure | ✅ Secure | ⚠️ User-provided |
| **Performance** | ✅ Excellent | ✅ Good | ✅ Fast (static) |
| **Custom Domain** | ✅ Free SSL | ✅ Paid plans | ✅ Free |
| **Auto-Deploy** | ✅ | ✅ | ✅ |
| **Cost** | Free tier | Free tier | Free |
| **Best For** | Production | Development | Demo/Portfolio |

---

## 🎯 **Recommended Workflow**

1. **Development**: Use Replit for development and testing
2. **Production**: Deploy to Netlify for best performance and security
3. **Demo/Portfolio**: Use GitHub Pages for showcasing the project

---

## 🔧 **Build Commands**

- **Netlify**: `npm run build:netlify`
- **GitHub Pages**: `npm run build:github`
- **Replit**: `npm start`

---

## 📝 **Environment Variables Required**

All deployments need:
- `OPENAI_API_KEY`: Your OpenAI API key

Optional:
- `NODE_ENV`: `production` for production deployments

---

## 🆘 **Troubleshooting**

**API Key Issues:**
- Ensure API key is correctly set in environment variables
- Check API key has sufficient credits
- Verify API key permissions

**Build Failures:**
- Check Node.js version (requires 14+)
- Ensure all dependencies are installed
- Check build logs for specific errors

**CORS Issues:**
- Functions include proper CORS headers
- Check network requests in browser dev tools