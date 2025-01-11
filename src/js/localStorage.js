const CACHE_KEY = 'weatherData';

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

export { saveToLocalStorage, getFromLocalStorage };
