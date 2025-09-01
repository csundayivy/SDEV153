// Initialize Lucide icons
lucide.createIcons();

// State management
let sidebarCollapsed = false;
let isAnalyzing = false;

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const conceptInput = document.getElementById('conceptInput');
const analyzeButton = document.getElementById('analyzeButton');
const buttonText = document.getElementById('buttonText');
const charCount = document.getElementById('charCount');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const successAlert = document.getElementById('successAlert');
const successMessage = document.getElementById('successMessage');
const analysisResults = document.getElementById('analysisResults');
const analysisContent = document.getElementById('analysisContent');
const loadingState = document.getElementById('loadingState');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// ChatGPT API Configuration
const CHATGPT_API_KEY = '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';
const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

// Sidebar toggle functionality
sidebarToggle.addEventListener('click', () => {
    toggleSidebar();
});

// Add keyboard shortcut (Esc key) to collapse sidebar
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sidebarCollapsed) {
        toggleSidebar();
    }
});

// Enhanced sidebar toggle function
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    
    // Handle mobile vs desktop behavior
    if (window.innerWidth <= 768) {
        if (sidebarCollapsed) {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('expanded');
        }
    } else {
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
    }
    
    // Update toggle icon with smooth transition
    const icon = sidebarToggle.querySelector('i');
    icon.style.transition = 'transform 0.3s ease';
    
    if (sidebarCollapsed) {
        icon.setAttribute('data-lucide', 'menu');
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.setAttribute('data-lucide', 'chevron-left');
        icon.style.transform = 'rotate(180deg)';
    }
    
    lucide.createIcons();
    
    // Store preference in localStorage
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    
    // Add visual feedback
    sidebarToggle.classList.add('toggled');
    setTimeout(() => sidebarToggle.classList.remove('toggled'), 300);
}

// Character count functionality
conceptInput.addEventListener('input', () => {
    const count = conceptInput.value.length;
    charCount.textContent = count;
    
    // Update character count styling
    charCount.className = 'character-count';
    if (count > 2000) {
        charCount.classList.add('error');
    } else if (count > 1500) {
        charCount.classList.add('warning');
    }
    
    // Enable/disable analyze button
    analyzeButton.disabled = count < 50 || isAnalyzing;
});

// Planning functionality
analyzeButton.addEventListener('click', async () => {
    const concept = conceptInput.value.trim();
    if (!concept || concept.length < 50) {
        showError('Please provide a more detailed description of your app idea (at least 50 characters).');
        return;
    }

    if (concept.length > 3000) {
        showError('Your description is too long. Please keep it under 3000 characters.');
        return;
    }

    setLoading(true);
    hideError();
    hideSuccess();
    hideAnalysis();

    try {
        const analysis = await generateProjectPlan(concept);
        displayAnalysis(analysis);
        showSuccess('Your project plan has been generated successfully!');
    } catch (error) {
        console.error('Error generating project plan:', error);
        showError('Failed to generate project plan. Please check your internet connection and try again.');
    } finally {
        setLoading(false);
    }
});

async function generateProjectPlan(concept) {
    const prompt = `As an expert software development consultant and project manager, analyze the following app concept and provide a comprehensive project plan. Please structure your response as a detailed analysis covering all the requested aspects.

App Concept: "${concept}"

Please provide a comprehensive analysis with the following sections:

1. **Problem Definition & Business Need**
   - Define the core problem being solved
   - Identify the target market and user pain points
   - Explain the business justification and market opportunity
   - Assess competitive landscape

2. **Project Scope & Goals**
   - Define clear project objectives and success criteria
   - Establish project boundaries and deliverables
   - Set measurable goals and KPIs
   - Identify project constraints and assumptions

3. **Feasibility Assessment**
   - Technical feasibility analysis
   - Economic feasibility and ROI projections
   - Operational feasibility considerations
   - Legal and regulatory compliance requirements
   - Risk assessment and mitigation strategies

4. **User Stories & Features**
   - Detailed user personas and their needs
   - Comprehensive user stories with acceptance criteria
   - Core features and functionality requirements
   - User experience considerations
   - Accessibility requirements

5. **Technical Requirements**
   - Recommended technology stack
   - System architecture and design patterns
   - Database design considerations
   - API requirements and integrations
   - Performance and scalability requirements
   - Security requirements and best practices
   - Deployment and infrastructure needs

6. **Project Timeline & Resource Planning**
   - Development phases and milestones
   - Resource requirements (team composition)
   - Time estimates for each phase
   - Budget estimation and cost breakdown
   - Risk management timeline

7. **Implementation Roadmap**
   - MVP (Minimum Viable Product) definition
   - Feature prioritization and release strategy
   - Development methodology recommendations
   - Testing and quality assurance plan
   - Deployment and launch strategy

Please provide specific, actionable insights and recommendations. Use industry best practices and consider modern development approaches. Format your response in clear sections with bullet points and specific details.`;

    try {
        const response = await fetch(CHATGPT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert software development consultant and project manager with 15+ years of experience. You specialize in creating comprehensive project plans for mobile and web applications. Provide detailed, actionable, and professional analysis. Always format your response with clear section headers using **bold** formatting.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 4000,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Invalid API Response:', data);
            throw new Error('Invalid response from ChatGPT API');
        }

        const content = data.choices[0].message.content;
        
        if (!content || content.trim().length === 0) {
            throw new Error('Empty response from ChatGPT API');
        }

        console.log('API Response received:', content.substring(0, 200) + '...');
        return content;

    } catch (error) {
        console.error('Error in generateProjectPlan:', error);
        
        // Provide more specific error messages
        if (error.message.includes('401')) {
            throw new Error('Invalid API key. Please check your ChatGPT API key.');
        } else if (error.message.includes('429')) {
            throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        } else if (error.message.includes('500')) {
            throw new Error('ChatGPT service is temporarily unavailable. Please try again later.');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw error;
        }
    }
}

function setLoading(loading) {
    isAnalyzing = loading;
    analyzeButton.disabled = loading || conceptInput.value.trim().length < 50;
    
    if (loading) {
        buttonText.textContent = 'Analyzing with AI...';
        analyzeButton.classList.add('loading');
        loadingState.classList.remove('hidden');
        analysisResults.classList.add('hidden');
    } else {
        buttonText.textContent = 'Generate AI Project Plan';
        analyzeButton.classList.remove('loading');
        loadingState.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
    successAlert.classList.add('hidden');
}

function hideError() {
    errorAlert.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successAlert.classList.remove('hidden');
    errorAlert.classList.add('hidden');
}

function hideSuccess() {
    successAlert.classList.add('hidden');
}

function hideAnalysis() {
    analysisResults.classList.add('hidden');
}

function displayAnalysis(analysis) {
    console.log('Raw analysis received:', analysis);
    
    // Parse the analysis and format it into structured sections
    const formattedAnalysis = formatAnalysisResponse(analysis);
    console.log('Formatted analysis:', formattedAnalysis);
    
    analysisContent.innerHTML = formattedAnalysis;
    analysisResults.classList.remove('hidden');
    lucide.createIcons();
    
    // Scroll to results
    analysisResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatAnalysisResponse(analysis) {
    // Clean up the response first
    let cleanAnalysis = analysis.trim();
    
    // Try multiple parsing strategies
    let formattedHTML = '';
    
    // Strategy 1: Look for numbered sections with **bold** titles
    const numberedSections = cleanAnalysis.split(/(\d+\.\s*\*\*[^*]+\*\*)/);
    if (numberedSections.length > 1) {
        formattedHTML = parseNumberedSections(numberedSections);
    }
    
    // Strategy 2: Look for ## markdown headers
    if (!formattedHTML) {
        const markdownSections = cleanAnalysis.split(/(##\s+[^\n]+)/);
        if (markdownSections.length > 1) {
            formattedHTML = parseMarkdownSections(markdownSections);
        }
    }
    
    // Strategy 3: Look for **bold** headers without numbers
    if (!formattedHTML) {
        const boldSections = cleanAnalysis.split(/(\*\*[^*]+\*\*)/);
        if (boldSections.length > 1) {
            formattedHTML = parseBoldSections(boldSections);
        }
    }
    
    // Fallback: If no structured sections found, create a single section
    if (!formattedHTML) {
        formattedHTML = createFallbackSection(cleanAnalysis);
    }
    
    return formattedHTML;
}

function parseNumberedSections(sections) {
    let html = '';
    for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i].replace(/^\d+\.\s*\*\*|\*\*$/g, '').trim();
        const content = sections[i + 1] ? sections[i + 1].trim() : '';
        
        if (title && content) {
            html += createAnalysisSection(title, content);
        }
    }
    return html;
}

function parseMarkdownSections(sections) {
    let html = '';
    for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i].replace(/^##\s+/, '').trim();
        const content = sections[i + 1] ? sections[i + 1].trim() : '';
        
        if (title && content) {
            html += createAnalysisSection(title, content);
        }
    }
    return html;
}

function parseBoldSections(sections) {
    let html = '';
    for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i].replace(/\*\*/g, '').trim();
        const content = sections[i + 1] ? sections[i + 1].trim() : '';
        
        if (title && content) {
            html += createAnalysisSection(title, content);
        }
    }
    return html;
}

function createAnalysisSection(title, content) {
    const icon = getIconForSection(title);
    return `
        <div class="analysis-item">
            <div class="analysis-header">
                <div class="analysis-icon">
                    <i data-lucide="${icon}" style="width: 24px; height: 24px; color: var(--primary);"></i>
                </div>
                <h3 class="analysis-title">${title}</h3>
            </div>
            <div class="analysis-content">${formatContent(content)}</div>
        </div>
    `;
}

function createFallbackSection(content) {
    return `
        <div class="analysis-item">
            <div class="analysis-header">
                <div class="analysis-icon">
                    <i data-lucide="file-text" style="width: 24px; height: 24px; color: var(--primary);"></i>
                </div>
                <h3 class="analysis-title">Project Analysis</h3>
            </div>
            <div class="analysis-content">${formatContent(content)}</div>
        </div>
    `;
}

function getIconForSection(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('problem') || titleLower.includes('business')) return 'alert-triangle';
    if (titleLower.includes('scope') || titleLower.includes('goal')) return 'target';
    if (titleLower.includes('feasibility')) return 'check-circle';
    if (titleLower.includes('user') || titleLower.includes('feature')) return 'users';
    if (titleLower.includes('technical') || titleLower.includes('requirement')) return 'settings';
    if (titleLower.includes('timeline') || titleLower.includes('resource')) return 'clock';
    if (titleLower.includes('implementation') || titleLower.includes('roadmap')) return 'map';
    return 'file-text';
}

function formatContent(content) {
    if (!content) return '';
    
    // Clean up the content
    let formatted = content.trim();
    
    // Handle bullet points and numbered lists
    formatted = formatted
        // Convert bullet points
        .replace(/^[\-\*\+]\s+(.+)$/gm, '<li>$1</li>')
        // Convert numbered lists
        .replace(/^(\d+\.)\s+(.+)$/gm, '<li><strong>$1</strong> $2</li>')
        // Convert sub-bullets
        .replace(/^\s{2,}[\-\*\+]\s+(.+)$/gm, '<li class="sub-item">$1</li>');
    
    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li[^>]*>.*<\/li>)(\s*<li[^>]*>.*<\/li>)+/g, (match) => {
        return '<ul>' + match + '</ul>';
    });
    
    // Handle bold and italic text
    formatted = formatted
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle line breaks and paragraphs
    formatted = formatted
        .replace(/\n\n+/g, '</p><p>')
        .replace(/^(?!<[ul]|<li)/gm, '<p>')
        .replace(/(?<!>)$/gm, '</p>');
    
    // Clean up empty paragraphs and fix nested tags
    formatted = formatted
        .replace(/<p><\/p>/g, '')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p>(<ul>)/g, '$1')
        .replace(/(<\/ul>)<\/p>/g, '$1')
        .replace(/<p>(<li)/g, '<ul><li')
        .replace(/(<\/li>)<\/p>/g, '</li></ul>');
    
    // Handle code blocks (if any)
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Clean up any remaining issues
    formatted = formatted
        .replace(/<p>\s*<p>/g, '<p>')
        .replace(/<\/p>\s*<\/p>/g, '</p>')
        .replace(/^\s*<p>|<\/p>\s*$/g, '');
    
    return formatted;
}

// Export functionality
document.getElementById('exportPDF').addEventListener('click', () => {
    // In a real implementation, you would use a library like jsPDF
    showSuccess('PDF export feature coming soon!');
});

document.getElementById('exportJSON').addEventListener('click', () => {
    const analysisData = {
        concept: conceptInput.value,
        analysis: analysisContent.innerHTML,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-plan-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showSuccess('Project plan exported as JSON successfully!');
});

document.getElementById('copyToClipboard').addEventListener('click', async () => {
    try {
        const textContent = analysisContent.textContent || analysisContent.innerText;
        await navigator.clipboard.writeText(textContent);
        showSuccess('Project plan copied to clipboard!');
    } catch (err) {
        showError('Failed to copy to clipboard. Please try again.');
    }
});

// Chat functionality
chatInput.addEventListener('input', () => {
    chatSend.disabled = !chatInput.value.trim();
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

chatSend.addEventListener('click', sendMessage);

// Quick prompts
document.querySelectorAll('.quick-prompt').forEach(prompt => {
    prompt.addEventListener('click', () => {
        const promptText = prompt.dataset.prompt;
        chatInput.value = promptText;
        chatSend.disabled = false;
        chatInput.focus();
    });
});

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Here you would typically send the message to your AI backend
    console.log('Sending message:', message);
    
    // Clear input
    chatInput.value = '';
    chatSend.disabled = true;

    // Mock response (in a real app, this would come from your AI service)
    setTimeout(() => {
        console.log('AI Response: I understand you want help with:', message);
        showSuccess(`AI response: "I understand you want help with: ${message}". This feature will be fully implemented with real AI responses.`);
    }, 1000);
}

// Initialize the app
function init() {
    // Initialize icons
    lucide.createIcons();

    // Restore sidebar state from localStorage
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
        sidebarCollapsed = JSON.parse(savedCollapsedState);
        // Apply the new logic for restoring sidebar state
        if (window.innerWidth <= 768) {
            if (sidebarCollapsed) {
                sidebar.classList.remove('expanded');
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
                sidebar.classList.add('expanded');
            }
        } else {
            sidebar.classList.toggle('collapsed', sidebarCollapsed);
        }
        const icon = sidebarToggle.querySelector('i');
        icon.style.transition = 'transform 0.3s ease';
        if (sidebarCollapsed) {
            icon.setAttribute('data-lucide', 'menu');
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.setAttribute('data-lucide', 'chevron-left');
            icon.style.transform = 'rotate(180deg)';
        }
        lucide.createIcons();
    }

    // Initial character count
    const count = conceptInput.value.length;
    charCount.textContent = count;
    analyzeButton.disabled = count < 50;
}

// Start the application
init();

// Responsive handling
function handleResize() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        sidebarCollapsed = true;
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial check
