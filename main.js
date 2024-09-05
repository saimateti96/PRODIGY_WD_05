const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '5108663a0cdb50b3c3f7484d600b5e70';

$(document).ready(function () {
    weatherFn('');
    $('#city-input').on('keydown', function (e) {
        if (e.key === 'Enter') {
            weatherFn($(this).val());
        }
    });
});

async function weatherFn(location) {
    if (location.trim() === '') {
        return;
    }

    let apiUrl;
    if (!isNaN(location)) {
        apiUrl = `${url}?zip=${location}&appid=${apiKey}&units=metric`;
    } else {
        apiUrl = `${url}?q=${location}&appid=${apiKey}&units=metric`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            weatherShowFn(data);
        } else {
            alert('Location not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${Math.round(data.main.temp)}°C`);
    $('#description').text(data.weather[0].description);
    $('#feels-like').html(`${Math.round(data.main.feels_like)}°C`);
    $('#humidity').html(`${data.main.humidity}%`);
    $('#wind-speed').html(`${data.wind.speed} m/s`);
    $('#visibility').html(`${data.visibility / 1000} km`);
    $('#pressure').html(`${data.main.pressure} hPa`);

    const weatherIcon = determineWeatherIcon(data.weather[0].icon, data.sys.sunrise, data.sys.sunset);
    $('#weather-icon').removeClass().addClass(weatherIcon);
    
    // Create day summary
    $('#day-summary').html(`Today's temperature is ${Math.round(data.main.temp)}°C with ${data.weather[0].description}. It feels like ${Math.round(data.main.feels_like)}°C.`);

    getUVIndex(data.coord.lat, data.coord.lon);

    $('#weather-info').fadeIn();
}

function determineWeatherIcon(iconCode, sunrise, sunset) {
    const currentTimestamp = moment().unix();
    let iconClass = 'fas fa-sun'; 

    if (currentTimestamp >= sunrise && currentTimestamp < sunset) {
        switch (iconCode) {
            case '01d': iconClass = 'fas fa-sun'; break;
            case '02d': iconClass = 'fas fa-cloud-sun'; break;
            case '03d':
            case '04d': iconClass = 'fas fa-cloud'; break;
            case '09d':
            case '10d': iconClass = 'fas fa-cloud-rain'; break;
            case '11d': iconClass = 'fas fa-bolt'; break;
            case '13d': iconClass = 'fas fa-snowflake'; break;
            case '50d': iconClass = 'fas fa-smog'; break;
            default: iconClass = 'fas fa-sun';
        }
    } else {
        switch (iconCode) {
            case '01n': iconClass = 'fas fa-moon'; break;
            case '02n': iconClass = 'fas fa-cloud-moon'; break;
            case '03n':
            case '04n': iconClass = 'fas fa-cloud'; break;
            case '09n':
            case '10n': iconClass = 'fas fa-cloud-showers-heavy'; break;
            case '11n': iconClass = 'fas fa-bolt'; break;
            case '13n': iconClass = 'fas fa-snowflake'; break;
            case '50n': iconClass = 'fas fa-smog'; break;
            default: iconClass = 'fas fa-moon';
        }
    }

    return iconClass;
}

async function getUVIndex(lat, lon) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(uvUrl);
        const uvData = await response.json();

        $('#uv-index').html(`${uvData.value}`);
    } catch (error) {
        console.error('Error fetching UV index:', error);
    }
}

$(document).ready(function() {
    setInterval(function() {
        $('#demand-text').fadeIn(1000, function() {
            $(this).fadeOut(1000);
        });
    }, 2000);

    weatherFn('');
});
