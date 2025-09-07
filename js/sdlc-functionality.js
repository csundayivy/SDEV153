// SDLC Pages Functionality - Shared functions for all SDLC phase pages
// This file provides common functionality for all SDLC phase pages

// Wait for both DOM and Lucide to be ready
function waitForLucide(callback) {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        callback();
    } else {
        setTimeout(() => waitForLucide(callback), 50);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    waitForLucide(() => {
        initializePage();
    });
});

function initializePage() {
    // Initialize Lucide icons with error handling
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        try {
            lucide.createIcons();
        } catch (error) {
            console.warn('Error creating Lucide icons:', error);
        }
    }
    
    // Setup mobile navigation
    setupMobileNavigation();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup page-specific functionality
    setupPageFunctionality();
}

// Mobile Navigation Setup - Enhanced for SDLC pages
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        // Only add event listeners if not already added
        if (typeof mobileMenuBtn.addEventListener === 'function' && !mobileMenuBtn.hasAttribute('data-mobile-listener')) {
            mobileMenuBtn.setAttribute('data-mobile-listener', 'true');
            mobileMenuBtn.addEventListener('click', () => {
                toggleMobileSidebar(sidebar, sidebarOverlay);
            });
        }
        
        if (typeof sidebarOverlay.addEventListener === 'function' && !sidebarOverlay.hasAttribute('data-overlay-listener')) {
            sidebarOverlay.setAttribute('data-overlay-listener', 'true');
            sidebarOverlay.addEventListener('click', () => {
                closeMobileSidebar(sidebar, sidebarOverlay);
            });
        }
        
        // Setup simplified SDLC navigation
        setupSDLCNavigation(sidebar);
    }
}

// Enhanced SDLC Navigation for Mobile
function setupSDLCNavigation(sidebar) {
    if (!sidebar) return;
    
    // Add navigation link functionality
    const navLinks = sidebar.querySelectorAll('.nav-item[href], a.nav-item');
    
    navLinks.forEach(link => {
        // Only add event listener if link doesn't already have one
        if (link && !link.hasAttribute('data-nav-listener')) {
            link.setAttribute('data-nav-listener', 'true');
            link.addEventListener('click', (e) => {
                // Close mobile menu when navigating
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        const overlay = document.getElementById('sidebarOverlay');
                        if (sidebar && overlay) {
                            closeMobileSidebar(sidebar, overlay);
                        }
                    }, 100);
                }
                
                // Add smooth transition effect
                if (link.style) {
                    link.style.backgroundColor = 'var(--primary-light)';
                    setTimeout(() => {
                        link.style.backgroundColor = '';
                    }, 200);
                }
            });
        }
    });
    
    // Add swipe gesture support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (window.innerWidth >= 768) return; // Only on mobile
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Swipe right to open menu (from left edge)
        if (deltaX > 100 && Math.abs(deltaY) < 50 && touchStartX < 50) {
            if (!sidebar.classList.contains('mobile-open')) {
                toggleMobileSidebar(sidebar, document.getElementById('sidebarOverlay'));
            }
        }
        
        // Swipe left to close menu
        if (deltaX < -100 && Math.abs(deltaY) < 50 && sidebar.classList.contains('mobile-open')) {
            closeMobileSidebar(sidebar, document.getElementById('sidebarOverlay'));
        }
    });
}

// Sidebar Navigation Setup
function setupSidebarNavigation() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        // Only add event listener if not already added
        if (typeof sidebarToggle.addEventListener === 'function' && !sidebarToggle.hasAttribute('data-toggle-listener')) {
            sidebarToggle.setAttribute('data-toggle-listener', 'true');
            sidebarToggle.addEventListener('click', () => {
                toggleDesktopSidebar(sidebar, sidebarToggle);
            });
        }
        
        // Load saved sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true' && window.innerWidth >= 768) {
            sidebar.classList.add('collapsed');
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                // Re-initialize icons if Lucide is available
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }
    
    // Keyboard shortcuts (only add once)
    if (!document.body.hasAttribute('data-keyboard-listener')) {
        document.body.setAttribute('data-keyboard-listener', 'true');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (window.innerWidth < 768 && sidebar) {
                    const overlay = document.getElementById('sidebarOverlay');
                    if (overlay) {
                        closeMobileSidebar(sidebar, overlay);
                    }
                }
            }
        });
    }
}

// Mobile Sidebar Functions
function toggleMobileSidebar(sidebar, overlay) {
    if (window.innerWidth < 768) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    }
}

function closeMobileSidebar(sidebar, overlay) {
    if (window.innerWidth < 768) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Desktop Sidebar Functions
function toggleDesktopSidebar(sidebar, toggle) {
    if (window.innerWidth >= 768) {
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebar.classList.toggle('collapsed');
        
        const icon = toggle.querySelector('i');
        if (icon) {
            if (isCollapsed) {
                icon.setAttribute('data-lucide', 'chevron-left');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            // Re-initialize icons if Lucide is available
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                try {
                    lucide.createIcons();
                } catch (error) {
                    console.warn('Error creating Lucide icons:', error);
                }
            }
        }
        
        // Save collapsed state
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
    }
}

// Page-specific functionality setup
function setupPageFunctionality() {
    const currentPage = getCurrentPage();
    
    // Load user information for all SDLC pages
    loadUserInfo();
    
    // Setup logout functionality
    setupLogout();
    
    switch(currentPage) {
        case 'planning':
            setupPlanningPage();
            break;
        case 'design':
            setupDesignPage();
            break;
        case 'development':
            setupDevelopmentPage();
            break;
        case 'testing':
            setupTestingPage();
            break;
        case 'deployment':
            setupDeploymentPage();
            break;
        case 'maintenance':
            setupMaintenancePage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('planning')) return 'planning';
    if (path.includes('design')) return 'design';
    if (path.includes('development')) return 'development';
    if (path.includes('testing')) return 'testing';
    if (path.includes('deployment')) return 'deployment';
    if (path.includes('maintenance')) return 'maintenance';
    return 'dashboard';
}

// Planning Page Functionality
function setupPlanningPage() {
    const conceptInput = document.getElementById('conceptInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const charCount = document.getElementById('charCount');
    
    if (conceptInput) {
        conceptInput.addEventListener('input', updateCharCount);
    }
    
    if (analyzeButton) {
        analyzeButton.addEventListener('click', handleAnalyzeClick);
    }
}

function updateCharCount() {
    const conceptInput = document.getElementById('conceptInput');
    const charCount = document.getElementById('charCount');
    if (conceptInput && charCount) {
        const count = conceptInput.value.length;
        charCount.textContent = `${count}/1000`;
        charCount.className = count > 800 ? 'char-count warning' : 'char-count';
    }
}

async function handleAnalyzeClick() {
    const conceptInput = document.getElementById('conceptInput');
    if (!conceptInput || !conceptInput.value.trim()) return;
    
    const concept = conceptInput.value.trim();
    setLoadingState(true);
    hideAlerts();
    
    try {
        const result = await makeAPIRequest('/api/analyze', { concept });
        
        if (result.success) {
            displayAnalysisResults(result.analysis);
        } else {
            showError(result.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        showError('Failed to analyze concept. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Design Page Functionality
function setupDesignPage() {
    setupGenericSDLCPage('design', 'Generate wireframes, design specifications, and user experience recommendations for your project.');
    
    // Setup requirements input character counter
    const requirementsInput = document.getElementById('requirementsInput');
    const charCount = document.getElementById('requirementsCharCount');
    
    if (requirementsInput && charCount) {
        requirementsInput.addEventListener('input', () => {
            const count = requirementsInput.value.length;
            charCount.textContent = `${count}`;
        });
    }

    // Setup ERD input character counter
    const erdInput = document.getElementById('erdInput');
    const erdCharCount = document.getElementById('erdCharCount');
    
    if (erdInput && erdCharCount) {
        erdInput.addEventListener('input', () => {
            const count = erdInput.value.length;
            erdCharCount.textContent = `${count}`;
        });
    }

    // Setup Low Level input character counter
    const lowLevelInput = document.getElementById('lowLevelInput');
    const lowLevelCharCount = document.getElementById('lowLevelCharCount');
    
    if (lowLevelInput && lowLevelCharCount) {
        lowLevelInput.addEventListener('input', () => {
            const count = lowLevelInput.value.length;
            lowLevelCharCount.textContent = `${count}`;
        });
    }

    // Setup Website Structure input character counter
    const websiteStructureInput = document.getElementById('websiteStructureInput');
    const websiteStructureCharCount = document.getElementById('websiteStructureCharCount');
    
    if (websiteStructureInput && websiteStructureCharCount) {
        websiteStructureInput.addEventListener('input', () => {
            const count = websiteStructureInput.value.length;
            websiteStructureCharCount.textContent = `${count}`;
        });
    }
}

// Development Page Functionality
function setupDevelopmentPage() {
    setupGenericSDLCPage('development', 'Generate code structure, implementation plans, and technical specifications for your project.');
}

// Testing Page Functionality
function setupTestingPage() {
    setupGenericSDLCPage('testing', 'Generate comprehensive test plans, test cases, and quality assurance strategies for your project.');
}

// Deployment Page Functionality
function setupDeploymentPage() {
    setupGenericSDLCPage('deployment', 'Generate deployment strategies, CI/CD pipelines, and infrastructure recommendations for your project.');
}

// Maintenance Page Functionality
function setupMaintenancePage() {
    setupGenericSDLCPage('maintenance', 'Generate maintenance plans, monitoring strategies, and update procedures for your project.');
}

// Generic SDLC Page Setup
function setupGenericSDLCPage(type, placeholder) {
    const input = document.getElementById(`${type}Input`) || document.getElementById('projectInput');
    const button = document.getElementById(`${type}Button`) || document.getElementById('generateButton');
    
    if (input) {
        input.placeholder = placeholder;
        input.addEventListener('input', () => {
            const charCount = document.getElementById('charCount');
            if (charCount) {
                const count = input.value.length;
                charCount.textContent = `${count}/1000`;
            }
        });
    }
    
    if (button) {
        button.addEventListener('click', () => handleGenericGenerate(type));
    }
}

// API helper function - works for Replit, Netlify, and GitHub Pages
async function makeAPIRequest(endpoint, data) {
    try {
        // Detect environment
        const isNetlify = window.NETLIFY_ENVIRONMENT || window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com');
        const isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('github.com');
        const isReplit = window.location.hostname.includes('replit');
        
        // Netlify: Use serverless functions (server-side)
        if (isNetlify) {
            // Convert endpoint to Netlify functions path
            let functionName = endpoint.replace('/api/', '');
            // Map specific endpoints to correct function names
            if (functionName === 'design') {
                functionName = 'design';
            } else if (functionName === 'erd') {
                functionName = 'erd';
            } else if (functionName === 'lowlevel') {
                functionName = 'lowlevel';
            } else if (functionName === 'website-structure') {
                functionName = 'website-structure';
            }
            const netlifyEndpoint = `/.netlify/functions/${functionName}`;
            const response = await fetch(netlifyEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        }
        
        // GitHub Pages: Use client-side AI if configured, otherwise fallback
        if (isGitHubPages) {
            if (window.githubPagesAI && window.githubPagesAI.isReady()) {
                if (endpoint === '/api/analyze') {
                    const result = await window.githubPagesAI.generateSDLCAnalysis(data.concept);
                    return { success: true, analysis: result };
                } else if (endpoint === '/api/generate') {
                    const result = await window.githubPagesAI.generateContent(data.prompt, data.type);
                    return { success: true, result: result };
                } else if (endpoint === '/api/design') {
                    const result = await window.githubPagesAI.generateHighLevelDesign(data.requirements);
                    return { success: true, design: result };
                } else if (endpoint === '/api/erd') {
                    const result = await window.githubPagesAI.generateERD(data.requirements);
                    return { success: true, erd: result };
                } else if (endpoint === '/api/lowlevel') {
                    const result = await window.githubPagesAI.generateLowLevelDiagram(data.requirements);
                    return { success: true, diagrams: result };
                } else if (endpoint === '/api/website-structure') {
                    const result = await window.githubPagesAI.generateWebsiteStructure(data.concept);
                    return { success: true, structure: result };
                }
            } else {
                // Fallback for GitHub Pages without API key
                return getGitHubPagesFallback(endpoint, data);
            }
        }
        
        // Replit: Use server-side API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Fallback responses for GitHub Pages without API key
function getGitHubPagesFallback(endpoint, data) {
    if (endpoint === '/api/analyze') {
        return {
            success: true,
            analysis: `
                <div class="analysis-result">
                    <h3>Project Analysis: ${data.concept}</h3>
                    <div class="github-pages-notice">
                        <p><strong>🔑 Demo Mode:</strong> To get real AI-powered analysis, please set up your OpenAI API key.</p>
                        <button onclick="location.reload()" class="setup-ai-btn">Set Up AI Features</button>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>🎯 Project Scope & Goals</h4>
                        <p>The project "${data.concept}" aims to provide value through digital solutions. Key objectives include user engagement, functionality, and scalable architecture.</p>
                        <ul>
                            <li>Primary goal: Deliver core functionality to target users</li>
                            <li>Secondary goal: Ensure scalability and maintainability</li>
                            <li>Success metrics: User adoption and performance indicators</li>
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>👥 Target Audience</h4>
                        <p>Understanding the user base is crucial for project success.</p>
                        <ul>
                            <li><strong>Primary Users:</strong> Tech-savvy individuals seeking efficient solutions</li>
                            <li><strong>Secondary Users:</strong> Business stakeholders and administrators</li>
                            <li><strong>User Demographics:</strong> Ages 25-45, comfortable with digital tools</li>
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>📝 User Stories</h4>
                        <p>Key user scenarios and acceptance criteria:</p>
                        <ul>
                            <li><strong>As a user,</strong> I want to easily access main features so that I can accomplish my goals efficiently</li>
                            <li><strong>As a user,</strong> I want responsive design so that I can use the application on any device</li>
                            <li><strong>As an admin,</strong> I want to manage user accounts so that I can maintain system security</li>
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>⚙️ Functional Requirements</h4>
                        <p>Core features and capabilities needed:</p>
                        <ul>
                            <li>User authentication and authorization system</li>
                            <li>Responsive user interface with intuitive navigation</li>
                            <li>Data management and storage capabilities</li>
                            <li>Search and filtering functionality</li>
                            <li>Real-time updates and notifications</li>
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>🔒 Non-Functional Requirements</h4>
                        <p>Performance, security, and scalability considerations:</p>
                        <ul>
                            <li><strong>Performance:</strong> Page load times under 3 seconds</li>
                            <li><strong>Security:</strong> Data encryption and secure authentication</li>
                            <li><strong>Scalability:</strong> Support for growing user base</li>
                            <li><strong>Availability:</strong> 99.9% uptime target</li>
                            <li><strong>Usability:</strong> Intuitive interface requiring minimal training</li>
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>🛠️ Technical Requirements</h4>
                        <p>Technology stack and architecture recommendations:</p>
                        <ul>
                            <li><strong>Frontend:</strong> Modern web technologies (React, Vue, or Angular)</li>
                            <li><strong>Backend:</strong> Node.js, Python, or similar server technology</li>
                            <li><strong>Database:</strong> PostgreSQL or MongoDB for data storage</li>
                            <li><strong>Hosting:</strong> Cloud platform (AWS, Azure, or Google Cloud)</li>
                            <li><strong>Security:</strong> HTTPS, authentication tokens, input validation</li>
                        </ul>
                    </div>
                </div>
            `
        };
    } else if (endpoint === '/api/generate') {
        return {
            success: true,
            result: `
                <div class="generated-content">
                    <h3>SDLC Guidance</h3>
                    <div class="github-pages-notice">
                        <p><strong>🔑 Demo Mode:</strong> To get AI-powered content generation, please set up your OpenAI API key.</p>
                        <button onclick="location.reload()" class="setup-ai-btn">Set Up AI Features</button>
                    </div>
                    <div class="content-section">
                        <h4>General Best Practices</h4>
                        <p><strong>Your request:</strong> ${data.prompt}</p>
                        <ul>
                            <li>Follow industry standards and proven methodologies</li>
                            <li>Consider scalability and future maintenance needs</li>
                            <li>Document all decisions and architectural choices</li>
                            <li>Include comprehensive testing strategies</li>
                            <li>Plan for continuous integration and deployment</li>
                        </ul>
                    </div>
                </div>
            `
        };
    }
}

// Generic content generation
async function handleGenericGenerate(type) {
    const input = document.getElementById(`${type}Input`) || document.getElementById('projectInput');
    if (!input || !input.value.trim()) return;
    
    const prompt = input.value.trim();
    setLoadingState(true);
    hideAlerts();
    
    try {
        const result = await makeAPIRequest('/api/generate', { prompt, type });
        
        if (result.success) {
            displayGenerationResults(result.result);
        } else {
            showError(result.error || 'Generation failed');
        }
    } catch (error) {
        console.error('Generation error:', error);
        showError('Failed to generate content. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// UI Helper Functions
function setLoadingState(loading) {
    const buttons = document.querySelectorAll('button[id$="Button"], #analyzeButton, #generateButton');
    buttons.forEach(button => {
        button.disabled = loading;
        if (loading) {
            button.innerHTML = '<i data-lucide="loader-2" class="loading"></i> Generating...';
        } else {
            // Reset button text based on type
            const originalText = button.getAttribute('data-original-text') || 'Generate';
            button.innerHTML = `<i data-lucide="sparkles"></i> ${originalText}`;
        }
    });
    lucide.createIcons();
}

function hideAlerts() {
    const alerts = document.querySelectorAll('.error-alert, .success-alert');
    alerts.forEach(alert => alert.classList.add('hidden'));
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('hidden');
    }
}

function showSuccess(message) {
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');
    if (successAlert && successMessage) {
        successMessage.textContent = message;
        successAlert.classList.remove('hidden');
    }
}

function displayAnalysisResults(analysis) {
    const resultsDiv = document.getElementById('analysisResults') || document.getElementById('results');
    const contentDiv = document.getElementById('analysisContent') || document.getElementById('resultsContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = analysis;
        resultsDiv.classList.remove('hidden');
        lucide.createIcons();
        showSuccess('Analysis completed successfully!');
    }
}

function displayGenerationResults(content) {
    const resultsDiv = document.getElementById('results') || document.getElementById('analysisResults');
    const contentDiv = document.getElementById('resultsContent') || document.getElementById('analysisContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = `<div class="generated-content">${content}</div>`;
        resultsDiv.classList.remove('hidden');
        lucide.createIcons();
        showSuccess('Content generated successfully!');
    }
}

// Load user information for SDLC pages
function loadUserInfo() {
    const user = localStorage.getItem('preppy_user');
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            
            // Update user name
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = userData.fullName || 'User';
            }
            
            // Update user email
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement) {
                userEmailElement.textContent = userData.email || '';
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }
}

// Setup logout functionality for SDLC pages
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn && typeof logoutBtn.addEventListener === 'function' && !logoutBtn.hasAttribute('data-logout-listener')) {
        logoutBtn.setAttribute('data-logout-listener', 'true');
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

function logout() {
    // Clear user data
    localStorage.removeItem('preppy_user');
    localStorage.removeItem('preppy_auth_token');
    
    // Show loading state
    showLogoutLoading();
    
    // Simulate logout process
    setTimeout(() => {
        showLogoutSuccess();
        
        // Redirect to login after showing success
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1000);
}

function showLogoutLoading() {
    // Create logout loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'logout-overlay';
    overlay.innerHTML = `
        <div class="logout-content">
            <div class="loading-spinner"></div>
            <p>Logging out...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function showLogoutSuccess() {
    // Update overlay content
    const overlay = document.querySelector('.logout-overlay');
    if (overlay) {
        overlay.innerHTML = `
            <div class="logout-content">
                <div class="success-icon">
                    <i data-lucide="check-circle"></i>
                </div>
                <p>Logged out successfully!</p>
            </div>
        `;
        
        // Re-initialize icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// High Level Design Generator Functions
async function generateHighLevelDesign() {
    const requirementsInput = document.getElementById('requirementsInput');
    const generateButton = document.getElementById('generateDesignButton');
    
    if (!requirementsInput || !generateButton) {
        console.error('Required elements not found');
        return;
    }
    
    const requirements = requirementsInput.value.trim();
    
    if (!requirements) {
        alert('Please enter your requirements document to generate a high level design.');
        requirementsInput.focus();
        return;
    }
    
    if (requirements.length < 50) {
        alert('Please provide more detailed requirements (at least 50 characters) for a comprehensive design.');
        requirementsInput.focus();
        return;
    }
    
    try {
        const response = await makeAPIRequest('/api/design', { requirements });
        
        if (response.success) {
            displayDesignResults(response.design);
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('designResults')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            throw new Error(response.error || 'Failed to generate design');
        }
    } catch (error) {
        console.error('Design generation failed:', error);
        alert(error.message || 'Failed to generate high level design. Please try again.');
    }
}


function displayDesignResults(design) {
    const resultsDiv = document.getElementById('designResults');
    const contentDiv = document.getElementById('designContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = design;
        resultsDiv.classList.remove('hidden');
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
}

function copyDesignToClipboard() {
    const contentDiv = document.getElementById('designContent');
    if (!contentDiv) return;
    
    // Get text content without HTML
    const textContent = contentDiv.innerText || contentDiv.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textContent).then(() => {
            alert('Design copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(textContent);
        });
    } else {
        fallbackCopy(textContent);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Design copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

function exportDesignToPDF() {
    // For now, show a helpful message about PDF export
    alert('PDF export feature coming soon! Use "Copy to Clipboard" to save the content for now.');
}

// Design Tools Navigation Functions
function showToolSelection() {
    // Hide generator sections
    document.getElementById('highLevelDesignSection')?.classList.add('hidden');
    document.getElementById('erdGeneratorSection')?.classList.add('hidden');
    document.getElementById('lowLevelDiagramSection')?.classList.add('hidden');
    document.getElementById('websiteStructureSection')?.classList.add('hidden');
    
    // Show tool selection grid
    document.querySelector('.design-tools-grid')?.classList.remove('hidden');
}

function showHighLevelDesignGenerator() {
    // Hide tool selection and other generators
    document.querySelector('.design-tools-grid')?.classList.add('hidden');
    document.getElementById('erdGeneratorSection')?.classList.add('hidden');
    document.getElementById('lowLevelDiagramSection')?.classList.add('hidden');
    document.getElementById('websiteStructureSection')?.classList.add('hidden');
    
    // Show high level design generator
    document.getElementById('highLevelDesignSection')?.classList.remove('hidden');
    
    // Focus input
    document.getElementById('requirementsInput')?.focus();
}

function showERDGenerator() {
    // Hide tool selection and other generators
    document.querySelector('.design-tools-grid')?.classList.add('hidden');
    document.getElementById('highLevelDesignSection')?.classList.add('hidden');
    document.getElementById('lowLevelDiagramSection')?.classList.add('hidden');
    document.getElementById('websiteStructureSection')?.classList.add('hidden');
    
    // Show ERD generator
    document.getElementById('erdGeneratorSection')?.classList.remove('hidden');
    
    // Focus input
    document.getElementById('erdInput')?.focus();
}

function showLowLevelDiagramGenerator() {
    // Hide tool selection and other generators
    document.querySelector('.design-tools-grid')?.classList.add('hidden');
    document.getElementById('highLevelDesignSection')?.classList.add('hidden');
    document.getElementById('erdGeneratorSection')?.classList.add('hidden');
    document.getElementById('websiteStructureSection')?.classList.add('hidden');
    
    // Show low level diagram generator
    document.getElementById('lowLevelDiagramSection')?.classList.remove('hidden');
    
    // Focus input
    document.getElementById('lowLevelInput')?.focus();
}

function showWebsiteStructureGenerator() {
    // Hide tool selection and other generators
    document.querySelector('.design-tools-grid')?.classList.add('hidden');
    document.getElementById('highLevelDesignSection')?.classList.add('hidden');
    document.getElementById('erdGeneratorSection')?.classList.add('hidden');
    document.getElementById('lowLevelDiagramSection')?.classList.add('hidden');
    
    // Show website structure generator
    document.getElementById('websiteStructureSection')?.classList.remove('hidden');
    
    // Focus input
    document.getElementById('websiteStructureInput')?.focus();
}

// ERD Generator Functions
async function generateERD() {
    const erdInput = document.getElementById('erdInput');
    const generateButton = document.getElementById('generateERDButton');
    
    if (!erdInput || !generateButton) {
        console.error('Required ERD elements not found');
        return;
    }
    
    const requirements = erdInput.value.trim();
    
    if (!requirements) {
        alert('Please describe your data requirements to generate an Entity-Relationship Diagram.');
        erdInput.focus();
        return;
    }
    
    if (requirements.length < 50) {
        alert('Please provide more detailed data requirements (at least 50 characters) for a comprehensive ERD.');
        erdInput.focus();
        return;
    }
    
    try {
        const response = await makeAPIRequest('/api/erd', { requirements });
        
        if (response.success) {
            displayERDResults(response.erd);
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('erdResults')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            throw new Error(response.error || 'Failed to generate ERD');
        }
    } catch (error) {
        console.error('ERD generation failed:', error);
        alert(error.message || 'Failed to generate Entity-Relationship Diagram. Please try again.');
    }
}

function displayERDResults(erd) {
    const resultsDiv = document.getElementById('erdResults');
    const contentDiv = document.getElementById('erdContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = erd;
        resultsDiv.classList.remove('hidden');
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
}

function copyERDToClipboard() {
    const contentDiv = document.getElementById('erdContent');
    if (!contentDiv) return;
    
    // Get text content without HTML
    const textContent = contentDiv.innerText || contentDiv.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textContent).then(() => {
            alert('ERD copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyERD(textContent);
        });
    } else {
        fallbackCopyERD(textContent);
    }
}

function fallbackCopyERD(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('ERD copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

function exportERDToPDF() {
    // For now, show a helpful message about PDF export
    alert('PDF export feature coming soon! Use "Copy to Clipboard" to save the content for now.');
}

// Low Level Diagram Generator Functions
async function generateLowLevelDiagram() {
    const lowLevelInput = document.getElementById('lowLevelInput');
    const generateButton = document.getElementById('generateLowLevelButton');
    
    if (!lowLevelInput || !generateButton) {
        console.error('Required Low Level Diagram elements not found');
        return;
    }
    
    const requirements = lowLevelInput.value.trim();
    
    if (!requirements) {
        alert('Please describe your system design or module specifications to generate low-level diagrams.');
        lowLevelInput.focus();
        return;
    }
    
    if (requirements.length < 50) {
        alert('Please provide more detailed specifications (at least 50 characters) for comprehensive low-level diagrams.');
        lowLevelInput.focus();
        return;
    }
    
    try {
        const response = await makeAPIRequest('/api/lowlevel', { requirements });
        
        if (response.success) {
            displayLowLevelResults(response.diagrams);
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('lowLevelResults')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            throw new Error(response.error || 'Failed to generate low level diagrams');
        }
    } catch (error) {
        console.error('Low level diagram generation failed:', error);
        alert(error.message || 'Failed to generate low-level diagrams. Please try again.');
    }
}

function displayLowLevelResults(diagrams) {
    const resultsDiv = document.getElementById('lowLevelResults');
    const contentDiv = document.getElementById('lowLevelContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = diagrams;
        resultsDiv.classList.remove('hidden');
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
}

function copyLowLevelToClipboard() {
    const contentDiv = document.getElementById('lowLevelContent');
    if (!contentDiv) return;
    
    // Get text content without HTML
    const textContent = contentDiv.innerText || contentDiv.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textContent).then(() => {
            alert('Low level diagrams copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyLowLevel(textContent);
        });
    } else {
        fallbackCopyLowLevel(textContent);
    }
}

function fallbackCopyLowLevel(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Low level diagrams copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

function exportLowLevelToPDF() {
    // For now, show a helpful message about PDF export
    alert('PDF export feature coming soon! Use "Copy to Clipboard" to save the content for now.');
}

// Website Structure Generator Functions
async function generateWebsiteStructure() {
    const websiteStructureInput = document.getElementById('websiteStructureInput');
    const generateButton = document.getElementById('generateWebsiteStructureButton');
    
    if (!websiteStructureInput || !generateButton) {
        console.error('Required Website Structure elements not found');
        return;
    }
    
    const concept = websiteStructureInput.value.trim();
    
    if (!concept) {
        alert('Please describe your website concept to generate a project structure.');
        websiteStructureInput.focus();
        return;
    }
    
    if (concept.length < 30) {
        alert('Please provide more details about your website concept (at least 30 characters) for a comprehensive structure.');
        websiteStructureInput.focus();
        return;
    }
    
    try {
        const response = await makeAPIRequest('/api/website-structure', { concept });
        
        if (response.success) {
            displayWebsiteStructureResults(response.structure);
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('websiteStructureResults')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            throw new Error(response.error || 'Failed to generate website structure');
        }
    } catch (error) {
        console.error('Website structure generation failed:', error);
        alert(error.message || 'Failed to generate website structure. Please try again.');
    }
}

function displayWebsiteStructureResults(structure) {
    const resultsDiv = document.getElementById('websiteStructureResults');
    const contentDiv = document.getElementById('websiteStructureContent');
    
    if (resultsDiv && contentDiv) {
        contentDiv.innerHTML = structure;
        resultsDiv.classList.remove('hidden');
        
        // Update Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
}

function copyWebsiteStructureToClipboard() {
    const contentDiv = document.getElementById('websiteStructureContent');
    if (!contentDiv) return;
    
    // Get text content without HTML
    const textContent = contentDiv.innerText || contentDiv.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textContent).then(() => {
            alert('Website structure copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyWebsiteStructure(textContent);
        });
    } else {
        fallbackCopyWebsiteStructure(textContent);
    }
}

function fallbackCopyWebsiteStructure(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Website structure copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

function exportWebsiteStructureToPDF() {
    // For now, show a helpful message about PDF export
    alert('PDF export feature coming soon! Use "Copy to Clipboard" to save the content for now.');
}

// Design Tools Navigation - Global exposure for onclick handlers
window.showToolSelection = showToolSelection;
window.showHighLevelDesignGenerator = showHighLevelDesignGenerator;
window.showERDGenerator = showERDGenerator;
window.showLowLevelDiagramGenerator = showLowLevelDiagramGenerator;
window.showWebsiteStructureGenerator = showWebsiteStructureGenerator;

// Design Tools Functions - Global exposure for onclick handlers
window.generateHighLevelDesign = generateHighLevelDesign;
window.generateERD = generateERD;
window.generateLowLevelDiagram = generateLowLevelDiagram;
window.generateWebsiteStructure = generateWebsiteStructure;

// Export Functions - Global exposure for onclick handlers
window.exportDesignToPDF = exportDesignToPDF;
window.copyDesignToClipboard = copyDesignToClipboard;
window.exportERDToPDF = exportERDToPDF;
window.copyERDToClipboard = copyERDToClipboard;
window.exportLowLevelToPDF = exportLowLevelToPDF;
window.copyLowLevelToClipboard = copyLowLevelToClipboard;
window.exportWebsiteStructureToPDF = exportWebsiteStructureToPDF;
window.copyWebsiteStructureToClipboard = copyWebsiteStructureToClipboard;