// Main app logic for Box Breathing App

// Check if the app is being loaded from a PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone || 
           document.referrer.includes('android-app://');
}

// Handle app installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default install prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show install button if we're not already in PWA mode
    if (!isPWA()) {
        showInstallButton();
    }
});

function showInstallButton() {
    // Could be implemented to show a custom install button
    console.log('App can be installed');
}

// Handle PWA installation
function installPWA() {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
    });
}

// Force a service worker update
function updateServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for(let registration of registrations) {
                registration.update();
            }
        });
    }
}

// Check for app updates
function checkForUpdates() {
    updateServiceWorker();
}

// Handle page visibility changes (for pausing/resuming timers)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // App became visible again - could resume timers if needed
    } else {
        // App is hidden - could pause timers if needed
    }
});

// Initialize the app
function initApp() {
    // Check for updates
    checkForUpdates();
    
    // Set up other app-wide functionality
}

// Run initialization when the window loads
window.addEventListener('load', initApp);
