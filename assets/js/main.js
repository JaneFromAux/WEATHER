<<<<<<< HEAD
//6b2723a1c78fa552dac0f78569b46380
// b53e702a55e76e6d14797bc3015565b1
// 53.551086 // lat
// 9.993682 // long

<<<<<<< HEAD
fetch('https://api.openweathermap.org/data/2.5/weather?lat=53.551086&lon=9.993682&appid=b53e702a55e76e6d14797bc3015565b1')
    .then(response => response.json())
    .then(json => {
=======
=======
'use strict';
// language for js lib
moment.locale('de');

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const aHome = document.querySelector('.a-home');
const header = document.querySelector('header');
const main = document.querySelector('main');
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
const btnFC = document.querySelector('.show-fc');
const sectionForecast = document.querySelector('.forecast');
const sectionCurrent = document.querySelector('.current__weather');
const currentIcon = document.querySelector('.current__weather__icon');
const wrapper = document.querySelector('.wrapper');
>>>>>>> 76039b00d685e81744864a503a035d883d4f4411

let todaysWeather = document.querySelector('#todaysWeather_output');
let today = document.querySelector('#today_output');
let temp = document.querySelector('#temp_output');
let feelsLike = document.querySelector('#feelsLike_output');
let tempMin = document.querySelector('#tempMin_output');
let tempMax = document.querySelector('#tempMax_output');

// Template for Forecast
const createHTML = (date,srcIconFC,weather,tempAvg, tempMin, tempMax) => {
    return `<div class="container-fc">
    <h4>${date}</h4>
    <img src="${srcIconFC}" alt="icon">
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
    .then(json => { 
        let srcIcon = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
        currentIcon.setAttribute('src',srcIcon);

        today.innerHTML = json.weather[0].description;
        temp.innerHTML = Math.round(json.main.temp) + " °C";
        feelsLike.innerHTML = Math.round(json.main.feels_like) + " °C";
        tempMin.innerHTML = Math.round(json.main.temp_min) + " °C";
        tempMax.innerHTML = Math.round(json.main.temp_max) + " °C";
        document.querySelector('.current__weather').scrollIntoView({behavior: 'smooth'});
    });
}

const fetchForecast = (lon, lat) => {
    if(wrapper.childNodes.length !== 0) {
        wrapper.innerHTML = '';
        wrapper.classList.add.hidden;
        btn.textContent = 'Show More';
        return;
    }
    btn.textContent = 'Show Less';
    wrapper.innerHTML = '';

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}&lang=de`)
        .then(response => response.json())
        .then(json => {
            console.log(json);

<<<<<<< HEAD
fetch(fetchGeo)
.then(response => response.json())
.then(json => {
    console.log(json);
    lat = json[0].lat;
    lon = json[0].lon;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6b2723a1c78fa552dac0f78569b46380`).then(response => response.json()).then(json => {
        // for (let i in json) {
        //     console.log(i);
        // }
        // document.body.innerHTML += Object.values(json);
        // console.log(Object.values(json));
>>>>>>> refs/remotes/origin/main
        console.log(json);
    });
})
=======
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
                console.log(outer);
                let srcIconFC = `http://openweathermap.org/img/wn/${outer[Math.round(outer.length / 2)].weather[0].icon}@2x.png`;

                // getting temps per day
                outer.forEach(inner => {
                    headlineFC = moment(inner.dt_txt).format('LL');
                    weatherFC = inner.weather[0].description;
                    temps.push(inner.main.temp);
                })

                // Calculating temps
                const tempMin = `${Math.round(Math.min(...temps))} °C`;
                const tempMax = `${Math.round(Math.max(...temps))} °C`;
                const tempAvg = `${Math.round(temps.reduce((a,b) => a + b) / temps.length)} °C`;

                // Create and insert HTML Template
                wrapper.innerHTML += createHTML(headlineFC,srcIconFC ,weatherFC,tempAvg,tempMin,tempMax);

                document.body.querySelector('.container-fc').scrollIntoView({behavior: 'smooth'});
            })
        })
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            sectionCurrent.classList.remove('hidden');
            wrapper.innerHTML = '';
            btnFC.classList.remove('hidden');
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

aHome.addEventListener('click', e => {
    e.preventDefault();
    header.scrollIntoView({behavior: "smooth"});
})
>>>>>>> 76039b00d685e81744864a503a035d883d4f4411
