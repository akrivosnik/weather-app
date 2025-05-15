const nowButton = document.getElementById("Now");
const todayButton = document.getElementById("Today");
const selectDateButton = document.getElementById("SelectDate");
const meresContainer = document.getElementById("meres");
const nowDiv = document.getElementById("stoixeia");
const todayDiv = document.getElementById("today");
const allDiv = document.getElementById("ALL");

// Event listeners
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

  container.appendChild(temp);
  container.appendChild(wind);

  nowDiv.appendChild(container);
}

function showNow() {
  nowDiv.style.display = "flex";
  todayDiv.style.display = "none";
  meresContainer.style.display = "none";
  selectDateButton.style.display = "block";
}

function showToday() {
  nowDiv.style.display = "none";
  todayDiv.style.display = "block";
  meresContainer.style.display = "none";
  selectDateButton.style.display = "block";

  fillHourlyForecast();
}

function showSelectDate() {
  nowDiv.style.display = "flex";
  todayDiv.style.display = "none";
  selectDateButton.style.display = "none";
  meresContainer.style.display = "flex";
  meresContainer.innerHTML = ""; // Clear old buttons

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
  nowDiv.style.display = "none";
  todayDiv.style.display = "block";
  meresContainer.style.display = "block";
  selectDateButton.style.display = "none";

  // Καθαρίζουμε την active-day από όλα τα κουμπιά
  const allButtons = document.getElementsByClassName("selectmera");
  for (let btn of allButtons) {
    btn.classList.remove("active-day");
  }

  // Προσθέτουμε την κλάση active-day στο επιλεγμένο κουμπί
  event.target.classList.add("active-day");

  fillHourlyForecast();
}

function fillHourlyForecast() {
  todayDiv.innerHTML = "";
  const hourlyForecast = document.createElement("div");
  hourlyForecast.id = "hourly-forecast";

  for (let i = 0; i < 24; i++) {
    const hourBox = document.createElement("div");
    hourBox.className = "hour-box";

    const hour = document.createElement("p");
    hour.className = "hour";
    hour.textContent = `${i}:00`;

    const tempValue = 8 + Math.floor(Math.random() * 21);
    const temp = document.createElement("p");
    temp.className = "temp";
    temp.textContent = `${tempValue}°C`;

    const icon = document.createElement("img");
    if (tempValue > 15) {
      icon.src = "icons/sun.png";
    } else {
      icon.src = "icons/sun-cloud.png";
    }

    icon.alt = `Weather icon for ${i}:00`;

    hourBox.appendChild(hour);
    hourBox.appendChild(icon);
    hourBox.appendChild(temp);
    hourlyForecast.appendChild(hourBox);
  }

  todayDiv.appendChild(hourlyForecast);
}

const latitude = 40.5872;
const longitude = 22.9482;
const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

function fetchCurrentWeather() {
  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      CurrentWeather(data.current_weather); // στέλνουμε ΜΟΝΟ το κομμάτι που χρειαζόμαστε
    })
    .catch(error => console.error("Error fetching weather:", error));
}
