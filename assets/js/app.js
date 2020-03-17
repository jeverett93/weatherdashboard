
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
        historyDivs.attr("data-city", searchHistory[i]);
        historyDivs.addClass("saved-city");
        historyDivs.prependTo(cityHistory);
    }
}

function getForecast (city){
    // var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ city + "&appid=" + APIKey;
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=" + APIKey + "&units=imperial"
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        
        .then(function(forecastData){
            console.log(forecastData);
            // not working yet
            for (var i = 0; i < forecastData.list.length; i++){
                var farenTemp = Math.floor((forecastData.list.main.temp - 273.15) * 1.8 + 32);
                var feelsLike = Math.floor((forecastData.list.main.feels_like - 273.15) * 1.8 + 32);
                // fiveDay.empty();
                $('<h3>').text("Date: " + forecastData.list.dt).appendTo(fiveDay)
                // $('<h3>').text("City: " + weatherData.name).appendTo(fiveDay)
                $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(fiveDay)
                $('<h3>').text("Feels Like: " + feelsLike).appendTo(fiveDay)
                $('<h3>').text("Humidity: " + forecastData.list.main.humidity + "%").appendTo(fiveDay)
                $('<h3>').text("Wind Speed: " + forecastData.list.wind.speed + " mph").appendTo(fiveDay)
            }
            
            
        })
};


function getCurrentWeather(city) {
    var cityInput = city || $('#cityInput').val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;
    console.log(queryURL)
  // Running AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
  })
    
    .then(function(weatherData) {
        
        console.log(weatherData);
        var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

        currentWeather.empty();

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
                getForecast(cityInput);
            });
        

    });



};

submitCity.on("click", function(event) {
    event.preventDefault();
    var newDiv = $("<div>");
    var cityInput = $("#cityInput").val().trim();
    newDiv.text(cityInput);
    newDiv.attr("data-city", cityInput);
    newDiv.addClass("saved-city");

    

    searchHistory.push(cityInput);

   
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));


    cityHistory.prepend(newDiv);


    getCurrentWeather();
});

$(document).on("click", ".saved-city", function(){
    var city = $(this).attr("data-city")
    getCurrentWeather(city);
})

$( document ).ready(function() {
    loadHistory();

});