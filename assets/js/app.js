
//moment
var momentTime = moment().format("MMMM Do YYYY");


//variables
var APIKey = "e885fd3db621744dfef49f4c1e174dc6";
var submitCity = $("#submit-city");
var cityHistory = $("#city-history");
var currentWeather = $("#current-weather");
var fiveDay = $("#five-day");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var city = "" || searchHistory[0];
getForecast(getCurrentWeather(city));

// function for page to hold search history
function loadHistory() {
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.text(searchHistory[i]);
        historyDivs.addClass('list-group-item');
        historyDivs.attr("data-city", searchHistory[i]);
        historyDivs.addClass("saved-city");
        historyDivs.appendTo(cityHistory);
    }
}

// function for 5 day forecast 
function getForecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial"

    // AJAX call to get 5 day forecast
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (forecastData) {

            fiveDay.empty();
            for (var j = 0; j < forecastData.list.length; j++) {
                if (forecastData.list[j].dt_txt.indexOf("00:00:00") !== -1) {
                    var farenTemp = Math.floor((forecastData.list[j].main.temp));

                    // formatting date and time of forecast
                    var fiveDayDate = moment(new Date(forecastData.list[j].dt_txt).toLocaleDateString()).format("LL");

                    // putting forecast in cards
                    var card = $('<div class ="card">');
                    var cardBody = $('<div class="card-body">');
                    var cardIcon = $('<img class="images" src ="https://openweathermap.org/img/wn/' + forecastData.list[j].weather[0].icon + '@2x.png"/>')
                    cardIcon.appendTo(cardBody);

                    $('<p class="card-text">').text(fiveDayDate).appendTo(cardBody);
                    $('<p class="card-text">').text("Temperature (F): " + farenTemp).appendTo(cardBody);
                    $('<p class="card-text">').text("Humidity: " + forecastData.list[j].main.humidity + " %").appendTo(cardBody);

                    card.append(cardBody);

                    fiveDay.append(card);
                }

            }


        })
};

// function to get the current weather
function getCurrentWeather(city) {
    var cityInput = city || $('#cityInput').val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;

    // Running AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (weatherData) {

            // converting temperatures from Kelvin to Fahrenheit 
            var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
            var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

            // adding icons to weather condition
            var imgIcon = $('<img>');
            imgIcon.attr('class', 'image');
            imgIcon.attr('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');

            currentWeather.empty();
            $('#icon').empty();

            // formatting current weather data and icons
            $('#icon').append(imgIcon)
            $('<h3>').text("City: " + weatherData.name).appendTo(currentWeather)
            $('<h3>').text("Date: " + momentTime).appendTo(currentWeather)
            $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather)
            $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather)
            $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
            $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather)

            // variables holding latitude and longitude 
            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            //Adds the UV Index to current weather
            var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: queryURL2,
                method: "GET"
            })
                // Getting UV index and color code for index
                .then(function (moreData) {
                    $('<h3 id = ' + city + '>').text("UV Index: " + moreData.value).appendTo(currentWeather);

                    if (moreData.value <= 2) {
                        $('#' + city).addClass('green');
                    }
                    else if (moreData.value <= 5) {
                        $('#' + city).addClass('yellow');
                    }
                    else if (moreData.value <= 7) {
                        $('#' + city).addClass('orange');
                    }
                    else if (moreData.value <= 10) {
                        $('#' + city).addClass('red');
                    }
                    else if (moreData.value > 10) {
                        $('#' + city).addClass('purple');
                    }

                });

            getForecast(cityInput);

        });



};

// adds city input to search history and runs current weather function
submitCity.on("click", function (event) {
    event.preventDefault();
    var newDiv = $("<div>");
    var cityInput = $("#cityInput").val().trim();
    newDiv.text(cityInput);
    newDiv.attr("data-city", cityInput);
    newDiv.addClass("saved-city");
    newDiv.addClass('list-group-item')



    searchHistory.unshift(cityInput);


    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));


    newDiv.prependTo(cityHistory)


    getCurrentWeather();

    $('#cityInput').val("");
});

// using attributes to run current weather function on each city in search history when clicked
$(document).on("click", ".saved-city", function () {
    var city = $(this).attr("data-city")
    getCurrentWeather(city);
})

// presents search history on page load
$(document).ready(function () {
    loadHistory();

});