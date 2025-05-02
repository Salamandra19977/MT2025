let input_city = document.getElementById("city")
let btn_search = document.getElementById("search")
let list_cities = document.getElementById("list_cities")
let weather_container = document.getElementById("weather_container")
let city_conteiner = document.getElementById("city_conteiner")
let url_search_city = `http://api.weatherapi.com/v1/search.json?key=571dca4c5ac842b093962531252904`
let url_search_weather = `http://api.weatherapi.com/v1/forecast.json?key=571dca4c5ac842b093962531252904&days=14`

function search_weather() {
    let city = input_city.value
    if(!document.getElementById("notFound")) {
        fetch(url_search_weather+`&q=${city}`, {
            method: "GET"
        })
        .then(async function(response){
            const weather = await response.json()
            draw(weather)
        }) 
    } else {
        alertify.error("Not found city")
    }

}

function search_city() {
    let city = input_city.value
    list_cities.innerHTML = null
    if (city.trim()) {
        fetch(url_search_city+`&q=${city}`, {
            method: "GET"
        })
        .then(async function(response){
            const cities = await response.json()
            if (response.ok && cities.length > 0) {
                cities.forEach(city => {
                    let item_city = document.createElement('div')
                    item_city.setAttribute("class", "item_city")
                    item_city.setAttribute("onclick", "setNameCity(this.innerText)")
                    item_city.textContent = city.name
                    list_cities.append(item_city)
                }); 
            } else {
                list_cities.innerHTML = "<div id='notFound'>Could not find such city</div>"
            }

            if (response.status == 400) {
                alertify.error("Bad Request")
            }
        })
        .catch(error => {
            alertify.error(error)
        });
    }

}

function setNameCity(name) {
    input_city.value = name
    list_cities.innerHTML = null
}

function draw(obj) { 
    let city_obj = obj.location
    let weather_forecast = obj.forecast.forecastday
    document.body.style.backgroundImage = `url(https:${obj.current.condition.icon})`
    weather_container.innerHTML = null
    weather_forecast.forEach(weather=>{
        weather_container.innerHTML += `
            <div class="weather">
                <p>Date: ${weather.date}</p>
                <p>${weather.day.condition.text}</p>
                <p>Min tem: ${weather.day.mintemp_c}</p>
                <p>Max tem: ${weather.day.maxtemp_c}</p>
                <p>Totalprecip_mm: ${weather.day.totalprecip_mm}</p>
                <p>Maxwind_kph: ${weather.day.maxwind_kph}</p>
                <img src="https:${weather.day.condition.icon}" alt="">
            </div>
        `
    })

    city_conteiner.innerHTML = `
        <div class="city">
            <p>Country: ${city_obj.country}</p>
            <p>Region: ${city_obj.region}</p>
            <p>Lat: ${city_obj.lat}</p>
            <p>Lon: ${city_obj.lon}</p>
        </div>
    `
}

input_city.addEventListener("input", search_city)
btn_search.addEventListener("click", search_weather)
