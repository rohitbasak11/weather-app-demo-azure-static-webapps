const cityInput = document.getElementById("input");
const displaySection = document.getElementById("display");
const conditionElement = document.getElementById("condition");
const iconElement = document.getElementById("icon");
const timeElement = document.getElementById("time");

const API_KEY = "9f1951828ff9489298c50331252502";

function updateTime() {
    const now = new Date();
    timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
    setTimeout(updateTime, 1000); // Update every second
}

updateTime();

cityInput.addEventListener("input", function() {
    const query = cityInput.value;
    if (query.length > 2) {
        fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    // Simple autocomplete suggestion (you can enhance this with a dropdown)
                    cityInput.value = data[0].name; // Suggests the first match
                }
            })
            .catch(err => console.log(err));
    }
});

cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleClick();
    }
});

const handleClick = () => {
    let currentCity = cityInput.value;

    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${currentCity || "Queenstown"}&aqi=no`)
        .then(res => res.json())
        .then(data => {
            const temp = data.current.temp_c;
            const condition = data.current.condition.text.toLowerCase();
            const icon = data.current.condition.icon;

            // Dynamic background color based on weather
            let bgColor = "#d49ad0"; // Default color
            if (condition.includes("sunny")) bgColor = "#ffd700"; // Gold for sunny
            if (condition.includes("rain")) bgColor = "#4682b4"; // Steel blue for rain
            if (condition.includes("cloud")) bgColor = "#a9a9a9"; // Dark gray for cloudy
            if (condition.includes("snow")) bgColor = "#e6e6fa"; // Lavender for snow
            document.body.style.backgroundColor = bgColor;

            displaySection.innerHTML = `
                <p>${data.location.name}'s temperature is ${temp}℃.</p>
                <p>Feels like ${data.current.feelslike_c}℃.</p>
                <img src="${icon}" alt="weather icon"/>
            `;
            conditionElement.textContent = `Condition: ${condition}`;
            iconElement.innerHTML = `<img src="${icon}" alt="condition icon"/>`;
        })
        .catch(err => {
            console.log(err);
            displaySection.innerText = `Please enter a valid city.`;
            document.body.style.backgroundColor = "#d49ad0"; // Reset to default on error
        });
};

handleClick();