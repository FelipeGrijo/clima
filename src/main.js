const CACHE_KEY = 'weatherData';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em milissegundos

async function getLocation() {
  try {
    const response = await fetch('https://www.geolocation-db.com/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
}

async function getWeather(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`, // eslint-disable-line
    );
    const data = await response.json();
    return data.current;
  } catch (error) {
    console.error('Erro ao obter clima:', error);
    return null;
  }
}

function getWeatherEmoji(weatherCode, isNight) {
  // Emojis específicos para noite
  const nightSpecific = {
    0: '🌕', // Clear sky
    1: '🌙', // Mainly clear
    2: '🌙', // Partly cloudy with moon
  };

  // Emojis padrão (dia ou condições que não mudam)
  const defaultEmojis = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Foggy
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '🌨️', // Slight snow
    73: '🌨️', // Moderate snow
    75: '🌨️', // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌧️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '🌧️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️', // Thunderstorm with heavy hail
  };

  // Se for noite e existir um emoji específico para noite, use-o
  if (isNight && nightSpecific[weatherCode]) {
    return nightSpecific[weatherCode];
  }

  // Caso contrário, use o emoji padrão
  return defaultEmojis[weatherCode] || '❓';
}

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com formação de gelo',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    77: 'Flocos de neve',
    80: 'Pancadas de chuva leve',
    81: 'Pancadas de chuva moderada',
    82: 'Pancadas de chuva forte',
    85: 'Neve fraca',
    86: 'Neve forte',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte',
  };
  return descriptions[weatherCode] || 'Desconhecido';
}

function setTheme() {
  const hours = new Date().getHours();
  const isNight = hours < 6 || hours > 18;
  document.body.classList.add(isNight ? 'night' : 'day');
  return isNight;
}

function updateUI(locationData, weather, isNight) {
  document.querySelector('.location').textContent = `${locationData.city}, ${locationData.country}`;
  document.querySelector('.temperature').textContent = `${Math.round(weather.temperature_2m)}°C`;
  document.querySelector('.weather-icon').textContent = getWeatherEmoji(weather.weather_code, isNight);
  document.querySelector('.description').textContent = getWeatherDescription(weather.weather_code);
  document.querySelector('.humidity').textContent = `${Math.round(weather.relative_humidity_2m)}%`;
  document.querySelector('.wind').textContent = `${Math.round(weather.wind_speed_10m)} km/h`;
}

function saveToLocalStorage(locationData, weather) {
  const data = {
    locationData,
    weather,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

function getFromLocalStorage() {
  const data = localStorage.getItem(CACHE_KEY);
  if (!data) return null;

  const parsedData = JSON.parse(data);
  const now = Date.now();

  if (now - parsedData.timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsedData;
}

async function initialize() {
  const isNight = setTheme();

  // Tenta carregar dados do cache primeiro
  const cachedData = getFromLocalStorage();
  if (cachedData) {
    updateUI(cachedData.locationData, cachedData.weather, isNight);
  }

  // Atualiza os dados em segundo plano
  const locationData = await getLocation();
  if (locationData) {
    const weather = await getWeather(locationData.latitude, locationData.longitude);
    if (weather) {
      updateUI(locationData, weather, isNight);
      saveToLocalStorage(locationData, weather);
    }
  }
}

initialize();
