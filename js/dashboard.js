// Dashboard functionality for authentication and user management

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Check authentication status
    checkAuthentication();
    
    // Set up logout functionality
    setupLogout();
    
    // Load user information
    loadUserInfo();
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