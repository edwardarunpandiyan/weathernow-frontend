
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";
import CitySearch from "../components/weather/CitySearch";
import CurrentWeather from "../components/weather/CurrentWeather";
import ForecastTabs from "../components/weather/ForecastTabs";
import Header from "../components/header/Header"
export default function Home() {
  return (
    <div>
      <Header />
      <DayForecast />
      <HourlyForecast />
      {/* <CitySearch /> */}
      {/* <CurrentWeather /> */}
      {/* <ForecastTabs /> */}
    </div>
  );
}
