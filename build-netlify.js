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

// Create a comprehensive environment detection script for Netlify
const netlifyDetection = `
// Netlify Environment Detection - Must run first!
window.NETLIFY_ENVIRONMENT = true;

// Remove GitHub Pages specific code for Netlify deployment
if (window.githubPagesAI) {
    // Disable GitHub Pages AI since we have server-side functions
    window.githubPagesAI = null;
}

// Force proper environment detection for cross-browser compatibility
window.netlifyEnvironmentForced = true;

// Ensure functions are available immediately for onclick handlers
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Netlify environment fully loaded - server-side functions ready');
    
    // Double-check that all required functions are exposed
    const requiredFunctions = [
        'showRequirementGenerator', 'showUserStoryGenerator', 'showPlanningToolSelection',
        'showHighLevelDesignGenerator', 'showERDGenerator', 'showLowLevelDiagramGenerator', 
        'showWebsiteStructureGenerator', 'showToolSelection'
    ];
    
    const missing = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    if (missing.length > 0) {
        console.warn('⚠️ Missing functions on Netlify:', missing);
    } else {
        console.log('✅ All functions properly exposed on Netlify');
    }
});

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
        
        // Add Netlify environment script at the very beginning of head section for early loading
        content = content.replace(
            '<head>',
            '<head>\n    <script src="js/netlify-env.js"></script>'
        );
        
        // Also add it before the github pages script for redundancy
        content = content.replace(
            '<script src="js/github-pages-ai.js"></script>',
            '<script src="js/github-pages-ai.js"></script>'
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

// Create a simple test file to verify functionality
const testHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Design Page Function Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-button { margin: 10px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .test-result { margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Netlify Design Page Function Test</h1>
    <p>Click buttons to test if functions are accessible:</p>
    
    <button class="test-button" onclick="testShowHighLevel()">Test High Level Design</button>
    <button class="test-button" onclick="testShowERD()">Test ERD Generator</button>
    <button class="test-button" onclick="testShowLowLevel()">Test Low Level</button>
    <button class="test-button" onclick="testShowWebsite()">Test Website Structure</button>
    
    <div id="test-results"></div>
    
    <script src="js/netlify-env.js"></script>
    <script src="js/github-pages-ai.js"></script>
    <script src="js/sdlc-functionality.js"></script>
    
    <script>
        function testShowHighLevel() {
            const result = document.getElementById('test-results');
            try {
                if (typeof window.showHighLevelDesignGenerator === 'function') {
                    result.innerHTML = '<div class="test-result" style="background: #d1fae5;">✅ showHighLevelDesignGenerator function is accessible</div>';
                } else {
                    result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ showHighLevelDesignGenerator function not found</div>';
                }
            } catch(e) {
                result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ Error: ' + e.message + '</div>';
            }
        }
        
        function testShowERD() {
            const result = document.getElementById('test-results');
            try {
                if (typeof window.showERDGenerator === 'function') {
                    result.innerHTML = '<div class="test-result" style="background: #d1fae5;">✅ showERDGenerator function is accessible</div>';
                } else {
                    result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ showERDGenerator function not found</div>';
                }
            } catch(e) {
                result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ Error: ' + e.message + '</div>';
            }
        }
        
        function testShowLowLevel() {
            const result = document.getElementById('test-results');
            try {
                if (typeof window.showLowLevelDiagramGenerator === 'function') {
                    result.innerHTML = '<div class="test-result" style="background: #d1fae5;">✅ showLowLevelDiagramGenerator function is accessible</div>';
                } else {
                    result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ showLowLevelDiagramGenerator function not found</div>';
                }
            } catch(e) {
                result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ Error: ' + e.message + '</div>';
            }
        }
        
        function testShowWebsite() {
            const result = document.getElementById('test-results');
            try {
                if (typeof window.showWebsiteStructureGenerator === 'function') {
                    result.innerHTML = '<div class="test-result" style="background: #d1fae5;">✅ showWebsiteStructureGenerator function is accessible</div>';
                } else {
                    result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ showWebsiteStructureGenerator function not found</div>';
                }
            } catch(e) {
                result.innerHTML = '<div class="test-result" style="background: #fee2e2;">❌ Error: ' + e.message + '</div>';
            }
        }
        
        // Auto-test on load
        window.addEventListener('load', function() {
            setTimeout(() => {
                const allFunctions = [
                    'showHighLevelDesignGenerator',
                    'showERDGenerator', 
                    'showLowLevelDiagramGenerator',
                    'showWebsiteStructureGenerator'
                ];
                
                const available = allFunctions.filter(fn => typeof window[fn] === 'function');
                const missing = allFunctions.filter(fn => typeof window[fn] !== 'function');
                
                let status = '<div class="test-result">';
                status += '<strong>Auto-Test Results:</strong><br>';
                status += \`Available functions: \${available.length}/\${allFunctions.length}<br>\`;
                if (available.length > 0) {
                    status += \`✅ Working: \${available.join(', ')}<br>\`;
                }
                if (missing.length > 0) {
                    status += \`❌ Missing: \${missing.join(', ')}<br>\`;
                }
                status += '</div>';
                
                document.getElementById('test-results').innerHTML = status;
            }, 1000);
        });
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'test-functions.html'), testHTML);

console.log('✅ Netlify build completed successfully!');
console.log('📁 Static files copied to ./dist directory');
console.log('🔧 Serverless functions configured in ./netlify/functions');
console.log('🌐 Environment detection added for optimal deployment');
console.log('🛠️ Function test page created at test-functions.html');
console.log('🚀 Ready for Netlify deployment with server-side AI');