function setTheme() {
  const hours = new Date().getHours();
  const isNight = hours < 6 || hours > 18;
  document.documentElement.setAttribute('data-theme', isNight ? 'night' : 'day');
  return isNight;
}

export default setTheme;
