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
        } else if (endpoint === '/api/design' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { requirements } = JSON.parse(body);
                    const design = await generateHighLevelDesign(requirements);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, design }));
                } catch (error) {
                    console.error('Design generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate design' }));
                }
            });
        } else if (endpoint === '/api/erd' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { requirements } = JSON.parse(body);
                    const erd = await generateERD(requirements);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, erd }));
                } catch (error) {
                    console.error('ERD generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate ERD' }));
                }
            });
        } else if (endpoint === '/api/lowlevel' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { requirements } = JSON.parse(body);
                    const diagrams = await generateLowLevelDiagram(requirements);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, diagrams }));
                } catch (error) {
                    console.error('Low level diagram generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate low level diagrams' }));
                }
            });
        } else if (endpoint === '/api/website-structure' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { concept } = JSON.parse(body);
                    const structure = await generateWebsiteStructure(concept);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, structure }));
                } catch (error) {
                    console.error('Website structure generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to generate website structure' }));
                }
            });
        } else if (endpoint === '/api/user-stories' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { prompt } = JSON.parse(body);
                    const userStories = await generateUserStories(prompt);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ content: userStories }));
                } catch (error) {
                    console.error('User stories generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to generate user stories' }));
                }
            });
        } else if (endpoint === '/api/requirements' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const { concept } = JSON.parse(body);
                    const document = await generateRequirementsDocument(concept);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ document }));
                } catch (error) {
                    console.error('Requirements generation error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to generate requirements document' }));
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

// Generate High Level Design using OpenAI
async function generateHighLevelDesign(requirements) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert system architect and technical lead. Analyze the given requirements document and generate a comprehensive high level design that includes:

1. **System Architecture Overview** - Overall system structure, layers, and architectural patterns
2. **Major Component Identification** - Key components, modules, and their responsibilities
3. **Technology Stack Decisions** - Recommended technologies, frameworks, and tools with justifications
4. **System-wide Design Patterns** - Architectural patterns, design principles, and best practices
5. **Integration Approaches** - How components communicate, APIs, messaging, and data flow
6. **Database Architecture** - Data models, storage solutions, and data management strategies

Format your response in clean HTML with proper headings, sections, bullet points, and professional styling. Make it comprehensive, technically sound, and suitable for development teams and technical stakeholders. Include specific recommendations and technical rationale for all decisions.`
            },
            {
                role: "user",
                content: `Based on these requirements, generate a comprehensive high level system design:

${requirements}

Please provide detailed technical analysis covering:
- Complete system architecture with component relationships
- Specific technology recommendations with reasoning
- Database design and data architecture decisions  
- Integration patterns and communication protocols
- Security considerations and non-functional requirements
- Scalability and performance design decisions`
            }
        ],
        max_tokens: 4000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate Entity-Relationship Diagram using OpenAI
async function generateERD(requirements) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert database architect and data modeler. Analyze the given data requirements and generate a comprehensive Entity-Relationship Diagram (ERD) that includes:

1. **Database Tables** - All entities with their attributes and data types
2. **Primary Keys** - Unique identifiers for each entity
3. **Foreign Keys** - Relationships between entities
4. **Relationships** - One-to-one, one-to-many, many-to-many relationships
5. **Cardinality** - Specific relationship constraints and multiplicity
6. **Indexes** - Performance optimization recommendations
7. **Constraints** - Data validation rules and business logic

Format your response in clean HTML with proper headings, sections, bullet points, and professional styling. Include detailed table structures, relationship descriptions, and SQL-like schema definitions. Make it comprehensive, technically accurate, and suitable for database developers and system architects.`
            },
            {
                role: "user",
                content: `Based on these data requirements, generate a comprehensive Entity-Relationship Diagram:

${requirements}

Please provide detailed database design covering:
- Complete table structures with all attributes and data types
- Primary and foreign key definitions
- Detailed relationship mappings with cardinality
- Junction tables for many-to-many relationships
- Database constraints and validation rules
- Performance considerations and indexing recommendations`
            }
        ],
        max_tokens: 4000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate Low Level Diagrams using OpenAI
async function generateLowLevelDiagram(requirements) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert software architect and technical lead specializing in detailed system design. Analyze the given specifications and generate comprehensive low-level technical diagrams using TEXT-BASED representations only. Include:

1. **Class/Component Diagrams** - Use ASCII art or structured text to show class hierarchies, attributes, methods, and relationships. Use boxes and lines made of text characters.
2. **Sequence Diagrams** - Create text-based sequence diagrams showing step-by-step interactions between objects/components using arrows (-->) and text descriptions.
3. **Database Schema** - Present detailed table structures in formatted text tables showing columns, data types, constraints, and relationships.
4. **API Specifications** - Complete method signatures, parameters, return types, and HTTP endpoints in structured text format.
5. **Algorithms** - Pseudocode and text-based flowcharts for complex processing logic.
6. **Error Handling** - Specific exceptions, error codes, and recovery mechanisms in structured text.

IMPORTANT: Use ONLY text-based diagrams and representations. NO images or visual graphics. Use ASCII characters, tables, code blocks, and structured text formatting. Make all content responsive and readable on mobile devices. Format your response in clean HTML with proper headings, sections, code blocks, and professional styling.`
            },
            {
                role: "user",
                content: `Based on these system specifications, generate comprehensive low-level technical diagrams:

${requirements}

Please provide detailed technical analysis covering:
- Complete class/component structures with all methods and properties
- Detailed sequence diagrams showing object interactions
- Full database schema with all constraints and relationships
- Complete API specifications with all endpoints and data formats
- Algorithmic implementations with pseudocode
- Comprehensive error handling strategies and exception management`
            }
        ],
        max_tokens: 4000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate Website Structure using OpenAI
async function generateWebsiteStructure(concept) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert web developer and project architect specializing in website structure and organization. Analyze the given website concept and generate a comprehensive project structure that includes:

1. **Complete File Structure** - Organized folder hierarchy with all necessary files and directories
2. **HTML Pages** - All required pages with proper naming conventions
3. **CSS Organization** - Stylesheet structure and organization approach
4. **JavaScript Architecture** - Script organization and modular structure
5. **Asset Management** - Images, fonts, and media organization
6. **Configuration Files** - Build tools, package management, and deployment configs
7. **Documentation Structure** - README, documentation, and project guides

Format your response in clean HTML with proper headings, code blocks for file structures, and professional styling. Include detailed explanations of the organizational approach, naming conventions, and best practices. Make it comprehensive and ready for immediate implementation by web developers.`
            },
            {
                role: "user",
                content: `Based on this website concept, generate a complete project structure and file organization:

${concept}

Please provide detailed structure covering:
- Complete folder hierarchy and file organization
- All HTML pages and components needed
- CSS and JavaScript organization strategy
- Asset and media file management
- Build and deployment configuration
- Documentation and project setup guides`
            }
        ],
        max_tokens: 4000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate User Stories using OpenAI
async function generateUserStories(prompt) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are an expert product manager and UX designer. Generate comprehensive user stories with specific features and implementation approaches."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

// Generate Requirements Document using OpenAI
async function generateRequirementsDocument(concept) {
    if (!openai) {
        throw new Error('OpenAI API not initialized. Please check your API key configuration.');
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an expert business analyst and product manager. Generate a comprehensive requirements document that includes:

1. **Executive Summary** - Project overview, goals, and value proposition
2. **Functional Requirements** - Detailed feature specifications with acceptance criteria
3. **Non-Functional Requirements** - Performance, security, usability, scalability requirements
4. **User Requirements** - User roles, permissions, and interaction patterns
5. **System Requirements** - Technical specifications, platform requirements, and constraints
6. **Business Requirements** - Success metrics, compliance needs, and business rules
7. **Interface Requirements** - UI/UX specifications, API requirements, and integration needs

Format your response in clean HTML with proper headings, sections, numbered lists, and professional styling. Make it comprehensive, detailed, and suitable for development teams and stakeholders. Include specific acceptance criteria and measurable requirements.`
            },
            {
                role: "user",
                content: `Generate a comprehensive requirements document for this project concept:

${concept}

Please provide detailed requirements covering:
- Complete functional specifications with user scenarios
- Performance, security, and scalability requirements
- Technical requirements and system constraints
- Business requirements and success criteria
- User interface and experience requirements
- Integration and API specifications`
            }
        ],
        max_tokens: 4000,
        temperature: 0.7
    });
    
    return completion.choices[0].message.content;
}

server.listen(port, '0.0.0.0', () => {
    console.log(`Preppy server running at http://0.0.0.0:${port}/`);
});