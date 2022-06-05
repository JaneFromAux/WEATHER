'use strict';

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
let todaysWeather = document.querySelector('#todaysWeather_output');
let today = document.querySelector('#today_output');
let temp = document.querySelector('#temp_output');
let feelsLike = document.querySelector('#feelsLike_output');
let tempMin = document.querySelector('#tempMin_output');
let tempMax = document.querySelector('#tempMax_output');


const calToCel = (temp) => {
    return Math.round(temp - 273.15);
}

document.body.style.fontFamily = "Helvetica";

const fetchWeather = (lon, lat) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`).then(response => response.json()).then(json => {

        console.log(json);
        console.log(json.weather[0].main);
        todaysWeather.innerHTML = "Today's Weather ☀️"
        today.innerHTML = "Today we have: " + json.weather[0].main;
        //if (json.weather[0].main >= 20) {
        //     document.body.style.add("sun");
        // } else {
        //     document.body.style.add("");
        // };
        temp.innerHTML = calToCel(json.main.temp) + " °C";
        feelsLike.innerHTML = "Feels like: " + calToCel(json.main.feels_like) + " °C";
        tempMin.innerHTML = "Min. temperature will be: " + calToCel(json.main.temp_min) + " °C";
        tempMax.innerHTML = "Max. temperature will be: " + calToCel(json.main.temp_max) + " °C";
        console.log(json.weather[0].description);
        console.log(calToCel(json.main.temp));
        console.log(calToCel(json.main.feels_like));
        console.log(calToCel(json.main.temp_min));
        console.log(calToCel(json.main.temp_max));
    });
}

const fetchForecast = (lon, lat) => {
    let counter = 0;
    console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            json.list.forEach(el => {
                counter++;
                console.log(calToCel(el.main.temp), counter);
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
