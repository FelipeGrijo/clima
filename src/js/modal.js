import updateWeather from './updateWeather.js';
import { saveToLocalStorage } from './localStorage.js';

const openModalButton = document.getElementById('openModal');
const saveModalButton = document.getElementById('saveModal');
const modalOverlay = document.getElementById('modalOverlay');
const citySearchInput = document.getElementById('citySearch');
const coordinatesInput = document.getElementById('coordinates');
const openGoogleMapsButton = document.getElementById('openGoogleMaps');
const suggestionsContainer = document.getElementById('suggestions');

openModalButton.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  citySearchInput.focus();
});

saveModalButton.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  const city = citySearchInput.value.trim();
  const country = citySearchInput.getAttribute('data-country');
  const [latitude, longitude] = coordinatesInput.value.split(',');
  console.log('Localização salva:', city, country, latitude, longitude);

  saveToLocalStorage({
    locationData: {
      city,
      country,
      latitude,
      longitude,
    },
  });
  updateWeather(false);
});

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

async function searchCities(query) {
  suggestionsContainer.innerHTML = '';
  if (query.length < 3) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
    const data = await response.json();
    console.log(data);

    if (data.results) {
      console.log(data.results.map((result) => result.name));
      suggestionsContainer.style.display = 'block';
      data.results.forEach((result) => {
        const suggestionItem = document.createElement('div');
        const cityName = result.admin1 ? `${result.name} - ${result.admin1}` : result.name;
        suggestionItem.textContent = cityName;
        suggestionItem.classList.add('suggestion');
        suggestionItem.addEventListener('click', () => {
          console.log('Cidade selecionada:', result);
          citySearchInput.value = result.name;
          coordinatesInput.value = `${result.latitude},${result.longitude}`;
          citySearchInput.setAttribute('data-location', `${result.latitude},${result.longitude}`);
          citySearchInput.setAttribute('data-country', result.country);
          suggestionsContainer.innerHTML = '';
          suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(suggestionItem);
      });
    } else {
      suggestionsContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    suggestionsContainer.style.display = 'none';
  }
}

let inputTimeout = null;
citySearchInput.addEventListener('input', async (event) => {
  clearTimeout(inputTimeout);
  const query = event.target.value.trim();
  inputTimeout = setTimeout(() => searchCities(query), 500);
});

openGoogleMapsButton.addEventListener('click', () => {
  const coordinates = coordinatesInput.value.trim();
  if (coordinates) {
    const [lat, lon] = coordinates.split(',');
    if (lat && lon) {
      window.open(`https://www.google.com/maps?q=${lat.trim()},${lon.trim()}`);
    } else {
      console.error('Coordenadas inválidas.');
    }
  } else {
    console.error('Campo de coordenadas vazio.');
  }
});
