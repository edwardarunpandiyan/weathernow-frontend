import { useState } from 'react';
import Header from "../components/header/Header"
import LocationInfo from "../components/location info/LocationInfo";
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";
import CitySearch from "../components/weather/CitySearch";
import CurrentWeather from "../components/weather/CurrentWeather";
import ForecastTabs from "../components/weather/ForecastTabs";
export default function Home() {
  // Sample location data - can be updated via search or other means
  const [currentLocation, setCurrentLocation] = useState({
    city: 'San Francisco',
    state: 'California',
    country: 'United States'
  });

  const handleLocationChange = (location) => {
    // Force re-render by creating new object
    setCurrentLocation({ ...location });
  };
  return (
    <div>
      <Header />
      <LocationInfo
        location={currentLocation}
        onLocationChange={handleLocationChange}
      />
      <DayForecast />
      <HourlyForecast />
      {/* <CitySearch /> */}
      {/* <CurrentWeather /> */}
      {/* <ForecastTabs /> */}
    </div>
  );
}
