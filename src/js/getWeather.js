async function getWeather({ latitude, longitude }) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'auto',
    });

    // Note: https://open-meteo.com/en/docs
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    const data = await response.json();
    return data.current;
  } catch (error) {
    console.error('Erro ao obter clima:', error);
    return null;
  }
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

export { getWeather, getWeatherDescription, getWeatherEmoji };
