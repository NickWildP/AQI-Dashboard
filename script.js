// Function to fetch and display AQI data
const fetchAQI = async () => {
    const apiUrl = "https://api.waqi.info/feed/chandigarh/?token=e3c0585e6a617fe29d33aab1c9d293cb5d9d5174";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch AQI data");

        const data = await response.json();

        if (data.status === "ok") {
            const aqi = data.data.aqi;
            const city = data.data.city.name;
            const dominantPollutant = data.data.dominentpol;
            const pm25 = data.data.iaqi.pm25?.v || "N/A";
            const pm10 = data.data.iaqi.pm10?.v || "N/A";
            const time = data.data.time.iso;

            // Updating the DOM with AQI data
            document.getElementById("aqi-value").textContent = `AQI: ${aqi}`;
            document.getElementById("city-name").textContent = `Location: ${city}`;
            document.getElementById("dominant-pollutant").textContent = `Dominant Pollutant: ${dominantPollutant}`;
            document.getElementById("pm25-value").textContent = `PM2.5: ${pm25}`;
            document.getElementById("pm10-value").textContent = `PM10: ${pm10}`;
            document.getElementById("time-updated").textContent = `Last Updated: ${time}`;
        } else {
            throw new Error("Invalid API response");
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        document.getElementById("aqi-value").textContent = "Unable to fetch AQI data.";
    }
};

// Toggle FAQ section visibility
const toggleFAQ = () => {
    const faqContent = document.getElementById("faq-content");
    if (faqContent.style.display === "none" || faqContent.style.display === "") {
        faqContent.style.display = "block";
    } else {
        faqContent.style.display = "none";
    }
};

// Attach event listener to FAQ button
document.getElementById("faq-button").addEventListener("click", toggleFAQ);

// Fetch AQI data when the page loads
window.onload = fetchAQI;

document.addEventListener("DOMContentLoaded", () => {
    const apiToken = "e3c0585e6a617fe29d33aab1c9d293cb5d9d5174"; // Replace with your AQI API token
    const city = "Chandigarh";
    const mainCityUrl = `https://api.waqi.info/feed/${city}/?token=${apiToken}`;
    const searchUrl = `https://api.waqi.info/v2/search/?token=${apiToken}&keyword=${city}`;

    // Main city elements
    const cityAQI = document.getElementById("city-aqi");
    const substationsContainer = document.getElementById("substations");

    // Fetch AQI data for Chandigarh city
    fetch(mainCityUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                const aqi = data.data.aqi;
                const cityName = data.data.city.name;
                const dominant = data.data.dominentpol;
                const lastUpdated = data.data.time.s;

                // Update the main city AQI
                cityAQI.innerHTML = `
                    <strong>${cityName}</strong><br>
                    AQI: ${aqi}<br>
                    Dominant Pollutant: ${dominant}<br>
                    Last Updated: ${lastUpdated}
                `;
            } else {
                cityAQI.textContent = "Unable to fetch Chandigarh AQI data.";
            }
        })
        .catch((error) => {
            console.error("Error fetching city AQI data:", error);
            cityAQI.textContent = "Error fetching Chandigarh AQI data.";
        });

    // Fetch AQI data for substations
    fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                const substations = data.data;

                // Display each substation's AQI data
                substations.forEach((station) => {
                    const stationName = station.station.name;
                    const aqi = station.aqi;
                    const lastUpdated = station.time.stime;

                    const substationDiv = document.createElement("div");
                    substationDiv.classList.add("substation");
                    substationDiv.innerHTML = `
                        <h3>${stationName}</h3>
                        <p>AQI: ${aqi}</p>
                        <p>Last Updated: ${lastUpdated}</p>
                    `;

                    substationsContainer.appendChild(substationDiv);
                });
            } else {
                substationsContainer.innerHTML =
                    "Unable to fetch substation data.";
            }
        })
        .catch((error) => {
            console.error("Error fetching substation data:", error);
            substationsContainer.innerHTML = "Error fetching substation data.";
        });
});