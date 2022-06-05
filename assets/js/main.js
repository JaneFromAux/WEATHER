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

// Template Wrapper

const resetWrapper = `<button class="slider__button slider__button--left">&larr;</button>
<button class="slider__button slider__button--right">&rarr;</button>
<div class="dots"></div>`;

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

const slider = () => {
    const slides = document.querySelectorAll('.container-fc');
    const btnRight = document.querySelector('.slider__button--right');
    const btnLeft = document.querySelector('.slider__button--left');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlides = slides.length;

    const createDots = () => {
        slides.forEach((_,i) => {
            dotContainer.insertAdjacentHTML('beforeend', 
            `<button class='dots__dot' data-slide='${i}'></button>`)
        })
    }

    const activateDot = (slide) => {
        document.querySelectorAll('.dots__dot').forEach(dot => {
            dot.classList.remove('dots__dot--active')
        });
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }

    const goToSlide = slide => {
        slides.forEach((s,index) => s.style.transform = `translateX(${(index - slide) * 100}%)`);
    }

    const nextSlide = () => {
        curSlide++;
        if(curSlide === maxSlides) curSlide = 0;
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    
    const prevSlide = () => {
        curSlide--;
        if(curSlide === -1) curSlide = maxSlides - 1;
        goToSlide(curSlide);
        activateDot(curSlide);
    }

    const init = () => {
        goToSlide(curSlide);
        createDots();
        activateDot(curSlide);
    }

    init();
    
    btnRight.addEventListener('click',nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    dotContainer.addEventListener('click', e => {
        if(e.target.classList.contains('dots__dot')) {
            const slide = e.target.dataset.slide;
            goToSlide(slide);
            activateDot(slide);
        }
    })

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
    btnFC.textContent = 'Show Less';
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
                const html = createHTML(foreCastObj);
                wrapper.insertAdjacentHTML('beforeend',html);
                document.body.querySelector('.container-fc').scrollIntoView({behavior: 'smooth'});
            })
        })
        .then(() => sectionForecast.classList.remove('hidden'))
        .then(() => slider());
}

const fetchGeo = (city, limit) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
        .then(response => response.json())
        .then(json => {
            fetchWeather(json[0].lon, json[0].lat);
            wrapper.innerHTML = resetWrapper;
            fetchForecast(json[0].lon, json[0].lat);
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