// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure CONFIG is loaded
    setTimeout(() => {
        console.log('Checking configuration...');
        if (typeof CONFIG === 'undefined') {
            console.error('Configuration not loaded. Please check if config.js is loaded properly.');
            document.body.innerHTML += '<div style="color: red; padding: 20px;">Error: Configuration not loaded. Check console for details.</div>';
            return;
        }
        console.log('Configuration loaded:', CONFIG);
        initializeApp();
    }, 500);
});

async function initializeApp() {
    try {
        console.log('Initializing app with config:', CONFIG);
        
        // Initialize map
        initializeMap();
        
        // Initialize weather updates
        await updateWeatherPreviews();
        // Update weather every 30 minutes
        setInterval(updateWeatherPreviews, 30 * 60 * 1000);

        // Add smooth scrolling for navigation
        addSmoothScrolling();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
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
    console.log('Updating weather previews...');
    // Check if API key is configured
    if (!CONFIG.WEATHER_API_KEY || CONFIG.WEATHER_API_KEY === 'your_openweathermap_api_key') {
        console.error('Weather API key not configured or invalid');
        for (const locationId of Object.keys(CONFIG.BEACHES)) {
            showWeatherError(locationId, 'Weather API key not configured');
        }
        return;
    }
    console.log('Weather API key found:', CONFIG.WEATHER_API_KEY);

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
    try {
        console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
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
            <div class="weather-info">
                <div class="loading-indicator">
                    Loading weather data
                </div>
            </div>
        `;
    }
}

function initializeMap() {
    try {
        console.log('Initializing map...');
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error('Map container not found');
            showMapError('Map container not found');
            return;
        }
        
        // Show loading state
        mapContainer.innerHTML = '<div class="loading-indicator">Loading map</div>';
        
        // Check if CONFIG is defined
        if (typeof CONFIG === 'undefined') {
            console.error('Configuration not loaded');
            showMapError('Configuration not loaded. Please check config.js is present.');
            return;
        }
        
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded');
            showMapError('Map library not loaded. Please check your internet connection.');
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
        showMapError(error.message);
    }
}

function showMapError(message) {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.innerHTML = `<div class="map-error">${message}</div>`;
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
