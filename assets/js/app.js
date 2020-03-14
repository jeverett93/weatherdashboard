$( document ).ready(function() {
    console.log( "ready!" );

//moment
var momentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
console.log(momentTime);

//variables
var APIKey = 'e885fd3db621744dfef49f4c1e174dc6';
var submitCity = $('#submit-city');
var cityHistory = $('city-history');
var currentWeather = $('#current-weather');
var fiveDay = $('#five-day');


function getCurrentWeather() {
    var cityInput = $('#cityInput').val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;

  // Running AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
  })
    // Store all of the retrieved data inside of an object called "response"
    .then(function(weatherData) {
        
        console.log(weatherData);
        console.log(queryURL);

    });

}

submitCity.on('click', function(event) {
    event.preventDefault();


    console.log(cityInput);


    getCurrentWeather();
});

});