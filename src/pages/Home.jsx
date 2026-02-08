import { useEffect } from "react";
import { initializeApp } from "../features/weather/weatherSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";

import Header from "../components/header/Header";
import LocationInfo from "../components/location info/LocationInfo";
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";
import SkeletonLoader from "../components/skeleton loader/SkeletonLoader";
import Error from "../components/error/Error";

export default function Home() {
  const dispatch = useAppDispatch();

  const { isLoading, weather } = useAppSelector(
    (state) => state.weather
  );

  // Initialize app on first mount
  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <SkeletonLoader />
      </>
    );
  }

  // Error / empty state
  if (!weather) {
    return (
      <>
        <Header />
        <Error />
      </>
    );
  }

  // Success state
  return (
    <>
      <Header />
      <main>
        <LocationInfo />
        <DayForecast />
        <HourlyForecast />
      </main>
    </>
  );
}
