// Box Breathing Animation and Exercise Logic

// Get settings from localStorage
const settings = JSON.parse(localStorage.getItem('boxBreathingSettings')) || {
    phaseDuration: 4,
    timeLimit: 0
};

// DOM elements
const phaseNameElement = document.getElementById('phaseName');
const phaseTimerElement = document.getElementById('phaseTimer');
const totalTimeCounterElement = document.getElementById('totalTimeCounter');
const breathCircle = document.getElementById('breathCircle');
const endButton = document.getElementById('endButton');

// Exercise states
const phases = ['inhale', 'hold', 'exhale', 'wait'];
let currentPhase = 0; // 0: inhale, 1: hold, 2: exhale, 3: wait
let phaseTimeLeft = settings.phaseDuration;
let totalSeconds = 0;
let timerInterval;
let animationTimeout;
let endingExercise = false;

// Set CSS variable for animation durations
document.documentElement.style.setProperty('--phase-duration', `${settings.phaseDuration}s`);

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the phase timer display
function updatePhaseTimer() {
    phaseTimerElement.textContent = phaseTimeLeft;
    
    // Add highlight class when time is changing to next second
    if (phaseTimeLeft <= settings.phaseDuration && phaseTimeLeft > settings.phaseDuration - 0.2) {
        phaseNameElement.classList.add('highlight');
        phaseTimerElement.classList.add('highlight');
    } else {
        phaseNameElement.classList.remove('highlight');
        phaseTimerElement.classList.remove('highlight');
    }
}

// Update total time counter
function updateTotalTime() {
    totalTimeCounterElement.textContent = formatTime(totalSeconds);
}

// Check if the exercise should end based on time limit
function checkTimeLimit() {
    if (settings.timeLimit === 0) return false; // No time limit
    
    const timeLimit = settings.timeLimit * 60; // Convert minutes to seconds
    
    if (totalSeconds >= timeLimit) {
        if (!endingExercise) {
            endingExercise = true;
            
            // Continue until the next exhale is completed
            if (currentPhase === 2) { // If already in exhale phase
                // End after this exhale
                return false;
            } else {
                // Continue until next exhale
                return false;
            }
        } else {
            // If we've completed the exhale phase after passing the time limit
            if (currentPhase === 3) { // Just completed exhale, now at wait
                return true;
            }
        }
    }
    
    return false;
}

// Set the animation class based on current phase
function setAnimationClass() {
    breathCircle.className = 'breath-circle';
    
    switch(currentPhase) {
        case 0: // Inhale - move from bottom-left to top-left
            breathCircle.classList.add('inhale');
            break;
        case 1: // Hold - at top-left
            breathCircle.classList.add('hold-top');
            break;
        case 2: // Exhale - move from top-left to top-right
            breathCircle.classList.add('exhale');
            break;
        case 3: // Wait - at top-right
            breathCircle.classList.add('hold-right');
            break;
    }
}

// Update the phase name display
function updatePhaseName() {
    switch(currentPhase) {
        case 0:
            phaseNameElement.textContent = 'Inhale';
            break;
        case 1:
            phaseNameElement.textContent = 'Hold';
            break;
        case 2:
            phaseNameElement.textContent = 'Exhale';
            break;
        case 3:
            phaseNameElement.textContent = 'Wait';
            break;
    }
}

// Advance to the next phase
function nextPhase() {
    currentPhase = (currentPhase + 1) % 4;
    phaseTimeLeft = settings.phaseDuration;
    updatePhaseName();
    updatePhaseTimer();
    setAnimationClass();
    
    // Check if exercise should end
    if (checkTimeLimit() && currentPhase === 0) { // If we've just completed a cycle
        endExercise();
        return;
    }
    
    // Schedule the next phase
    animationTimeout = setTimeout(nextPhase, settings.phaseDuration * 1000);
}

// Start the exercise
function startExercise() {
    // Set initial phase (inhale)
    currentPhase = 0;
    phaseTimeLeft = settings.phaseDuration;
    updatePhaseName();
    updatePhaseTimer();
    setAnimationClass();
    
    // Start the timer that ticks every 100ms for smooth countdown
    timerInterval = setInterval(() => {
        // Update phase timer
        phaseTimeLeft -= 0.1;
        if (phaseTimeLeft < 0) phaseTimeLeft = 0;
        updatePhaseTimer();
        
        // Update total time every second
        if (Math.round(phaseTimeLeft * 10) % 10 === 0) {
            totalSeconds++;
            updateTotalTime();
        }
    }, 100);
    
    // Schedule the first phase transition
    animationTimeout = setTimeout(nextPhase, settings.phaseDuration * 1000);
}

// End the exercise and return to home
function endExercise() {
    clearInterval(timerInterval);
    clearTimeout(animationTimeout);
    
    // Add ending animation if needed
    
    // Return to homepage after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Initialize the exercise page
function init() {
    // Set up the end button event listener
    endButton.addEventListener('click', endExercise);
    
    // Start the exercise
    startExercise();
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
