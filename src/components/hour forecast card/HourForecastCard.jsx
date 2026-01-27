import React from 'react';
import WeatherIcon from '../../assets/WeatherIcon';
import '../../styles/hourly forecast/HourlyForecast.css';

/**
 * HourCard component displays weather info for a single hour
 */
const HourForecastCard = ({ hourData, isSelected, isNow, onClick }) => {
    return (
        <div
            className={`hour-card ${isSelected ? 'hour-card--selected' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-pressed={isSelected}
            aria-label={`${hourData.timeLabel}, ${hourData.temp}°, ${hourData.condition}`}
        >
            {isNow && <span className="hour-card__now-label">Now</span>}
            <span className="hour-card__time">{hourData.timeLabel}</span>
            <div className="hour-card__icon">
                <WeatherIcon condition={hourData.condition} size={48} />
            </div>
            <span className="hour-card__temp">{hourData.temp}°</span>
        </div>
    );
};

export default HourForecastCard;
