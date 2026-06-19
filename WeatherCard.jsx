function WeatherCard({ city, weather }) {
  return (
    <div className="weather-card">
      <h2>{city}</h2>

      <div className="temperature">
        {weather.temperature}°C
      </div>

      <p className="description">{weather.description}</p>

      <div className="details">
        <p>
          <strong>Wind Speed:</strong> {weather.windspeed} km/h
        </p>
        <p>
          <strong>Weather Code:</strong> {weather.weathercode}
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
