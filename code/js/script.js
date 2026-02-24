// YapHub JavaScript
console.log('YapHub loaded');

// Navigation handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login button navigation
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'feed.html';
        });
    }

    // Signup form navigation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = 'feed.html';
        });
    }
});
