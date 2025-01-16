const openModalButton = document.getElementById('openModal');
const saveModalButton = document.getElementById('saveModal');
const modalOverlay = document.getElementById('modalOverlay');
const citySearchInput = document.getElementById('citySearch');
const coordinatesInput = document.getElementById('coordinates');
const openGoogleMapsButton = document.getElementById('openGoogleMaps');

openModalButton.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  citySearchInput.focus();
});

saveModalButton.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

async function searchCities(query) {
  if (query.length < 3) {
    return;
  }

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
    const data = await response.json();

    const cityNames = data.results.map((result) => result.name);

    console.log(cityNames);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
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
