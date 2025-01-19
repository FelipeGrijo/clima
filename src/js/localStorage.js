const CACHE_KEY = 'weatherData';

function getFromLocalStorage() {
  const data = localStorage.getItem(CACHE_KEY);
  if (!data) return null;

  const parsedData = JSON.parse(data);
  return parsedData;
}

function saveToLocalStorage({ locationData, weather }) {
  const currentData = getFromLocalStorage();

  const data = {
    locationData: locationData || currentData?.locationData,
    weather: weather || currentData?.weather,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export { saveToLocalStorage, getFromLocalStorage };
