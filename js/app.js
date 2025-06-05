// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Initialize weather updates
    updateWeatherPreviews();
    // Update weather every 30 minutes
    setInterval(updateWeatherPreviews, 30 * 60 * 1000);

    // Add smooth scrolling for navigation
    addSmoothScrolling();
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

async function updateWeatherPreviews() {
    const locations = {
        'siloso': { lat: 1.2580, lon: 103.8190 },
        'palawan': { lat: 1.2494, lon: 103.8303 }
    };

    // TODO: Implement actual weather API integration
    // For now, we'll use placeholder data
    for (const [locationName, coords] of Object.entries(locations)) {
        const weatherElement = document.getElementById(`${locationName}-weather`);
        if (weatherElement) {
            weatherElement.innerHTML = `
                <div class="weather-info">
                    <p>Loading weather data...</p>
                </div>
            `;
        }
    }
}

// Animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.location-card').forEach((card) => {
    observer.observe(card);
});
