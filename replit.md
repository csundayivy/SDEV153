# Overview

Preppy is an AI-powered Software Development Life Cycle (SDLC) companion web application designed to help students understand and navigate the software development process. The application provides guided assistance through all phases of SDLC including planning, design, development, testing, deployment, and maintenance. Built as a static web application with Node.js backend, it features a complete authentication system and interactive AI-powered tools for each development phase.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static HTML/CSS/JavaScript**: Pure frontend approach using vanilla JavaScript without frameworks
- **Responsive Design**: Mobile-first CSS architecture with desktop breakpoints
- **Component Structure**: Modular HTML pages for each SDLC phase (planning.html, design.html, development.html, testing.html, deployment.html, maintenance.html)
- **Icon System**: Lucide icons loaded via CDN for consistent UI elements
- **Authentication Flow**: Client-side authentication using localStorage for demo purposes

## Backend Architecture
- **Custom HTTP Server**: Node.js HTTP server (server.js) serving static files on port 5000
- **API Endpoints**: RESTful API structure with `/api/` prefix for AI-powered functionality
- **File Serving**: Custom MIME type handling for static assets (HTML, CSS, JS, images)
- **CORS Configuration**: Cross-origin resource sharing enabled for API endpoints

## Navigation System
- **Sidebar Navigation**: Collapsible sidebar with user information and phase navigation
- **Mobile-First Design**: Responsive navigation with overlay system for mobile devices
- **Multi-page Application**: Separate HTML pages for each SDLC phase with consistent navigation

## Authentication System
- **Demo Implementation**: localStorage-based authentication for demonstration purposes
- **Session Management**: User data and authentication tokens stored client-side
- **Protected Routes**: Dashboard and SDLC pages require authentication
- **User Experience**: Complete signup/login flow with form validation and user feedback

## AI Integration Architecture
- **OpenAI Integration**: Direct API calls to OpenAI services for AI-powered assistance
- **Environment Variables**: API key management through environment variables
- **Error Handling**: Comprehensive error handling for API failures and network issues

# External Dependencies

## Third-party Services
- **OpenAI API**: Primary AI service for generating SDLC guidance and assistance (requires OPENAI_API_KEY environment variable)

## Deployment Platforms
- **Replit**: Primary development and hosting platform with full server-side functionality
- **Netlify**: Production deployment with serverless functions for optimal performance and security
- **GitHub Pages**: Static demo deployment with client-side AI integration

## External Libraries
- **Lucide Icons**: Icon library loaded via CDN (`https://unpkg.com/lucide@latest/dist/umd/lucide.js`)
- **OpenAI Node.js SDK**: Official OpenAI library (^5.18.1) for backend API integration

## Runtime Dependencies
- **Node.js**: Runtime environment (>=14.0.0 required)
- **HTTP Module**: Built-in Node.js module for server functionality
- **File System Module**: Built-in Node.js module for file serving
- **Path Module**: Built-in Node.js module for path resolution
- **URL Module**: Built-in Node.js module for URL parsing

## Development Environment
- **Replit Hosting**: Configured for Replit deployment with autoscale
- **Environment Variable Management**: OPENAI_API_KEY stored in Replit Secrets
- **Package Management**: npm with package.json configuration for dependencies