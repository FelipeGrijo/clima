function setTheme() {
  const hours = new Date().getHours();
  const isNight = hours < 6 || hours > 18;
  document.body.classList.add(isNight ? 'night' : 'day');
  return isNight;
}

export default setTheme;
