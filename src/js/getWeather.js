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

export default getWeather;
