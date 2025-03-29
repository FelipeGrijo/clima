import { getWeatherEmoji, getWeatherDescription } from './getWeather.js';

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

  // Note: Retorna o valor que não for nulo, vazio ou indefinido. Mostrará a cidade e o país, separados por vírgula ou somente um dos dois, caso um deles não exista.
  const locations = [locationData.city, locationData.country].filter(Boolean);
  // Remove locais duplicados
  const uniqueLocations = [...new Set(locations)];
  const displayText = uniqueLocations.join(', ');

  document.querySelector('.location').textContent = displayText;
  document.querySelector('.temperature').textContent = `${temperature}°C`;
  document.querySelector('.weather-icon').textContent = emoji;
  document.querySelector('.weather-description').textContent = weatherDescription;
  document.querySelector('.humidity').textContent = `${Math.round(weather.relative_humidity_2m)}%`;
  document.querySelector('.wind').textContent = `${Math.round(weather.wind_speed_10m)} km/h`;

  updateTitle({ temperature, weatherDescription });
  updateFavicon(emoji);

  const citySearchInput = document.getElementById('city-search');
  const coordinatesInput = document.getElementById('coordinates');
  const countryInput = document.getElementById('country');

  if (citySearchInput.value === '') {
    citySearchInput.value = displayText;
    countryInput.value = locationData.country;
  }

  if (coordinatesInput.value === '') {
    coordinatesInput.value = `${locationData.latitude},${locationData.longitude}`;
  }
}

export default updateUI;
