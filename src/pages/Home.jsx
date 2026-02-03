import { useState, useEffect } from 'react';
import { initializeApp } from '../features/weather/weatherSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import Header from "../components/header/Header"
import LocationInfo from "../components/location info/LocationInfo";
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";

export default function Home() {
  const dispatch = useAppDispatch();
  // Sample location data - can be updated via search or other means
  const [currentLocation, setCurrentLocation] = useState({
    city: 'San Francisco',
    state: 'California',
    country: 'United States'
  });

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

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
    </div>
  );
}
