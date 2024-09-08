const weather_url="https://api.open-meteo.com/v1/forecast?latitude=48.2584&longitude=2.8563&current=temperature_2m,relative_humidity_2m,is_day,rain,wind_speed_10m&timezone=auto"
const time_url="https://timeapi.io/api/time/current/zone?timeZone="
let timezone; 

// Information for current time and date
async function get_time_date_info(){
    try {
        const res = await fetch(`${time_url}${get_user_timezone()}`)
        const data2 = await res.json();
        set_time_text(data2);
        sunMovement(`${data2.time}`)
    } catch (error){
        console.log(`Fetching time didn't work! ${error}`)
    }
}
// Information for weather
async function get_weather_info(){
    try {
        const resp = await fetch(weather_url); 
        const data1 = await resp.json();
        set_weather_text(data1);
        
    } catch (error) {
        console.log(`Fetching weather didn't work! ${error}`);
    }
} 

function sunMovement(time){
    let temp, temp2, sun;
    temp = time.slice(0, 2);
    temp2 = time.slice(3, 5);
    minutes = Number(temp) * 60 + Number(temp2);
    percent_of_sun_elevation = minutes/1440 * 65;
    console.log(percent_of_sun_elevation);
    document.querySelector('.dot').style.marginTop = `${percent_of_sun_elevation}%`;

    // Coloring part
    document.querySelector('.dot').backgroundColor = "red"
    

}
// Sets text related to weather
function set_weather_text(weather_data){
    document.getElementById("temperature").innerHTML = `🌡 ${weather_data.current.temperature_2m}°C`;
    document.getElementById("humidity").innerHTML = `🌢 ${weather_data.current.relative_humidity_2m}%`;
    document.getElementById("windspeed").innerHTML = `༄ ${weather_data.current.wind_speed_10m}m/s`;
    if (weather_data.current.rain == 0) {
        document.getElementById("rain").innerHTML = `🌧 No!`;
    } else {
        document.getElementById("rain").innerHTML = `🌧 Yes!`;
    } 
}

// Takes the user's IANA timezone and replaces '/' with '%2F' to connect it with the API link
function get_user_timezone(){
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    timezone = timezone.replace(/[\/]/, '%2F')
    return timezone;
}

// Sets text related to time and date
function set_time_text(time_data){
    let day;
    switch(`${time_data.day}`){
        case 1: 
        day = "1st";
        break;
        case 2:
        day = "2nd";
        break;
        case 3:
        day = "3rd";
        break;
        case 4:
        day = "4th";
        break;
        default:
        day = `${time_data.day}th`;
        break;
    }
    const monthNames = ["FILLER!", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    document.getElementById("timedate").innerHTML = `Hello, it's ${time_data.time}! (${time_data.dayOfWeek}, ${day} ${monthNames[`${time_data.month}`]})` // message (for ex.: Hello! it's 20:32 (9th January))
}

// Executes everything after loading page
window.addEventListener("load", (e) => {
    console.log("Page loaded");
    get_weather_info();
    get_time_date_info();
    setInterval(get_weather_info, 4000);
    setInterval(get_time_date_info, 4000);
    /*document.getElementById("weatherButton").addEventListener("click", (e) => {
        get_weather_info();
        get_time_date_info();
    
    });*/
});


