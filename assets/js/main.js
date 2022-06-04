'use strict';
// language for js lib
moment.locale('de');

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
const btnFC = document.querySelector('.show-fc');
const sectionForecast = document.querySelector('.forecast');
const currentIcon = document.querySelector('.current__weather__icon');
const wrapper = document.querySelector('.wrapper');

let todaysWeather = document.querySelector('#todaysWeather_output');
let today = document.querySelector('#today_output');
let temp = document.querySelector('#temp_output');
let feelsLike = document.querySelector('#feelsLike_output');
let tempMin = document.querySelector('#tempMin_output');
let tempMax = document.querySelector('#tempMax_output');

// Template for Forecast
const createHTML = (date,weather,tempAvg, tempMin, tempMax) => {
    return `<div class="container-fc">
    <h4>${date}</h4>
    <div class="grid-fc">
        <div class="flex-fc">
            <span>Durchschnittliches Wetter</span>
            <span>${weather}</span>
        </div>
        <div class="flex-fc">
            <span>Durchschnittstemperatur</span>
            <span>${tempAvg}</span>
        </div>
        <div class="flex-fc">
            <span>Mindest-Temperatur</span>
            <span>${tempMin}</span>
        </div>
        <div class="flex-fc">
            <span>Maximal-Temperatur</span>
            <span>${tempMax}</span>
        </div>
    </div>
</div>`
}

const fetchWeather = (lon, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}&lang=de`)
    .then(response => response.json())
    .then(json => {   console.log(json);
        let srcIcon = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
        currentIcon.setAttribute('src',srcIcon);

        today.innerHTML = json.weather[0].description;
        temp.innerHTML = Math.round(json.main.temp) + " °C";
        feelsLike.innerHTML = Math.round(json.main.feels_like) + " °C";
        tempMin.innerHTML = Math.round(json.main.temp_min) + " °C";
        tempMax.innerHTML = Math.round(json.main.temp_max) + " °C";
    });
}

const fetchForecast = (lon, lat) => {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}&lang=de`)
        .then(response => response.json())
        .then(json => {

            // create variables for better readability and scoping
            let array = [[],[],[],[],[]];
            let muster = json.list[0].dt_txt.slice(0, json.list[0].dt_txt.indexOf(' '));
            let date = moment(muster);
            let day2 = date.clone().add(1,'days');
            let day3 = date.clone().add(2,'days');
            let day4 = date.clone().add(3,'days');
            let day5 = date.clone().add(4,'days');
            let day6 = date.clone().add(5,'days');

            // Aufteilen der Objects nach Datum, pro Tag ein Array mit objects
            json.list.forEach(el => {
                let compare = moment(el.dt_txt);
                if ( compare < day2) array[0].push(el);
                else if (compare < day3) array[1].push(el);
                else if (compare < day4) array[2].push(el);
                else if (compare < day5) array[3].push(el);
                else if (compare < day6) array[4].push(el);
            })
            array.forEach((outer, index) => {
                
                // declare variables --> scoping
                const temps = [];
                let headlineFC;
                let weatherFC;

                // getting temps per day
                outer.forEach(inner => {
                    let srcIcon = `http://openweathermap.org/img/wn/${inner.weather[0].icon}@2x.png`;
                    headlineFC = moment(inner.dt_txt).format('LL');
                    // weatherFC.textContent = inner.weather[0].main;
                    weatherFC = inner.weather[0].description;
                    temps.push(inner.main.temp);
                })

                // Calculating temps
                const tempMin = `${Math.round(Math.min(...temps))} °C`;
                const tempMax = `${Math.round(Math.max(...temps))} °C`;
                const tempAvg = `${Math.round(temps.reduce((a,b) => a + b) / temps.length)} °C`;

                // Create and insert HTML Template
                const html = createHTML(headlineFC,weatherFC,tempAvg,tempMin,tempMax);
                wrapper.insertAdjacentHTML('beforeend', html);
            })
        })
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            btnFC.classList.remove('hidden');
            wrapper.innerHTML = '';
            btnFC.addEventListener('click', e => {
                fetchForecast(json[0].lon, json[0].lat);
            })
        })
}


// API World Map
// doesn't work. google api what u doin

// const mapLayer = 'temp_new';
// const mapZ = 0;
// const mapX = 0;
// const mapY = 0;

// fetch(`https://tile.openweathermap.org/map/${mapLayer}/${mapZ}/${mapX}/${mapY}.png?appid=${key}`).then(response => console.log(response));

// EVENT Listener

btn.addEventListener('click', x => {
    let city = inputCity.value;
    let limit = 5;
    fetchGeo(city, limit);
});