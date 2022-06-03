'use strict';

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
const btnFC = document.querySelector('.show-fc');
const sectionForecast = document.querySelector('.forecast');

let todaysWeather = document.querySelector('#todaysWeather_output');
let today = document.querySelector('#today_output');
let temp = document.querySelector('#temp_output');
let feelsLike = document.querySelector('#feelsLike_output');
let tempMin = document.querySelector('#tempMin_output');
let tempMax = document.querySelector('#tempMax_output');


const calToCel = (temp) => {
    return Math.round(temp - 273.15);
}

const fetchWeather = (lon, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`).then(response => response.json()).then(json => {
        document.body.style.fontFamily = "Helvetica";

        todaysWeather.innerHTML = "Today's Weather ☀️"
        today.innerHTML = "Today we have: " + json.weather[0].main;
        temp.innerHTML = "Temperature: " + calToCel(json.main.temp) + " °C";
        feelsLike.innerHTML = "Feels like: " + calToCel(json.main.feels_like) + " °C";
        tempMin.innerHTML = "Min. temperature will be: " + calToCel(json.main.temp_min) + " °C";
        tempMax.innerHTML = "Max. temperature will be: " + calToCel(json.main.temp_max) + " °C";
        // console.log(json.weather[0].description);
        // console.log(calToCel(json.main.temp));
        // console.log(calToCel(json.main.feels_like));
        // console.log(calToCel(json.main.temp_min));
        // console.log(calToCel(json.main.temp_max));
    });
}

const fetchForecast = (lon, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            let array = [[],[],[],[],[]];
            let muster = json.list[0].dt_txt.slice(0, json.list[0].dt_txt.indexOf(' '));
            let date = moment(muster);
            let day2 = date.clone().add(1,'days');
            let day3 = date.clone().add(2,'days');
            let day4 = date.clone().add(3,'days');
            let day5 = date.clone().add(4,'days');
            let day6 = date.clone().add(5,'days');
            json.list.forEach(el => {
                let compare = moment(el.dt_txt);
                if ( compare < day2) {
                    array[0].push(el);
                } else if (compare < day3) {
                    array[1].push(el);
                } else if (compare < day4) {
                    array[2].push(el);
                } else if (compare < day5) {
                    array[3].push(el);
                } else if (compare < day6){
                    array[4].push(el);
                } 
                // else {
                //     array[5].push(el);
                // }
            })
            array.forEach((outer, index) => {

                // Creating Elements
                const containerFC = document.createElement('div');
                const headlineFC = document.createElement('h4');
                const gridFC = document.createElement('div');
                const flexWeatherFC = document.createElement('div');
                const labelWeatherFC = document.createElement('span');
                const weatherFC = document.createElement('span');
                const flexDescFC = document.createElement('div');
                const labelDescFC = document.createElement('span');
                const descFC = document.createElement('span');
                const flexAvgFC = document.createElement('div');
                const labelAvgFC = document.createElement('span');
                const tempAvgFC = document.createElement('span');
                const flexMinFC = document.createElement('div');
                const labelMinFC = document.createElement('span');
                const tempMinFC = document.createElement('span');
                const flexMaxFC = document.createElement('div');
                const labelMaxFC = document.createElement('span');
                const tempMaxFC = document.createElement('span');

                // Adding Classes
                containerFC.classList.add('container-fc');
                gridFC.classList.add('grid-fc');
                flexWeatherFC.classList.add('flex-fc');
                flexDescFC.classList.add('flex-fc');
                flexAvgFC.classList.add('flex-fc');
                flexMinFC.classList.add('flex-fc');
                flexMaxFC.classList.add('flex-fc');

                // TextContent Static Elements
                labelWeatherFC.textContent = `Current Weather`;
                labelDescFC.textContent = `Detailed Weather`;
                labelAvgFC.textContent = `Average Temperature`;
                labelMinFC.textContent = `Min Temperature`;
                labelMaxFC.textContent = `Max Temperature`;
                
                // Berechnung temps
                const temps = [];

                outer.forEach(inner => {
                    headlineFC.textContent = moment(inner.dt_txt).format('MMMM Do');
                    weatherFC.textContent = inner.weather[0].main;
                    descFC.textContent = inner.weather[0].description;
                    temps.push(inner.main.temp);
                })

                tempMinFC.textContent = `${calToCel(Math.min(...temps))} °C`;
                tempMaxFC.textContent = `${calToCel(Math.max(...temps))} °C`;
                tempAvgFC.textContent = `${calToCel(temps.reduce((a,b) => a + b) / temps.length)} °C`;

                // Zusammenbau Element
                containerFC.insertAdjacentElement('afterbegin', headlineFC);
                containerFC.insertAdjacentElement('beforeend', gridFC);
                gridFC.insertAdjacentElement('beforeend',flexWeatherFC);
                gridFC.insertAdjacentElement('beforeend',flexDescFC);
                gridFC.insertAdjacentElement('beforeend',flexAvgFC);
                gridFC.insertAdjacentElement('beforeend',flexMinFC);
                gridFC.insertAdjacentElement('beforeend',flexMaxFC);

                flexWeatherFC.insertAdjacentElement('beforeend', labelWeatherFC);
                flexWeatherFC.insertAdjacentElement('beforeend', weatherFC);
                flexDescFC.insertAdjacentElement('beforeend', labelDescFC);
                flexDescFC.insertAdjacentElement('beforeend', descFC);
                flexAvgFC.insertAdjacentElement('beforeend', labelAvgFC);
                flexAvgFC.insertAdjacentElement('beforeend', tempAvgFC);
                flexMinFC.insertAdjacentElement('beforeend', labelMinFC);
                flexMinFC.insertAdjacentElement('beforeend', tempMinFC);
                flexMaxFC.insertAdjacentElement('beforeend', labelMaxFC);
                flexMaxFC.insertAdjacentElement('beforeend', tempMaxFC);

                sectionForecast.insertAdjacentElement('beforeend', containerFC);
            })
        })
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            btnFC.classList.remove('hidden');
            btnFC.addEventListener('click', e => {
                fetchForecast(json[0].lon, json[0].lat);
            })
        })
}


// API World Map

const mapLayer = 'temp_new';
const mapZ = 0;
const mapX = 0;
const mapY = 0;

fetch(`https://tile.openweathermap.org/map/${mapLayer}/${mapZ}/${mapX}/${mapY}.png?appid=${key}`).then(response => console.log(response));

// EVENT Listener

btn.addEventListener('click', x => {
    let city = inputCity.value;
    let limit = 5;
    fetchGeo(city, limit);
});