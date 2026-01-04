// Configuration OpenWeatherMap API
const API_KEY = 'ce9a3b93307a25a9370e33e779f60b56';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Récupère les données météo actuelles d'une ville
 * @param {string} city - Nom de la ville
 * @param {string} country - Code du pays (optionnel)
 * @returns {Promise<Object>} Données météo
 */
async function getCurrentWeather(city, country = '') {
    try {
        const query = country ? `${city},${country}` : city;
        const response = await fetch(
            `${BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric&lang=fr`
        );

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return parseWeatherData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
        return null;
    }
}

/**
 * Récupère la météo par coordonnées GPS
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Données météo
 */
async function getWeatherByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
        );

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        return parseWeatherData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération par coordonnées:', error);
        return null;
    }
}

/**
 * Récupère la prévision sur 5 jours
 * @param {string} city - Nom de la ville
 * @param {string} country - Code du pays (optionnel)
 * @returns {Promise<Array>} Tableau des prévisions
 */
async function getForecast(city, country = '') {
    try {
        const query = country ? `${city},${country}` : city;
        const response = await fetch(
            `${BASE_URL}/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=fr`
        );

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        return parseForecastData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération de la prévision:', error);
        return [];
    }
}

/**
 * Recherche les villes correspondant à une requête
 * @param {string} query - Terme de recherche
 * @returns {Promise<Array>} Tableau des villes trouvées
 */
async function searchCities(query) {
    try {
        const response = await fetch(
            `${BASE_URL}/find?q=${query}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        return data.list.map(city => ({
            name: city.name,
            country: city.sys.country,
            lat: city.coord.lat,
            lon: city.coord.lon
        }));
    } catch (error) {
        console.error('Erreur lors de la recherche de villes:', error);
        return [];
    }
}

/**
 * Parse les données météo actuelles
 * @param {Object} data - Données brutes de l'API
 * @returns {Object} Données formatées
 */
function parseWeatherData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        windDeg: data.wind.deg,
        clouds: data.clouds.all,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        main: data.weather[0].main,
        visibility: (data.visibility / 1000).toFixed(1),
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        timezone: data.timezone
    };
}

/**
 * Parse les données de prévision
 * @param {Object} data - Données brutes de l'API
 * @returns {Array} Tableau des prévisions formatées
 */
function parseForecastData(data) {
    const forecasts = [];
    const seenDates = new Set();

    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('fr-FR');
        
        if (!seenDates.has(date)) {
            seenDates.add(date);
            forecasts.push({
                date: date,
                timestamp: forecast.dt,
                tempMin: Math.round(forecast.main.temp_min),
                tempMax: Math.round(forecast.main.temp_max),
                description: forecast.weather[0].description,
                icon: forecast.weather[0].icon,
                humidity: forecast.main.humidity,
                windSpeed: Math.round(forecast.wind.speed * 3.6)
            });
        }
    });

    return forecasts;
}

/**
 * Convertit le code d'icône OpenWeatherMap en emoji
 * @param {string} iconCode - Code d'icône API
 * @returns {string} Emoji correspondant
 */
function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️',  // clear sky day
        '01n': '🌙',  // clear sky night
        '02d': '🌤️',  // few clouds day
        '02n': '🌤️',  // few clouds night
        '03d': '⛅',  // scattered clouds day
        '03n': '⛅',  // scattered clouds night
        '04d': '☁️',  // broken clouds day
        '04n': '☁️',  // broken clouds night
        '09d': '🌧️',  // shower rain day
        '09n': '🌧️',  // shower rain night
        '10d': '🌦️',  // rain day
        '10n': '🌧️',  // rain night
        '11d': '🌩️',  // thunderstorm day
        '11n': '🌩️',  // thunderstorm night
        '13d': '❄️',  // snow day
        '13n': '❄️',  // snow night
        '50d': '🌫️',  // mist day
        '50n': '🌫️'   // mist night
    };
    return emojiMap[iconCode] || '🌡️';
}

/**
 * Formate l'heure de lever/coucher du soleil
 * @param {Date} date - Date du lever/coucher
 * @returns {string} Heure formatée
 */
function formatTime(date) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentWeather,
        getWeatherByCoordinates,
        getForecast,
        searchCities,
        getWeatherEmoji,
        formatTime
    };
}
