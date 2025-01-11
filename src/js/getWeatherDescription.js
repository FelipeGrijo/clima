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

export default getWeatherDescription;
