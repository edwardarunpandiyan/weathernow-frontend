import React, { useState, useEffect, useRef } from 'react';
import { getCitySuggestions, getWeather } from '../../services/weatherApi';

function Header() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedFetch = useRef(null);

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  useEffect(() => {
    debouncedFetch.current = debounce(async (value) => {
      const cities = await getCitySuggestions(value);
      setSuggestions(cities);
    }, 400);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    setSuggestions([]);
    setWeather(null);

    if (value.trim()) {
      debouncedFetch.current(value);
    }
  };

  const handleCitySelect = async (city) => {
    setQuery('');
    setCity(city.name);
    setSuggestions([]);
    setLoading(true);
    setError('');

    try {
      const response = await getWeather(city.latitude, city.longitude);
      setWeather(response.data);
    } catch {
      setError('Unable to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Weather Now</h2>

      {/* <input
        type="text"
        placeholder="Search city"
        value={query}
        onChange={handleInputChange}
        style={styles.input}
      /> */}

      {suggestions.length > 0 && (
        <ul style={styles.suggestionBox}>
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleCitySelect(city)}
              style={styles.suggestionItem}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.card}>
          <h3>{city}</h3>
          <p>{weather.condition}</p>
          <p>
            🌡 {weather.temperature}
            {weather.units.temperature}
          </p>
          <p>
            💨 Wind: {weather.windspeed}
            {weather.units.windspeed}
          </p>
          <p>
            🧭 Direction: {weather.winddirection}
            {weather.units.winddirection}
          </p>
          <p>{weather.is_day ? '☀️ Day' : '🌙 Night'}</p>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    // width: '350px',
    // margin: '50px auto',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  input: {
    width: '100%',
    padding: '8px',
  },
  suggestionBox: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    border: '1px solid #ccc',
  },
  suggestionItem: {
    padding: '8px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  },
  card: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
  },
};

export default Header;
