//6b2723a1c78fa552dac0f78569b46380
// 53.551086 // lat
// 9.993682 // long



// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

let state = 'augsburg';
let city = 'königsbrunn';
let limit = 5;
let lon;
let lat;


const fetchGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=6b2723a1c78fa552dac0f78569b46380`;


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
        console.log(json);
    });
})
