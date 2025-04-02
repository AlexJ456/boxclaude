// Settings management for Box Breathing App

// Default settings
const defaultSettings = {
    phaseDuration: 4, // seconds
    timeLimit: 0, // 0 means no limit; otherwise in minutes
};

// Load settings from localStorage or use defaults
let settings = JSON.parse(localStorage.getItem('boxBreathingSettings')) || { ...defaultSettings };

// DOM elements
const phaseDurationSlider = document.getElementById('phaseDuration');
const durationValueDisplay = document.getElementById('durationValue');
const timeButtons = document.querySelectorAll('.time-button');
const customMinutesInput = document.getElementById('customMinutes');
const setCustomButton = document.getElementById('setCustom');
const startButton = document.getElementById('startButton');

// Initialize UI with current settings
function initializeSettings() {
    // Set phase duration slider
    phaseDurationSlider.value = settings.phaseDuration;
    durationValueDisplay.textContent = `${settings.phaseDuration} seconds`;
    
    // Set active time button
    timeButtons.forEach(button => {
        button.classList.remove('active');
        
        if (button.id === 'twoMin' && settings.timeLimit === 2) {
            button.classList.add('active');
        } else if (button.id === 'fiveMin' && settings.timeLimit === 5) {
            button.classList.add('active');
        } else if (button.id === 'tenMin' && settings.timeLimit === 10) {
            button.classList.add('active');
        } else if (button.id === 'noLimit' && settings.timeLimit === 0) {
            button.classList.add('active');
        }
    });
    
    // Clear custom input value
    customMinutesInput.value = '';
}

// Event Listeners
function setupEventListeners() {
    // Phase duration slider
    phaseDurationSlider.addEventListener('input', () => {
        const value = phaseDurationSlider.value;
        durationValueDisplay.textContent = `${value} seconds`;
        settings.phaseDuration = parseInt(value);
        saveSettings();
    });
    
    // Time limit buttons
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            if (button.id === 'twoMin') {
                settings.timeLimit = 2;
            } else if (button.id === 'fiveMin') {
                settings.timeLimit = 5;
            } else if (button.id === 'tenMin') {
                settings.timeLimit = 10;
            } else if (button.id === 'noLimit') {
                settings.timeLimit = 0;
            }
            
            saveSettings();
        });
    });
    
    // Custom time limit
    setCustomButton.addEventListener('click', () => {
        const customMinutes = parseInt(customMinutesInput.value);
        if (customMinutes && customMinutes > 0 && customMinutes <= 60) {
            timeButtons.forEach(b => b.classList.remove('active'));
            settings.timeLimit = customMinutes;
            saveSettings();
        } else {
            // Shake animation for invalid input
            customMinutesInput.classList.add('shake');
            setTimeout(() => {
                customMinutesInput.classList.remove('shake');
            }, 500);
        }
    });
    
    // Start button
    startButton.addEventListener('click', () => {
        saveSettings();
        window.location.href = 'exercise.html';
    });
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('boxBreathingSettings', JSON.stringify(settings));
}

// Initialize the settings page
function init() {
    initializeSettings();
    setupEventListeners();
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
