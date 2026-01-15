
import { useSelector } from "react-redux";

export default function CurrentWeather() {
  const { weather, city } = useSelector(state => state.weather);
  if (!weather?.current) return null;

  const currentWeather = weather.current;
  const units = weather.units;

  return (
    <div>
      {currentWeather && (
        <div style={styles.card}>
          <h3>{city?.name}</h3>
          <p>{currentWeather.condition}</p>
          <p>
            🌡 {currentWeather.temperature}
            {units.temperature}
          </p>
          <p>
            💨 Wind: {currentWeather.windspeed}
            {units.windspeed}
          </p>
          <p>
            🧭 Direction: {currentWeather.winddirection}
            {units.winddirection}
          </p>
          <p>{currentWeather.is_day ? '☀️ Day' : '🌙 Night'}</p>
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