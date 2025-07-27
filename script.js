document.addEventListener("DOMContentLoaded", () => {
  let clockIntervalId = null;

  const weatherBackgrounds = {
    "clear sky": "ClearSky.jpg",
    "few clouds": "PartialCloud.jpg",
    "scattered clouds": "mostlycloudy.jpg",
    "broken clouds": "overcast.jpg",
    "overcast clouds": "overcast.jpg",
    "light rain": "light.jpg",
    "moderate rain": "moderate.jpg",
    "heavy intensity rain": "HeavyRain.jpg",
    "very heavy rain": "HeavyRain.jpg",
    "fog": "foggy.jpg",
    "mist": "foggy.jpg",
    "smoke": "foggy.jpg",
    "haze": "foggy.jpg",
    "light snow": "lightsnow.jpg",
    "snow": "Heavysnowfall.jpg",
    "heavy snow": "Heavysnowfall.jpg",
    "thunderstorm": "thunderstorm.jpg",
    "storm": "storm.jpg",
    "sunny": "Sunny.jpg"
  };

  const cityInput = document.getElementById("city");

  function getUserLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getCityFromCoords(lat, lon);
        },
        error => {
          console.warn("Geolocation error:", error.message);
          getWeatherByCity("Karachi");
        }
      );
    } else {
      console.warn("Geolocation not supported");
      getWeatherByCity("Karachi");
    }
  }

  function getCityFromCoords(lat, lon) {
    const apiKey = "29a93f56abc546796a421c825a89e0ff";
    const geoURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    fetch(geoURL)
      .then(res => res.json())
      .then(geoData => {
        const cityName = geoData[0]?.name || "Karachi";
        getWeatherByCity(cityName);
      })
      .catch(() => getWeatherByCity("Karachi"));
  }

  function getWeatherByCity(cityName) {
    const apiKey = "29a93f56abc546796a421c825a89e0ff";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("City not found");
        return response.json();
      })
      .then(data => {
startWeatherClock(null, data.timezone);
        updateWeather(data); 
      })
      .catch(error => {
        alert("Error: " + error.message);
      });
  }

function startWeatherClock(apiTime, timezoneOffset) {
  if (clockIntervalId) clearInterval(clockIntervalId);

  function updateClock() {
    let cityTimeFinal;

    if (typeof timezoneOffset === 'number') {
      const now = new Date();
      const utcTimeMs = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cityTime = new Date(utcTimeMs + timezoneOffset * 1000);
      cityTimeFinal = cityTime;
    } else {
      cityTimeFinal = new Date(); 
    }

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    };

    const formatted = cityTimeFinal.toLocaleString('en-US', options).replace(',', ' |');
    const dateTimeEl = document.getElementById("date-time");
    if (dateTimeEl) {
      dateTimeEl.textContent = formatted;
    }
  }

  updateClock();

  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000;

  setTimeout(() => {
    updateClock();
    clockIntervalId = setInterval(updateClock, 60000);
  }, msToNextMinute);
}

  cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const cityName = cityInput.value.trim();
      if (cityName === "") {
        alert("Please enter a city name.");
        return;
      }
      getWeatherByCity(cityName);
    }
  });

  function updateWeather(data) {
    const weatherDesc = data.weather[0].description.toLowerCase();
    const backgroundImage = weatherBackgrounds[weatherDesc] || "Sunny.jpg";
    updateBackground(backgroundImage);

    document.querySelector(".temp span:first-child").textContent = `${Math.round(data.main.temp)}°`;
    document.querySelector(".temp span:last-child").textContent = data.name;
    document.querySelector(".text-start p").textContent = data.weather[0].description.toUpperCase();

    const weatherItems = document.querySelectorAll(".weather-item");
    weatherItems[0].querySelector("span:nth-child(2)").innerHTML = `${Math.round(data.main.temp_max)}° <i class="text-4xl uil uil-temperature-half"></i>`;
    weatherItems[1].querySelector("span:nth-child(2)").innerHTML = `${Math.round(data.main.temp_min)}° <i class="text-4xl uil uil-temperature-empty"></i>`;
    weatherItems[2].querySelector("span:nth-child(2)").innerHTML = `${data.main.humidity}% <i class="text-4xl uil uil-tear"></i>`;
    weatherItems[3].querySelector("span:nth-child(2)").innerHTML = `${data.clouds.all}% <i class="text-4xl uil uil-cloud"></i>`;
    weatherItems[4].querySelector("span:nth-child(2)").innerHTML = `${data.wind.speed} km/h <i class="text-4xl uil uil-wind"></i>`;
  }

  function updateBackground(imageFileName) {
    const bgDiv = document.getElementById("background");
    bgDiv.style.transition = "opacity 0.5s ease";

    bgDiv.style.opacity = 0;

    setTimeout(() => {
      bgDiv.style.backgroundImage = `url('./images/${imageFileName}')`;
      bgDiv.style.opacity = 1;
    }, 500);
  }

  getUserLocationWeather();
});
