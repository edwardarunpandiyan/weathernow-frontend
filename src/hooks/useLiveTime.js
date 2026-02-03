// Live Time Hook

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useAppHooks";
import { updateCurrentHour } from "../features/weather/weatherSlice";

export function useLiveTime() {
    const dispatch = useAppDispatch();
    const weather = useAppSelector((state) => state.weather.weather);

    const [currentTime, setCurrentTime] = useState(() => {
        if (weather && weather.locationNow) {
            return new Date(weather.locationNow);
        }
        return new Date();
    });

    const [currentHour, setCurrentHour] = useState(currentTime.getHours());

    useEffect(() => {
        // Update time every minute
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            const newHour = now.getHours();
            if (newHour !== currentHour) {
                setCurrentHour(newHour);
                dispatch(updateCurrentHour());
            }
        }, 60000); // every minute

        return () => clearInterval(interval);
    }, [currentHour, dispatch]);

    // Initialize from locationNow when weather data changes
    useEffect(() => {
        if (weather && weather.locationNow) {
            const locationTime = new Date(weather.locationNow);
            setCurrentTime(locationTime);
            setCurrentHour(locationTime.getHours());
        }
    }, [weather && weather.locationNow]);

    const formatTime = useCallback((date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }, []);

    return {
        currentTime,
        currentHour,
        formattedTime: formatTime(currentTime),
    };
}
