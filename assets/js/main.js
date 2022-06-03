'use strict';

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
const sectionCurrent = document.querySelector('.current-weather');
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
            let array = [[],[],[],[],[],[]];
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
                } else {
                    array[5].push(el);
                }
            })
            array.forEach((outer, index) => {

                // Creating Elements
                const sectionFC = document.createElement('section');
                const h3FC = document.createElement('h3');
                const gridFC = document.createElement('div');
                const labelWeatherFC = document.createElement('span');
                const weatherFC = document.createElement('span');
                const labelDescFC = document.createElement('span');
                const descFC = document.createElement('span');
                const labelAvgFC = document.createElement('span');
                const tempAvgFC = document.createElement('span');
                const labelMinFC = document.createElement('span');
                const tempMinFC = document.createElement('span');
                const labelMaxFC = document.createElement('span');
                const tempMaxFC = document.createElement('span');

                // TextContent Static Elements
                labelWeatherFC.textContent = `Current Weather`;
                labelDescFC.textContent = `Detailed Weather`;
                labelAvgFC.textContent = `Average Temperature`;
                labelMinFC.textContent = `Min Temperature`;
                labelMaxFC.textContent = `Max Temperature`;
                
                // Berechnung temps
                const temps = [];

                outer.forEach(inner => {
                    h3FC.textContent = moment(inner.dt_txt).format('MMM Do YY');
                    weatherFC.textContent = inner.weather[0].main;
                    descFC.textContent = inner.weather[0].description;
                    temps.push(inner.main.temp);
                })

                tempMinFC.textContent = calToCel(Math.min(...temps));
                tempMaxFC.textContent = calToCel(Math.max(...temps));
                // tempAvgFC.textContent = temps.reduce((a,b) => a + b) / temps.length;

                // Zusammenbau Element
                sectionFC.insertAdjacentElement('afterbegin', h3FC);
                sectionFC.insertAdjacentElement('beforeend', gridFC);
                gridFC.insertAdjacentElement('beforeend', labelWeatherFC);
                gridFC.insertAdjacentElement('beforeend', weatherFC);
                gridFC.insertAdjacentElement('beforeend', labelDescFC);
                gridFC.insertAdjacentElement('beforeend', descFC);
                gridFC.insertAdjacentElement('beforeend', labelAvgFC);
                gridFC.insertAdjacentElement('beforeend', tempAvgFC);
                gridFC.insertAdjacentElement('beforeend', labelMinFC);
                gridFC.insertAdjacentElement('beforeend', tempMinFC);
                gridFC.insertAdjacentElement('beforeend', labelMaxFC);
                gridFC.insertAdjacentElement('beforeend', tempMaxFC);
                sectionCurrent.insertAdjacentElement('beforeend', sectionFC);
            })
        })
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            fetchForecast(json[0].lon, json[0].lat);
        })
}

btn.addEventListener('click', x => {
    let city = inputCity.value;
    let limit = 5;
    fetchGeo(city, limit);
});