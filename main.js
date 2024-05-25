import "./style.css";
/*
In VITE not work
 import dotenv from "dotenv"
 dotenv.config()
 process.env.URL_KEY
 */


async function weatherAPI(lati, long, city) {
  let urlAd;

  const urlOpenKey = import.meta.env.VITE_URL_KEYOPEN;

  try {
    if (city) {
      urlAd = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${urlOpenKey}&units=metric`;
    } else {
      urlAd = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${urlOpenKey}&units=metric`;
    }
    const resp = await fetch(urlAd);
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (error404) {
    alert("Failed To Fetch API");
  }
}
const searchButton = document.querySelector("#search");
const inputBox = document.querySelector("input");
const DegreeChange = document.querySelector(".degree");
const CelciusBtn = document.querySelector(".tempC");
const FerhaBtn = document.querySelector(".tempF");
const DegreeFeel = document.querySelector(".degree_feel");
const bodyBG = document.querySelector("body");
const weatherImage = document.querySelector(".weatherIcon");

//  AT start
const weatherDetailWrapp=document.querySelector(".weatherDetails")
weatherDetailWrapp.style.height="0";
weatherDetailWrapp.style.width="0";
weatherDetailWrapp.style.overflow="hidden"

// card open for give height dynamically
function weatherDetailOpen(height,width){
weatherDetailWrapp.style.height=height;
weatherDetailWrapp.style.width=width
}


let currentData;
async function FinalData(data) {
  currentData = await data;
  console.log(currentData.main.temp);

  // DOM manipulatio
  if (currentData && currentData.main) {
    // Weather condition Image
    const W_Condition = currentData.weather[0].main;

    let W_ImgSrc;
    W_Condition === "Clear"
      ? (W_ImgSrc = "./Images/sunny.png")
      : W_Condition === "Clouds"
      ? (W_ImgSrc = "./Images/cloudy.png")
      : W_Condition === "Rain"
      ? (W_ImgSrc = "./Images/rainy-day.png")
      : W_Condition === "Haze"
      ? (W_ImgSrc = "./Images/haze.png")
      : "./Images/thunder.png";

    // adding image source
    weatherImage.innerHTML = `<img src=${W_ImgSrc} alt="" />`;

    DegreeChange.innerHTML = `<p>${Math.round(
      currentData.main.temp
    )}</p><span>°C</span>`;

    // changing Degree Celcius to Fahrenheit

    // celcius change
    CelciusBtn.addEventListener("click", () => {
      DegreeChange.innerHTML = `<p>${Math.round(
        currentData.main.temp
      )}</p><span>°C</span>`;
      FerhaBtn.classList.remove("active");
      CelciusBtn.className = "active";
      //  feel like degree
      DegreeFeel.innerHTML = `<h4>Feel Like: <span>${Math.ceil(
        currentData.main.feels_like
      )}</span></h4>
        <span>°C</span>`;
    });

    // ferha converstion
    const Fahrenheit = Math.ceil((currentData.main.temp * 9) / 5 + 32);
    FerhaBtn.addEventListener("click", () => {
      DegreeChange.innerHTML = `<p>${Fahrenheit}</p><span>°F</span>`;
      CelciusBtn.classList.remove("active");
      FerhaBtn.className = "active";

      // feel like changer
      DegreeFeel.innerHTML = `<h4>Feel Like: <span>${Fahrenheit}</span></h4>
        <span>°F</span>`;
    });
    //end
    // capitalize
    const conditionW = currentData.weather[0].description;
    const firstLetter = conditionW.charAt(0);
    const capital = firstLetter.toUpperCase();
    const remains = conditionW.slice(1);
    const conditionCaptial = capital + remains;

    //feel Like and weather condition
    document.querySelector(
      ".conditions"
    ).innerHTML = `<p>${conditionCaptial}</p>`;
    DegreeFeel.innerHTML = `<h4>Feel Like: <span>${Math.ceil(
      currentData.main.feels_like
    )}</span></h4>
      <span>°C</span>`;

    // wind speed
    const targetWind = document.querySelector(".wind");
    targetWind.innerHTML = `<p>Wind Speed : <span>${Math.round(
      currentData.wind.speed
    )}</span> <span>Km/h</span></p>`;

    // humdiity
    const targetHumidity = document.querySelector(".humidity");
    targetHumidity.innerHTML = `<p>Humidity : <span>  ${currentData.main.humidity}</span> <span>%</span></p>`;

    // sunrise sunset
    function SunriseSunsetF() {
      let options = { timeStyle: "short", hour12: true };

      const fullDateSunrise = new Date(currentData.sys.sunrise * 1000);
      const fullDateSunset = new Date(currentData.sys.sunset * 1000);

      const sunriseTi = fullDateSunrise.toLocaleString("en-us", options);
      const sunsetTi = fullDateSunset.toLocaleString("en-us", options);
      return [sunriseTi, sunsetTi];
    }

    // destructed returned array item from function
    const [sunriseTi, sunsetTi] = SunriseSunsetF();

    // backgroundchanger
    function backgroundChanger() {
      const localDate = new Date();
      const localHour = localDate.getHours();
      const fullDateSunrise = new Date(currentData.sys.sunrise * 1000);
      const fullDateSunset = new Date(currentData.sys.sunset * 1000);
      const sunriseHour = fullDateSunrise.getHours();
      const sunsetHour = fullDateSunset.getHours();
      if (localHour >= sunriseHour && localHour < sunsetHour) {
        console.log("local Time", localHour, "sunset", sunsetHour);
        console.log("day");
        bodyBG.style.background = `var(--body-light-background)`;
      } else if (localHour >= sunsetHour) {
        console.log("Night");
        bodyBG.style.background = `var(--body-dark-background)`;
      }
    }
    // backgroundChange on current city
    backgroundChanger();

    //Sunrise Sunset
    const sunriseSunset = document.querySelector(".times");
    sunriseSunset.innerHTML = `
<p>Sunrise: <span>${sunriseTi}</span></p>
<p>Sunset: <span>${sunsetTi}</span></p>
`;
    // city
    document.querySelector("#city").innerHTML = `${currentData.name}`;
    document.querySelector(
      "#country"
    ).innerHTML = `( ${currentData.sys.country} )`;
  } else {
    alert("Invalid Data Received || Please Enter City Name");
  }
}

async function showCoord(positions) {
  console.log("Is COORDS Working", positions);
  const lati = positions.coords.latitude;
  const longi = positions.coords.longitude;
  await FinalData(weatherAPI(lati, longi));
  // card open
  weatherDetailOpen("50vh","100%")
}

// when DOM loaded get location
document.addEventListener("DOMContentLoaded", () => {
  navigator.geolocation.getCurrentPosition(showCoord, (errorGeoAPI) => {
    console.warn("Geolocation API not Working", errorGeoAPI);
    alert("Failed to get Your Location, Please Enter a City Manually!!");
  });
  inputBox.focus();
});

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  // card details open
  weatherDetailOpen("50vh","100%")
  if (inputBox.value) {
    inputBox.placeholder = inputBox.value;
    FinalData(weatherAPI(null, null, inputBox.value));
    inputBox.placeholder = "Enter Next City";
  }
});

inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    // card details opens
    weatherDetailOpen("50vh","100%")

    if (inputBox.value) {
      inputBox.placeholder = inputBox.value;
      FinalData(weatherAPI(null, null, inputBox.value));
      inputBox.placeholder = "Enter Next City";
    }
    inputBox.focus(undefined);
  }
});
