
import { useSelector } from "react-redux";

export default function CurrentWeather() {
  const { weather, city } = useSelector(state => state.weather);
  if (!weather) return null;

  return (
    <div>
      {weather && (
        <div style={styles.card}>
          <h3>{city?.name}</h3>
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
  card: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
};