document.addEventListener("DOMContentLoaded", function () {
  var input = document.querySelector("#cityinput");
  var submitBtn = document.querySelector("#submitBtn");
  var weatherWrapper = document.querySelector("#weatherWrapper");
  var loader = document.querySelector("#loader");
  var cityOutput = document.querySelector("#cityoutput");
  var description = document.querySelector("#description");
  var temperature = document.querySelector("#temp");
  var windSpeed = document.querySelector("#wind");

  var apiKey = "470ee0255499411a1a3e0b9709702e54";
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather";

  function convertToCelsius(val) {
    return (val - 273.15).toFixed(2);
  }

  function showLoader() {
    loader.style.display = "block";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  function showError(message) {
    weatherWrapper.innerHTML = `<p class="error">${message}</p>`;
    weatherWrapper.style.display = "block";
  }

  function clearResults() {
    cityOutput.innerHTML = "";
    temperature.innerHTML = "";
    description.innerHTML = "";
    windSpeed.innerHTML = "";
  }

  function validateInput() {
    return input.value.trim() !== "";
  }

  function getWeatherData() {
    if (!validateInput()) {
      showError("Please enter a city name.");
      return;
    }

    clearResults(); 
    showLoader();

    fetch(`${apiUrl}?q=${input.value}&appid=${apiKey}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        hideLoader();

        var cityName = data["name"];
        var weatherDescription = data["weather"][0]["description"];
        var tempValue = data["main"]["temp"];
        var windSpeedValue = data["wind"]["speed"];

        cityOutput.innerHTML = `Weather in <span style="color: white;">${cityName}</span>`;
        temperature.innerHTML = `Temperature: <span>${convertToCelsius(
          tempValue
        )}°C</span>`;
        description.innerHTML = `Sky Conditions: <span>${weatherDescription}</span>`;
        windSpeed.innerHTML = `Wind Speed: <span>${windSpeedValue} m/s</span>`;

        weatherWrapper.appendChild(cityOutput);
        weatherWrapper.appendChild(temperature);
        weatherWrapper.appendChild(description);
        weatherWrapper.appendChild(windSpeed);

        var errorMessage = document.querySelector(".error");
        if (errorMessage) {
          errorMessage.remove();
        }
      })
      .catch((err) => {
        hideLoader();
        showError(
          "Oops! Something went wrong. Please check the city name and try again."
        );
      })
      .finally(() => {
        weatherWrapper.style.display = "block";
      });
  }

  submitBtn.addEventListener("click", getWeatherData);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      getWeatherData();
    }
  });
});
