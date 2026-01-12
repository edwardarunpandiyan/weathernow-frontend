
import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
// import { useDispatch } from "react-redux";
// import { fetchWeather } from "../../features/weather/weatherSlice";
import { getCitySuggestions, getWeather } from '../../services/weatherApi';

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const debouncedSearch = useDebounce(search);
  // const dispatch = useDispatch();

  // const handleSelect = () => {
  //   dispatch(fetchWeather({ lat: 12, lon: 79.5 }));
  // };

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
    setQuery(value);
    setSearch(value);
    setSuggestions([]);
    // setWeather(null);

    // if (value.trim()) {
    //   debouncedFetch.current(value);
    // }
  };
  const handleCitySelect = async (city) => {
    setQuery('');
    setCity(city.name);
    setSuggestions([]);
    setLoading(true);
    // setError('');

    try {
      const response = await getWeather(city.latitude, city.longitude);
      // setWeather(response.data);
    } catch {
      // setError('Unable to fetch weather');
    } finally {
      setLoading(false);
    }
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