
import CitySearch from "../components/weather/CitySearch";
import CurrentWeather from "../components/weather/CurrentWeather";
import ForecastTabs from "../components/weather/ForecastTabs";
import Header from "../components/header/Header"
export default function Home() {
  return (
    <div className="container">
      <Header />
      <CitySearch />
      {/* <CurrentWeather />
      <ForecastTabs /> */}
    </div>
  );
}
