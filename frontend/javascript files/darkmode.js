function toggleDarkMode() {
    // Toggle dark mode class on the body element
    document.body.classList.toggle('dark-mode');

    // Store dark mode state in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Change logo image based on dark mode state
    const logo = document.getElementById('logo');
    logo.src = isDarkMode ? 'Photos/logoPink-dark.png' : 'Photos/logoPink.png';
}

// Add event listener to dark mode toggle checkbox
const darkModeToggle = document.getElementById("darkmode");
darkModeToggle.addEventListener("change", function() {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    localStorage.setItem('darkMode', darkModeToggle.checked);

    // Change logo image based on dark mode state
    const logo = document.getElementById('logo');
    logo.src = darkModeToggle.checked ? 'Photos/logoPink-dark.png' : 'Photos/logoPink.png';
});

// Function to apply dark mode based on stored state
function applyDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true; // Update checkbox state
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.checked = false; // Update checkbox state
    }

    // Change logo image based on dark mode state
    const logo = document.getElementById('logo');
    logo.src = isDarkMode ? 'Photos/logoPink-dark.png' : 'Photos/logoPink.png';
}

// Apply dark mode when the page loads
applyDarkMode();
