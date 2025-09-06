const fs = require('fs');
const path = require('path');

// Create dist directory for GitHub Pages
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
        
        // Skip node_modules, .git, server files, and build files
        if (item === 'node_modules' || item === '.git' || item === 'server.js' || 
            item === 'package.json' || item === 'package-lock.json' || 
            item === 'build-github.js' || item === 'dist' || item.startsWith('.')) {
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

// Create a client-side API handler for GitHub Pages
const clientApiHandler = `
// GitHub Pages API Handler - Client-side fallback
window.GithubPagesAPI = {
    async makeRequest(endpoint, data) {
        // For GitHub Pages, we'll implement client-side AI integration
        // This is a fallback since GitHub Pages doesn't support server-side APIs
        
        if (endpoint === '/api/analyze') {
            return this.analyzeProject(data.concept);
        } else if (endpoint === '/api/generate') {
            return this.generateContent(data.prompt, data.type);
        }
        
        throw new Error('Endpoint not supported in GitHub Pages mode');
    },
    
    async analyzeProject(concept) {
        // Placeholder analysis for GitHub Pages
        return {
            success: true,
            analysis: \`
                <div class="analysis-result">
                    <h3>Project Analysis: \${concept}</h3>
                    <p><strong>Note:</strong> This is a static demo running on GitHub Pages.</p>
                    <div class="analysis-section">
                        <h4>Problem Definition</h4>
                        <p>The project "\${concept}" requires comprehensive planning and analysis.</p>
                    </div>
                    <div class="analysis-section">
                        <h4>Project Scope</h4>
                        <p>This project should include requirements gathering, design, development, testing, and deployment phases.</p>
                    </div>
                    <div class="analysis-section">
                        <h4>Recommendations</h4>
                        <ul>
                            <li>Start with detailed requirements analysis</li>
                            <li>Create user stories and acceptance criteria</li>
                            <li>Design system architecture</li>
                            <li>Implement in iterative phases</li>
                            <li>Include comprehensive testing strategy</li>
                        </ul>
                    </div>
                    <div class="github-pages-notice">
                        <p><em>For full AI-powered analysis, deploy this application to a platform that supports server-side APIs like Replit, Vercel, or Netlify with API functions.</em></p>
                    </div>
                </div>
            \`
        };
    },
    
    async generateContent(prompt, type) {
        // Placeholder content generation for GitHub Pages
        const typeDescriptions = {
            design: "UI/UX Design and Wireframes",
            development: "Code Structure and Implementation",
            testing: "Test Plans and Quality Assurance",
            deployment: "Deployment Strategy and DevOps",
            maintenance: "Maintenance and Monitoring Plans"
        };
        
        return {
            success: true,
            result: \`
                <div class="generated-content">
                    <h3>\${typeDescriptions[type] || 'Generated Content'}</h3>
                    <p><strong>Prompt:</strong> \${prompt}</p>
                    <p><strong>Note:</strong> This is a static demo running on GitHub Pages.</p>
                    <div class="content-section">
                        <h4>Sample \${type.charAt(0).toUpperCase() + type.slice(1)} Guidelines</h4>
                        <p>Here are some general best practices for \${type} in software development:</p>
                        <ul>
                            <li>Follow industry standards and best practices</li>
                            <li>Consider scalability and maintainability</li>
                            <li>Document all decisions and processes</li>
                            <li>Include stakeholder feedback loops</li>
                            <li>Plan for testing and validation</li>
                        </ul>
                    </div>
                    <div class="github-pages-notice">
                        <p><em>For AI-powered content generation, deploy this application to a platform that supports server-side APIs with OpenAI integration.</em></p>
                    </div>
                </div>
            \`
        };
    }
};

// Override fetch for API calls in GitHub Pages mode
if (window.location.hostname.includes('github.io')) {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.startsWith('/api/')) {
            const endpoint = url;
            const data = options && options.body ? JSON.parse(options.body) : {};
            return Promise.resolve({
                ok: true,
                json: () => window.GithubPagesAPI.makeRequest(endpoint, data)
            });
        }
        return originalFetch.apply(this, arguments);
    };
}
`;

// Write the GitHub Pages API handler
fs.writeFileSync(path.join(distDir, 'js', 'github-pages-api.js'), clientApiHandler);

// Update HTML files to include the GitHub Pages API handler
const htmlFiles = ['index.html', 'dashboard.html', 'planning.html', 'design.html', 'development.html', 'testing.html', 'deployment.html', 'maintenance.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add GitHub Pages API script before closing body tag
        const scriptTag = '    <script src="js/github-pages-api.js"></script>\\n</body>';
        content = content.replace('</body>', scriptTag);
        
        fs.writeFileSync(filePath, content);
    }
});

console.log('✅ GitHub Pages build completed successfully!');
console.log('📁 Static files copied to ./dist directory');
console.log('🔧 Client-side API fallback configured');
console.log('🚀 Ready for GitHub Pages deployment');