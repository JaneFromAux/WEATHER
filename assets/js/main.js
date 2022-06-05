'use strict';
// language for js lib
moment.locale('de');

// HTML ELEMENTS
const key = '6b2723a1c78fa552dac0f78569b46380';
const aHome = document.querySelector('.a-home');
const header = document.querySelector('header');
const nav = document.querySelector('header nav');
const main = document.querySelector('main');
const btn = document.querySelector('#btn');
const inputCity = document.querySelector('#city');
const btnFC = document.querySelector('.show-fc');
const sectionForecast = document.querySelector('.forecast');
const sectionCurrent = document.querySelector('.current__weather');
const currentIcon = document.querySelector('.current__weather__icon');
const wrapper = document.querySelector('.wrapper');

let todaysWeather = document.querySelector('#todaysWeather_output');
let today = document.querySelector('#today_output');
let temp = document.querySelector('#temp_output');
let feelsLike = document.querySelector('#feelsLike_output');
let tempMin = document.querySelector('#tempMin_output');
let tempMax = document.querySelector('#tempMax_output');

// Template for Forecast
const createHTML = (obj) => {
    return `<div class="container-fc">
    <h4>${obj.headline}</h4>
    <img src="${obj.srcIcon}" alt="icon">
    <div class="grid-fc">
        <div class="flex-fc">
            <span>Durchschnittliches Wetter</span>
            <span>${obj.weather}</span>
        </div>
        <div class="flex-fc">
            <span>Durchschnittstemperatur</span>
            <span>${obj.tempAvg}</span>
        </div>
        <div class="flex-fc">
            <span>Mindest-Temperatur</span>
            <span>${obj.tempMin}</span>
        </div>
        <div class="flex-fc">
            <span>Maximal-Temperatur</span>
            <span>${obj.tempMax}</span>
        </div>
    </div>
</div>`
}

const fetchWeather = (lon, lat) => {
    sectionCurrent.classList.remove('hidden');
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
        btnFC.textContent = 'Show More';
        return;
    }
    btnFC.textContent = 'Show Less';
    wrapper.innerHTML = '';

    // Zum speichern der Werte
    const foreCastObj = {};

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
            array.forEach((outer) => {
                
                // declare variables --> scoping
                const temps = [];
                foreCastObj.srcIcon = `http://openweathermap.org/img/wn/${outer[Math.round(outer.length / 2)].weather[0].icon}@2x.png`;

                // getting temps per day
                outer.forEach(inner => {
                    foreCastObj.headline = moment(inner.dt_txt).format('LL');
                    foreCastObj.weather = inner.weather[0].description;
                    temps.push(inner.main.temp);
                })

                // Calculating temps
                foreCastObj.tempMin = `${Math.round(Math.min(...temps))} °C`;
                foreCastObj.tempMax = `${Math.round(Math.max(...temps))} °C`;
                foreCastObj.tempAvg = `${Math.round(temps.reduce((a,b) => a + b) / temps.length)} °C`;

                // Create and insert HTML Template
                wrapper.innerHTML += createHTML(foreCastObj);

                document.body.querySelector('.container-fc').scrollIntoView({behavior: 'smooth'});
            })
        })
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            wrapper.innerHTML = '';
            btnFC.classList.remove('hidden');
            btnFC.addEventListener('click', e => {
                fetchForecast(json[0].lon, json[0].lat);
            })
        })
}


// =================================================
//                 EVENT Listener

btn.addEventListener('click', x => {
    let city = inputCity.value;
    let limit = 5;
    fetchGeo(city, limit);
});

aHome.addEventListener('click', e => {
    e.preventDefault();
    header.scrollIntoView({behavior: "smooth"});
})

// ================================================
//                  Sticky Navbar

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
    const [entry] = entries;
    if(!entry.isIntersecting) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
})

headerObserver.observe(header);