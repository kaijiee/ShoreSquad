# ShoreSquad 🌊

Rally your crew, track weather, and join beach cleanups in Singapore! ShoreSquad is a web application that helps organize and coordinate beach cleanup events while providing real-time weather information.

## Features

- 🗺️ Interactive map showing Singapore beach locations
- ⛅ Real-time weather information including:
  - Temperature
  - Humidity
  - Wind speed
  - "Feels like" temperature
- 🏖️ Detailed beach information
- 📱 Responsive design for all devices

## Live Demo

Visit our website: [ShoreSquad](https://kaijiee.github.io/ShoreSquad)

## Getting Started

### Prerequisites

- A modern web browser
- An OpenWeatherMap API key (for weather data)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kaijiee/ShoreSquad.git
```

2. Create a free account at [OpenWeatherMap](https://openweathermap.org/api) and get your API key

3. Update the `js/config.js` file with your API key:
```javascript
const CONFIG = {
    WEATHER_API_KEY: 'your_api_key_here',
    // ... rest of the config
};
```

4. Open `index.html` in your browser or use a local server

### Development

For local development, we recommend using Visual Studio Code with the Live Server extension:
1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Right-click on `index.html` and select "Open with Live Server"

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [OpenStreetMap](https://www.openstreetmap.org/) & [Leaflet.js](https://leafletjs.com/) for mapping
- [OpenWeatherMap API](https://openweathermap.org/api) for weather data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [@kaijiee](https://github.com/kaijiee)

## Acknowledgments

- OpenStreetMap contributors
- OpenWeatherMap for weather data
- Leaflet.js team
