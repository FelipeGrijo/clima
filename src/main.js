const CACHE_KEY = 'weatherData';
const refreshButton = document.querySelector('.refresh-button');
let isUpdating = false;

function getCountryNameInLocalLanguage(countryCode) {
  const userLanguage = navigator.language || navigator.userLanguage;
  const displayNames = new Intl.DisplayNames([userLanguage], { type: 'region' });
  return displayNames.of(countryCode);
}

async function getLocation() {
  // Note: https://www.geolocation-db.com/documentation

  try {
    const response = await fetch('https://www.geolocation-db.com/json/');
    const data = await response.json();
    const country = getCountryNameInLocalLanguage(data.country_code);
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
}

async function getWeather({ latitude, longitude }) {
  // Note: https://open-meteo.com/en/docs

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'auto',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    const data = await response.json();
    return data.current;
  } catch (error) {
    console.error('Erro ao obter clima:', error);
    return null;
  }
}

function getWeatherEmoji({ weatherCode, isNight }) {
  const nightSpecific = {
    0: '🌕', // Clear sky
    1: '🌙', // Mainly clear
    2: '🌙', // Partly cloudy with moon
  };

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

  if (isNight && nightSpecific[weatherCode]) {
    return nightSpecific[weatherCode];
  }

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
  return descriptions[weatherCode] || `Desconhecido (${weatherCode})`;
}

function setTheme() {
  const hours = new Date().getHours();
  const isNight = hours < 6 || hours > 18;
  document.body.classList.add(isNight ? 'night' : 'day');
  return isNight;
}

function updateFavicon(emoji) {
  const favicon = document.querySelector('head > link[rel=icon]');
  favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><text y='1em' font-size='100'>${emoji}</text></svg>`;
}

function updateTitle({ temperature, weatherDescription }) {
  document.title = `Clima | ${temperature}°C - ${weatherDescription}`;
}

function updateUI({ locationData, weather, isNight }) {
  const emoji = getWeatherEmoji({ weatherCode: weather.weather_code, isNight });
  const temperature = Math.round(weather.temperature_2m);
  const weatherDescription = getWeatherDescription(weather.weather_code);

  // Note: Quando o geolocation-db encontra a cidade, retorna o nome com uma vírgula, quando for null, retorna uma string vazia
  const city = locationData.city ? `${locationData.city},` : '';

  document.querySelector('.location').textContent = `${city} ${locationData.country}`.trim();
  document.querySelector('.temperature').textContent = `${temperature}°C`;
  document.querySelector('.weather-icon').textContent = emoji;
  document.querySelector('.weather-description').textContent = weatherDescription;
  document.querySelector('.humidity').textContent = `${Math.round(weather.relative_humidity_2m)}%`;
  document.querySelector('.wind').textContent = `${Math.round(weather.wind_speed_10m)} km/h`;

  updateTitle({ temperature, weatherDescription });
  updateFavicon(emoji);
}

function saveToLocalStorage({ locationData, weather }) {
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
  return parsedData;
}

function setUpdatingState(updating) {
  isUpdating = updating;
  refreshButton.classList.toggle('updating', updating);
  refreshButton.disabled = updating;
}

async function updateWeather(useCache = true) {
  if (isUpdating) return;

  setUpdatingState(true);
  const isNight = setTheme();

  try {
    // Verifica o cache primeiro
    if (useCache) {
      const cachedData = getFromLocalStorage();
      if (cachedData) {
        updateUI({ locationData: cachedData.locationData, weather: cachedData.weather, isNight });
      }
    }

    // Atualiza os dados
    const locationData = await getLocation();
    if (locationData) {
      const weather = await getWeather({ latitude: locationData.latitude, longitude: locationData.longitude });
      if (weather) {
        updateUI({ locationData, weather, isNight });
        saveToLocalStorage({ locationData, weather });
      }
    }
  } catch (error) {
    // TODO: Mostrar mensagem de erro pro usuário
    console.error('Erro ao atualizar o clima:', error);
  } finally {
    setUpdatingState(false);
  }
}

refreshButton.addEventListener('click', () => updateWeather(false));
updateWeather(true);
