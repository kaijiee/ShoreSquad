// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Initialize map
    initializeMap();
    
    // Initialize weather updates
    await updateWeatherPreviews();
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
    // Check if API key is configured
    if (!CONFIG.WEATHER_API_KEY || CONFIG.WEATHER_API_KEY === 'your_openweathermap_api_key') {
        for (const locationId of Object.keys(CONFIG.BEACHES)) {
            showWeatherError(locationId, 'Weather API key not configured');
        }
        return;
    }

    for (const [locationId, beachInfo] of Object.entries(CONFIG.BEACHES)) {
        try {
            showWeatherLoading(locationId);
            const weather = await fetchWeather(beachInfo.coordinates[0], beachInfo.coordinates[1]);
            updateWeatherUI(locationId, weather);
        } catch (error) {
            console.error(`Error fetching weather for ${beachInfo.name}:`, error);
            showWeatherError(locationId, 'Unable to fetch weather data');
        }
    }
}

async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
    }
    return await response.json();
}

function updateWeatherUI(locationId, weatherData) {
    const weatherElement = document.getElementById(`${locationId}-weather`);
    if (weatherElement) {
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        // Convert wind speed from m/s to km/h
        const windSpeedKmh = Math.round(weatherData.wind.speed * 3.6);
        
        weatherElement.innerHTML = `
            <div class="weather-info">
                <div class="weather-main">
                    <img src="${iconUrl}" alt="${weatherData.weather[0].description}">
                    <div class="weather-primary">
                        <div class="weather-temp">${Math.round(weatherData.main.temp)}°C</div>
                        <div class="weather-description">${weatherData.weather[0].description}</div>
                    </div>
                </div>
                <div class="weather-details-grid">
                    <div class="weather-detail">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${weatherData.main.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span class="detail-label">Wind</span>
                        <span class="detail-value">${windSpeedKmh} km/h</span>
                    </div>
                    <div class="weather-detail">
                        <span class="detail-label">Feels like</span>
                        <span class="detail-value">${Math.round(weatherData.main.feels_like)}°C</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function showWeatherError(locationId, message = 'Weather data unavailable') {
    const weatherElement = document.getElementById(`${locationId}-weather`);
    if (weatherElement) {
        weatherElement.innerHTML = `
            <div class="weather-info error">
                <p>${message}</p>
            </div>
        `;
    }
}

function showWeatherLoading(locationId) {
    const weatherElement = document.getElementById(`${locationId}-weather`);
    if (weatherElement) {
        weatherElement.innerHTML = `
            <div class="weather-info loading">
                <p>Loading weather data...</p>
            </div>
        `;
    }
}

function initializeMap() {
    try {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Initialize the map
        const map = L.map('map-container', {
            center: CONFIG.MAP_CENTER,
            zoom: 15,
            minZoom: 13,
            maxZoom: 18
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add markers for each beach
        for (const [locationId, beachInfo] of Object.entries(CONFIG.BEACHES)) {
            const marker = L.marker(beachInfo.coordinates)
                .addTo(map)
                .bindPopup(`
                    <strong>${beachInfo.name}</strong><br>
                    ${beachInfo.description}
                `);
                
            // Store marker reference for later updates
            beachInfo.marker = marker;
        }

        // Fit map bounds to show all markers
        const bounds = Object.values(CONFIG.BEACHES).map(beach => beach.coordinates);
        map.fitBounds(bounds);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.innerHTML = '<div class="map-error">Unable to load map</div>';
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
