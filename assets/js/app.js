
//moment
var momentTime = moment().format("MMMM Do YYYY, h:mm:ss a");
console.log(momentTime);

//variables
var APIKey = "e885fd3db621744dfef49f4c1e174dc6";
var submitCity = $("#submit-city");
var cityHistory = $("#city-history");
var currentWeather = $("#current-weather");
var fiveDay = $("#five-day");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


function loadHistory() {
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.text(searchHistory[i]);
        historyDivs.appendTo(cityHistory);
    }
}


function getCurrentWeather() {
    var cityInput = $('#cityInput').val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;

  // Running AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
  })
    
    .then(function(weatherData) {
        

        var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

        $('<h3>').text("City: " + weatherData.name).appendTo(currentWeather)
        $('<h3>').text("Date: " + momentTime).appendTo(currentWeather)
        $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather)
        $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather)
        $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
        $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather)

        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        //Adds the UV Index to current weather
        var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
          })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(moreData) {
                console.log(moreData);
                $('<h3>').text("UV Index: " + moreData.value).appendTo(currentWeather);

            });


    });



}

submitCity.on("click", function(event) {
    event.preventDefault();
    var newDiv = $("<div>");
    var cityInput = $("#cityInput").val().trim();
    newDiv.text(cityInput);


    

    searchHistory.push(cityInput);

   
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));


    cityHistory.prepend(newDiv);


    getCurrentWeather();
});

$( document ).ready(function() {
    loadHistory();

});