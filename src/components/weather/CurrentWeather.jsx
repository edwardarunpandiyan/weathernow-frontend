
import { useSelector } from "react-redux";

export default function CurrentWeather() {
  const { data } = useSelector(state => state.weather);
  if (!data) return null;

  return (
    <div className="card">
      <h2>{data.condition}</h2>
      <p>{data.temperature} {data.units.temperature}</p>
      <p>Wind: {data.windspeed} {data.units.windspeed}</p>
    </div>
  );
}
