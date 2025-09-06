const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const OpenAI = require('openai');

const port = 5000;

// Environment-aware OpenAI initialization
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI API initialized successfully');
} else {
    console.log('⚠️  OpenAI API key not found. API features will be disabled.');
    console.log('   To enable AI features:');
    console.log('   - In Replit: Add OPENAI_API_KEY to the Secrets tab');
    console.log('   - In GitHub: Add OPENAI_API_KEY to Repository Secrets');
}

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = parsedUrl.pathname;
    
    // Set CORS headers for API endpoints
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API endpoints
    if (filePath.startsWith('/api/')) {
        await handleApiRequest(req, res, filePath, parsedUrl.query);
        return;
    }
    
    // Default to index.html for root path
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Construct file path
    const fullPath = path.join(__dirname, filePath);
    const extname = path.extname(fullPath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Set cache control headers to prevent caching issues in Replit
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Read and serve the file
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Server Error</h1>');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Handle API requests
async function handleApiRequest(req, res, endpoint, query) {
    try {
        if (endpoint === '/api/analyze' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { concept } = JSON.parse(body);
                    const analysis = await generateSDLCAnalysis(concept);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, analysis }));
                } catch (error) {
                    console.error('Analysis error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate analysis' }));
                }
            });
        } else if (endpoint === '/api/generate' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { prompt, type } = JSON.parse(body);
                    const result = await generateContent(prompt, type);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, result }));
                } catch (error) {
                    console.error('Generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate content' }));
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
        }
    } catch (error) {
        console.error('API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
    }
}

// Generate SDLC analysis using OpenAI
async function generateSDLCAnalysis(concept) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert software development consultant and business analyst. Analyze the given project concept and provide a comprehensive project analysis that includes:

1. **Project Scope & Goals** - Clear definition of what the project will accomplish
2. **Target Audience** - Detailed user personas and demographics  
3. **User Stories** - Specific user scenarios and acceptance criteria
4. **Functional Requirements** - Core features and capabilities
5. **Non-Functional Requirements** - Performance, security, scalability needs
6. **Technical Requirements** - Technology stack, infrastructure, and architecture

Format your response in clean HTML with proper headings, sections, and bullet points. Use professional styling with clear structure. Make it comprehensive yet concise, suitable for project planning and stakeholder review.`
            },
            {
                role: "user",
                content: `Analyze this project concept for comprehensive SDLC planning: ${concept}

Please provide detailed analysis covering:
- Project scope and strategic goals
- Target audience definition and user personas
- User stories with acceptance criteria
- Complete functional requirements
- Non-functional requirements (performance, security, etc.)
- Technical requirements and architecture recommendations`
            }
        ],
        max_tokens: 3000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate content for different SDLC phases
async function generateContent(prompt, type) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    const systemPrompts = {
        design: "You are a UX/UI design expert. Generate wireframes, design specifications, and user experience recommendations.",
        development: "You are a senior software developer. Generate code structure, implementation plans, and technical specifications.",
        testing: "You are a QA engineer. Generate test plans, test cases, and quality assurance strategies.",
        deployment: "You are a DevOps engineer. Generate deployment strategies, CI/CD pipelines, and infrastructure recommendations.",
        maintenance: "You are a software maintenance specialist. Generate maintenance plans, monitoring strategies, and update procedures."
    };
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: systemPrompts[type] || "You are a software development expert."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 1500,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

server.listen(port, '0.0.0.0', () => {
    console.log(`Preppy server running at http://0.0.0.0:${port}/`);
});