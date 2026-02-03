// App Configuration

export const DEFAULT_CITY = {
    id: 2643743,
    name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    state: 'England',
    latitude: 51.50853,
    longitude: -0.12574,
};

export const APP_CONFIG = {
    appName: "WeatherApp",
    version: "1.0.0",
    apiDebounceMs: 300,
    hoursPerDay: 24,
    forecastDays: 7,
    storageKeys: {
        recentCity: "weather_recent_city",
        favorites: "weather_favorites",
    },
};
