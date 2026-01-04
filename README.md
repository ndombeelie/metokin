# 🌤️ Météo Pro - Premium Edition

Une application météo moderne et élégante avec thème clair/sombre, géolocalisation, et sélection de villes.

## 📋 Table des matières

- [Caractéristiques](#caractéristiques)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [API](#api)
- [Fonctionnalités détaillées](#fonctionnalités-détaillées)

---

## ✨ Caractéristiques

- **Thème Clair/Sombre** : Basculez facilement entre deux thèmes élégants
- **Sélection de Villes** : Recherchez et sélectionnez parmi 6 villes prédéfinies
- **Informations Complètes** : Affichage de température, humidité, vent, indice UV, visibilité, ressenti et pression
- **Icônes Dynamiques** : Utilise Lucide Icons pour des icônes vectorielles nettes
- **Sauvegarde Locale** : Mémorise la dernière ville visitée et les préférences de thème
- **Notifications Toast** : Affiche des messages de feedback utilisateur
- **Design Responsive** : Interface optimisée pour tous les appareils

---

## 📁 Structure du projet

```
metheo/
├── index.html          # Page HTML principale avec structure de l'interface
├── script.js           # Logique principale et gestion des événements (255 lignes)
├── style.css           # Styles CSS avec thèmes light/dark (412 lignes)
├── api/
│   └── api.js          # Requêtes API OpenWeatherMap (214 lignes)
└── README.md           # Cette documentation
```

---

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Une connexion Internet pour accéder à l'API OpenWeatherMap

### Étapes
1. Clonez ou téléchargez le projet
2. Ouvrez `index.html` dans votre navigateur
3. L'application est prête à l'emploi !

---

## 💻 Utilisation

### Affichage de la Météo
- L'application affiche par défaut la météo de **Paris**
- La météo actuelle comprend : température, condition, humidité, vent, UV, visibilité, ressenti et pression

### Changer de Ville
1. Cliquez sur le nom de la ville en haut de l'application
2. Le modal s'ouvre avec une liste de villes disponibles
3. Saisissez le début du nom pour filtrer les résultats
4. Cliquez sur une ville pour charger ses données météo

### Changer de Thème
Cliquez sur le bouton en haut à gauche (icône soleil/lune) pour basculer entre les thèmes clair et sombre.

### Rafraîchir les Données
Cliquez sur le bouton en haut à droite (icône d'actualisation) pour recharger les données météo actuelles.

---

## 🏗️ Architecture

### Organisation du Code

#### **index.html** - Structure HTML
- Conteneur principal avec toolbar
- Affichage principal de la météo (héro section)
- Grille de détails (6 cartes d'informations)
- Modal de sélection de villes
- CDN de Lucide Icons pour les icônes

#### **script.js** - Logique principale (255 lignes)

**Variables globales :**
- `currentCity` : Ville actuellement affichée
- `currentCountry` : Code ISO du pays
- `countryCodeMap` : Mapping des noms et codes de pays

**Fonctions principales :**
- `toggleTheme()` : Bascule entre thème clair/sombre
- `toggleCityModal()` : Affiche/masque le modal de sélection
- `selectCity(city, country)` : Sélectionne une ville
- `loadWeatherData(city, country)` : Charge les données météo
- `updateWeatherDisplay(data)` : Met à jour l'interface
- `filterCities(value)` : Filtre les villes dans la recherche
- `refreshData()` : Actualise les données météo
- `initializeProjects()` : Initialise les projets avec drapeaux
- `showToast()` : Affiche des notifications
- `showErrorMessage()` : Affiche les erreurs

**Utilitaires :**
- `getCountryFlag(countryCode)` : Convertit le code pays en emoji drapeau
- `normalizeCountryCode(country)` : Normalise les codes pays

#### **style.css** - Styles (412 lignes)

**Thèmes CSS :**
- **Thème Sombre** (défaut) : Fond bleu-nuit (#0f172a), accent cyan (#38bdf8)
- **Thème Clair** : Fond gris clair (#f1f5f9), accent bleu (#0284c7)

**Composants stylisés :**
- `.app-container` : Conteneur principal avec gradient
- `.toolbar` : Barre supérieure avec boutons
- `.hero-weather` : Section d'affichage principal
- `.details-grid` : Grille de 6 cartes
- `.city-modal` : Modal de sélection de villes
- `.toast` : Notifications
- Transitions fluides et effets hover

#### **api/api.js** - Intégration API (214 lignes)

**Configuration :**
- `API_KEY` : Clé API OpenWeatherMap
- `BASE_URL` : URL de base de l'API

**Fonctions :**
- `getCurrentWeather(city, country)` : Récupère la météo actuelle
- `getWeatherByCoordinates(latitude, longitude)` : Récupère par GPS
- `getForecast(city, country)` : Récupère la prévision 5 jours
- `searchCities(query)` : Recherche des villes
- `parseWeatherData(rawData)` : Parse les données brutes
- `parseForecastData(rawData)` : Parse les prévisions
- `getWeatherIcon(code)` : Retourne l'emoji selon le code météo

---

## 🔌 Technologie

- **HTML5** : Structure sémantique
- **CSS3** : Styles avec variables CSS et gradients
- **JavaScript (Vanilla)** : Aucune dépendance framework
- **Lucide Icons** : Bibliothèque d'icônes vectorielles (CDN)
- **OpenWeatherMap API** : Données météo en temps réel
- **LocalStorage** : Sauvegarde des préférences utilisateur

---

## 🌐 API - OpenWeatherMap

### Clé API
- **API_KEY** : `ce9a3b93307a25a9370e33e779f60b56`
- **Service** : Plan gratuit OpenWeatherMap

### Endpoints utilisés

#### 1. **Weather Actuel**
```
GET /data/2.5/weather?q={city},{country}&appid={API_KEY}&units=metric&lang=fr
```
Retourne les données météo actuelles pour une ville.

#### 2. **Prévisions 5 jours**
```
GET /data/2.5/forecast?q={city},{country}&appid={API_KEY}&units=metric&lang=fr
```
Retourne les prévisions sur 5 jours par intervalle de 3 heures.

#### 3. **Par Coordonnées GPS**
```
GET /data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=fr
```
Retourne la météo selon les coordonnées GPS.

#### 4. **Recherche de Villes**
```
GET /data/2.5/find?q={query}&appid={API_KEY}&units=metric
```
Recherche les villes correspondant à une requête.

### Format des données
Les réponses incluent :
- Température actuelle et ressentie
- Humidité (%)
- Vitesse du vent (km/h)
- Indice UV
- Visibilité (m)
- Pression (hPa)
- Code météo pour l'icône

---

## 🎨 Fonctionnalités détaillées

### 1. Thème Clair/Sombre
Le basculement de thème est géré par l'attribut `data-theme` du body et des variables CSS. Les préférences sont sauvegardées dans `localStorage`.

**Thème Sombre :**
- Fond : `#0f172a` (bleu très foncé)
- Accent : `#38bdf8` (cyan)
- Texte : `#f8fafc` (presque blanc)

**Thème Clair :**
- Fond : `#f1f5f9` (gris très clair)
- Accent : `#0284c7` (bleu)
- Texte : `#1e293b` (presque noir)

### 2. Sélection de Villes
Une modal affiche 6 villes prédéfinies :
- Paris (FR)
- Londres (UK)
- New York (US)
- Tokyo (JP)
- Marrakech (MA)
- Montréal (CA)

La recherche filtre la liste en temps réel selon la saisie.

### 3. Indicateurs Météo

| Indicateur | Exemple | Description |
|-----------|---------|-------------|
| **Température** | 24° | Température actuelle en Celsius |
| **Condition** | Ciel Dégagé | Description textuelle de la météo |
| **Vent** | 14 km/h | Vitesse du vent |
| **Humidité** | 42% | Taux d'humidité relative |
| **Indice UV** | 6 (Élevé) | Index UV avec niveau |
| **Visibilité** | 10 km | Distance de visibilité |
| **Ressenti** | 26° | Température ressentie |
| **Pression** | 1015 hPa | Pression atmosphérique |

### 4. Drapeaux Pays
Les codes ISO des pays sont convertis en emojis drapeaux dynamiquement.

```javascript
function getCountryFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}
```

### 5. Notifications Toast
Les messages de notification s'affichent brièvement et disparaissent automatiquement :
- **Succès** : ✓ Météo de X chargée avec succès
- **Erreur** : ✗ Impossible de récupérer les données

### 6. Sauvegarde Locale
L'application mémorise :
- `lastCity` : Dernière ville affichée
- `lastCountry` : Dernier pays affichée
- `theme` : Thème clair/sombre

---

## 📱 Responsive Design

L'application s'adapte à tous les appareils :
- **Desktop** : Affichage optimisé à 450px max
- **Tablet** : Interface complète et lisible
- **Mobile** : Padding et espacements adaptés

---

## 🐛 Gestion des Erreurs

L'application gère les erreurs :
- **Requête API échouée** : Affiche un message d'erreur
- **Ville non trouvée** : Notification d'erreur
- **Sans connexion Internet** : Gestion du try/catch

---

## 🔐 Sécurité

- **Clé API publique** : Utilisée côté client (limitation normale)
- **Pas de données sensibles** : Seulement des données météo
- **HTTPS sécurisé** : Toutes les requêtes API en HTTPS

---

## 📊 Performance

- **Chargement léger** : Pas de framework, fichiers minimaux
- **Icons CDN** : Lucide Icons chargées de manière optimisée
- **Cache LocalStorage** : Sauvegarde les préférences utilisateur

---

## 🤝 Contribution

Pour améliorer l'application :
1. Ajouter plus de villes prédéfinies
2. Implémenter la géolocalisation automatique
3. Ajouter les prévisions 5 jours
4. Intégrer un graphique de température
5. Support multilingue

---

## 📄 Licence

Projet libre d'utilisation. Données météo fournies par OpenWeatherMap.

---

**Dernière mise à jour** : 4 janvier 2026
