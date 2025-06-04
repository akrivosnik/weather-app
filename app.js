
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
  if (!weatherData || !weatherData.daily || !weatherData.daily.time) {
    alert("Δεν υπάρχουν διαθέσιμες ημερομηνίες.");
    return;
  }

  allDiv.className = "selectdate-mode";
  nowDiv.style.display = "none";
  todayDiv.style.display = "none";
  selectDateButton.style.display = "none";
  meresContainer.style.display = "flex";
  meresContainer.innerHTML = "";

  
  const availableDates = weatherData.daily.time;

  for (let date of availableDates) {
    const [year, month, day] = date.split("-");
    const button = document.createElement("button");
    button.className = "selectmera";
    button.textContent = `${parseInt(day)}/${parseInt(month)}`;
    button.dataset.fullDate = date;
    meresContainer.appendChild(button);
  }

  const gegonosimeras = document.getElementsByClassName("selectmera");
  for (let i = 0; i < gegonosimeras.length; i++) {
    gegonosimeras[i].addEventListener("click", Spesificday);
  }
}


function Spesificday(event) {
  const selected = event.target.dataset.fullDate;

  nowDiv.style.display = "none";
  todayDiv.style.display = "block";
  meresContainer.style.display = "flex"; 
  selectDateButton.style.display = "none";

  for (let btn of document.getElementsByClassName("selectmera")) {
    btn.classList.remove("active-day");
  }
  event.target.classList.add("active-day");

  fillHourlyForecast(selected);
}


function fillHourlyForecast(selectedDate = null) {  //pairnei null mono se periptosi pou den exei to selcted timi.
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
const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,windspeed_10m,windgusts_10m,winddirection_10m,relativehumidity_2m,pressure_msl,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;


function fetchCurrentWeather() {
  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      weatherData = data; 
      CurrentWeather(data.current_weather);
      drawTemperatureChart(data.daily);
      updateNowDetails();
    })
    .catch(error => console.error("Error fetching weather:", error));
}

window.onload = () => {
  changeMode("now");       
  fetchCurrentWeather();   
};

let weatherData = null;

function updateNowDetails() {
  if (!weatherData || !weatherData.hourly) return;

  
  const temp = weatherData.hourly.temperature_2m?.[0];
  const feelsLike = weatherData.hourly.apparent_temperature?.[0];
  const wind = weatherData.hourly.windspeed_10m?.[0];
  const windGust = weatherData.hourly.windgusts_10m?.[0];
  const windDeg = weatherData.hourly.winddirection_10m?.[0];
  const humidity = weatherData.hourly.relativehumidity_2m?.[0];

  const timesDiv = document.getElementById('Times');
  if (!timesDiv || timesDiv.children.length < 6) return;

  const divs = timesDiv.children;

  
  divs[0].querySelector('h1').textContent = temp !== undefined ? `${temp}°C` : '-';
  divs[0].querySelector('p').textContent = 'Temperature';

  divs[1].querySelector('h1').textContent = feelsLike !== undefined ? `${feelsLike}°C` : '-';
  divs[1].querySelector('p').textContent = 'Feels Like';

  divs[2].querySelector('h1').textContent = wind !== undefined ? `${wind} m/s` : '-';
  divs[2].querySelector('p').textContent = 'Wind';

  divs[3].querySelector('h1').textContent = windGust !== undefined ? `${windGust} m/s` : '-';
  divs[3].querySelector('p').textContent = 'Wind Gust';

  divs[4].querySelector('h1').textContent = windDeg !== undefined ? `${windDeg}°` : '-';
  divs[4].querySelector('p').textContent = 'Wind Direction';

  divs[5].querySelector('h1').textContent = humidity !== undefined ? `${humidity}%` : '-';
  divs[5].querySelector('p').textContent = 'Humidity';
}
