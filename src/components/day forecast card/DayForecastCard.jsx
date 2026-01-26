import React from 'react';

/**
 * Weather icons as inline SVG components
 */
const SunIcon = () => (
    <svg viewBox="0 0 64 64" className="forecast-card__icon">
        <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#F9A826" />
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="14" fill="url(#sunGradient)" />
        {/* Sun rays */}
        <g stroke="#FFD93D" strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="8" x2="32" y2="14" />
            <line x1="32" y1="50" x2="32" y2="56" />
            <line x1="8" y1="32" x2="14" y2="32" />
            <line x1="50" y1="32" x2="56" y2="32" />
            <line x1="15" y1="15" x2="19" y2="19" />
            <line x1="45" y1="45" x2="49" y2="49" />
            <line x1="45" y1="15" x2="49" y2="19" />
            <line x1="15" y1="45" x2="19" y2="49" />
        </g>
    </svg>
);

const SunCloudIcon = () => (
    <svg viewBox="0 0 64 64" className="forecast-card__icon">
        <defs>
            <linearGradient id="sunGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#F9A826" />
            </linearGradient>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E8EDF2" />
            </linearGradient>
        </defs>
        {/* Sun behind cloud */}
        <circle cx="24" cy="22" r="12" fill="url(#sunGradient2)" />
        <g stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round">
            <line x1="24" y1="4" x2="24" y2="8" />
            <line x1="8" y1="22" x2="12" y2="22" />
            <line x1="12" y1="10" x2="15" y2="13" />
            <line x1="36" y1="10" x2="33" y2="13" />
        </g>
        {/* Cloud in front */}
        <ellipse cx="38" cy="42" rx="18" ry="12" fill="url(#cloudGradient)" />
        <ellipse cx="28" cy="38" rx="12" ry="10" fill="url(#cloudGradient)" />
        <ellipse cx="46" cy="40" rx="10" ry="8" fill="url(#cloudGradient)" />
    </svg>
);

const CloudySunIcon = () => (
    <svg viewBox="0 0 64 64" className="forecast-card__icon">
        <defs>
            <linearGradient id="sunGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#F9A826" />
            </linearGradient>
            <linearGradient id="cloudGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#D4E5F7" />
            </linearGradient>
        </defs>
        {/* Sun peeking */}
        <circle cx="22" cy="20" r="10" fill="url(#sunGradient3)" />
        <g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round">
            <line x1="22" y1="5" x2="22" y2="9" />
            <line x1="9" y1="20" x2="13" y2="20" />
            <line x1="13" y1="11" x2="16" y2="14" />
        </g>
        {/* Larger cloud */}
        <ellipse cx="36" cy="40" rx="20" ry="14" fill="url(#cloudGradient2)" />
        <ellipse cx="24" cy="36" rx="14" ry="12" fill="url(#cloudGradient2)" />
        <ellipse cx="48" cy="38" rx="12" ry="10" fill="url(#cloudGradient2)" />
    </svg>
);

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
    icon = 'sun',
    maxTemp,
    minTemp,
    isActive = false,
    onClick
}) => {
    const renderIcon = () => {
        switch (icon) {
            case 'sun-cloud':
                return <SunCloudIcon />;
            case 'cloudy-sun':
                return <CloudySunIcon />;
            case 'sun':
            default:
                return <SunIcon />;
        }
    };

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
                {renderIcon()}
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
