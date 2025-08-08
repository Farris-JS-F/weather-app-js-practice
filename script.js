const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const suggestionsBox = document.getElementById('suggestions');
const apiKey = '65aac20a5ec7ba62c7898c4cddf3b380';
const iconMap = {
  clear: 'wi-day-sunny',
  clouds: 'wi-cloudy',
  rain: 'wi-rain',
  snow: 'wi-snow',
  mist: 'wi-fog',
  thunderstorm: 'wi-thunderstorm'
};
const cities = ["Melbourne", "Sydney", "Brisbane", "Perth", "Adelaide", "London", "Paris", "Tokyo", "New York", "Shanghai", "Beijing"];

cityInput.addEventListener('input', () => {
  const input = cityInput.value.toLowerCase();
  suggestionsBox.innerHTML = '';
  if (input === '') {
    suggestionsBox.classList.add('hidden');
    return;
  }

  const matched = cities.filter(city => city.toLowerCase().startsWith(input));
  matched.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      cityInput.value = city;
      suggestionsBox.classList.add('hidden');
      getWeather();
    });
    suggestionsBox.appendChild(li);
  });

  suggestionsBox.classList.toggle('hidden', matched.length === 0);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    suggestionsBox.classList.add('hidden');
  }
});

function getWeather() {
  const city = cityInput.value.trim();
  if (city === '') return;

  cityInput.blur();
  cityInput.value = '';
  suggestionsBox.classList.add('hidden');

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(err => {
      weatherResult.innerHTML = `<p style="text-align:center; color:#e53e3e;">${err.message}</p>`;
      weatherResult.style.display = 'block';
      document.getElementById('app').className = '';
    });
}

function displayWeather(data) {
  const name = data.name;
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const wind = data.wind.speed;
  const mainWeather = data.weather[0].main.toLowerCase();

  weatherResult.innerHTML = `
    <div class="weather-top">
     <i class="wi ${iconMap[mainWeather] || 'wi-na'} weather-icon"></i>
      <div class="weather-info">
        <h3>${name}</h3>
        <p>${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
      </div>
    </div>
    <div class="weather-mid">
      <div class="temp">${temp}°C</div>
    </div>
    <div class="weather-bottom">
      <p>Wind: ${wind} km/h</p>
    </div>
  `;

  weatherResult.style.display = 'block';
  const app = document.getElementById('app');
  app.className = '';
  const validTypes = ['clear', 'clouds', 'rain', 'snow', 'mist'];
  app.classList.add(validTypes.includes(mainWeather) ? mainWeather : 'clear');
}

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});
