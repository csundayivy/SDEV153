const fs = require('fs');
const path = require('path');

// Create dist directory for Netlify
const distDir = './dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy all static files to dist
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        // Skip node_modules, .git, server files, build files, but allow netlify directory
        if (item === 'node_modules' || item === '.git' || item === 'server.js' || 
            item === 'package.json' || item === 'package-lock.json' || 
            item === 'build-github.js' || item === 'build-netlify.js' || 
            item === 'dist' || item.startsWith('.')) {
            continue;
        }
        
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy static files
copyDirectory('./', distDir);

// Create a simple environment detection script for Netlify
const netlifyDetection = `
// Netlify Environment Detection
window.NETLIFY_ENVIRONMENT = true;

// Remove GitHub Pages specific code for Netlify deployment
if (window.githubPagesAI) {
    // Disable GitHub Pages AI since we have server-side functions
    window.githubPagesAI = null;
}

console.log('🚀 Netlify environment detected - using server-side functions');
`;

// Write Netlify-specific environment detection
fs.writeFileSync(path.join(distDir, 'js', 'netlify-env.js'), netlifyDetection);

// Update HTML files to include Netlify environment detection
const htmlFiles = ['index.html', 'dashboard.html', 'planning.html', 'design.html', 'development.html', 'testing.html', 'deployment.html', 'maintenance.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add Netlify environment script before GitHub Pages AI script
        content = content.replace(
            '<script src="js/github-pages-ai.js"></script>',
            '<script src="js/netlify-env.js"></script>\\n    <script src="js/github-pages-ai.js"></script>'
        );
        
        fs.writeFileSync(filePath, content);
    }
});

// Copy package.json for Netlify functions
const packageJson = {
    "name": "preppy-netlify-functions",
    "version": "1.0.0",
    "dependencies": {
        "openai": "^5.18.1"
    }
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(packageJson, null, 2));

console.log('✅ Netlify build completed successfully!');
console.log('📁 Static files copied to ./dist directory');
console.log('🔧 Serverless functions configured in ./netlify/functions');
console.log('🌐 Environment detection added for optimal deployment');
console.log('🚀 Ready for Netlify deployment with server-side AI');