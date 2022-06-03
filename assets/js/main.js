//6b2723a1c78fa552dac0f78569b46380
// 53.551086 // lat
// 9.993682 // long

fetch('https://api.openweathermap.org/data/2.5/weather?lat=53.551086&lon=9.993682&appid=6b2723a1c78fa552dac0f78569b46380')
    .then(response => response.json())
    .then(json => {
        console.log(json);
    });