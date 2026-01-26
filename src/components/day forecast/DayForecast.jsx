import React, { useState, useRef, useEffect } from 'react';
import DayForecastCard from '../day forecast card/DayForecastCard';
import '../../styles/day forecast/DayForecast.css';

/**
 * Sample forecast data for 7 days
 * In production, this would come from an API
 */
const defaultForecastData = [
    { id: 1, day: 'Tue', icon: 'sun-cloud', maxTemp: 32, minTemp: 24 },
    { id: 2, day: 'Wed', icon: 'sun', maxTemp: 31, minTemp: 23 },
    { id: 3, day: 'Thu', icon: 'sun-cloud', maxTemp: 31, minTemp: 24 },
    { id: 4, day: 'Fri', icon: 'cloudy-sun', maxTemp: 32, minTemp: 24 },
    { id: 5, day: 'Sat', icon: 'cloudy-sun', maxTemp: 32, minTemp: 25 },
    { id: 6, day: 'Sun', icon: 'sun', maxTemp: 30, minTemp: 23 },
    { id: 7, day: 'Mon', icon: 'sun', maxTemp: 31, minTemp: 24 },
];

/**
 * SevenDayForecast Component
 * Displays a responsive 7-day weather forecast with horizontal scroll on mobile
 * 
 * @param {Object} props
 * @param {Array} props.forecastData - Array of forecast objects (optional, uses default if not provided)
 */
const DayForecast = ({ forecastData = defaultForecastData }) => {
    const [activeDay, setActiveDay] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const scrollContainerRef = useRef(null);

    // Check scroll position and update arrow visibility
    const updateArrowVisibility = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;

        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < maxScroll - 10);
    };

    // Initial check and resize listener
    useEffect(() => {
        updateArrowVisibility();

        const handleResize = () => {
            updateArrowVisibility();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Smooth scroll handler
    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const cardWidth = 130; // Approximate card width + gap
        const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    // Handle card selection
    const handleCardClick = (index) => {
        setActiveDay(index);

        // Scroll the selected card into view on mobile
        const container = scrollContainerRef.current;
        if (!container) return;

        const cards = container.querySelectorAll('.forecast-card');
        if (cards[index]) {
            cards[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    return (
        <section className="seven-day-forecast">
            {/* <h2 className="seven-day-forecast__title">7-Day Forecast</h2> */}

            <div className="seven-day-forecast__container">
                {/* Left Navigation Arrow */}
                <button
                    className={`seven-day-forecast__arrow seven-day-forecast__arrow--left ${showLeftArrow ? 'visible' : ''}`}
                    onClick={() => handleScroll('left')}
                    aria-label="Scroll left"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Cards Container with Horizontal Scroll */}
                <div
                    className="seven-day-forecast__cards"
                    ref={scrollContainerRef}
                    onScroll={updateArrowVisibility}
                >
                    {forecastData.map((forecast, index) => (
                        <DayForecastCard
                            key={forecast.id}
                            day={forecast.day}
                            icon={forecast.icon}
                            maxTemp={forecast.maxTemp}
                            minTemp={forecast.minTemp}
                            isActive={index === activeDay}
                            onClick={() => handleCardClick(index)}
                        />
                    ))}
                </div>

                {/* Right Navigation Arrow */}
                <button
                    className={`seven-day-forecast__arrow seven-day-forecast__arrow--right ${showRightArrow ? 'visible' : ''}`}
                    onClick={() => handleScroll('right')}
                    aria-label="Scroll right"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            {/* Mobile Scroll Indicator Dots */}
            <div className="seven-day-forecast__dots">
                {forecastData.map((_, index) => (
                    <button
                        key={index}
                        className={`seven-day-forecast__dot ${index === activeDay ? 'active' : ''}`}
                        onClick={() => handleCardClick(index)}
                        aria-label={`Go to day ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default DayForecast;
