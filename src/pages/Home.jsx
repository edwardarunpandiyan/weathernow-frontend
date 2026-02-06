import { useState, useEffect } from 'react';
import { initializeApp } from '../features/weather/weatherSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import Header from "../components/header/Header"
import LocationInfo from "../components/location info/LocationInfo";
import DayForecast from "../components/day forecast/DayForecast";
import HourlyForecast from "../components/hourly forecast/HourlyForecast";
import SkeletonLoader from '../components/skeleton loader/SkeletonLoader';

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    isLoading,
  } = useAppSelector((state) => state.weather);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  return (
    <div>
      <Header />
      {isLoading ?
        <SkeletonLoader />
        :
        <div>

          <LocationInfo />
          <DayForecast />
          <HourlyForecast />
        </div>}
    </div>
  );
}
