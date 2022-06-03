'use strict';

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');


const calToCel = (temp) => {
    return Math.round(temp - 273.15);
}

const fetchWeather = (lon, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`).then(response => response.json()).then(json => {
        console.log(json);
        console.log(json.weather[0].main);
        console.log(json.weather[0].description);
        console.log(calToCel(json.main.temp));
        console.log(calToCel(json.main.feels_like));
        console.log(calToCel(json.main.temp_min));
        console.log(calToCel(json.main.temp_max));
    });
}

const fetchForecast = (lon,lat) => {
    let counter = 0;
    console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        json.list.forEach(el => {
            counter++;
            console.log(calToCel(el.main.temp),counter);
        })
    })
}

const fetchGeo = (city,limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
    .then(response => response.json())
    .then(json => {
        fetchWeather(json[0].lon, json[0].lat);
        fetchForecast(json[0].lon, json[0].lat);
    })
}

btn.addEventListener('click',x => {
    let city = inputCity.value;
    let limit = 5;
    fetchGeo(city,limit);
});