# Preppy - AI SDLC Companion

A refactored web application that provides AI-powered Software Development Life Cycle (SDLC) planning and management tools.

## Project Structure

The application has been refactored into separate, maintainable files:

```
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and themes
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Files Description

### `index.html`
- Clean HTML structure without inline styles or scripts
- References external CSS and JavaScript files
- Maintains semantic HTML structure
- Includes all necessary meta tags and external dependencies

### `styles.css`
- Complete CSS styling with CSS custom properties (variables)
- Dark theme support
- Responsive design with mobile-first approach
- Organized into logical sections:
  - CSS Variables and themes
  - Base styles
  - Layout components (sidebar, main content)
  - UI components (cards, buttons, forms)
  - Responsive design rules

### `script.js`
- All JavaScript functionality in a single, organized file
- Modular functions for different features
- Event handling for user interactions
- Mock AI analysis functionality
- Responsive behavior management

## Features

- **Dashboard**: Project overview with progress tracking and metrics
- **Planning Tool**: AI-powered SDLC planning with concept analysis
- **Navigation**: Collapsible sidebar with development stage navigation
- **Responsive Design**: Mobile-friendly interface


## Usage

1. Open `index.html` in a modern web browser
2. The application will load with the planning page as default
3. Use the sidebar to navigate between different development stages
4. Enter project concepts in the planning tool to generate SDLC analysis
5. Use the chat interface for AI assistance

## Dependencies

- **Lucide Icons**: CDN-loaded icon library for the UI
- **Modern Browser**: Requires ES6+ support for JavaScript features

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

To modify the application:

- **HTML Structure**: Edit `index.html`
- **Styling**: Modify `styles.css`
- **Functionality**: Update `script.js`

The separation of concerns makes it easy to:
- Update styles without touching HTML or JavaScript
- Modify functionality without affecting the presentation
- Maintain and debug individual components
- Collaborate with team members on different aspects

## Notes

- The AI analysis functionality currently uses mock data
- In a production environment, you would integrate with actual AI services
- The chat interface is set up for backend integration
- All interactive elements are properly accessible and keyboard navigable 
