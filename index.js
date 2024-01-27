const containerWeather = document.getElementById("containerWeather");
const containerImg = document.getElementById("containerImg");
const containerTitle = document.getElementById("containerTitle");
const inputCity = document.getElementById("inputCity");
const inputCountry = document.getElementById("inputCountry");
const btn = document.getElementById("btnSearch");
const APIkey = `335c87fe603f14b97380be07152af7e5`;

//obtiene latitud y longitud de la ciudad ingresada por el usuario
document.addEventListener("DOMContentLoaded", getGeocoding())

function getGeocoding(){
    btn.addEventListener("click", async ()=>{
        const city = inputCity.value
        const country = inputCountry.value
        
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${APIkey}`);
        if(!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        const {lat, lon} = data[0]

        const img = await getWeatherImg(lat, lon)// carga la imagen del clima y la muestra
        const weather = await getWeather(lat, lon) //toma la latitud y longitud para cargar la info y mostrar el templeate
        showWeather(weather,city, country)
        inputCity.value = ""; //limpiar los campos
        inputCountry.value = ""; 
    });  
}
//obtiene informacion del clima pronosticado para los siguiente siete dias de cada ciudad 
async function getWeather(lat, lon){
    const response = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`);
    if(!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();
    const {dataseries} = data //array con el clima de los siete dias
    return dataseries
}
//imagenes del clima de los siguientes siete dias de cada ciudad
async function getWeatherImg(lat, lon){
    const response = await fetch(`https://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`);
    if(!response.ok) throw new Error(`${response.status}`);
    const data = await response.blob()
    const urlImg = URL.createObjectURL(data)
    let template =`<img id="imgWeather" src="${urlImg}" alt="ayuda visual del clima">`
    containerImg.innerHTML = template
}
//template del clima que se muestra por cada ciudad con el pronostico
async function showWeather(array, city, country){
    let template =``;
    let templeateTitle =`<h2>${city}, ${country}</h2>`;
    for (let index = 0; index < array.length; index++) {
           const element = array[index];
           const {date, weather, temp2m} = element
          template += `
              <div class="cardWeather">
                <h3>Date: ${date} </h3>
                <p>Weather: ${weather} </p>
                <p> temp max: ${temp2m.max} temp min: ${temp2m.min}</p>
             </div>
           `
        }
        containerTitle.innerHTML = templeateTitle
        containerWeather.innerHTML = template
};