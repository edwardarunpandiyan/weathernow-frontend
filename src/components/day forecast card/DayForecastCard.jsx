import React from 'react';
import WeatherIcon from '../../assets/WeatherIcon';

/**
 * ForecastCard Component
 * Displays a single day's weather forecast
 * 
 * @param {Object} props
 * @param {string} props.day - Day name (e.g., "Tue", "Wed")
 * @param {string} props.icon - Icon type: "sun", "sun-cloud", "cloudy-sun"
 * @param {number} props.maxTemp - Maximum temperature
 * @param {number} props.minTemp - Minimum temperature
 * @param {boolean} props.isActive - Whether this card is selected/active
 * @param {function} props.onClick - Click handler
 */
const DayForecastCard = ({
    day,
    icon,
    maxTemp,
    minTemp,
    isActive = false,
    onClick
}) => {
    return (
        <div
            className={`forecast-card ${isActive ? 'forecast-card--active' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
            <span className="forecast-card__day">{day}</span>
            <div className="forecast-card__icon-wrapper">
                <WeatherIcon weatherCode={icon} />
            </div>
            <div className="forecast-card__temps">
                <span className="forecast-card__temp-max">{maxTemp}°</span>
                <span className="forecast-card__temp-divider">|</span>
                <span className="forecast-card__temp-min">{minTemp}°</span>
            </div>
        </div>
    );
};

export default DayForecastCard;
