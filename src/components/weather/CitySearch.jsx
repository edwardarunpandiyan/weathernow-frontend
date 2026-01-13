
import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch } from "react-redux";
import { setCity, fetchWeather } from "../../features/weather/weatherSlice";
import { getCitySuggestions } from '../../services/weatherApi';

export default function CitySearch() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = useDebounce(search);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!debouncedSearch) return;
    const controller = new AbortController();

    const fetchCities = async () => {
      try {
        const cities = await getCitySuggestions(
          debouncedSearch,
          controller.signal
        );
        setSuggestions(cities);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      }
    };

    fetchCities();
    return () => controller.abort();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSuggestions([]);
  };

  const handleCitySelect = async (city) => {
    setCity(city);
    setSearch('');
    setSuggestions([]);

    dispatch(
      fetchWeather({
        lat: city.latitude,
        lon: city.longitude,
      })
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search city"
        value={search}
        onChange={handleInputChange}
        style={styles.input}
      />
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
    </div>
  );
}
const styles = {

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
};