# Preppy - AI-Powered SDLC Companion

## Goal 
Provide students with a hands on agile lab for AI product development to better understand Software Development Life Cycle (SDLC) and accelerate development workflows. 


## Project Overview
Preppy is a web application that provides AI assistance for the Software Development Life Cycle (SDLC) process. It guides users through various stages of software development including Planning, Design, Implementation, Testing, Deployment, and Maintenance.


- Static HTML/CSS/JavaScript website
- Simple Node.js HTTP server serving static files on port 5000
- Authentication system using localStorage (demo implementation)
- All pages functional and accessible

- Functional demo available below: 
  https://preppysdlcai.netlify.app

## Project Structure
```
/
├── index.html          # Landing page
├── about.html          # About page
├── dashboard.html      # Main dashboard (requires auth)
├── login.html          # User login page
├── signup.html         # User registration page
├── planning.html       # SDLC planning page
├── design.html         # Design phase page
├── development.html    # Development phase page
├── testing.html        # Testing phase page
├── deployment.html     # Deployment phase page
├── maintenance.html    # Maintenance phase page
├── css/               # Stylesheets
│   ├── styles.css     # Main styles
│   ├── landing.css    # Landing page styles
│   └── planning.css   # Planning page styles
├── js/                # JavaScript files
│   ├── auth.js        # Authentication logic
│   ├── dashboard.js   # Dashboard functionality
│   ├── landing.js     # Landing page functionality
│   ├── planning.js    # Planning page functionality
│   └── script.js      # Main dashboard script
├── server.js          # Node.js HTTP server
└── package.json       # Node.js project configuration
```

## Technical Setup
- **Runtime**: Node.js 20
- **Server**: Custom HTTP server (server.js)
- **Port**: 5000 (configured for Replit environment)
- **Dependencies**: Lucide icons (CDN), no npm packages required
- **Authentication**: Demo implementation using localStorage
- **Deployment**: Configured for autoscale deployment

## Features
- ✅ Responsive design for all devices
- ✅ User authentication (signup/login)
- ✅ SDLC planning with AI-generated mock analysis
- ✅ Dashboard with multiple SDLC phases
- ✅ Interactive UI with Lucide icons
- ✅ Session management

## Architecture Decisions
1. **Static Website Approach**: Chosen for simplicity and fast deployment
2. **Custom HTTP Server**: Implemented to serve static files with proper cache control
3. **localStorage Authentication**: Demo implementation for client-side session management
4. **Port 5000 Configuration**: Required for Replit environment compatibility
5. **Cache Control**: Disabled caching to prevent Replit iframe issues

## Recent Changes (Session Date)
- ✅ Imported fresh GitHub clone
- ✅ Created Node.js HTTP server for static file serving
- ✅ Configured package.json with proper start script
- ✅ Set up Preppy Server workflow on port 5000
- ✅ Added cache control headers for Replit compatibility
- ✅ Configured deployment for autoscale target
- ✅ Verified all pages load and function correctly

## Deployment Configuration
- **Target**: Autoscale (suitable for stateless frontend)
- **Command**: `npm start`
- **Status**: ✅ Ready for production deployment

## Browser Compatibility
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Mobile responsive design
- Touch-friendly interface

## Next Steps (if requested)
- Backend API integration for real authentication
- Database connection for user management
- AI API integration (OpenAI/Perplexity) for real SDLC analysis
- Payment processing (Stripe integration)
- Analytics integration (Google Analytics)
