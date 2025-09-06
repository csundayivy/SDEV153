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
                content: "You are an expert software development consultant. Analyze the given project concept and provide detailed SDLC recommendations including planning, design, development, testing, deployment, and maintenance phases. Format your response in HTML with proper headings and sections."
            },
            {
                role: "user",
                content: `Analyze this project concept for SDLC planning: ${concept}`
            }
        ];

        return await this.makeAPICall(messages, { maxTokens: 2000 });
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