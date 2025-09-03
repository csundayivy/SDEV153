// SDLC Pages Functionality - Shared functions for all SDLC phase pages
// This file provides common functionality for all SDLC phase pages

// Wait for both DOM and Lucide to be ready
function waitForLucide(callback) {
    if (typeof lucide !== 'undefined') {
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
    // Initialize Lucide icons
    lucide.createIcons();
    
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
        if (!mobileMenuBtn.hasAttribute('data-mobile-listener')) {
            mobileMenuBtn.setAttribute('data-mobile-listener', 'true');
            mobileMenuBtn.addEventListener('click', () => {
                toggleMobileSidebar(sidebar, sidebarOverlay);
            });
        }
        
        if (!sidebarOverlay.hasAttribute('data-overlay-listener')) {
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
    // Add navigation link functionality
    const navLinks = sidebar.querySelectorAll('.nav-item[href], a.nav-item');
    
    navLinks.forEach(link => {
        // Only add event listener if link doesn't already have one
        if (!link.hasAttribute('data-nav-listener')) {
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
                link.style.backgroundColor = 'var(--primary-light)';
                setTimeout(() => {
                    link.style.backgroundColor = '';
                }, 200);
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
        if (!sidebarToggle.hasAttribute('data-toggle-listener')) {
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
    if (!document.hasAttribute('data-keyboard-listener')) {
        document.setAttribute('data-keyboard-listener', 'true');
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
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
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
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ concept })
        });
        
        const result = await response.json();
        
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

// Generic content generation
async function handleGenericGenerate(type) {
    const input = document.getElementById(`${type}Input`) || document.getElementById('projectInput');
    if (!input || !input.value.trim()) return;
    
    const prompt = input.value.trim();
    setLoadingState(true);
    hideAlerts();
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, type })
        });
        
        const result = await response.json();
        
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
    
    if (logoutBtn && !logoutBtn.hasAttribute('data-logout-listener')) {
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