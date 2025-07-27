const apiKey = "afd65df38199c5b37f204e1c535fe7f1";

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        document.getElementById("weatherResult").innerHTML = "<p style='color:red;'>Please enter a city name.</p>";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            const weather = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;
            document.getElementById("weatherResult").innerHTML = weather;
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
}
