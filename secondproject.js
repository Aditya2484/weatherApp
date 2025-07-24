// lets declare all the variable that are used first
const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchwheather]");
const usercontainer=document.querySelector(".weather-container");
const grantaccesscontainer=document.querySelector(".grant-location-container");
const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");

// oldtab means the tab the usertab where you are initially

let oldtab=usertab;
const API_KEY="08b2059fcb7ba8d6f617ef67ed337181";
// this is used to apply the color on the tab where you are initially
oldtab.classList.add("current-tab");

getfromsessionstorage();/*we use this here first because the ui will know my current location and whenever we try to open the website it will render my location whether */

function switchtab(newtab){
    // as we know that when we are on a tab if we clicked the same ab then there is no need to do anything so thats why when you clicked on another tab then we do something
    if(newtab!=oldtab){
        oldtab.classList.remove("current-tab");/* in our ui the tab on which you are have a color that we provided as you clicked on another tab so that color must be also switched so that why we remove the color from that */ 
        oldtab=newtab;/*now our tab is changed so thats  why we add that property on the new tab*/
        oldtab.classList.add("current-tab");

        if(!searchform.classList.contains("active")){
            // is the search form tab is invisible or not if yes then make it visible
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");

        }
        else{
            // previously user is at search tab but now he clicked on whether tab so we have to make that visible
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            // now we are in whether tab so we have to display weather so let's check local storage first
            // now we try to find the coordinats like lattitude and longitude
            getfromsessionstorage();
        }
    }
}
// jab hm click krenge usertab pe to agar wo phle hi usertab pe tha tab to thik hai nhi to wo switch krega searchtab pe
usertab.addEventListener("click",()=>{
    // pass clicked tab as input parameter in the switchtab function
    switchtab(usertab);
});
searchtab.addEventListener("click",()=>{
    // pass clicked tab as input parameter
    switchtab(searchtab);
});

// this function will help in knowing the coordinates(latti,longi) are already present in session storage or not
function getfromsessionstorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        // agar local coordinates nahi mile to hme user ko grant location wala ui show krna hai
        grantaccesscontainer.classList.add("active");
    }
    else{
        // agar coordinates mil gaye to use json format me kr ke store ke lenge
        const coordinates=JSON.parse(localcoordinates);/*this will fetch th lattitude and the longitude of the asked location  */
        fetchuserwhetherinfo(coordinates);
    }
    

}
async function fetchuserwhetherinfo(coordinates){
    const {lat,lon}=coordinates;
    // making the grant container invisible because we had got the location lattitude and the longitude
    grantaccesscontainer.classList.remove("active");
    // now we show the loader because we are fetching the data with the help of coordinates
    loadingscreen.classList.add("active");
    // API call 
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        // now data have all the value and we show the loader and the userinfocontainer
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderwhetherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
        alert("Failed to fetch weather info. Please try again.");
    }
    
}
// this function is used to render all the value from the json object 
function renderwhetherinfo(weatherInfo){
    const cityname = document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-whetherdesc]");
    const weatherIcon = document.querySelector("[data-whethericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");

    console.log(weatherInfo);
    
    // fetch values from whether info object and put it in ui element
    /* this is called optional chaning operater by this we fetch the data from the json format it means in whetherinfo go to name section and retrive the data */
    cityname.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;/*this is used to find the country name from the syn and the link is used to convert that name into an image */
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    const temperature = weatherInfo?.main?.temp;
    
    if (temperature > 38) {
        temp.style.color = "red";
        temp.innerText = `${temperature} °C 🥵`;

    } 
    else if(temperature>30) {
        temp.style.color = "yellow";
        temp.innerText = `${temperature} °C 🫡`;
    }
    else if(temperature>20){
        temp.style.color = "white";
        temp.innerText = `${temperature} °C 😍🥰`;
    }
    else{
        temp.style.color = "blue";
        temp.innerText = `${temperature} °C 🥶`;
    }
    document.body.className = ""; // Reset class
    const weatherMain = weatherInfo?.weather?.[0]?.main?.toLowerCase() || "";
    const temperatur = weatherInfo?.main?.temp;

    if (weatherMain.includes("cloud")) {
        document.body.classList.add("cloudy");
    } else if (weatherMain.includes("rain")) {
        document.body.classList.add("rainy");
    } else if (temperatur > 30) {
        document.body.classList.add("sunny");
    } else {
        document.body.classList.add("cold");
    }
    // this all are used to fetch the data from the json format the humidity teperature and the whether logo
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
        // this is used to find the geolocation of the searched location and the showposition is used to find the lattitude and the longitude
    }
    else{
        alert("Geolocation is not supported by your browser. Please enter your city manually.");
        // we have to show alert sign that the searched location is not valid
    }
}
function showposition(position){
    // by this in usercoordinates we store the latitude and the longitude
    const usercoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    // and by this we set those value in the user-coordinates and we use them in getfromsessionstorage function
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    //this is used to fetch the whether from the lattitude and the longitude
    fetchuserwhetherinfo(usercoordinates);
}
const grantaccessbutton=document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click",getlocation);
const searchinput=document.querySelector("[data-searchinput]");
// searchform pe hmne event listener lagaya hai kyuki jab hm kisis location ka whether search kare aur button pe click kare to waha ka whether hme show ho 
searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;
    // agar seached city null hai to return kr jao
    if(cityname==="")
        return;
    else
       fetchsearchwhetherinfo(cityname);
    // wrna user ko searched  whether show kr do
})

async function fetchsearchwhetherinfo(city){
    // jab user ne search kiya tb phle use loading d=screen show karo jab tak tum search kr rhe ho
    loadingscreen.classList.add("active");

    userinfocontainer.classList.add("active");
    // grantlocation wale ui ko invisible kr do
    grantaccesscontainer.classList.remove("active");
    try{
        // API CALL
      
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        // json format me convert karo
        const data=await response.json();
        // loading screen remove karo
        loadingscreen.classList.remove("active");
        // aur searched location ka whether dikha do
        userinfocontainer.classList.add("active");
        if (data?.cod !== 200) {
            alert(data?.message || "Weather data not found.");
            return;
        }
        renderwhetherinfo(data);

    }
    catch(err){
         loadingscreen.classList.remove("active");
         alert("Failed to fetch weather info. Please try again.");
    }
}
