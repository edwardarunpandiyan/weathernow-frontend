import React, { useState, useRef, useEffect, useMemo } from 'react';
import HourForecastRadial from '../hour forecast radial/HourForecastRadial';
import HourForecastCard from '../hour forecast card/HourForecastCard';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import '../../styles/hourly forecast/HourlyForecast.css';


/**
 * HourlyForecast container component
 * Manages state and renders the radial visualization and hour cards
 */
const HourlyForecast = () => {
    const dispatch = useAppDispatch();
    const {
        weather,
        selectedDayIndex
    } = useAppSelector((state) => state.weather);

    if (!weather) return null;

    // Generate hourly data once (memoized)
    const hourlyData = useMemo(() => {
        if (!weather?.hourly || weather.hourly.length === 0) return [];

        const HOURS_PER_DAY = 24;
        const result = [];

        const startIndex = selectedDayIndex * HOURS_PER_DAY;
        const endIndex = startIndex + HOURS_PER_DAY;

        for (let i = startIndex; i < endIndex && i < weather.hourly.length; i++) {
            result.push(weather.hourly[i]);
        }
        return result;
    }, [weather, selectedDayIndex]);

    // Selected hour index (default to 0, which is current hour)
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Ref for scroll container
    const scrollContainerRef = useRef(null);

    // Scroll to now card on mount
    useEffect(() => {
        if (!hourlyData.length) return;

        const nowIndex = hourlyData.findIndex(h => h?.isNow);
        if (nowIndex !== -1) {
            setSelectedIndex(nowIndex);
        }
    }, [hourlyData]);

    // Scroll to selected card on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const selectedCard = scrollContainerRef.current.querySelector('.hour-card--selected');
            if (selectedCard) {
                selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [hourlyData, selectedIndex]);

    // Handle hour selection - used by both cards and radial
    const handleHourSelect = (index) => {
        setSelectedIndex(index);

        // Scroll the selected card into view
        if (scrollContainerRef.current) {
            const cards = scrollContainerRef.current.querySelectorAll('.hour-card');
            if (cards[index]) {
                cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    };

    // Navigation handlers
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
    };

    return (
        <section className="hourly-forecast" aria-label="Hourly Weather Forecast">
            {/* <h2 className="hourly-forecast__title">Hourly Forecast</h2> */}

            {/* Radial Visualization */}
            {hourlyData?.length > 0 &&
                <HourForecastRadial
                    hourlyData={hourlyData}
                    selectedIndex={selectedIndex}
                    onHourSelect={handleHourSelect}
                />
            }

            {/* Hour Cards Section */}
            <div className="hourly-cards">
                <div className="hourly-cards__wrapper">
                    {/* Left Navigation Button */}
                    <button
                        className="hourly-cards__nav-btn"
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Scrollable Cards Container */}
                    <div
                        className="hourly-cards__scroll-container"
                        ref={scrollContainerRef}
                        role="listbox"
                        aria-label="Select hour"
                    >
                        <div className="hourly-cards__list">
                            {hourlyData.map((hour, index) => (
                                <HourForecastCard
                                    key={hour.id}
                                    hourData={hour}
                                    isSelected={index === selectedIndex}
                                    isNow={hour.isNow}
                                    onClick={() => handleHourSelect(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Navigation Button */}
                    <button
                        className="hourly-cards__nav-btn"
                        onClick={scrollRight}
                        aria-label="Scroll right"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HourlyForecast;
