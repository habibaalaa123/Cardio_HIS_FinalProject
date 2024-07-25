// Function to toggle dark mode
function toggleDarkMode() {
    // Toggle dark mode class on the body element
    const isDarkMode = document.body.classList.toggle('dark-mode');

    // Toggle image sources based on dark mode
    const images = [
        { id: 'phone-icon', light: 'Photos/phone-light.png', dark: 'Photos/phone-dark.png' },
        { id: 'working-hours-icon', light: 'Photos/clock-light.png', dark: 'Photos/clock-dark.png' },
        { id: 'location-icon', light: 'Photos/location-light.png', dark: 'Photos/location-dark.png' },
        { id: 'logo-icon', light: 'Photos/logoOrange-light.png', dark: 'Photos/logoOrange-dark.png' },
        { id: 'emergency-phone-icon', light: 'Photos/phone-orange-light.png', dark: 'Photos/phone-orange-dark.png' },
        { id: 'mail-icon', light: 'Photos/mail-orange-light.png', dark: 'Photos/mail-orange-dark.png' },
        { id: 'card-working-hours-icon', light: 'Photos/clock-orange-light.png', dark: 'Photos/clock-orange-dark.png' }
    ];

    images.forEach(image => {
        const imgElement = document.getElementById(image.id);
        const newSrc = isDarkMode ? image.dark : image.light;
        imgElement.src = newSrc;
    });

    // Store dark mode state in localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

// Add event listener to dark mode toggle checkbox
const darkModeToggle = document.getElementById("darkmode");
darkModeToggle.addEventListener("change", function() {
    // Toggle dark mode class on the body element
    const isDarkMode = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Toggle image sources based on dark mode
    const images = [
        { id: 'phone-icon', light: 'Photos/phone-light.png', dark: 'Photos/phone-dark.png' },
        { id: 'working-hours-icon', light: 'Photos/clock-light.png', dark: 'Photos/clock-dark.png' },
        { id: 'location-icon', light: 'Photos/location-light.png', dark: 'Photos/location-dark.png' },
        { id: 'logo-icon', light: 'Photos/logoOrange-light.png', dark: 'Photos/logoOrange-dark.png' },
        { id: 'emergency-phone-icon', light: 'Photos/phone-orange-light.png', dark: 'Photos/phone-orange-dark.png' },
       
        { id: 'mail-icon', light: 'Photos/mail-orange-light.png', dark: 'Photos/mail-orange-dark.png' },
        { id: 'card-working-hours-icon', light: 'Photos/clock-orange-light.png', dark: 'Photos/clock-orange-dark.png' }
    ];

    images.forEach(image => {
        const imgElement = document.getElementById(image.id);
        const newSrc = isDarkMode ? image.dark : image.light;
        imgElement.src = newSrc;
    });

    // Store dark mode state in localStorage
    localStorage.setItem('darkMode', isDarkMode);
});

// Function to apply dark mode based on stored state
function applyDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById("darkmode");

    // Apply dark mode class to body
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Update image sources based on dark mode
    const images = [
        { id: 'phone-icon', light: 'Photos/phone-light.png', dark: 'Photos/phone-dark.png' },
        { id: 'working-hours-icon', light: 'Photos/clock-light.png', dark: 'Photos/clock-dark.png' },
        { id: 'location-icon', light: 'Photos/location-light.png', dark: 'Photos/location-dark.png' },
        { id: 'logo-icon', light: 'Photos/logoOrange-light.png', dark: 'Photos/logoOrange-dark.png' },
        { id: 'emergency-phone-icon', light: 'Photos/phone-orange-light.png', dark: 'Photos/phone-orange-dark.png' },
      
        { id: 'mail-icon', light: 'Photos/mail-orange-light.png', dark: 'Photos/mail-orange-dark.png' },
        { id: 'card-working-hours-icon', light: 'Photos/clock-orange-light.png', dark: 'Photos/clock-orange-dark.png' }
    ];

    images.forEach(image => {
        const imgElement = document.getElementById(image.id);
        const newSrc = isDarkMode ? image.dark : image.light;
        imgElement.src = newSrc;
    });

    // Update dark mode toggle state
    darkModeToggle.checked = isDarkMode;
}

// Apply dark mode when the page loads
applyDarkMode();
