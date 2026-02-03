// Local Storage Utilities

import { APP_CONFIG } from "../config/appConfig";

// Get recent city from localStorage
export const getRecentCity = () => {
    try {
        const stored = localStorage.getItem(APP_CONFIG.storageKeys.recentCity);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error reading recent city:", error);
    }
    return null;
};

// Save recent city to localStorage
export const setRecentCity = (city) => {
    try {
        localStorage.setItem(
            APP_CONFIG.storageKeys.recentCity,
            JSON.stringify(city)
        );
    } catch (error) {
        console.error("Error saving recent city:", error);
    }
};

// Get favorites from localStorage
export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(APP_CONFIG.storageKeys.favorites);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error reading favorites:", error);
    }
    return [];
};

// Save favorites to localStorage
export const setFavorites = (cities) => {
    try {
        localStorage.setItem(
            APP_CONFIG.storageKeys.favorites,
            JSON.stringify(cities)
        );
    } catch (error) {
        console.error("Error saving favorites:", error);
    }
};

// Add city to favorites
export const addFavorite = (city) => {
    const favorites = getFavorites();
    const exists = favorites.some((fav) => fav.id === city.id);

    if (!exists) {
        const updated = [...favorites, city];
        setFavorites(updated);
        return updated;
    }

    return favorites;
};

// Remove city from favorites
export const removeFavorite = (cityId) => {
    const favorites = getFavorites();
    const updated = favorites.filter((fav) => fav.id !== cityId);
    setFavorites(updated);
    return updated;
};

// Check if city is favorite
export const isFavorite = (cityId) => {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.id === cityId);
};
