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

// 


function identifyUser(){
    var ID = localStorage.getItem("WeatherUserID");
    console.log(ID);
    if (ID == null) {   
        userid_generated = Math.random();
        ID = userid_generated
        localStorage.setItem("UserID",`${userid_generated}`);
        const main_div = document.getElementById("weatherShow");

        const button = document.createElement('button');
        const input = document.createElement('input');
    
        button.setAttribute("id", "Button");
        input.setAttribute("id", "cityInput");    
    
        main_div.appendChild(button);
        main_div.appendChild(input);
    
        document.getElementById("Button").addEventListener("click", (e) => {
            console.log(`${input.value}`);
            if (input.value == "") {
                console.log(`aa`);
            } else {
                fetch(`http://192.168.0.2:5555/write/${userid_generated}&${input.value}`)
            }
        });
    } else {
        fetch(`http://192.168.0.2:5555/read/${ID}`)
        .then(resp => resp.json())
        .then(response => console.log(response))
    }
}
function sunMovement(time){

    // variables
    let temp, temp2, sun;
    
    // turning time into individual hour and minute numbers
    temp = time.slice(0, 2);
    temp2 = time.slice(3, 5);
    
    // Calculating minutes from given time
    minutes = Number(temp) * 60 + Number(temp2);
    percent_of_sun_elevation = minutes/1440 * 45;
    console.log(percent_of_sun_elevation);
    document.querySelector('.dot').style.marginTop = `${percent_of_sun_elevation}%`;

    // Coloring part
    const calculatedYellow = 255 - minutes/6
    document.querySelector('.dot').style.backgroundColor = `rgb(255, ${calculatedYellow}, 15)`;
    document.querySelector('.dot').style.boxShadow = `0px 0px 12px 24px rgb(255, ${calculatedYellow}, 15)`
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
    get_weather_info();
    get_time_date_info();


    identifyUser();

    // repeats every 4 seconds
    setInterval(get_weather_info, 4000);
    setInterval(get_time_date_info, 4000);
    
});


