import { useState } from "react";
import WeatherCard from "./WeatherCard";

const cityData = {
  "los angeles": { name: "Los Angeles", latitude: 34.05, longitude: -118.24 },
  "new york": { name: "New York", latitude: 40.71, longitude: -74.01 },
  "london": { name: "London", latitude: 51.51, longitude: -0.13 },
  "dhaka": { name: "Dhaka", latitude: 23.81, longitude: 90.41 },
  "tokyo": { name: "Tokyo", latitude: 35.68, longitude: 139.69 }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rainy";
    if ([71, 73, 75].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Unknown weather";
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const cityKey = city.trim().toLowerCase();

    if (!cityKey) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    if (!cityData[cityKey]) {
      setError("City not found. Try Los Angeles, New York, London, Dhaka, or Tokyo.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const { latitude, longitude, name } = cityData[cityKey];

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!response.ok) {
        throw new Error("Weather data could not be loaded.");
      }

      const data = await response.json();

      setSelectedCity(name);
      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        description: getWeatherDescription(data.current_weather.weathercode)
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="weather-box">
        <h1>SkyCast Weather App</h1>
        <p className="subtitle">
          A simple React app that shows current weather information.
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <p className="hint">
          Try: Los Angeles, New York, London, Dhaka, or Tokyo
        </p>

        {loading && <p className="loading">Loading weather...</p>}
        {error && <p className="error">{error}</p>}

        {weather && <WeatherCard city={selectedCity} weather={weather} />}
      </section>
    </main>
  );
}

export default App;
