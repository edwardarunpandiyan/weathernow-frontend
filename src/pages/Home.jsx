import { useEffect } from "react";
import { initializeApp, tickMinute } from "../features/weather/weatherSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useAppHooks";

import Header from "../components/header/Header";
import LocationInfo from "../components/location info/LocationInfo";
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";
import SkeletonLoader from "../components/skeleton loader/SkeletonLoader";
import Error from "../components/error/Error";

export default function Home() {
  const dispatch = useAppDispatch();

  const {
    isLoading,
    weather,
    currentMinute,
    currentSecond,
  } = useAppSelector(
    (state) => state.weather
  );
  console.log({ currentMinute })
  // Initialize app on first mount
  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  // ⏱️ Minute timer logic (SIMPLE & ACCURATE)
  useEffect(() => {
    if (
      currentMinute === null ||
      currentSecond === null
    ) return;

    let intervalId;

    // align first tick with backend seconds
    const initialDelay = (60 - currentSecond) * 1000;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentMinute === 59) {
          // refresh weather for same location
          dispatch(initializeApp());
        } else {
          console.log('tick', currentMinute)
          dispatch(tickMinute());
        }
      }, 60000);
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentMinute, currentSecond, dispatch]);

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
