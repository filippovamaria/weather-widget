const API_KEY = "05b28519f3c1770240a2731c2f3f1683"
const input = document.querySelector(".widget_search_input")
const searchResultsDiv = document.querySelector(".widget_searchResult")
const icon = document.querySelector(".widget_search_icon")
const currentTemp = document.querySelector(".widget_info_temp_current")
const feelsLikeTemp = document.querySelector(".widget_info_temp_feelsLike")
const cityName = document.querySelector(".widget_info_cityNameAndIcon_cityName")
const minTemp = document.querySelector(".widget_info_temp_min")
const maxTemp = document.querySelector(".widget_info_temp_max")
const weather = document.querySelector(".widget_info_cityNameAndIcon_icon")

function fetch(url, callback) {
    const xhr = new XMLHttpRequest()

    xhr.open("GET", url)

    xhr.addEventListener("readystatechange", (e) => {
        if (e.target.status !== 200) {
            console.log("Error")
            return
        }

        if (e.target.readyState !== 4) {
            return
        }

        const data = JSON.parse(e.target.responseText)
        callback(data)
    })
    xhr.send()
}

fetch("https://api.hh.ru/areas", (data) => {

    const rusAreas = data[0]["areas"];
    let arrayOfCityName = []

    for (let i = 0; i < rusAreas.length; i++) {
        const citiesOfArea = rusAreas[i]["areas"];

        for (let j = 0; j < citiesOfArea.length; j++) {
            const cities = citiesOfArea[j];
            arrayOfCityName.push(cities["name"]);
        }
    }

    input.addEventListener('input', function (e) {
        searchResultsDiv.innerHTML = ""
        const filteredArrayOfCities = arrayOfCityName.filter((city) => city.toLowerCase().split().join().includes(e.target.value.toLowerCase()))

        for (let i = 0; i < filteredArrayOfCities.length; i++) {
            const newElement = document.createElement("p")
            newElement.innerHTML = filteredArrayOfCities[i]
            searchResultsDiv.appendChild(newElement)

            newElement.addEventListener("click", (e) => {
                input.value = e.target.innerHTML
                searchResultsDiv.innerHTML = ""
                addClickForIcon()
            })
        }

        if (input.value === "") {
            searchResultsDiv.innerHTML = ""
        }
    });

})

function addClickForIcon() {
    icon.addEventListener("click", function () {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${API_KEY}&units=metric`
        fetch(url, (data) => {
            currentTemp.textContent = Math.round(data.main.temp) + "˚"
            feelsLikeTemp.textContent = "Feels like " + Math.round(data.main.feels_like)
            cityName.textContent = input.value
            minTemp.textContent = "Min: " + Math.round(data.main.temp_min)
            maxTemp.textContent = "Max: " + Math.round(data.main.temp_max)
            weather.src = getIconWeather(data.weather.id)
        })
    })
}

function getIconWeather(id) {
    let imageCode = "";

    switch (id) {
        case (id >= 200 && i <= 232):
            imageCode = "11d"
            break
        case (id >= 300 && i <= 321):
            imageCode = "09d"
            break
        case (id >= 500 && i <= 531):
            imageCode = "10d"
            break
        case (id >= 600 && i <= 622):
            imageCode = "13d"
            break
        case (id >= 701 && i <= 781):
            imageCode = "50d"
            break
        case (800):
            // imageCode = "01d"
            return "/clear.svg"
            break
        case (id >= 801 && i <= 804):
            imageCode = "02d"
            break
        default:
            return "/clear.svg"
    }

    console.log(imageCode)
    return `http://openweathermap.org/img/wn/${imageCode}@2x.png`
}