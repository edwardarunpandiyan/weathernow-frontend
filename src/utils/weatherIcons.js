const WEATHER_ICONS = {
    "Clear sky": "☀️",
    "Mainly clear": "🌤️",
    "Partly cloudy": "⛅",
    "Overcast": "☁️",
    "Fog": "🌫️",
    "Rain": "🌧️",
    "Rain showers": "🌦️",
    "Snow fall": "❄️"
};

export function getWeatherIcon(condition) {
    return WEATHER_ICONS[condition] || "🌡️";
}
