// Wait for Lucide to be available
function waitForLucide(callback) {
    if (typeof lucide !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForLucide(callback), 50);
    }
}

// Initialize Lucide icons when ready
waitForLucide(() => {
    lucide.createIcons();
});

// State management
let currentStage = 'planning';
let sidebarCollapsed = false;

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const navigation = document.getElementById('navigation');
const dashboard = document.getElementById('dashboard');
const planning = document.getElementById('planning');
const conceptInput = document.getElementById('conceptInput');
const analyzeButton = document.getElementById('analyzeButton');
const buttonText = document.getElementById('buttonText');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const analysisResults = document.getElementById('analysisResults');
const analysisContent = document.getElementById('analysisContent');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        toggleMobileSidebar();
    });
}

// Sidebar overlay click to close
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        closeMobileSidebar();
    });
}

// Desktop sidebar toggle functionality
sidebarToggle.addEventListener('click', () => {
    toggleSidebar();
});

// Add keyboard shortcut (Esc key) to collapse sidebar
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (window.innerWidth < 768) {
            closeMobileSidebar();
        } else if (!sidebarCollapsed) {
            toggleSidebar();
        }
    }
});

// Mobile sidebar functions
function toggleMobileSidebar() {
    if (window.innerWidth < 768) {
        sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    }
}

function closeMobileSidebar() {
    if (window.innerWidth < 768) {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Enhanced sidebar toggle function
function toggleSidebar() {
    if (window.innerWidth >= 768) {
        sidebarCollapsed = !sidebarCollapsed;
        
        // Handle desktop behavior
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        
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
}

// Navigation functionality
navigation.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (!navItem) return;

    const stage = navItem.dataset.stage;
    if (stage === currentStage) return;

    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const badge = item.querySelector('.nav-badge');
        if (badge) badge.remove();
    });

    navItem.classList.add('active');
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = 'Active';
    navItem.appendChild(badge);

    // Show/hide content
    currentStage = stage;
    showStageContent(stage);
});

function showStageContent(stage) {
    // Hide all content
    dashboard.classList.add('hidden');
    planning.classList.add('hidden');

    // Show selected content
    if (stage === 'planning') {
        planning.classList.remove('hidden');
    } else {
        dashboard.classList.remove('hidden');
    }
}

// Planning functionality
analyzeButton.addEventListener('click', async () => {
    const concept = conceptInput.value.trim();
    if (!concept) return;

    setLoading(true);
    hideError();
    hideAnalysis();

    try {
        // Make real API call to OpenAI
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ concept })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayAnalysis(result.analysis);
        } else {
            showError(result.error || 'Failed to generate analysis');
        }
        
    } catch (error) {
        console.error('Analysis error:', error);
        showError('An unexpected error occurred while generating the analysis. Please try again.');
    } finally {
        setLoading(false);
    }
});

function setLoading(loading) {
    analyzeButton.disabled = loading;
    if (loading) {
        buttonText.innerHTML = '<i data-lucide="loader-2" class="loading"></i> Analyzing Concept...';
    } else {
        buttonText.innerHTML = '<i data-lucide="lightbulb"></i> Generate SDLC Plan';
    }
    lucide.createIcons();
}

function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
}

function hideError() {
    errorAlert.classList.add('hidden');
}

function hideAnalysis() {
    analysisResults.classList.add('hidden');
}

function displayAnalysis(analysis) {
    analysisContent.innerHTML = analysis;
    analysisResults.classList.remove('hidden');
    lucide.createIcons();
}

function generateMockAnalysis(concept) {
    const sections = [
        {
            title: 'Problem Definition & Business Need',
            icon: 'alert-triangle',
            color: 'red',
            content: `
                <p><strong>Problem Statement:</strong> Based on your concept "${concept.substring(0, 100)}${concept.length > 100 ? '...' : ''}", the primary challenge appears to be addressing the gap in current market solutions.</p>
                <p><strong>Business Justification:</strong> This project addresses a clear market need with potential for significant ROI through improved efficiency and user satisfaction.</p>
                <ul>
                    <li>Target market size and growth potential</li>
                    <li>Competitive advantage opportunities</li>
                    <li>Revenue generation possibilities</li>
                </ul>
            `
        },
        {
            title: 'Project Scope & Goals',
            icon: 'target',
            color: 'blue',
            content: `
                <p><strong>Primary Objectives:</strong></p>
                <ul>
                    <li>Develop a minimum viable product (MVP) within 6-8 weeks</li>
                    <li>Achieve 90% user satisfaction in initial testing</li>
                    <li>Implement core functionality with scalable architecture</li>
                </ul>
                <p><strong>Success Criteria:</strong> User adoption rate > 70%, system uptime > 99.5%, positive user feedback score > 4.2/5</p>
            `
        },
        {
            title: 'Feasibility Assessment',
            icon: 'check-circle',
            color: 'green',
            content: `
                <p><strong>Technical Feasibility:</strong> High - Required technologies are mature and well-documented</p>
                <p><strong>Economic Feasibility:</strong> Positive - Estimated development cost of $50k-75k with break-even in 12-18 months</p>
                <p><strong>Schedule Feasibility:</strong> Achievable with proper resource allocation and agile methodology</p>
                <ul>
                    <li>Available technology stack is suitable</li>
                    <li>Team has necessary skill sets</li>
                    <li>Infrastructure requirements are manageable</li>
                </ul>
            `
        },
        {
            title: 'Resource & Timeline Estimates',
            icon: 'clock',
            color: 'orange',
            content: `
                <p><strong>Team Composition:</strong></p>
                <ul>
                    <li>1 Project Manager (full-time)</li>
                    <li>2 Full-stack Developers (full-time)</li>
                    <li>1 UI/UX Designer (part-time)</li>
                    <li>1 QA Engineer (part-time)</li>
                </ul>
                <p><strong>Timeline:</strong> 8-week development cycle with 2-week sprints</p>
                <p><strong>Budget Estimate:</strong> $60,000 - $80,000 including all resources and infrastructure</p>
            `
        },
        {
            title: 'User Stories',
            icon: 'users',
            color: 'purple',
            content: `
                <ul>
                    <li><strong>As a user,</strong> I want to easily navigate the application so that I can complete tasks efficiently</li>
                    <li><strong>As a user,</strong> I want to receive real-time notifications so that I stay informed of important updates</li>
                    <li><strong>As an admin,</strong> I want to manage user accounts so that I can maintain system security</li>
                    <li><strong>As a user,</strong> I want to export my data so that I can use it in other applications</li>
                    <li><strong>As a user,</strong> I want the application to work on mobile devices so that I can access it anywhere</li>
                </ul>
            `
        },
        {
            title: 'Technical Requirements',
            icon: 'settings',
            color: 'gray',
            content: `
                <p><strong>System Architecture:</strong> Microservices architecture with RESTful APIs</p>
                <p><strong>Technology Stack:</strong></p>
                <ul>
                    <li>Frontend: React.js with TypeScript</li>
                    <li>Backend: Node.js with Express</li>
                    <li>Database: PostgreSQL with Redis for caching</li>
                    <li>Cloud: AWS with Docker containerization</li>
                </ul>
                <p><strong>Performance Requirements:</strong> Page load time < 2 seconds, API response time < 500ms</p>
                <p><strong>Security Requirements:</strong> OAuth 2.0 authentication, HTTPS encryption, GDPR compliance</p>
            `
        }
    ];

    return sections.map(section => `
        <div class="analysis-item">
            <div class="analysis-header">
                <div class="analysis-icon">
                    <i data-lucide="${section.icon}" style="width: 20px; height: 20px; color: var(--primary);"></i>
                </div>
                <h3 class="analysis-title">${section.title}</h3>
            </div>
            <div class="analysis-content">${section.content}</div>
        </div>
    `).join('');
}

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
    });
});

function sendMessage() {
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
    }, 1000);
}

// Initialize the app
function init() {
    // Show planning page by default
    showStageContent('planning');
    
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