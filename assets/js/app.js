
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
// var keepHistory = JSON.parse(localStorage.getItem("searchHistory") || searchHistory);

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
        
        console.log(weatherData);
        console.log(queryURL);
        

    });

}

submitCity.on("click", function(event) {
    event.preventDefault();
    var newDiv = $("<div>");
    var cityInput = $("#cityInput").val().trim();
    newDiv.text(cityInput);


    

    searchHistory.push(cityInput);

    // may need to put this in separate function that dynamically generates city input
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    console.log(searchHistory);


    cityHistory.prepend(newDiv);


    getCurrentWeather();
});

$( document ).ready(function() {
    loadHistory();

});