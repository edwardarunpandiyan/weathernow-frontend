import React from 'react';
import WeatherIcon from '../../assets/WeatherIcon';
import radial from '../../assets/radial.png'
/**
 * HourlyRadial component displays a circular radial visualization
 * with fixed 24-hour layout (12 AM - 11 PM) and weather data
 */
const HourForecastRadial = ({ hourlyData, selectedIndex, onHourSelect }) => {
    const selectedHour = hourlyData[selectedIndex] || hourlyData[0];

    // SVG dimensions - increased to prevent clipping
    const size = 500;
    const center = size / 2;
    const outerRadius = 175;
    const innerRadius = 120;
    const tickRadius = 165;
    const markerRadius = 155;
    const arcRadius = 145;
    const labelRadius = outerRadius + 35; // Labels outside the circle

    // Fixed 24-hour labels (every 6 hours)
    const fixedLabelHours = [
        { hour: 0, label: '12', suffix: 'AM' },   // Top (midnight)
        { hour: 6, label: '6', suffix: 'AM' },    // Right
        { hour: 12, label: '12', suffix: 'PM' },  // Bottom (noon)
        { hour: 18, label: '6', suffix: 'PM' },   // Left
    ];

    // Generate arc path for weather conditions
    const generateArcPath = (startAngle, endAngle, radius) => {
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const startX = center + radius * Math.cos(startRad);
        const startY = center + radius * Math.sin(startRad);
        const endX = center + radius * Math.cos(endRad);
        const endY = center + radius * Math.sin(endRad);

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    // Create a map from actual hour (0-23) to data index
    const hourDataMap = React.useMemo(() => {
        const map = {};
        hourlyData.forEach((data, index) => {
            map[data.hour] = { data, index };
        });
        return map;
    }, [hourlyData]);

    // Group consecutive hours by weather condition for arcs
    const getWeatherArcs = () => {
        const arcs = [];
        let currentCondition = null;
        let startHour = null;

        // Iterate through all 24 fixed hours
        for (let h = 0; h < 24; h++) {
            const entry = hourDataMap[h];
            if (!entry) continue;

            const condition = entry.data.condition.toLowerCase().includes('sunny') ||
                entry.data.condition.toLowerCase().includes('clear') ? 'sunny' :
                entry.data.condition.toLowerCase().includes('rain') ? 'rainy' : 'cloudy';

            if (condition !== currentCondition) {
                if (currentCondition !== null && startHour !== null) {
                    arcs.push({
                        condition: currentCondition,
                        startHour,
                        endHour: h - 1
                    });
                }
                currentCondition = condition;
                startHour = h;
            }
        }

        // Add the last arc
        if (currentCondition !== null && startHour !== null) {
            arcs.push({
                condition: currentCondition,
                startHour,
                endHour: 23
            });
        }

        return arcs;
    };

    const weatherArcs = getWeatherArcs();

    // Calculate position on the circle for a given hour (0-23)
    const getPositionByHour = (hour, radius) => {
        const angle = (hour / 24) * 360 - 90; // Start from top (12 AM = midnight)
        const rad = angle * (Math.PI / 180);
        return {
            x: center + radius * Math.cos(rad),
            y: center + radius * Math.sin(rad)
        };
    };

    // Get the hour value of the currently selected data
    const selectedHourValue = selectedHour?.hour;

    return (
        <div className="hourly-radial">
            <div className="hourly-radial__container">
                {/* Background image layer - sits behind the SVG */}
                <div
                    className="hourly-radial__bg-image"
                    style={{ backgroundImage: `url(${radial})` }}
                />
                <svg
                    className="hourly-radial__svg"
                    viewBox={`0 0 ${size} ${size}`}
                    aria-hidden="true"
                >

                    <defs>
                        {/* Radial gradient for main circle */}
                        <radialGradient id="radialGradient" cx="50%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#f0f4f8" />
                            <stop offset="100%" stopColor="#d3dde6" />
                        </radialGradient>

                        {/* Inner gradient */}
                        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="100%" stopColor="#e8eef3" />
                        </linearGradient>

                        {/* Sunny arc gradient */}
                        <linearGradient id="sunnyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#ffb347" />
                        </linearGradient>

                        {/* Shadow filter */}
                        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
                        </filter>
                    </defs>

                    {/* Main circle background */}
                    {/* <circle
                        cx={center}
                        cy={center}
                        r={outerRadius}
                        className="hourly-radial__bg"
                        filter="url(#dropShadow)"
                    /> */}

                    {/* Inner circle */}
                    {/* <circle
                        cx={center}
                        cy={center}
                        r={innerRadius}
                        className="hourly-radial__inner-bg"
                    /> */}
                    {/* <img className="" src={radial} alt="App Logo" /> */}
                    {/* Weather condition arcs */}
                    {/* {weatherArcs.map((arc, index) => {
                        const startAngle = (arc.startHour / 24) * 360;
                        const endAngle = ((arc.endHour + 1) / 24) * 360;
                        const arcClass = `hourly-radial__arc hourly-radial__arc--${arc.condition}`;

                        return (
                            <path
                                key={index}
                                d={generateArcPath(startAngle, endAngle, arcRadius)}
                                className={arcClass}
                            />
                        );
                    })} */}

                    {/* Hour tick marks - fixed 24 positions */}
                    {Array.from({ length: 24 }).map((_, hour) => {
                        const angle = (hour / 24) * 360 - 90;
                        const rad = angle * (Math.PI / 180);
                        const isMajor = hour % 6 === 0;
                        const tickStart = isMajor ? tickRadius - 12 : tickRadius - 8;
                        const tickEnd = tickRadius;

                        const x1 = center + tickStart * Math.cos(rad);
                        const y1 = center + tickStart * Math.sin(rad);
                        const x2 = center + tickEnd * Math.cos(rad);
                        const y2 = center + tickEnd * Math.sin(rad);

                        return (
                            <line
                                key={hour}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                className={`hourly-radial__tick ${isMajor ? 'hourly-radial__tick--major' : ''}`}
                            />
                        );
                    })}

                    {/* Hour markers (dots) - fixed 24 positions, clickable if data exists */}
                    {Array.from({ length: 24 }).map((_, hour) => {
                        const pos = getPositionByHour(hour, markerRadius);
                        const entry = hourDataMap[hour];
                        const hasData = entry !== undefined;
                        const isSelected = hour === selectedHourValue;

                        return (
                            <circle
                                key={hour}
                                cx={pos.x}
                                cy={pos.y}
                                r={isSelected ? 10 : 6}
                                className={`hourly-radial__marker ${isSelected ? 'hourly-radial__marker--selected' : ''} ${!hasData ? 'hourly-radial__marker--disabled' : ''}`}
                                onClick={() => hasData && onHourSelect(entry.index)}
                                onKeyDown={(e) => {
                                    if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onHourSelect(entry.index);
                                    }
                                }}
                                tabIndex={hasData ? 0 : -1}
                                role="button"
                                aria-label={hasData ? `Select ${entry.data.timeLabel}` : `${hour}:00 - No data`}
                                style={{ cursor: hasData ? 'pointer' : 'default' }}
                            />
                        );
                    })}

                    {/* Fixed hour labels around the edge (12 AM, 6 AM, 12 PM, 6 PM) */}
                    {fixedLabelHours.map(({ hour, label, suffix }) => {
                        const pos = getPositionByHour(hour, labelRadius);
                        return (
                            <text
                                key={hour}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="hourly-radial__hour-label"
                            >
                                {label}
                                <tspan className="hourly-radial__hour-label-suffix"> {suffix}</tspan>
                            </text>
                        );
                    })}
                </svg>

                {/* Center content - detailed weather data */}
                <div className="hourly-radial__center">
                    <span className="hourly-radial__time-label">
                        {selectedHour.isNow ? 'Now ' : ''}{selectedHour.timeLabel}
                    </span>

                    <div className="hourly-radial__temp-row">
                        <div className="hourly-radial__temp-icon">
                            <WeatherIcon condition={selectedHour.condition} size="100%" />
                        </div>
                        <span className="hourly-radial__temp">{selectedHour.temp}°</span>
                    </div>

                    <span className="hourly-radial__condition">{selectedHour.condition}</span>

                    {/* Additional weather details */}
                    <div className="hourly-radial__details">
                        <div className="hourly-radial__detail-item">
                            <svg className="hourly-radial__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M6.34 6.34l-1.42-1.42M19.08 19.08l-1.42-1.42M6.34 17.66l-1.42 1.42M19.08 4.92l-1.42 1.42" />
                            </svg>
                            <span>Feels {selectedHour.feelsLike}°</span>
                        </div>

                        <div className="hourly-radial__detail-item">
                            <svg className="hourly-radial__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                            </svg>
                            <span>{selectedHour.wind}</span>
                        </div>

                        <div className="hourly-radial__detail-item">
                            <svg className="hourly-radial__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                            <span>{selectedHour.humidity}%</span>
                        </div>

                        <div className="hourly-radial__detail-item">
                            <svg className="hourly-radial__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
                                <path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01" />
                            </svg>
                            <span>{selectedHour.precipitation}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourForecastRadial;
