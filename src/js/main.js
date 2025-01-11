import getLocation from './getLocation.js';
import getWeather from './getWeather.js';
import setTheme from './setTheme.js';
import { saveToLocalStorage, getFromLocalStorage } from './localStorage.js';
import updateUI from './updateUI.js';

const refreshButton = document.querySelector('.refresh-button');
let isUpdating = false;

function setUpdatingState(updating) {
  isUpdating = updating;
  refreshButton.classList.toggle('updating', updating);
  refreshButton.disabled = updating;
}

async function updateWeather(useCache = true) {
  if (isUpdating) return;

  setUpdatingState(true);
  const isNight = setTheme();

  try {
    // Verifica o cache primeiro
    if (useCache) {
      const cachedData = getFromLocalStorage();
      if (cachedData) {
        updateUI({
          locationData: cachedData.locationData,
          weather: cachedData.weather,
          isNight,
        });
      }
    }

    // Atualiza os dados
    const locationData = await getLocation();
    if (locationData) {
      const weather = await getWeather({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });

      if (weather) {
        updateUI({ locationData, weather, isNight });
        saveToLocalStorage({ locationData, weather });
      }
    }
  } catch (error) {
    // TODO: Mostrar mensagem de erro pro usuário
    console.error('Erro ao atualizar o clima:', error);
  } finally {
    setUpdatingState(false);
  }
}

refreshButton.addEventListener('click', () => updateWeather(false));
updateWeather(true);
