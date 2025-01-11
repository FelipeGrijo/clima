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

export default getLocation;
