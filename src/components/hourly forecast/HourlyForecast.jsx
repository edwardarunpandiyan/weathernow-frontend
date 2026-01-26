import React, { useState, useRef, useEffect, useMemo } from 'react';
// import HourForecastRadial from '../hour forecast radial/HourForecastRadial';
import HourForecastCard from '../hour forecast card/HourForecastCard';
import '../../styles/hourly forecast/HourlyForecast.css';

/**
 * Generate mock hourly weather data for the next 24+ hours
 */
const generateHourlyData = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Wind directions
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    // Weather conditions with their probability based on time
    const getCondition = (hour) => {
        const hourNum = hour % 24;
        // Night hours (8pm - 6am)
        if (hourNum >= 20 || hourNum < 6) {
            const rand = Math.random();
            if (rand < 0.3) return 'Clear Night';
            if (rand < 0.6) return 'Night Cloudy';
            return 'Partly Cloudy Night';
        }
        // Morning/Evening hours
        if (hourNum >= 6 && hourNum < 9 || hourNum >= 17 && hourNum < 20) {
            const rand = Math.random();
            if (rand < 0.4) return 'Partly Cloudy';
            if (rand < 0.7) return 'Cloudy';
            return 'Sunny';
        }
        // Midday hours
        const rand = Math.random();
        if (rand < 0.5) return 'Sunny';
        if (rand < 0.75) return 'Partly Cloudy';
        if (rand < 0.9) return 'Cloudy';
        return 'Rainy';
    };

    // Temperature based on time of day
    const getTemp = (hour) => {
        const hourNum = hour % 24;
        const baseTemp = 25;
        // Temperature curve: lowest at 5am, highest at 2pm
        const tempVariation = Math.sin((hourNum - 5) * Math.PI / 12) * 8;
        const randomVariation = (Math.random() - 0.5) * 4;
        return Math.round(baseTemp + tempVariation + randomVariation);
    };

    const data = [];

    // Determine starting hour based on current minutes
    let startHour;
    if (currentMinutes === 0) {
        // If exactly on the hour, start from next hour
        startHour = currentHour + 1;
    } else {
        // Include current hour + next 24 hours
        startHour = currentHour;
    }

    // Generate 25 hours of data (current hour + 24 hours if minutes != 0)
    const hoursToGenerate = currentMinutes === 0 ? 24 : 25;

    for (let i = 0; i < hoursToGenerate; i++) {
        const hourNum = (startHour + i) % 24;
        const isAM = hourNum < 12;
        const displayHour = hourNum === 0 ? 12 : (hourNum > 12 ? hourNum - 12 : hourNum);
        const suffix = isAM ? 'AM' : 'PM';

        const condition = getCondition(hourNum);
        const temp = getTemp(hourNum);

        // For current hour, show "Now" in time label
        let timeLabel;
        if (i === 0 && currentMinutes !== 0) {
            timeLabel = `${displayHour}:${currentMinutes.toString().padStart(2, '0')} ${suffix}`;
        } else {
            timeLabel = `${displayHour} ${suffix}`;
        }

        // Generate additional weather data
        const windSpeed = Math.round(5 + Math.random() * 20);
        const windDir = windDirections[Math.floor(Math.random() * windDirections.length)];
        const humidity = Math.round(40 + Math.random() * 40);
        const precipitation = condition.toLowerCase().includes('rain')
            ? Math.round(40 + Math.random() * 50)
            : Math.round(Math.random() * 30);

        data.push({
            id: i,
            hour: hourNum,
            timeLabel,
            condition,
            temp,
            feelsLike: temp + Math.round((Math.random() - 0.3) * 4),
            wind: `${windSpeed} km/h ${windDir}`,
            windSpeed,
            windDir,
            humidity,
            precipitation,
            isNow: i === 0
        });
    }

    return data.slice(0, 24); // Ensure we only return 24 hours max
};

/**
 * HourlyForecast container component
 * Manages state and renders the radial visualization and hour cards
 */
const HourlyForecast = () => {
    // Generate hourly data once (memoized)
    const hourlyData = useMemo(() => generateHourlyData(), []);

    // Selected hour index (default to 0, which is current hour)
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Ref for scroll container
    const scrollContainerRef = useRef(null);

    // Scroll to selected card on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const selectedCard = scrollContainerRef.current.querySelector('.hour-card--selected');
            if (selectedCard) {
                selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, []);

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
            {/* <HourForecastRadial
                hourlyData={hourlyData}
                selectedIndex={selectedIndex}
                onHourSelect={handleHourSelect}
            /> */}

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
