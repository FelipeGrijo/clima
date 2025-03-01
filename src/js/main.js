import updateWeather from './updateWeather.js';
import './modal.js';

updateWeather();

// Adiciona o CSS do Flag Icons após carregar a página
window.addEventListener('load', () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css';
  document.head.appendChild(link);
});
