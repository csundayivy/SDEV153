// Authentication functionality for signup and login pages

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set up form handlers
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check for URL parameters (for demo purposes)
    checkUrlParams();
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Pre-fill forms with URL parameters if they exist (for demo)
    if (urlParams.has('email')) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = urlParams.get('email');
        }
    }
    
    if (urlParams.has('password')) {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.value = urlParams.get('password');
        }
    }
    
    if (urlParams.has('fullName')) {
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) {
            fullNameInput.value = urlParams.get('fullName');
        }
    }
    
    // Auto-submit if parameters are present (for demo)
    if (urlParams.has('email') && urlParams.has('password')) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html')) {
            setTimeout(() => {
                handleLogin({ preventDefault: () => {} });
            }, 500);
        } else if (currentPath.includes('signup.html') && urlParams.has('fullName')) {
            setTimeout(() => {
                handleSignup({ preventDefault: () => {} });
            }, 500);
        }
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validate form
    const validation = validateSignupForm(fullName, email, password, confirmPassword, terms);
    
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    // Show loading state
    showLoading('Creating your account...');
    
    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
        // Store user data in localStorage for demo
        const userData = {
            fullName: fullName,
            email: email,
            password: password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            isAuthenticated: true
        };
        
        localStorage.setItem('preppy_user', JSON.stringify(userData));
        localStorage.setItem('preppy_auth_token', 'demo_token_' + Date.now());
        
        // Show success message
        showSuccess('Account created successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    }, 2000); // Simulate network delay
}

function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate form
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    // Show loading state
    showLoading('Signing you in...');
    
    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
        // Check if user exists in localStorage (for demo)
        const existingUser = localStorage.getItem('preppy_user');
        
        if (existingUser) {
            const userData = JSON.parse(existingUser);
            
            // Simple password check (in real app, this would be server-side)
            if (userData.email === email && userData.password === password) {
                // Update authentication status
                userData.isAuthenticated = true;
                userData.lastLogin = new Date().toISOString();
                localStorage.setItem('preppy_user', JSON.stringify(userData));
                localStorage.setItem('preppy_auth_token', 'demo_token_' + Date.now());
                
                // Show success message
                showSuccess('Welcome back! Redirecting to dashboard...');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                showError('Invalid email or password. Please try again.');
            }
        } else {
            // For demo purposes, create a new user if they don't exist
            const userData = {
                fullName: email.split('@')[0], // Use email prefix as name
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isAuthenticated: true
            };
            
            localStorage.setItem('preppy_user', JSON.stringify(userData));
            localStorage.setItem('preppy_auth_token', 'demo_token_' + Date.now());
            
            showSuccess('Welcome! Redirecting to dashboard...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
        
    }, 1500); // Simulate network delay
}

function validateSignupForm(fullName, email, password, confirmPassword, terms) {
    if (!fullName || fullName.trim().length < 2) {
        return { isValid: false, message: 'Please enter a valid full name (at least 2 characters).' };
    }
    
    if (!email || !isValidEmail(email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!password || password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long.' };
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match.' };
    }
    
    if (!terms) {
        return { isValid: false, message: 'Please accept the Terms of Service and Privacy Policy.' };
    }
    
    return { isValid: true };
}

function validateLoginForm(email, password) {
    if (!email || !isValidEmail(email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!password || password.length < 1) {
        return { isValid: false, message: 'Please enter your password.' };
    }
    
    return { isValid: true };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading(message) {
    // Remove any existing alerts
    removeExistingAlerts();
    
    // Create loading alert
    const alert = document.createElement('div');
    alert.className = 'auth-alert auth-alert-loading';
    alert.innerHTML = `
        <div class="alert-content">
            <div class="loading-spinner"></div>
            <span>${message}</span>
        </div>
    `;
    
    // Insert at the top of the auth container
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(alert, authContainer.firstChild);
    
    // Disable form submission
    const submitButton = document.querySelector('.btn-primary');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
    }
}

function showSuccess(message) {
    removeExistingAlerts();
    
    const alert = document.createElement('div');
    alert.className = 'auth-alert auth-alert-success';
    alert.innerHTML = `
        <div class="alert-content">
            <i data-lucide="check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(alert, authContainer.firstChild);
    
    // Re-initialize icons
    lucide.createIcons();
}

function showError(message) {
    removeExistingAlerts();
    
    const alert = document.createElement('div');
    alert.className = 'auth-alert auth-alert-error';
    alert.innerHTML = `
        <div class="alert-content">
            <i data-lucide="alert-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(alert, authContainer.firstChild);
    
    // Re-enable form submission
    const submitButton = document.querySelector('.btn-primary');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
    
    // Re-initialize icons
    lucide.createIcons();
}

function removeExistingAlerts() {
    const existingAlerts = document.querySelectorAll('.auth-alert');
    existingAlerts.forEach(alert => alert.remove());
}

// Check authentication status on page load
function checkAuthStatus() {
    const user = localStorage.getItem('preppy_user');
    const token = localStorage.getItem('preppy_auth_token');
    
    if (user && token) {
        const userData = JSON.parse(user);
        if (userData.isAuthenticated) {
            // User is already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }
}

// Call checkAuthStatus when the page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);