// GitHub Pages AI Integration - Client-side OpenAI API calls
class GitHubPagesAI {
    constructor() {
        this.apiKey = null;
        this.isConfigured = false;
        this.baseURL = 'https://api.openai.com/v1';
    }

    // Initialize with API key from user input
    configure(apiKey) {
        if (!apiKey || !apiKey.trim()) {
            throw new Error('API key is required');
        }
        this.apiKey = apiKey.trim();
        this.isConfigured = true;
        
        // Store in sessionStorage for this session only (more secure than localStorage)
        sessionStorage.setItem('openai_session_key', this.apiKey);
        
        console.log('✅ OpenAI API configured for GitHub Pages mode');
    }

    // Get API key from session storage if available
    loadFromSession() {
        const storedKey = sessionStorage.getItem('openai_session_key');
        if (storedKey) {
            this.apiKey = storedKey;
            this.isConfigured = true;
            return true;
        }
        return false;
    }

    // Check if AI is ready to use
    isReady() {
        return this.isConfigured && this.apiKey;
    }

    // Make API call to OpenAI
    async makeAPICall(messages, options = {}) {
        if (!this.isReady()) {
            throw new Error('OpenAI API not configured. Please provide your API key.');
        }

        const payload = {
            model: options.model || 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: options.maxTokens || 1500,
            temperature: options.temperature || 0.7
        };

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API call failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    // Generate SDLC analysis
    async generateSDLCAnalysis(concept) {
        const messages = [
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
        ];

        return await this.makeAPICall(messages, { maxTokens: 3000 });
    }

    // Generate High Level Design
    async generateHighLevelDesign(requirements) {
        const messages = [
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
        ];

        return await this.makeAPICall(messages, { maxTokens: 4000 });
    }

    // Generate content for specific SDLC phases
    async generateContent(prompt, type) {
        const systemPrompts = {
            design: "You are a UX/UI design expert. Generate wireframes, design specifications, and user experience recommendations. Format your response in HTML.",
            development: "You are a senior software developer. Generate code structure, implementation plans, and technical specifications. Format your response in HTML.",
            testing: "You are a QA engineer. Generate test plans, test cases, and quality assurance strategies. Format your response in HTML.",
            deployment: "You are a DevOps engineer. Generate deployment strategies, CI/CD pipelines, and infrastructure recommendations. Format your response in HTML.",
            maintenance: "You are a systems architect. Generate maintenance procedures, monitoring strategies, and update processes. Format your response in HTML."
        };

        const messages = [
            {
                role: "system",
                content: systemPrompts[type] || "You are a software development expert. Provide detailed guidance and recommendations. Format your response in HTML."
            },
            {
                role: "user",
                content: prompt
            }
        ];

        return await this.makeAPICall(messages, { maxTokens: 1500 });
    }

    // Generate Entity-Relationship Diagram
    async generateERD(requirements) {
        const messages = [
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
        ];

        return await this.makeAPICall(messages, { maxTokens: 4000 });
    }

    // Generate Low Level Diagrams
    async generateLowLevelDiagram(requirements) {
        const messages = [
            {
                role: "system",
                content: `You are an expert software architect and technical lead specializing in detailed system design. Analyze the given specifications and generate comprehensive low-level technical diagrams that include:

1. **Class/Component Diagrams** - Detailed structure of each module with attributes, methods, and relationships
2. **Sequence Diagrams** - Step-by-step interaction flows between objects/components
3. **Database Schema** - Detailed table structures, relationships, constraints, and indexes
4. **API Specifications** - Complete method signatures, parameters, return types, and HTTP endpoints
5. **Algorithms** - Pseudocode and flowcharts for complex processing logic
6. **Error Handling** - Specific exceptions, error codes, and recovery mechanisms

Format your response in clean HTML with proper headings, sections, code blocks, diagrams, and professional styling. Include UML-style diagrams using text representations, detailed code specifications, and comprehensive technical documentation. Make it suitable for developers and technical architects who need to implement the system.`
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
        ];

        return await this.makeAPICall(messages, { maxTokens: 4000 });
    }

    // Clear stored API key
    clearSession() {
        sessionStorage.removeItem('openai_session_key');
        this.apiKey = null;
        this.isConfigured = false;
    }
}

// Global instance for GitHub Pages
window.githubPagesAI = new GitHubPagesAI();

// Override the existing API functions for GitHub Pages environment
if (window.location.hostname.includes('github.io') || window.location.hostname.includes('github.com')) {
    console.log('🌐 GitHub Pages mode detected - enabling client-side AI');
    
    // Try to load existing session
    window.githubPagesAI.loadFromSession();
    
    // Show API key input if not configured
    if (!window.githubPagesAI.isReady()) {
        window.addEventListener('DOMContentLoaded', showAPIKeySetup);
    }
}

function showAPIKeySetup() {
    // Only show if we're on a page that needs AI functionality
    const needsAI = document.querySelector('.ai-input') || 
                   document.querySelector('#conceptInput') || 
                   document.querySelector('#aiPrompt');
    
    if (!needsAI) return;

    // Create API key setup modal
    const modal = document.createElement('div');
    modal.className = 'api-key-modal';
    modal.innerHTML = `
        <div class="api-key-content">
            <h3>🔑 Enable AI Features</h3>
            <p>To use AI-powered SDLC assistance on GitHub Pages, please enter your OpenAI API key:</p>
            <div class="api-key-form">
                <input type="password" id="apiKeyInput" placeholder="sk-..." />
                <button id="saveApiKey">Enable AI</button>
                <button id="skipApiKey">Skip (Demo Mode)</button>
            </div>
            <div class="api-key-help">
                <p><small>🔒 Your API key is stored securely in your browser session only.</small></p>
                <p><small>📝 Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a></small></p>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .api-key-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .api-key-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            margin: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .api-key-form {
            margin: 1rem 0;
        }
        .api-key-form input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-family: monospace;
        }
        .api-key-form button {
            padding: 0.75rem 1.5rem;
            margin-right: 0.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        #saveApiKey {
            background: #4F46E5;
            color: white;
        }
        #skipApiKey {
            background: #6B7280;
            color: white;
        }
        .api-key-help {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        .api-key-help a {
            color: #4F46E5;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Handle API key setup
    document.getElementById('saveApiKey').addEventListener('click', () => {
        const apiKey = document.getElementById('apiKeyInput').value;
        try {
            window.githubPagesAI.configure(apiKey);
            modal.remove();
            
            // Show success message
            showNotification('✅ AI features enabled! You can now use real-time AI assistance.', 'success');
        } catch (error) {
            showNotification('❌ Please enter a valid OpenAI API key', 'error');
        }
    });

    document.getElementById('skipApiKey').addEventListener('click', () => {
        modal.remove();
        showNotification('ℹ️ AI features disabled. Using demo mode.', 'info');
    });

    // Handle Enter key in input
    document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('saveApiKey').click();
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        }
        .notification-success { background: #10B981; }
        .notification-error { background: #EF4444; }
        .notification-info { background: #3B82F6; }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    if (!document.querySelector('style[data-notifications]')) {
        style.setAttribute('data-notifications', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}