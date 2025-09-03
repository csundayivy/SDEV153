// Dashboard functionality for authentication and user management

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Wait for Lucide to be available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }
    
    // Check authentication status
    checkAuthentication();
    
    // Set up logout functionality
    setupLogout();
    
    // Load user information
    loadUserInfo();
    
    // Setup sidebar functionality
    setupSidebarFunctionality();
    
    // Setup navigation functionality
    setupNavigationFunctionality();
}

function checkAuthentication() {
    const user = localStorage.getItem('preppy_user');
    const token = localStorage.getItem('preppy_auth_token');
    
    if (!user || !token) {
        // User is not authenticated, redirect to login
        showAuthError('Please log in to access the dashboard.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        if (!userData.isAuthenticated) {
            // User data exists but not authenticated
            showAuthError('Your session has expired. Please log in again.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error parsing user data:', error);
        showAuthError('Invalid user data. Please log in again.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
}

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
            
            // Update page title with user's name
            if (userData.fullName) {
                document.title = `Welcome ${userData.fullName} - Preppy Dashboard`;
            }
            
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Show confirmation
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

function logout() {
    // Show loading state
    showLogoutLoading();
    
    // Simulate logout process
    setTimeout(() => {
        // Clear authentication data
        localStorage.removeItem('preppy_user');
        localStorage.removeItem('preppy_auth_token');
        
        // Show success message
        showLogoutSuccess();
        
        // Redirect to landing page after a short delay
        setTimeout(() => {
            window.location.href = 'landing.html';
        }, 1500);
        
    }, 1000);
}

function showAuthError(message) {
    // Create error overlay
    const overlay = document.createElement('div');
    overlay.className = 'auth-error-overlay';
    overlay.innerHTML = `
        <div class="auth-error-content">
            <div class="error-icon">
                <i data-lucide="alert-circle"></i>
            </div>
            <h2>Authentication Required</h2>
            <p>${message}</p>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Re-initialize icons
    lucide.createIcons();
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
        
        // Re-initialize icons
        lucide.createIcons();
    }
}

// Auto-refresh authentication status every 5 minutes
setInterval(() => {
    if (!checkAuthentication()) {
        // Authentication failed, stop the interval
        clearInterval();
    }
}, 5 * 60 * 1000);

// Check authentication on page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        checkAuthentication();
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function() {
    checkAuthentication();
});

// Sidebar functionality for dashboard
function setupSidebarFunctionality() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!sidebar || !sidebarToggle) return;
    
    // Load saved sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    let sidebarCollapsed = savedState === 'true';
    
    // Apply initial state
    if (sidebarCollapsed && window.innerWidth >= 768) {
        sidebar.classList.add('collapsed');
    }
    
    // Desktop sidebar toggle functionality
    sidebarToggle.addEventListener('click', function() {
        if (window.innerWidth >= 768) {
            sidebarCollapsed = !sidebarCollapsed;
            sidebar.classList.toggle('collapsed', sidebarCollapsed);
            localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
            
            // Update toggle icon
            const icon = sidebarToggle.querySelector('i');
            if (sidebarCollapsed) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'chevron-left');
            }
            
            // Reinitialize icons
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 10);
        }
    });
    
    // Mobile menu functionality
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.add('mobile-open');
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu when overlay is clicked
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('mobile-open');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
            
            // Restore desktop collapsed state
            sidebar.classList.toggle('collapsed', sidebarCollapsed);
        } else {
            sidebar.classList.remove('collapsed');
        }
    });
}

// Navigation functionality for dashboard
function setupNavigationFunctionality() {
    const navItems = document.querySelectorAll('.nav-item');
    const sdlcActionCards = document.querySelectorAll('.sdlc-action-card');
    
    // Handle navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Let the default link behavior handle navigation
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Close mobile sidebar if open
                const sidebar = document.getElementById('sidebar');
                const sidebarOverlay = document.getElementById('sidebarOverlay');
                
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    sidebar.classList.remove('mobile-open');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('active');
                    }
                    document.body.style.overflow = '';
                }
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Handle SDLC action card clicks
    sdlcActionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}