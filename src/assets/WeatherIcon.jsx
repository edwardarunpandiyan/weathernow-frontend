import React from 'react';

/**
 * Weather icon component that renders SVG icons for different weather conditions
 */
const WeatherIcon = ({ condition, size = 48, className = '' }) => {
    const iconSize = typeof size === 'number' ? `${size}px` : size;

    const icons = {
        sunny: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFE066" />
                        <stop offset="100%" stopColor="#FFB800" />
                    </radialGradient>
                </defs>
                <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                        key={i}
                        x1="32"
                        y1="8"
                        x2="32"
                        y2="14"
                        stroke="#FFB800"
                        strokeWidth="3"
                        strokeLinecap="round"
                        transform={`rotate(${angle} 32 32)`}
                    />
                ))}
            </svg>
        ),

        partlyCloudy: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <radialGradient id="sunGrad2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFE066" />
                        <stop offset="100%" stopColor="#FFB800" />
                    </radialGradient>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E8EEF3" />
                    </linearGradient>
                </defs>
                {/* Sun behind cloud */}
                <circle cx="42" cy="20" r="12" fill="url(#sunGrad2)" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                        key={i}
                        x1="42"
                        y1="4"
                        x2="42"
                        y2="9"
                        stroke="#FFB800"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform={`rotate(${angle} 42 20)`}
                    />
                ))}
                {/* Cloud */}
                <ellipse cx="24" cy="40" rx="16" ry="12" fill="url(#cloudGrad)" />
                <ellipse cx="38" cy="42" rx="14" ry="10" fill="url(#cloudGrad)" />
                <ellipse cx="30" cy="36" rx="12" ry="10" fill="#FFFFFF" />
            </svg>
        ),

        cloudy: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D3DEE8" />
                        <stop offset="100%" stopColor="#A8BFCF" />
                    </linearGradient>
                </defs>
                <ellipse cx="20" cy="38" rx="14" ry="11" fill="#C9D6E0" />
                <ellipse cx="38" cy="40" rx="16" ry="12" fill="url(#cloudGrad2)" />
                <ellipse cx="28" cy="34" rx="14" ry="11" fill="#E8EEF3" />
                <ellipse cx="44" cy="36" rx="12" ry="9" fill="#D3DEE8" />
            </svg>
        ),

        rainy: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A8BFCF" />
                        <stop offset="100%" stopColor="#7A9BB5" />
                    </linearGradient>
                </defs>
                {/* Cloud */}
                <ellipse cx="20" cy="26" rx="12" ry="9" fill="#8FA8BB" />
                <ellipse cx="36" cy="28" rx="14" ry="10" fill="url(#rainCloudGrad)" />
                <ellipse cx="28" cy="24" rx="12" ry="9" fill="#A8BFCF" />
                {/* Rain drops */}
                {[20, 32, 44].map((x, i) => (
                    <g key={i}>
                        <line x1={x} y1="42" x2={x - 4} y2="52" stroke="#5B9BD5" strokeWidth="2" strokeLinecap="round" />
                        <line x1={x - 8} y1="48" x2={x - 12} y2="58" stroke="#5B9BD5" strokeWidth="2" strokeLinecap="round" />
                    </g>
                ))}
            </svg>
        ),

        stormy: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <linearGradient id="stormCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7A9BB5" />
                        <stop offset="100%" stopColor="#5A7A8F" />
                    </linearGradient>
                </defs>
                {/* Dark cloud */}
                <ellipse cx="20" cy="24" rx="12" ry="9" fill="#6B8A9F" />
                <ellipse cx="36" cy="26" rx="14" ry="10" fill="url(#stormCloudGrad)" />
                <ellipse cx="28" cy="22" rx="12" ry="9" fill="#7A9BB5" />
                {/* Lightning bolt */}
                <polygon points="32,32 28,42 34,42 30,56 40,40 34,40 38,32" fill="#FFD700" />
            </svg>
        ),

        night: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5F5DC" />
                        <stop offset="100%" stopColor="#E8E4C9" />
                    </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="16" fill="url(#moonGrad)" />
                <circle cx="40" cy="28" r="14" fill="#1a1a2e" />
                {/* Stars */}
                {[{ x: 14, y: 16 }, { x: 50, y: 44 }, { x: 18, y: 48 }].map((star, i) => (
                    <circle key={i} cx={star.x} cy={star.y} r="1.5" fill="#FFE066" />
                ))}
            </svg>
        ),

        nightCloudy: (
            <svg viewBox="0 0 64 64" width={iconSize} height={iconSize} className={className}>
                <defs>
                    <linearGradient id="moonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5F5DC" />
                        <stop offset="100%" stopColor="#E8E4C9" />
                    </linearGradient>
                    <linearGradient id="nightCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C9D6E0" />
                        <stop offset="100%" stopColor="#A8BFCF" />
                    </linearGradient>
                </defs>
                {/* Moon behind */}
                <circle cx="44" cy="18" r="10" fill="url(#moonGrad2)" />
                <circle cx="50" cy="15" r="9" fill="#1a1a2e" />
                {/* Cloud */}
                <ellipse cx="24" cy="40" rx="14" ry="10" fill="url(#nightCloudGrad)" />
                <ellipse cx="36" cy="42" rx="12" ry="9" fill="#D3DEE8" />
                <ellipse cx="30" cy="38" rx="10" ry="8" fill="#E8EEF3" />
            </svg>
        )
    };

    // Map condition strings to icon keys
    const getIconKey = (cond) => {
        const condLower = (cond || 'sunny').toLowerCase();
        if (condLower.includes('storm') || condLower.includes('thunder')) return 'stormy';
        if (condLower.includes('rain') || condLower.includes('shower')) return 'rainy';
        if (condLower.includes('night') && condLower.includes('cloud')) return 'nightCloudy';
        if (condLower.includes('night') || condLower.includes('clear night')) return 'night';
        if (condLower.includes('partly') || condLower.includes('partial')) return 'partlyCloudy';
        if (condLower.includes('cloud') || condLower.includes('overcast')) return 'cloudy';
        return 'sunny';
    };

    return (
        <div className="weather-icon">
            {icons[getIconKey(condition)] || icons.sunny}
        </div>
    );
};

export default WeatherIcon;
