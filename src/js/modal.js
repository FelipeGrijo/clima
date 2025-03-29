import updateWeather from './updateWeather.js';
import { saveToLocalStorage } from './localStorage.js';
import { formatCountryName } from './getLocation.js';

const openModalButton = document.getElementById('open-modal');
const saveModalButton = document.getElementById('btn-save');
const modalOverlay = document.getElementById('modal-overlay');
const citySearchInput = document.getElementById('city-search');
const coordinatesInput = document.getElementById('coordinates');
const openGoogleMapsButton = document.getElementById('btn-open-googlemaps');
const suggestionsContainer = document.getElementById('suggestions');

openModalButton.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  citySearchInput.focus();
});

saveModalButton.addEventListener('click', (event) => {
  event.preventDefault();

  modalOverlay.classList.remove('active');

  const form = event.target.closest('form');
  const formData = Object.fromEntries(new FormData(form).entries());
  const city = formData.city.trim().split(',')[0]; // Salva só o nome da cidade
  const country = formData.country.trim();
  const [latitude, longitude] = formData.coordinates.split(',').map((coord) => coord.trim());

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

const suggestionTemplate = ({ displayText, city, country, countryCode, latitude, longitude }) => /* html */ `
  <div tabIndex="0" class="suggestion" data-name="${city}" data-country="${country}" data-latitude="${latitude}" data-longitude="${longitude}">
    <span class="fi fi-${countryCode.toLowerCase()}" title="${country}"></span>
    <span class="suggestion-location">${displayText}</span>
  </div>
`;

function clearSuggestions() {
  suggestionsContainer.innerHTML = '';
  suggestionsContainer.style.display = 'none';
}

function loadingState() {
  suggestionsContainer.style.display = 'block';
  suggestionsContainer.innerHTML = `
    <span class="loading">
      <svg class="spinner" width="24" height="24">
        <use href="./assets/icons.svg#refresh"></use>
      </svg>
    </span>
  `;
}

async function searchCities(query) {
  if (query.trim().length < 3) {
    clearSuggestions();
    return;
  }

  loadingState();

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar cidades.', response.statusText);
    }

    const data = await response.json();

    if (!data?.results || data.results.length === 0) {
      clearSuggestions();
      return;
    }

    suggestionsContainer.style.display = 'block';

    const suggestions = data.results.map((result) => ({
      displayText: result.admin1 ? `${result.name} - ${result.admin1}` : result.name,
      city: result.name === result.country ? formatCountryName(result.country_code) : result.name,
      country: formatCountryName(result.country_code) || result.country || '',
      countryCode: result.country_code || 'xx',
      latitude: result.latitude || '',
      longitude: result.longitude || '',
    }));

    suggestionsContainer.innerHTML = suggestions.map(suggestionTemplate).join('');
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    clearSuggestions();
  }
}

suggestionsContainer.addEventListener('click', (event) => {
  const elem = event.target.closest('.suggestion');
  if (elem) {
    const countryInput = document.getElementById('country');
    const { name, country, latitude, longitude } = elem.dataset;

    citySearchInput.value = name;
    countryInput.value = country;
    coordinatesInput.value = `${latitude},${longitude}`;

    clearSuggestions();
  }
});

let inputTimeout = null;
citySearchInput.addEventListener('input', async (event) => {
  clearTimeout(inputTimeout);
  const query = event.target.value.trim();
  inputTimeout = setTimeout(() => searchCities(query), 500);
});

function closeSuggestionsOnEscape(event) {
  if (event.key === 'Escape') {
    clearSuggestions();
  }
}

citySearchInput.addEventListener('keydown', closeSuggestionsOnEscape);

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
