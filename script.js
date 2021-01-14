let APIKey = "9e123c7bd50385362ccd78f9199f0aef"
let cities = [];

/*Function that will pull information from API, and display it into
<div> #today && <div> #forecast*/
function renderCityInfo() {
    $('#today').empty();
    $('#forecast').empty();
    $('#today').addClass('todays-weather');


    let cityName = $(this).attr('data-name');
    
    let geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}&limit=1`
    let lat = 0;
    let lon = 0;
        
    $.ajax({
        url: geoURL,
        method: 'GET'
    }).then(function(latLongRes){
        lat = latLongRes[0].lat;
        lon = latLongRes[0].lon;

    let queryURL =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&eclude=minutly,hourly,alerts&lon=${lon}&exclude={part}&appid=${APIKey}&units=imperial`;

    //Renders the current weather conditions.
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        let currentDate = moment.unix(response.current.dt).utcOffset('-0500').format('(M/D/YYYY)');
        console.log(response)
        
        // <div> for holding #today title information.
        let todayTitleDiv = $('<div>');
        todayTitleDiv.attr('id', 'todayTitleDiv');
        todayTitleDiv.addClass('row');
        // <div> for holding current weather information.
        let currentWeatherDiv = $('<div>');
        currentWeatherDiv.attr('id', 'currentWeatherDiv');
        // Append new divs to <div> #today.
        $('#today').append(todayTitleDiv, currentWeatherDiv);
        //City Title
        let cityTitle = $('<h2>');
        cityTitle.text(cityName + ' ' + currentDate);
        //Weather Icon
        let iconID = response.current.weather[0].icon;
        let iconURL = `http://openweathermap.org/img/wn/${iconID}.png`;
        let iconImg = $('<img>');
        iconImg.attr('src', iconURL);
        //Append Icon && City title to #todayTitleDiv.
        $('#todayTitleDiv').append(cityTitle, iconImg);

        //Current Temp.
        let currentTemp = $('<p>');
        currentTemp.text('Temperature: ' + response.current.temp + ' °F')
        // Current Humidity.
        let currentHumidity = $('<p>');
        currentHumidity.text('Humidity: ' + response.current.humidity + '%')
        //Current Wind Speed.
        let currentWindSpeed = $('<p>');
        currentWindSpeed.text('Wind Speed: ' + response.current.wind_speed + ' MPH')
       
       
        // Current UV Index
        let UVIndexDiv = $('<div>');
        UVIndexDiv.attr('id', 'UVIndexDiv');
        UVIndexDiv.addClass('row')
        let UVTitle = $('<p>');
        UVTitle.text('UV Index:');
        UVTitle.addClass('UVTitle')
        let UVIndex = $('<p>');
        let currentUVIndex = response.current.uvi;
        UVIndex.text(currentUVIndex);


        if(currentUVIndex < 3){
            UVIndex.addClass('favorable')
        }
        else if (currentUVIndex >= 3 && currentUVIndex < 7 ) {
            UVIndex.addClass('moderate')           
        } else {
            UVIndex.addClass('severe')
        }

       $('#currentWeatherDiv').append(currentTemp, currentHumidity, currentWindSpeed, UVIndexDiv);
       $('#UVIndexDiv').append(UVTitle, UVIndex);
        // Forecast Information
        let forecastTitle = $('<h2>')
        forecastTitle.text('5-Day Forecast:')
        forecastTitle.addClass('col-md-12')
        $('#forecast').append(forecastTitle);
        let weeklyForecast = (response.daily);
        for(i = 1; i <= 5 ; i++){
            createForeCast(response);
        }

        function createForeCast(forecast){
            //Creates Div for each day of forecast.
            let forecastDiv = $('<div>');
            let forecastTitle = $('<h3>')
            forecastTitle.text(moment.unix(forecast.daily[i].dt).utcOffset('-0500').format("M/D/YYYY"));
            forecastDiv.addClass('forecast-div col-md-2')
            forecastDiv.attr('id', 'forecast' + [i])
            $('#forecast').append(forecastDiv);
            //Creates forecast temperature
            let forecastTemp = $('<p>');
            forecastTemp.text('Temperatue: ' + weeklyForecast[i].temp.day + ' °F');
            let forecastIcon = $('<img>')
            let forecastIconID = forecast.daily[i].weather[0].icon
            let fiURL = `http://openweathermap.org/img/wn/${forecastIconID}.png` 
            forecastIcon.attr('src', fiURL)
            let forecastHumidity = $('<p>');
            forecastHumidity.text('Humidity: ' + weeklyForecast[i].humidity + ' %');

            $('#forecast' + [i]).append(forecastTitle, forecastIcon, forecastTemp, forecastHumidity);           
        }
    });
    })
};

//Function that will take each city, and render into button form on the page.
function renderCities() {
    $('.history').empty();
    
    for(i = 0; i < cities.length; i++) {
        let b = $('<button>');
        b.addClass('city');
        b.attr('data-name', cities[i]);
        b.text(cities[i]);
        $('.history').append(b);  
    }
}

renderCities();

//When the search button is pressed, the user input will be added to the cities array. 
$('#search-button').on('click', function(){
    let userInput = ($('#search-value').val());
    cities.push(userInput);
    localStorage.setItem('search-history',JSON.stringify(cities));
    renderCities();
    renderCityInfo(userInput);
})
$(document).on('click', '.city', renderCityInfo);



