
## Feature Overview
- Wireframe Generator - User provides concept input to receieve AI generated front end mockup design. The output can either be a text based page layout or image. 

- Code Generator - User provides website structure from imported website structure input to obtain code for each page in website structure.
  
- Test Case Generator - User provides code input to receive test case generations based on code provided. 


## Milestone
- [ ] Design A – Wireframe Generator
- [ ] Design B – Code Generation from Imported Website Structure
- [ ] Design C – Test Case Generation
- [ ] Integration & Release

**Class Lab Instructions: AI-Powered SDLC Features Implementation**
** Overview**
This guide provides step-by-step instructions to recreate three key AI-powered features for your class lab:
Wireframe Generator - Generate AI-powered frontend mockups from descriptions
 Code Generator - Generate production-ready code from structure specs or wireframe images
 Test Case Development - Generate test cases and perform source code review
 
**Architecture Overview**
Technology Stack
Frontend: Pure HTML/CSS/JavaScript (no frameworks required)
Backend: Node.js HTTP server with static file serving
AI Integration: OpenAI API (GPT-4) 
Icons: Lucide icons via CDN
File Processing: JSZip for downloadable code packages
Multi-Platform Support
Netlify: Serverless functions for secure server-side processing
GitHub Pages: Client-side integration with session-based API key storage
Setup Checklist
 Create project directory structure
 Install Node.js dependencies (npm install openai@^5.18.1)
 Set up environment variables (OPENAI_API_KEY)
 Create HTML files (design.html, development.html, testing.html)
 Implement JavaScript functionality
 Add CSS styling
 Test all features locally
Feature Implementation Checklist
Wireframe Generator
 HTML structure with input form
 Character counter functionality
 OpenAI API integration
 Response formatting and display
 Export to PDF functionality
 Copy to clipboard feature
 Error handling and loading states
Code Generator
 Dual input modes (structure + wireframe upload)
 Technology stack selection
 File upload handling for wireframes
 Code parsing and file separation
 ZIP download functionality
 Individual file copy features
 Multi-platform API support
Test Case Development
 Test Case Generator with framework selection
 Source Code Review with vulnerability detection
 Character counters and input validation
 Comprehensive AI prompts for testing
 Export functionality for test files
 PDF export for review reports
 Navigation between tools
 Deployment Checklist
 Server configuration (server.js)
 Netlify function setup
 GitHub Pages client-side integration
 CORS configuration
 Environment-specific API handling
 Error handling and fallbacks
Quick Start Guide
1. Local Development
# Clone/create project
mkdir preppy-ai-sdlc
cd preppy-ai-sdlc
# Install dependencies
npm init -y
npm install openai@^5.18.1
# Set environment variable
echo "OPENAI_API_KEY=your_key_here" > .env
# Start server
node server.js
Netlify Deployment
Create netlify.toml configuration
Add environment variables in Netlify dashboard
Deploy functions in netlify/functions/
GitHub Pages Deployment
Push to GitHub repository
Enable GitHub Pages
Uses client-side API integration
**Key Learning Outcomes**
Students will learn:
Full-stack web development with Node.js and vanilla JavaScript
AI API integration across multiple deployment platforms
File handling and download functionality
Responsive web design with modern CSS
Error handling and user experience design
Cross-platform deployment strategies
This comprehensive implementation provides a complete AI-powered SDLC companion with professional-grade features ready for production use!


User Experience
 Interface is intuitive and responsive across all devices
 Loading states provide clear feedback during processing
 Navigation between features is seamless and logical
 Generated content serves as effective learning materials


