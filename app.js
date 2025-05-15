const nowButton = document.getElementById("Now");
const todayButton = document.getElementById("Today");
const selectDateButton = document.getElementById("SelectDate");
const meresContainer = document.getElementById("meres");
const nowDiv = document.getElementById("stoixeia");
const todayDiv = document.getElementById("today");
const allDiv = document.getElementById("ALL");


nowButton.addEventListener("click", () => changeMode("now"));
todayButton.addEventListener("click", () => changeMode("today"));
selectDateButton.addEventListener("click", () => changeMode("selectdate"));

function changeMode(mode) {
  allDiv.className = `${mode}-mode`;

  if (mode === "now") {
    showNow();
    fetchCurrentWeather();
  } else if (mode === "today") {
    showToday();
  } else if (mode === "selectdate") {
    showSelectDate();
  }
}
const koumpiaButtons = document.getElementsByClassName("koumpia");

for (let i = 0; i < koumpiaButtons.length; i++) {
  koumpiaButtons[i].addEventListener("click", function () {
    for (let btn of koumpiaButtons) {
      btn.classList.remove("active-day");
    }
    this.classList.add("active-day");
  });
}

function CurrentWeather(current) {
  nowDiv.innerHTML = ""; 

  const container = document.createElement("div");
  container.className = "currentweather";

  const temp = document.createElement("h1");
  temp.textContent = `${current.temperature}°C`;

  const wind = document.createElement("p");
  wind.textContent = `Wind: ${current.windspeed} m/s`;

  const icon = document.createElement("img");
  icon.alt = "Weather icon";
  icon.id="protieikona";

  if (current.temperature > 20) {
    icon.src = "icons/sun.png";
  } else {
    icon.src = "icons/sun-cloud.png";
  }

  container.appendChild(temp);
  container.appendChild(wind);

  nowDiv.appendChild(container);
  nowDiv.appendChild(icon);
}

function showNow() {
  nowDiv.style.display = "flex";
  todayDiv.style.display = "none";
  meresContainer.style.display = "none";
  selectDateButton.style.display = "block";
}

function showToday(date = null) {
  nowDiv.style.display = "none";
  todayDiv.style.display = "block";
  meresContainer.style.display = "none";
  selectDateButton.style.display = "block";

  fillHourlyForecast(date);
}


function showSelectDate() {
  nowDiv.style.display = "flex";
  todayDiv.style.display = "none";
  selectDateButton.style.display = "none";
  meresContainer.style.display = "flex";
  meresContainer.innerHTML = ""; 

  for (let i = 1; i <= 6; i++) {
    const dayButton = document.createElement("button");
    dayButton.className = "selectmera";
    dayButton.textContent = `${i+14}/5`;
    meresContainer.appendChild(dayButton);
  }

  const gegonosimeras = document.getElementsByClassName("selectmera");
  for (let i = 0; i < gegonosimeras.length; i++) {
    gegonosimeras[i].addEventListener("click", Spesificday);
  }
}

function Spesificday(event) {
  const dateText = event.target.textContent;
  const today = new Date();
  const selected = `2025-05-${dateText.split("/")[0].padStart(2, "0")}`; 

  nowDiv.style.display = "none";
  todayDiv.style.display = "block";
  meresContainer.style.display = "block";
  selectDateButton.style.display = "none";

  for (let btn of document.getElementsByClassName("selectmera")) {
    btn.classList.remove("active-day");
  }
  event.target.classList.add("active-day");

  showToday(selected);
}


function fillHourlyForecast(selectedDate = null) {
  todayDiv.innerHTML = "";
  const hourlyForecast = document.createElement("div");
  hourlyForecast.id = "hourly-forecast";

  if (!weatherData || !weatherData.hourly) {
    todayDiv.textContent = "Δεν υπάρχουν δεδομένα.";
    return;
  }

  const times = weatherData.hourly.time;
  const temps = weatherData.hourly.temperature_2m;
  const codes = weatherData.hourly.weathercode;

  
  const today = selectedDate || new Date().toISOString().split("T")[0];

  for (let i = 0; i < times.length; i++) {
    if (times[i].startsWith(today)) {
      const hour = times[i].split("T")[1].split(":")[0];

      const hourBox = document.createElement("div");
      hourBox.className = "hour-box";

      const hourEl = document.createElement("p");
      hourEl.className = "hour";
      hourEl.textContent = `${hour}:00`;

      const tempEl = document.createElement("p");
      tempEl.className = "temp";
      tempEl.textContent = `${temps[i]}°C`;

      const icon = document.createElement("img");
      icon.alt = "Weather icon";
      icon.src = getIconFromCode(codes[i]);

      hourBox.appendChild(hourEl);
      hourBox.appendChild(icon);
      hourBox.appendChild(tempEl);
      hourlyForecast.appendChild(hourBox);
    }
  }

  todayDiv.appendChild(hourlyForecast);
}

function getIconFromCode(code) {
  if (code === 0) return "icons/sun.png";
  if (code === 1 || code === 2) return "icons/sun-cloud.png";
  if (code === 3) return "icons/cloud.png";
  if (code >= 45 && code <= 48) return "icons/fog.png";
  if (code >= 51 && code <= 67) return "icons/rain.png";
  if (code >= 71 && code <= 77) return "icons/snow.png";
  if (code >= 80 && code <= 82) return "icons/rain.png";
  if (code >= 95) return "icons/thunder.png";
  return "icons/sun.png"; 
}


const latitude = 40.5872;
const longitude = 22.9482;
const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;






function fetchCurrentWeather() {
  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      weatherData = data; 
      CurrentWeather(data.current_weather);
      drawTemperatureChart(data.daily); 
    })
    .catch(error => console.error("Error fetching weather:", error));
}

window.onload = () => {
  changeMode("now");       
  fetchCurrentWeather();   
};

let weatherData = null;
