import React, { useId } from 'react';

/**
 * Weather icon component that renders SVG icons based on WMO weather codes.
 * Supports day/night variants via the `isDay` prop (defaults to true).
 *
 * Props:
 *   weatherCode (number) - WMO weather code (0-99)
 *   size         (number|string) - Icon size in px or CSS string. Default: 48
 *   className    (string) - Additional CSS class names
 *   isDay        (boolean) - true = day icons, false = night icons. Default: true
 *
 * Weather Code Map (WMO standard):
 *   0  - Clear sky
 *   1  - Mainly clear
 *   2  - Partly cloudy
 *   3  - Overcast
 *  45  - Fog
 *  48  - Depositing rime fog
 *  51  - Light drizzle
 *  53  - Moderate drizzle
 *  55  - Dense drizzle
 *  56  - Light freezing drizzle
 *  57  - Dense freezing drizzle
 *  61  - Light rain
 *  63  - Moderate rain
 *  65  - Heavy rain
 *  66  - Light freezing rain
 *  67  - Heavy freezing rain
 *  71  - Light snowfall
 *  73  - Moderate snowfall
 *  75  - Heavy snowfall
 *  77  - Snow grains
 *  80  - Light rain showers
 *  81  - Moderate rain showers
 *  82  - Heavy rain showers
 *  85  - Light snow showers
 *  86  - Heavy snow showers
 *  95  - Thunderstorm
 *  96  - Thunderstorm with hail
 *  99  - Thunderstorm with heavy hail
 */

/* ═══════════════════════════════════════════════════
   Reusable SVG building blocks
   ═══════════════════════════════════════════════════ */

const Sun = ({ cx, cy, r, rayLen, uid }) => (
    <g>
        <defs>
            <radialGradient id={`sun-${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#FFB800" />
            </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill={`url(#sun-${uid})`} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
                key={i}
                x1={cx}
                y1={cy - r - 4}
                x2={cx}
                y2={cy - r - 4 - rayLen}
                stroke="#FFB800"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${angle} ${cx} ${cy})`}
            />
        ))}
    </g>
);

const Moon = ({ cx, cy, r, uid }) => (
    <g>
        <defs>
            <linearGradient id={`moon-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5F5DC" />
                <stop offset="100%" stopColor="#E8E4C9" />
            </linearGradient>
            <mask id={`moonMask-${uid}`}>
                <rect x="0" y="0" width="64" height="64" fill="white" />
                <circle cx={cx + r * 0.55} cy={cy - r * 0.25} r={r * 0.85} fill="black" />
            </mask>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill={`url(#moon-${uid})`} mask={`url(#moonMask-${uid})`} />
    </g>
);

const Stars = ({ positions }) => (
    <g>
        {positions.map((star, i) => (
            <g key={i}>
                <circle cx={star.x} cy={star.y} r={star.r || 1.2} fill="#FFE066" opacity={star.o || 0.8} />
                {(star.r || 1.2) > 1 && (
                    <g>
                        <line x1={star.x - 2} y1={star.y} x2={star.x + 2} y2={star.y} stroke="#FFE066" strokeWidth="0.4" opacity="0.5" />
                        <line x1={star.x} y1={star.y - 2} x2={star.x} y2={star.y + 2} stroke="#FFE066" strokeWidth="0.4" opacity="0.5" />
                    </g>
                )}
            </g>
        ))}
    </g>
);

const Cloud = ({ cx, cy, scale = 1, color = '#E8EEF3', shadow = '#C9D6E0' }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <ellipse cx="-8" cy="4" rx="14" ry="10" fill={shadow} />
        <ellipse cx="8" cy="6" rx="16" ry="11" fill={color} />
        <ellipse cx="0" cy="0" rx="13" ry="10" fill="#FFFFFF" opacity="0.9" />
    </g>
);

const NightCloud = ({ cx, cy, scale = 1 }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <ellipse cx="-8" cy="4" rx="14" ry="10" fill="#8090A0" />
        <ellipse cx="8" cy="6" rx="16" ry="11" fill="#95A5B5" />
        <ellipse cx="0" cy="0" rx="13" ry="10" fill="#B0BCC8" opacity="0.9" />
    </g>
);

const DarkCloud = ({ cx, cy, scale = 1 }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <ellipse cx="-8" cy="4" rx="14" ry="10" fill="#6B8A9F" />
        <ellipse cx="8" cy="6" rx="16" ry="11" fill="#5A7A8F" />
        <ellipse cx="0" cy="0" rx="13" ry="10" fill="#7A9BB5" />
    </g>
);

const RainDrop = ({ x, y, length = 10, color = '#5B9BD5' }) => (
    <line
        x1={x}
        y1={y}
        x2={x - 2}
        y2={y + length}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
    />
);

const Snowflake = ({ x, y, r = 2.5 }) => (
    <g>
        <circle cx={x} cy={y} r={r * 0.4} fill="#B8D8F0" />
        {[0, 60, 120].map((angle, i) => (
            <line
                key={i}
                x1={x - r}
                y1={y}
                x2={x + r}
                y2={y}
                stroke="#A8CCE8"
                strokeWidth="1.2"
                strokeLinecap="round"
                transform={`rotate(${angle} ${x} ${y})`}
            />
        ))}
    </g>
);

const HailStone = ({ x, y, r = 2.5 }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill="#D0E8F5" stroke="#A0C8E0" strokeWidth="0.8" />
        <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.25} fill="#FFFFFF" opacity="0.6" />
    </g>
);

/* ═══════════════════════════════════════════════════
   DAY Weather Icons
   ═══════════════════════════════════════════════════ */

// 0 - Clear sky (Day)
const ClearSky = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={32} cy={32} r={14} rayLen={8} uid={uid} />
    </svg>
);

// 1 - Mainly clear (Day)
const MainlyClear = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={36} cy={26} r={12} rayLen={6} uid={uid} />
        <ellipse cx="18" cy="48" rx="10" ry="5" fill="#E8EEF3" opacity="0.7" />
        <ellipse cx="26" cy="46" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" />
    </svg>
);

// 2 - Partly cloudy (Day)
const PartlyCloudy = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={44} cy={18} r={11} rayLen={5} uid={uid} />
        <Cloud cx={26} cy={40} scale={1} />
    </svg>
);

// 3 - Overcast
const Overcast = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <ellipse cx="18" cy="32" rx="14" ry="10" fill="#B8C8D4" />
        <ellipse cx="36" cy="34" rx="18" ry="12" fill="#A8BFCF" />
        <ellipse cx="26" cy="28" rx="15" ry="10" fill="#D3DEE8" />
        <ellipse cx="44" cy="30" rx="12" ry="9" fill="#C0CFD9" />
        <ellipse cx="32" cy="38" rx="20" ry="8" fill="#CCD8E2" />
    </svg>
);

// 45 - Fog
const Fog = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        {[22, 30, 38, 46].map((y, i) => (
            <line
                key={i}
                x1={8 + (i % 2) * 4}
                y1={y}
                x2={56 - (i % 2) * 4}
                y2={y}
                stroke="#B8C8D4"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.5 + i * 0.12}
            />
        ))}
        <ellipse cx="32" cy="18" rx="16" ry="8" fill="#D3DEE8" opacity="0.6" />
    </svg>
);

// 48 - Depositing rime fog
const RimeFog = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        {[22, 30, 38, 46].map((y, i) => (
            <line
                key={i}
                x1={8 + (i % 2) * 4}
                y1={y}
                x2={56 - (i % 2) * 4}
                y2={y}
                stroke="#A8C8E0"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.5 + i * 0.12}
            />
        ))}
        <ellipse cx="32" cy="18" rx="16" ry="8" fill="#C0D8EA" opacity="0.6" />
        {[{ x: 16, y: 26 }, { x: 42, y: 34 }, { x: 28, y: 42 }, { x: 50, y: 26 }].map((p, i) => (
            <g key={i}>
                <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke="#88B8D8" strokeWidth="1" />
                <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke="#88B8D8" strokeWidth="1" />
                <line x1={p.x - 2} y1={p.y - 2} x2={p.x + 2} y2={p.y + 2} stroke="#88B8D8" strokeWidth="0.8" />
            </g>
        ))}
    </svg>
);

// 51 - Light drizzle
const LightDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={24} />
        <circle cx="22" cy="44" r="1.5" fill="#7BB8D8" />
        <circle cx="34" cy="48" r="1.5" fill="#7BB8D8" />
    </svg>
);

// 53 - Moderate drizzle
const ModerateDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={24} />
        <circle cx="18" cy="44" r="1.5" fill="#7BB8D8" />
        <circle cx="28" cy="48" r="1.5" fill="#7BB8D8" />
        <circle cx="38" cy="44" r="1.5" fill="#7BB8D8" />
        <circle cx="24" cy="52" r="1.5" fill="#7BB8D8" />
    </svg>
);

// 55 - Dense drizzle
const DenseDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} shadow="#B0BFC8" />
        <circle cx="16" cy="42" r="1.5" fill="#5BA8D0" />
        <circle cx="24" cy="46" r="1.5" fill="#5BA8D0" />
        <circle cx="32" cy="42" r="1.5" fill="#5BA8D0" />
        <circle cx="40" cy="46" r="1.5" fill="#5BA8D0" />
        <circle cx="20" cy="52" r="1.5" fill="#5BA8D0" />
        <circle cx="28" cy="54" r="1.5" fill="#5BA8D0" />
        <circle cx="36" cy="52" r="1.5" fill="#5BA8D0" />
    </svg>
);

// 56 - Light freezing drizzle
const LightFreezingDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={24} color="#D8E8F0" shadow="#A8C0D0" />
        <circle cx="22" cy="44" r="1.8" fill="#88CCE8" stroke="#60A8D0" strokeWidth="0.5" />
        <circle cx="34" cy="48" r="1.8" fill="#88CCE8" stroke="#60A8D0" strokeWidth="0.5" />
        <circle cx="28" cy="52" r="1.8" fill="#88CCE8" stroke="#60A8D0" strokeWidth="0.5" />
    </svg>
);

// 57 - Dense freezing drizzle
const DenseFreezingDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} color="#C8D8E8" shadow="#90AAC0" />
        <circle cx="18" cy="42" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="26" cy="46" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="34" cy="42" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="42" cy="46" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="22" cy="52" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="30" cy="54" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
        <circle cx="38" cy="52" r="1.8" fill="#70B8E0" stroke="#5098C0" strokeWidth="0.5" />
    </svg>
);

// 61 - Light rain
const LightRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} shadow="#A8B8C4" />
        <RainDrop x={22} y={40} length={8} />
        <RainDrop x={34} y={42} length={8} />
    </svg>
);

// 63 - Moderate rain
const ModerateRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={20} shadow="#90A8B8" />
        <RainDrop x={18} y={38} length={10} />
        <RainDrop x={28} y={40} length={10} />
        <RainDrop x={38} y={38} length={10} />
    </svg>
);

// 65 - Heavy rain
const HeavyRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={18} shadow="#7898AA" color="#C0D0D8" />
        <RainDrop x={14} y={36} length={12} />
        <RainDrop x={22} y={38} length={12} />
        <RainDrop x={30} y={36} length={12} />
        <RainDrop x={38} y={38} length={12} />
        <RainDrop x={46} y={36} length={12} />
        <RainDrop x={18} y={50} length={8} />
        <RainDrop x={34} y={50} length={8} />
    </svg>
);

// 66 - Light freezing rain
const LightFreezingRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} color="#D0E0EA" shadow="#90AAC0" />
        <RainDrop x={22} y={40} length={9} color="#60A8D8" />
        <RainDrop x={34} y={42} length={9} color="#60A8D8" />
        <circle cx="20" cy="52" r="2" fill="#B0D8F0" stroke="#80B8D8" strokeWidth="0.6" />
        <circle cx="32" cy="54" r="2" fill="#B0D8F0" stroke="#80B8D8" strokeWidth="0.6" />
    </svg>
);

// 67 - Heavy freezing rain
const HeavyFreezingRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={18} color="#B8D0E0" shadow="#7898B0" />
        <RainDrop x={16} y={36} length={11} color="#5098C8" />
        <RainDrop x={26} y={38} length={11} color="#5098C8" />
        <RainDrop x={36} y={36} length={11} color="#5098C8" />
        <RainDrop x={44} y={38} length={11} color="#5098C8" />
        <circle cx="18" cy="52" r="2.2" fill="#A0D0E8" stroke="#70A8C8" strokeWidth="0.6" />
        <circle cx="30" cy="54" r="2.2" fill="#A0D0E8" stroke="#70A8C8" strokeWidth="0.6" />
        <circle cx="42" cy="52" r="2.2" fill="#A0D0E8" stroke="#70A8C8" strokeWidth="0.6" />
    </svg>
);

// 71 - Light snowfall
const LightSnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} />
        <Snowflake x={24} y={44} r={3} />
        <Snowflake x={38} y={48} r={3} />
    </svg>
);

// 73 - Moderate snowfall
const ModerateSnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={20} />
        <Snowflake x={18} y={40} r={3} />
        <Snowflake x={30} y={44} r={3} />
        <Snowflake x={42} y={40} r={3} />
        <Snowflake x={24} y={52} r={2.5} />
    </svg>
);

// 75 - Heavy snowfall
const HeavySnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={18} shadow="#A0B8C8" />
        <Snowflake x={14} y={38} r={3} />
        <Snowflake x={26} y={42} r={3.5} />
        <Snowflake x={38} y={38} r={3} />
        <Snowflake x={48} y={42} r={3} />
        <Snowflake x={20} y={52} r={2.5} />
        <Snowflake x={34} y={54} r={3} />
        <Snowflake x={46} y={52} r={2.5} />
    </svg>
);

// 77 - Snow grains
const SnowGrains = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Cloud cx={30} cy={22} />
        {[
            { x: 18, y: 42 }, { x: 26, y: 46 }, { x: 34, y: 42 },
            { x: 42, y: 46 }, { x: 22, y: 52 }, { x: 30, y: 54 }, { x: 38, y: 52 },
        ].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="#C0D8E8" stroke="#90B0C8" strokeWidth="0.5" />
        ))}
    </svg>
);

// 80 - Light rain showers (Day)
const LightRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={46} cy={16} r={9} rayLen={4} uid={`lrs-${uid}`} />
        <Cloud cx={24} cy={30} scale={0.9} />
        <RainDrop x={18} y={44} length={7} />
        <RainDrop x={28} y={46} length={7} />
    </svg>
);

// 81 - Moderate rain showers (Day)
const ModerateRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={48} cy={14} r={8} rayLen={4} uid={`mrs-${uid}`} />
        <Cloud cx={24} cy={28} scale={0.9} />
        <RainDrop x={14} y={42} length={9} />
        <RainDrop x={24} y={44} length={9} />
        <RainDrop x={34} y={42} length={9} />
    </svg>
);

// 82 - Heavy rain showers (Day)
const HeavyRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={50} cy={12} r={7} rayLen={3} uid={`hrs-${uid}`} />
        <Cloud cx={24} cy={26} scale={0.95} shadow="#90A8B8" />
        <RainDrop x={12} y={40} length={11} />
        <RainDrop x={20} y={42} length={11} />
        <RainDrop x={28} y={40} length={11} />
        <RainDrop x={36} y={42} length={11} />
        <RainDrop x={16} y={54} length={6} />
        <RainDrop x={32} y={54} length={6} />
    </svg>
);

// 85 - Light snow showers (Day)
const LightSnowShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={46} cy={16} r={9} rayLen={4} uid={`lss-${uid}`} />
        <Cloud cx={24} cy={30} scale={0.9} />
        <Snowflake x={20} y={46} r={3} />
        <Snowflake x={34} y={50} r={3} />
    </svg>
);

// 86 - Heavy snow showers (Day)
const HeavySnowShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Sun cx={50} cy={12} r={7} rayLen={3} uid={`hss-${uid}`} />
        <Cloud cx={24} cy={26} scale={0.95} shadow="#A0B8C8" />
        <Snowflake x={14} y={42} r={3} />
        <Snowflake x={26} y={46} r={3.5} />
        <Snowflake x={38} y={42} r={3} />
        <Snowflake x={20} y={54} r={2.5} />
        <Snowflake x={32} y={54} r={3} />
    </svg>
);

// 95 - Thunderstorm
const Thunderstorm = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={18} />
        <polygon
            points="30,32 26,42 32,42 28,56 38,40 32,40 36,32"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
    </svg>
);

// 96 - Thunderstorm with hail
const ThunderstormHail = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={16} />
        <polygon
            points="28,30 24,38 30,38 26,50 36,36 30,36 34,30"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
        <HailStone x={16} y={48} r={2.5} />
        <HailStone x={40} y={46} r={2.5} />
        <HailStone x={28} y={56} r={2.5} />
    </svg>
);

// 99 - Thunderstorm with heavy hail
const ThunderstormHeavyHail = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={14} scale={1.05} />
        <polygon
            points="28,28 24,36 30,36 26,48 36,34 30,34 34,28"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
        <HailStone x={12} y={44} r={3} />
        <HailStone x={22} y={48} r={3.2} />
        <HailStone x={38} y={44} r={3} />
        <HailStone x={48} y={48} r={2.8} />
        <HailStone x={16} y={56} r={2.8} />
        <HailStone x={30} y={58} r={3} />
        <HailStone x={44} y={56} r={2.8} />
    </svg>
);

/* ═══════════════════════════════════════════════════
   NIGHT Weather Icons
   ═══════════════════════════════════════════════════ */

const defaultStars = [
    { x: 10, y: 12, r: 1.4, o: 0.9 },
    { x: 54, y: 10, r: 1.0, o: 0.7 },
    { x: 8, y: 44, r: 1.0, o: 0.6 },
    { x: 56, y: 50, r: 1.2, o: 0.8 },
    { x: 50, y: 30, r: 0.8, o: 0.5 },
];

// 0 - Clear sky (Night)
const NightClearSky = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Moon cx={32} cy={28} r={16} uid={`ncs-${uid}`} />
        <Stars positions={[
            { x: 10, y: 14, r: 1.5, o: 0.9 },
            { x: 54, y: 12, r: 1.2, o: 0.8 },
            { x: 14, y: 50, r: 1.3, o: 0.7 },
            { x: 52, y: 48, r: 1.4, o: 0.85 },
            { x: 8, y: 32, r: 1.0, o: 0.6 },
            { x: 56, y: 28, r: 0.9, o: 0.55 },
        ]} />
    </svg>
);

// 1 - Mainly clear (Night)
const NightMainlyClear = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Moon cx={36} cy={22} r={13} uid={`nmc-${uid}`} />
        <Stars positions={[
            { x: 10, y: 12, r: 1.3, o: 0.85 },
            { x: 56, y: 14, r: 1.0, o: 0.7 },
            { x: 8, y: 38, r: 1.1, o: 0.6 },
            { x: 54, y: 44, r: 1.2, o: 0.75 },
        ]} />
        <ellipse cx="18" cy="50" rx="10" ry="5" fill="#95A5B5" opacity="0.6" />
        <ellipse cx="26" cy="48" rx="8" ry="4" fill="#B0BCC8" opacity="0.5" />
    </svg>
);

// 2 - Partly cloudy (Night)
const NightPartlyCloudy = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Stars positions={[
            { x: 8, y: 10, r: 1.2, o: 0.8 },
            { x: 56, y: 8, r: 1.0, o: 0.7 },
            { x: 54, y: 36, r: 0.9, o: 0.5 },
        ]} />
        <Moon cx={44} cy={16} r={11} uid={`npc-${uid}`} />
        <NightCloud cx={26} cy={40} scale={1} />
    </svg>
);

// 3 - Overcast (Night)
const NightOvercast = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <ellipse cx="18" cy="32" rx="14" ry="10" fill="#6E7E8A" />
        <ellipse cx="36" cy="34" rx="18" ry="12" fill="#5E6E7A" />
        <ellipse cx="26" cy="28" rx="15" ry="10" fill="#8090A0" />
        <ellipse cx="44" cy="30" rx="12" ry="9" fill="#70808E" />
        <ellipse cx="32" cy="38" rx="20" ry="8" fill="#7A8A96" />
    </svg>
);

// 45 - Fog (Night)
const NightFog = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        {[22, 30, 38, 46].map((y, i) => (
            <line
                key={i}
                x1={8 + (i % 2) * 4}
                y1={y}
                x2={56 - (i % 2) * 4}
                y2={y}
                stroke="#7888A0"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.4 + i * 0.12}
            />
        ))}
        <ellipse cx="32" cy="18" rx="16" ry="8" fill="#8898A8" opacity="0.5" />
        <Stars positions={[
            { x: 12, y: 10, r: 1.0, o: 0.5 },
            { x: 52, y: 8, r: 0.8, o: 0.4 },
        ]} />
    </svg>
);

// 48 - Rime fog (Night)
const NightRimeFog = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        {[22, 30, 38, 46].map((y, i) => (
            <line
                key={i}
                x1={8 + (i % 2) * 4}
                y1={y}
                x2={56 - (i % 2) * 4}
                y2={y}
                stroke="#6888A8"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.4 + i * 0.12}
            />
        ))}
        <ellipse cx="32" cy="18" rx="16" ry="8" fill="#7898B0" opacity="0.5" />
        {[{ x: 16, y: 26 }, { x: 42, y: 34 }, { x: 28, y: 42 }, { x: 50, y: 26 }].map((p, i) => (
            <g key={i}>
                <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke="#6898B8" strokeWidth="1" />
                <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke="#6898B8" strokeWidth="1" />
                <line x1={p.x - 2} y1={p.y - 2} x2={p.x + 2} y2={p.y + 2} stroke="#6898B8" strokeWidth="0.8" />
            </g>
        ))}
    </svg>
);

// 51 - Light drizzle (Night)
const NightLightDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={24} />
        <circle cx="22" cy="44" r="1.5" fill="#6098B8" />
        <circle cx="34" cy="48" r="1.5" fill="#6098B8" />
        <Stars positions={[{ x: 52, y: 10, r: 0.9, o: 0.5 }, { x: 10, y: 14, r: 1.0, o: 0.6 }]} />
    </svg>
);

// 53 - Moderate drizzle (Night)
const NightModerateDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={24} />
        <circle cx="18" cy="44" r="1.5" fill="#6098B8" />
        <circle cx="28" cy="48" r="1.5" fill="#6098B8" />
        <circle cx="38" cy="44" r="1.5" fill="#6098B8" />
        <circle cx="24" cy="52" r="1.5" fill="#6098B8" />
        <Stars positions={[{ x: 54, y: 10, r: 0.9, o: 0.5 }]} />
    </svg>
);

// 55 - Dense drizzle (Night)
const NightDenseDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        <circle cx="16" cy="42" r="1.5" fill="#4888B0" />
        <circle cx="24" cy="46" r="1.5" fill="#4888B0" />
        <circle cx="32" cy="42" r="1.5" fill="#4888B0" />
        <circle cx="40" cy="46" r="1.5" fill="#4888B0" />
        <circle cx="20" cy="52" r="1.5" fill="#4888B0" />
        <circle cx="28" cy="54" r="1.5" fill="#4888B0" />
        <circle cx="36" cy="52" r="1.5" fill="#4888B0" />
    </svg>
);

// 56 - Light freezing drizzle (Night)
const NightLightFreezingDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={24} />
        <circle cx="22" cy="44" r="1.8" fill="#6AACC8" stroke="#4888A8" strokeWidth="0.5" />
        <circle cx="34" cy="48" r="1.8" fill="#6AACC8" stroke="#4888A8" strokeWidth="0.5" />
        <circle cx="28" cy="52" r="1.8" fill="#6AACC8" stroke="#4888A8" strokeWidth="0.5" />
    </svg>
);

// 57 - Dense freezing drizzle (Night)
const NightDenseFreezingDrizzle = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        <circle cx="18" cy="42" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="26" cy="46" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="34" cy="42" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="42" cy="46" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="22" cy="52" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="30" cy="54" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
        <circle cx="38" cy="52" r="1.8" fill="#5898C0" stroke="#3878A0" strokeWidth="0.5" />
    </svg>
);

// 61 - Light rain (Night)
const NightLightRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        <RainDrop x={22} y={40} length={8} color="#4888B5" />
        <RainDrop x={34} y={42} length={8} color="#4888B5" />
        <Stars positions={[{ x: 54, y: 10, r: 0.9, o: 0.5 }]} />
    </svg>
);

// 63 - Moderate rain (Night)
const NightModerateRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={20} />
        <RainDrop x={18} y={38} length={10} color="#4888B5" />
        <RainDrop x={28} y={40} length={10} color="#4888B5" />
        <RainDrop x={38} y={38} length={10} color="#4888B5" />
    </svg>
);

// 65 - Heavy rain (Night)
const NightHeavyRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={18} />
        <RainDrop x={14} y={36} length={12} color="#4080B0" />
        <RainDrop x={22} y={38} length={12} color="#4080B0" />
        <RainDrop x={30} y={36} length={12} color="#4080B0" />
        <RainDrop x={38} y={38} length={12} color="#4080B0" />
        <RainDrop x={46} y={36} length={12} color="#4080B0" />
        <RainDrop x={18} y={50} length={8} color="#4080B0" />
        <RainDrop x={34} y={50} length={8} color="#4080B0" />
    </svg>
);

// 66 - Light freezing rain (Night)
const NightLightFreezingRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        <RainDrop x={22} y={40} length={9} color="#4888B8" />
        <RainDrop x={34} y={42} length={9} color="#4888B8" />
        <circle cx="20" cy="52" r="2" fill="#90B8D0" stroke="#6090B0" strokeWidth="0.6" />
        <circle cx="32" cy="54" r="2" fill="#90B8D0" stroke="#6090B0" strokeWidth="0.6" />
    </svg>
);

// 67 - Heavy freezing rain (Night)
const NightHeavyFreezingRain = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={18} />
        <RainDrop x={16} y={36} length={11} color="#3878A8" />
        <RainDrop x={26} y={38} length={11} color="#3878A8" />
        <RainDrop x={36} y={36} length={11} color="#3878A8" />
        <RainDrop x={44} y={38} length={11} color="#3878A8" />
        <circle cx="18" cy="52" r="2.2" fill="#80B0C8" stroke="#5888A8" strokeWidth="0.6" />
        <circle cx="30" cy="54" r="2.2" fill="#80B0C8" stroke="#5888A8" strokeWidth="0.6" />
        <circle cx="42" cy="52" r="2.2" fill="#80B0C8" stroke="#5888A8" strokeWidth="0.6" />
    </svg>
);

// 71 - Light snowfall (Night)
const NightLightSnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        <Snowflake x={24} y={44} r={3} />
        <Snowflake x={38} y={48} r={3} />
        <Stars positions={[{ x: 54, y: 10, r: 0.9, o: 0.5 }]} />
    </svg>
);

// 73 - Moderate snowfall (Night)
const NightModerateSnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={20} />
        <Snowflake x={18} y={40} r={3} />
        <Snowflake x={30} y={44} r={3} />
        <Snowflake x={42} y={40} r={3} />
        <Snowflake x={24} y={52} r={2.5} />
    </svg>
);

// 75 - Heavy snowfall (Night)
const NightHeavySnow = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={18} />
        <Snowflake x={14} y={38} r={3} />
        <Snowflake x={26} y={42} r={3.5} />
        <Snowflake x={38} y={38} r={3} />
        <Snowflake x={48} y={42} r={3} />
        <Snowflake x={20} y={52} r={2.5} />
        <Snowflake x={34} y={54} r={3} />
        <Snowflake x={46} y={52} r={2.5} />
    </svg>
);

// 77 - Snow grains (Night)
const NightSnowGrains = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <NightCloud cx={30} cy={22} />
        {[
            { x: 18, y: 42 }, { x: 26, y: 46 }, { x: 34, y: 42 },
            { x: 42, y: 46 }, { x: 22, y: 52 }, { x: 30, y: 54 }, { x: 38, y: 52 },
        ].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="#A0C0D8" stroke="#7098B0" strokeWidth="0.5" />
        ))}
    </svg>
);

// 80 - Light rain showers (Night)
const NightLightRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Stars positions={[{ x: 8, y: 10, r: 1.0, o: 0.6 }, { x: 56, y: 8, r: 0.8, o: 0.5 }]} />
        <Moon cx={46} cy={14} r={9} uid={`nlrs-${uid}`} />
        <NightCloud cx={24} cy={30} scale={0.9} />
        <RainDrop x={18} y={44} length={7} color="#4888B5" />
        <RainDrop x={28} y={46} length={7} color="#4888B5" />
    </svg>
);

// 81 - Moderate rain showers (Night)
const NightModerateRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Stars positions={[{ x: 8, y: 8, r: 0.9, o: 0.5 }]} />
        <Moon cx={48} cy={12} r={8} uid={`nmrs-${uid}`} />
        <NightCloud cx={24} cy={28} scale={0.9} />
        <RainDrop x={14} y={42} length={9} color="#4888B5" />
        <RainDrop x={24} y={44} length={9} color="#4888B5" />
        <RainDrop x={34} y={42} length={9} color="#4888B5" />
    </svg>
);

// 82 - Heavy rain showers (Night)
const NightHeavyRainShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Moon cx={50} cy={10} r={7} uid={`nhrs-${uid}`} />
        <NightCloud cx={24} cy={26} scale={0.95} />
        <RainDrop x={12} y={40} length={11} color="#4080B0" />
        <RainDrop x={20} y={42} length={11} color="#4080B0" />
        <RainDrop x={28} y={40} length={11} color="#4080B0" />
        <RainDrop x={36} y={42} length={11} color="#4080B0" />
        <RainDrop x={16} y={54} length={6} color="#4080B0" />
        <RainDrop x={32} y={54} length={6} color="#4080B0" />
    </svg>
);

// 85 - Light snow showers (Night)
const NightLightSnowShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Stars positions={[{ x: 8, y: 10, r: 1.0, o: 0.6 }, { x: 56, y: 8, r: 0.8, o: 0.5 }]} />
        <Moon cx={46} cy={14} r={9} uid={`nlss-${uid}`} />
        <NightCloud cx={24} cy={30} scale={0.9} />
        <Snowflake x={20} y={46} r={3} />
        <Snowflake x={34} y={50} r={3} />
    </svg>
);

// 86 - Heavy snow showers (Night)
const NightHeavySnowShower = ({ size, className, uid }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <Moon cx={50} cy={10} r={7} uid={`nhss-${uid}`} />
        <NightCloud cx={24} cy={26} scale={0.95} />
        <Snowflake x={14} y={42} r={3} />
        <Snowflake x={26} y={46} r={3.5} />
        <Snowflake x={38} y={42} r={3} />
        <Snowflake x={20} y={54} r={2.5} />
        <Snowflake x={32} y={54} r={3} />
    </svg>
);

// 95 - Thunderstorm (Night)
const NightThunderstorm = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={18} />
        <polygon
            points="30,32 26,42 32,42 28,56 38,40 32,40 36,32"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
        <Stars positions={[{ x: 54, y: 8, r: 0.8, o: 0.4 }]} />
    </svg>
);

// 96 - Thunderstorm with hail (Night)
const NightThunderstormHail = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={16} />
        <polygon
            points="28,30 24,38 30,38 26,50 36,36 30,36 34,30"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
        <HailStone x={16} y={48} r={2.5} />
        <HailStone x={40} y={46} r={2.5} />
        <HailStone x={28} y={56} r={2.5} />
        <Stars positions={[{ x: 54, y: 8, r: 0.7, o: 0.35 }]} />
    </svg>
);

// 99 - Thunderstorm with heavy hail (Night)
const NightThunderstormHeavyHail = ({ size, className }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
        <DarkCloud cx={30} cy={14} scale={1.05} />
        <polygon
            points="28,28 24,36 30,36 26,48 36,34 30,34 34,28"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
        />
        <HailStone x={12} y={44} r={3} />
        <HailStone x={22} y={48} r={3.2} />
        <HailStone x={38} y={44} r={3} />
        <HailStone x={48} y={48} r={2.8} />
        <HailStone x={16} y={56} r={2.8} />
        <HailStone x={30} y={58} r={3} />
        <HailStone x={44} y={56} r={2.8} />
    </svg>
);

/* ═══════════════════════════════════════════════════
   Weather Code → Icon Key Mapping
   ═══════════════════════════════════════════════════ */

const WEATHER_CODE_MAP = {
    0: 'clearSky',
    1: 'mainlyClear',
    2: 'partlyCloudy',
    3: 'overcast',
    45: 'fog',
    48: 'rimeFog',
    51: 'lightDrizzle',
    53: 'moderateDrizzle',
    55: 'denseDrizzle',
    56: 'lightFreezingDrizzle',
    57: 'denseFreezingDrizzle',
    61: 'lightRain',
    63: 'moderateRain',
    65: 'heavyRain',
    66: 'lightFreezingRain',
    67: 'heavyFreezingRain',
    71: 'lightSnow',
    73: 'moderateSnow',
    75: 'heavySnow',
    77: 'snowGrains',
    80: 'lightRainShower',
    81: 'moderateRainShower',
    82: 'heavyRainShower',
    85: 'lightSnowShower',
    86: 'heavySnowShower',
    95: 'thunderstorm',
    96: 'thunderstormHail',
    99: 'thunderstormHeavyHail',
};

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

const WeatherIcon = ({ weatherCode, size = 48, className = '', isDay = true }) => {
    const uid = useId();
    const iconSize = typeof size === 'number' ? `${size}px` : size;
    const props = { size: iconSize, className, uid };

    const iconKey = WEATHER_CODE_MAP[weatherCode] || 'clearSky';

    // Day icon registry
    const dayIcons = {
        clearSky: <ClearSky {...props} />,
        mainlyClear: <MainlyClear {...props} />,
        partlyCloudy: <PartlyCloudy {...props} />,
        overcast: <Overcast {...props} />,
        fog: <Fog {...props} />,
        rimeFog: <RimeFog {...props} />,
        lightDrizzle: <LightDrizzle {...props} />,
        moderateDrizzle: <ModerateDrizzle {...props} />,
        denseDrizzle: <DenseDrizzle {...props} />,
        lightFreezingDrizzle: <LightFreezingDrizzle {...props} />,
        denseFreezingDrizzle: <DenseFreezingDrizzle {...props} />,
        lightRain: <LightRain {...props} />,
        moderateRain: <ModerateRain {...props} />,
        heavyRain: <HeavyRain {...props} />,
        lightFreezingRain: <LightFreezingRain {...props} />,
        heavyFreezingRain: <HeavyFreezingRain {...props} />,
        lightSnow: <LightSnow {...props} />,
        moderateSnow: <ModerateSnow {...props} />,
        heavySnow: <HeavySnow {...props} />,
        snowGrains: <SnowGrains {...props} />,
        lightRainShower: <LightRainShower {...props} />,
        moderateRainShower: <ModerateRainShower {...props} />,
        heavyRainShower: <HeavyRainShower {...props} />,
        lightSnowShower: <LightSnowShower {...props} />,
        heavySnowShower: <HeavySnowShower {...props} />,
        thunderstorm: <Thunderstorm {...props} />,
        thunderstormHail: <ThunderstormHail {...props} />,
        thunderstormHeavyHail: <ThunderstormHeavyHail {...props} />,
    };

    // Night icon registry — every weather code has a dedicated night variant
    const nightIcons = {
        clearSky: <NightClearSky {...props} />,
        mainlyClear: <NightMainlyClear {...props} />,
        partlyCloudy: <NightPartlyCloudy {...props} />,
        overcast: <NightOvercast {...props} />,
        fog: <NightFog {...props} />,
        rimeFog: <NightRimeFog {...props} />,
        lightDrizzle: <NightLightDrizzle {...props} />,
        moderateDrizzle: <NightModerateDrizzle {...props} />,
        denseDrizzle: <NightDenseDrizzle {...props} />,
        lightFreezingDrizzle: <NightLightFreezingDrizzle {...props} />,
        denseFreezingDrizzle: <NightDenseFreezingDrizzle {...props} />,
        lightRain: <NightLightRain {...props} />,
        moderateRain: <NightModerateRain {...props} />,
        heavyRain: <NightHeavyRain {...props} />,
        lightFreezingRain: <NightLightFreezingRain {...props} />,
        heavyFreezingRain: <NightHeavyFreezingRain {...props} />,
        lightSnow: <NightLightSnow {...props} />,
        moderateSnow: <NightModerateSnow {...props} />,
        heavySnow: <NightHeavySnow {...props} />,
        snowGrains: <NightSnowGrains {...props} />,
        lightRainShower: <NightLightRainShower {...props} />,
        moderateRainShower: <NightModerateRainShower {...props} />,
        heavyRainShower: <NightHeavyRainShower {...props} />,
        lightSnowShower: <NightLightSnowShower {...props} />,
        heavySnowShower: <NightHeavySnowShower {...props} />,
        thunderstorm: <NightThunderstorm {...props} />,
        thunderstormHail: <NightThunderstormHail {...props} />,
        thunderstormHeavyHail: <NightThunderstormHeavyHail {...props} />,
    };

    const registry = isDay ? dayIcons : nightIcons;

    return (
        <div className="weather-icon inline-flex items-center justify-center">
            {registry[iconKey]}
        </div>
    );
};

/** Helper: get human-readable description for a weather code */
WeatherIcon.getDescription = (code) => {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Freezing drizzle',
        57: 'Freezing drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Freezing rain',
        71: 'Light snowfall',
        73: 'Moderate snowfall',
        75: 'Heavy snowfall',
        77: 'Snow grains',
        80: 'Light rain showers',
        81: 'Moderate rain showers',
        82: 'Heavy rain showers',
        85: 'Light snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
};

/** All valid weather codes */
WeatherIcon.CODES = Object.keys(WEATHER_CODE_MAP).map(Number);

export default WeatherIcon;
