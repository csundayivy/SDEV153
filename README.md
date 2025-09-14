# Preppy - AI-Powered SDLC Companion

## Goal 
Provide students with a hands-on agile lab for AI product development to better understand Software Development Life Cycle (SDLC) and accelerate development workflows with real ChatGPT integration across all deployment platforms.

## Project Overview
Preppy is a comprehensive AI-powered Software Development Life Cycle (SDLC) companion web application designed to help students understand and navigate the software development process. The application provides guided assistance through all phases of SDLC including planning, design, development, testing, deployment, and maintenance. Built as a static web application with Node.js backend, it features a complete authentication system and interactive AI-powered tools for each development phase.

### Key Features

- **Multi-Platform AI Integration**: Real ChatGPT functionality across Netlify, and GitHub Pages
- **Comprehensive Planning Suite**: Requirements document generator and user story generator with structured outputs
- **Four Specialized Design Tools**: High-level design, ERD generation, low-level diagrams, and website structure planning
- **Comprehensive SDLC Coverage**: Complete workflow from planning to maintenance with AI guidance
- **Mobile-First Responsive Design**: Optimized for all devices with touch-friendly navigation

- **Live Demo Access**: https://preppysdlcai.netlify.app

## Advanced Planning Tools

### Requirements Document Generator
- Transform app concepts into comprehensive development plans
- Detailed project analysis with technical stack recommendations
- Implementation roadmaps and architectural guidance
- Business logic and feature specification documentation

### User Story Generator
- Generate 10 comprehensive user stories from project concepts
- Structured format: User Story → Website Feature → Implementation Approach
- Covers diverse user personas and use cases
- Professional export options for development teams

## Advanced Design Tools

### High Level Design Generator
- Transform requirements into comprehensive system architecture
- Technology stack recommendations and design patterns
- Scalability considerations and implementation guidance

### Entity-Relationship Diagram Generator  
- Create detailed database structure visualizations
- Table relationships and cardinality mapping
- Data modeling best practices and normalization guidance

### Low Level Diagram Generator
- Generate technical diagrams in text format for easy sharing
- Class structures, sequence diagrams, and API specifications
- Implementation-level technical documentation

### Website Structure Generator
- Complete project layout and file organization
- Directory structure optimization for development workflows
- Project scaffolding with best practice recommendations

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Pure frontend approach using vanilla JavaScript without frameworks
- **Responsive Design**: Mobile-first CSS architecture with desktop breakpoints
- **Component Structure**: Modular HTML pages for each SDLC phase (planning.html, design.html, development.html, testing.html, deployment.html, maintenance.html)
- **Icon System**: Lucide icons loaded via CDN for consistent UI elements
- **Authentication Flow**: Client-side authentication using localStorage for demo purposes

### Backend Architecture
- **Custom HTTP Server**: Node.js HTTP server (server.js) serving static files on port 5000
- **API Endpoints**: RESTful API structure with `/api/` prefix for AI-powered functionality
- **File Serving**: Custom MIME type handling for static assets (HTML, CSS, JS, images)
- **CORS Configuration**: Cross-origin resource sharing enabled for API endpoints

### Navigation System
- **Sidebar Navigation**: Collapsible sidebar with user information and phase navigation
- **Mobile-First Design**: Responsive navigation with overlay system for mobile devices
- **Multi-page Application**: Separate HTML pages for each SDLC phase with consistent navigation

### Authentication System
- **Demo Implementation**: localStorage-based authentication for demonstration purposes
- **Session Management**: User data and authentication tokens stored client-side
- **Protected Routes**: Dashboard and SDLC pages require authentication
- **User Experience**: Complete signup/login flow with form validation and user feedback

## AI Integration Architecture

### Multi-Platform Real AI Integration
- **Netlify**: Serverless functions with OpenAI API for secure server-side processing
- **GitHub Pages**: Client-side OpenAI integration with secure session-based API key storage
- **Comprehensive Error Handling**: Robust error handling for API failures, rate limits, and network issues
- **Smart Environment Detection**: Automatic platform detection to use optimal AI integration method

## Project Structure
```
preppy-sdlc-companion/
├── index.html              # Landing page with mobile navigation
├── about.html              # About page
├── dashboard.html          # Main dashboard (requires auth)
├── login.html              # User login page
├── signup.html             # User registration page
├── planning.html           # SDLC planning with requirements generator and user story generator
├── design.html             # Design phase with four specialized tools
├── development.html        # Development phase page
├── testing.html            # Testing phase page
├── deployment.html         # Deployment phase page
├── maintenance.html        # Maintenance phase page
├── css/                    # Stylesheets
│   ├── styles.css          # Main dashboard and component styles
│   ├── landing.css         # Landing page with responsive navigation
│   └── planning.css        # Shared SDLC page styles and design tools
├── js/                     # JavaScript files
│   ├── sdlc-functionality.js  # Core application logic and design tools
│   ├── landing.js          # Landing page functionality
│   ├── github-pages-ai.js # GitHub Pages AI integration
│   └── auth.js             # Authentication logic
├── netlify/                # Netlify deployment configuration
│   └── functions/          # Serverless functions for AI integration
│       ├── design.js       # High level design generator API
│       ├── erd.js          # Entity-relationship diagram API
│       ├── lowlevel.js     # Low level diagram generator API
│       ├── website-structure.js  # Website structure API
│       ├── analyze.js      # Project analysis API
│       ├── generate.js     # Requirements generation API
│       └── user-stories.js # User story generation API
├── dist/                   # Netlify build output directory
├── server.js               # Node.js HTTP server 
├── build-netlify.js        # Netlify build and optimization script
├── package.json            # Node.js project dependencies and scripts
└── README.md               # This documentation file
```

## External Dependencies

### Third-party Services
- **OpenAI API**: Primary AI service for generating SDLC guidance and assistance (requires OPENAI_API_KEY environment variable)

### Deployment Platforms
- **Netlify**: Production deployment with serverless functions for optimal performance and security
- **GitHub Pages**: Static demo deployment with client-side AI integration

### External Libraries
- **Lucide Icons**: Icon library loaded via CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.js`)
- **OpenAI Node.js SDK**: Official OpenAI library (^5.18.1) for backend API integration

### Runtime Dependencies
- **Node.js**: Runtime environment (>=14.0.0 required)
- **HTTP Module**: Built-in Node.js module for server functionality
- **File System Module**: Built-in Node.js module for file serving
- **Path Module**: Built-in Node.js module for path resolution
- **URL Module**: Built-in Node.js module for URL parsing
- **Package Management**: npm with package.json configuration for dependencies

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API Key
- Git (for cloning the repository)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/preppy-sdlc-companion.git
   cd preppy-sdlc-companion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - For local development: Create `.env` file with:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Access the application:**
   - Open browser to `http://localhost:5000`
   - Navigate through the landing page to dashboard
   - Explore all SDLC phases with AI-powered tools

### Deployment Options

#### Netlify Deployment
1. Run the build script:
   ```bash
   node build-netlify.js
   ```
2. Deploy the `dist` folder to Netlify
3. Add `OPENAI_API_KEY` in Netlify environment variables
4. Serverless functions will handle all AI processing

#### GitHub Pages Deployment
1. Push repository to GitHub
2. Enable GitHub Pages in repository settings
3. Users can enter their OpenAI API key securely in the application
4. Full functionality available with client-side AI integration

## Technical Setup
- **Runtime**: Node.js 20
- **Server**: Custom HTTP server (server.js)
- **Dependencies**: OpenAI SDK, Lucide icons (CDN)
- **Authentication**: Demo implementation using localStorage
- **Deployment**: Configured for autoscale deployment

## Recent Major Updates (September 2025)

### Design Tools Enhancement
- ✅ **Four Specialized Design Tools**: Implemented with real ChatGPT integration
  - High Level Design Generator with system architecture planning
  - Entity-Relationship Diagram Generator with database modeling
  - Low Level Diagram Generator with technical specifications
  - Website Structure Generator with project layout planning
- ✅ **Professional UI/UX**: Enhanced with loading states, error handling, and export options

### Mobile Experience Improvements
- ✅ **Fixed Mobile Slider Menu**: Dashboard sidebar navigation now fully functional on mobile devices
- ✅ **Logo Display Issues Resolved**: Fixed logo rendering on both landing page and dashboard mobile versions
- ✅ **Touch-Friendly Navigation**: Enhanced mobile navigation with gesture support and responsive design
- ✅ **Consistent Styling**: Unified design language across all deployment versions

### Netlify Deployment Optimization
- ✅ **Serverless Functions**: Complete API coverage with six specialized serverless functions
- ✅ **Build Process Enhancement**: Automated build script with environment detection
- ✅ **Function Exposure Fix**: Resolved JavaScript onclick handler issues for card navigation
- ✅ **Performance Optimization**: CDN-powered distribution with server-side AI processing

### Technical Improvements
- ✅ **Enhanced JavaScript Architecture**: Improved function exposure and event handling
- ✅ **Cross-Platform Compatibility**: Identical functionality regardless of deployment platform
- ✅ **Error Handling & Recovery**: Robust error management with user-friendly feedback
- ✅ **Loading States & Visual Feedback**: Professional loading animations and status indicators

## Architecture Decisions
1. **Static Website Approach**: Chosen for simplicity, fast deployment, and multi-platform compatibility
2. **Custom HTTP Server**: Implemented to serve static files with proper cache control and CORS support
3. **localStorage Authentication**: Demo implementation for client-side session management suitable for educational use
4. **Multi-Platform AI Strategy**: Designed to work optimally on all three major deployment platforms
5. **Mobile-First Design**: Responsive design approach ensuring excellent mobile user experience
6. **Modular Design Tools**: Separate specialized tools for different aspects of system design

## Browser Compatibility
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Touch Interface**: Optimized for touch interactions on mobile and tablet devices

## Features Status
- ✅ **Responsive design for all devices** with enhanced mobile navigation
- ✅ **User authentication (signup/login)** with session management
- ✅ **Real AI integration** with ChatGPT across all platforms
- ✅ **Four specialized design tools** with comprehensive AI-powered generation
- ✅ **Multi-platform deployment** with identical functionality
- ✅ **Interactive UI with Lucide icons** and professional loading states
- ✅ **Mobile slider menu functionality** for seamless navigation
- ✅ **Cross-platform styling consistency** and logo display fixes

## Deployment Configuration
- **Target**: Autoscale (suitable for stateless frontend with AI backend)
- **Command**: `npm start`
- **Status**: ✅ Ready for production deployment across all platforms

## Contributing

1. **Fork the repository** from GitHub
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: Maintain consistent code style and mobile-first approach
4. **Test thoroughly**: Verify functionality across all platforms 
5. **Test mobile functionality**: Ensure responsive design and touch interactions work properly
6. **Commit changes**: `git commit -am 'Add new feature'`
7. **Push to branch**: `git push origin feature/new-feature`
8. **Create Pull Request**: Submit for review and integration

### Development Guidelines
- **Mobile-first responsive design** approach for all new features
- **Cross-platform compatibility** testing required for all changes
- **Vanilla JavaScript** for maximum compatibility and performance
- **Comprehensive error handling** and user feedback implementation
- **Consistent AI integration** patterns across all deployment platforms

## Support & Documentation

For support, questions, or feature requests:
- **GitHub Issues**: Open issues for bug reports and feature requests
- **Documentation**: Comprehensive README and inline code documentation
- **Live Demo**: Test functionality at https://preppysdlcai.netlify.app
- **Multi-Platform Testing**: Verify features work across all deployment options

---

**Preppy** - Transforming ideas into production-ready applications with comprehensive AI-powered SDLC guidance, specialized design tools, and seamless multi-platform deployment.
