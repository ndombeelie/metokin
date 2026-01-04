// Variables globales
let currentCity = 'Paris';
let currentCountry = 'FR';

// Mapping des noms de pays et codes courts en codes ISO
const countryCodeMap = {
    'FR': 'FR', 'France': 'FR',
    'GB': 'GB', 'UK': 'GB', 'Royaume-Uni': 'GB', 'United Kingdom': 'GB',
    'US': 'US', 'États-Unis': 'US', 'United States': 'US',
    'JP': 'JP', 'Japon': 'JP', 'Japan': 'JP',
    'MA': 'MA', 'Maroc': 'MA', 'Morocco': 'MA',
    'CA': 'CA', 'Canada': 'CA'
};

// Convertit un code de pays ISO en emoji drapeau
function getCountryFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// Normalise le code de pays en code ISO à 2 lettres
function normalizeCountryCode(country) {
    return countryCodeMap[country] || country.toUpperCase().substring(0, 2);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    // Charge la dernière ville visionnée ou Paris par défaut
    const lastCity = localStorage.getItem('lastCity') || 'Paris';
    const lastCountry = localStorage.getItem('lastCountry') || 'FR';
    
    // Affiche le drapeau initial
    const flag = getCountryFlag(lastCountry);
    document.getElementById('currentCity').innerHTML = `${flag} ${lastCity} <i data-lucide="chevron-down" style="width: 16px;"></i>`;
    document.getElementById('currentCountry').textContent = lastCountry;
    
    currentCity = lastCity;
    currentCountry = lastCountry;
    
    // Initialise les projets avec drapeaux
    initializeProjects();
    
    loadWeatherData(lastCity, lastCountry);
});

// Gestion du Thème
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.setAttribute('data-theme', 'light');
        themeBtn.innerHTML = '<i data-lucide="moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i data-lucide="sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
    lucide.createIcons();
}

// Gestion de la Modal de Ville
function toggleCityModal() {
    const modal = document.getElementById('cityModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Sélection d'une ville et chargement des données
function selectCity(city, country) {
    currentCity = city;
    const normalizedCountry = normalizeCountryCode(country);
    currentCountry = normalizedCountry;
    const flag = getCountryFlag(normalizedCountry);
    document.getElementById('currentCity').innerHTML = `${flag} ${city} <i data-lucide="chevron-down" style="width: 16px;"></i>`;
    document.getElementById('currentCountry').textContent = normalizedCountry;
    toggleCityModal();
    loadWeatherData(city, normalizedCountry);
    lucide.createIcons();
}

// Charge les données météo réelles depuis OpenWeatherMap
async function loadWeatherData(city, country = '') {
    try {
        // Récupère les données météo actuelles
        const weatherData = await getCurrentWeather(city, country);
        
        if (weatherData) {
            updateWeatherDisplay(weatherData);
            // Stocke la ville actuelle
            localStorage.setItem('lastCity', city);
            localStorage.setItem('lastCountry', country);
            showToast(`Météo de ${city} chargée avec succès`, 'success', '✓', 3000);
        } else {
            showErrorMessage('Impossible de récupérer les données météo');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showErrorMessage('Erreur lors du chargement des données. Vérifiez votre clé API.');
    }
}

// Met à jour l'affichage avec les données réelles
function updateWeatherDisplay(data) {
    const container = document.querySelector('.hero-weather');
    container.style.opacity = '0';

    setTimeout(() => {
        // Affichage principal
        document.getElementById('tempDisplay').textContent = data.temperature + '°';
        document.getElementById('weatherIcon').textContent = getWeatherEmoji(data.icon);
        document.getElementById('weatherDesc').textContent = data.description.charAt(0).toUpperCase() + data.description.slice(1);
        
        // Détails
        document.getElementById('windValue').textContent = data.windSpeed + ' km/h';
        document.getElementById('humidityValue').textContent = data.humidity + '%';
        document.getElementById('feelsLike').textContent = data.feelsLike + '°';
        document.getElementById('visValue').textContent = data.visibility + ' km';
        document.getElementById('pressureValue').textContent = data.pressure + ' hPa';
        
        container.style.opacity = '1';
    }, 400);
    
    lucide.createIcons();
}

// Fonction de rafraîchissement avec animation de chargement
async function refreshData() {
    const btn = event.target.closest('.icon-btn');
    if (btn) {
        btn.style.animation = 'spin 1s linear';
        await loadWeatherData(currentCity, currentCountry);
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = '';
        }, 50);
    }
}

// Affiche un message d'erreur
function showErrorMessage(message) {
    showToast(message, 'error', '❌');
}

// Système de Toast Pro
function showToast(message, type = 'info', icon = 'ℹ️', duration = 4000) {
    // Crée le conteneur de toast s'il n'existe pas
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Crée l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto-suppression après la durée spécifiée
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);

    return toast;
}

// Recherche dynamique des villes lors de la recherche
async function filterCities(query) {
    const cityList = document.getElementById('cityList');
    const searchQuery = query.trim();

    // Si la recherche est vide, affiche les villes par défaut
    if (!searchQuery) {
        const defaultCities = [
            { name: 'Paris', country: 'FR' },
            { name: 'Londres', country: 'GB' },
            { name: 'New York', country: 'US' },
            { name: 'Tokyo', country: 'JP' },
            { name: 'Marrakech', country: 'MA' },
            { name: 'Montréal', country: 'CA' }
        ];
        cityList.innerHTML = defaultCities.map(city => {
            const flag = getCountryFlag(city.country);
            return `<li class="city-item" onclick="selectCity('${city.name}', '${city.country}')"><span>${flag} ${city.name}</span> <small>${city.country}</small></li>`;
        }).join('');
        return;
    }

    // Recherche les villes via l'API
    try {
        const cities = await searchCities(searchQuery);
        
        if (cities.length === 0) {
            cityList.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--text-secondary);">Aucune ville trouvée</li>';
            return;
        }

        // Limite à 10 résultats et crée les éléments
        cityList.innerHTML = cities.slice(0, 10).map(city => {
            const flag = getCountryFlag(city.country);
            return `<li class="city-item" onclick="selectCity('${city.name.replace(/'/g, "\\'")}', '${city.country}')"><span>${flag} ${city.name}</span> <small>${city.country}</small></li>`;
        }).join('');
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        cityList.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--text-secondary);">Erreur de recherche</li>';
    }
}

// Initialise les projets avec drapeaux
function initializeProjects() {
    const projects = [
        { name: 'Météo App', country: 'FR' },
        { name: 'Task Manager', country: 'US' },
        { name: 'Blog Platform', country: 'GB' },
        { name: 'E-commerce', country: 'DE' },
        { name: 'Chat App', country: 'CA' },
        { name: 'Analytics', country: 'JP' }
    ];

    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = projects.map(project => {
        const flag = getCountryFlag(project.country);
        return `
            <div class="project-card">
                <div class="project-flag">${flag}</div>
                <div class="project-name">${project.name}</div>
                <div class="project-country">${project.country}</div>
            </div>
        `;
    }).join('');
}
