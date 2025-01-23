// Note: https://www.geolocation-db.com/documentation
const GEODB_API_URL = 'https://www.geolocation-db.com/json/';
const PROXY_API_URL = '/api';

function formatCountryName(countryCode) {
  const userLanguage = navigator.language || navigator.userLanguage;
  const displayNames = new Intl.DisplayNames([userLanguage], { type: 'region' });
  return displayNames.of(countryCode);
}

async function getLocation() {
  try {
    const response = await fetch(GEODB_API_URL);
    const data = await response.json();
    const country = formatCountryName(data.country_code);

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || data.state,
      country,
    };
  } catch (error) {
    console.error('Erro ao obter localização usando Geolocation-DB:', error);

    // Note: Tenta obter a localização usando o proxy caso algum adblock bloqueie o acesso ao Geolocation-DB
    try {
      const proxyResponse = await fetch(PROXY_API_URL);
      const locationData = await proxyResponse.json();
      const country = formatCountryName(locationData.country_code);

      return {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city || locationData.state,
        country,
      };
    } catch (err) {
      throw new Error('Erro ao obter localização usando proxy:', err);
    }
  }
}

export { getLocation, formatCountryName };
