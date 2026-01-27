import '../../styles/location info/LocationInfo.css';

/**
 * LocationInfo Component
 * Displays current location info with city, state, country and favorite button.
 * Persists favorites to localStorage.
 */
function LocationInfo({ location, onLocationChange }) {
    // Get favorites from localStorage on mount
    const getFavoritesFromStorage = () => {
        try {
            const stored = localStorage.getItem('weatherly_location_favorites');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };

    // Save favorites to localStorage
    const saveFavoritesToStorage = (favs) => {
        try {
            localStorage.setItem('weatherly_location_favorites', JSON.stringify(favs));
        } catch {
            // Storage not available
        }
    };

    // Check if current location is in favorites
    const isFavorite = () => {
        const favorites = getFavoritesFromStorage();
        return favorites.some(
            (fav) =>
                fav.city === location.city &&
                fav.state === location.state &&
                fav.country === location.country
        );
    };

    // Toggle favorite status
    const toggleFavorite = () => {
        const favorites = getFavoritesFromStorage();
        const existingIndex = favorites.findIndex(
            (fav) =>
                fav.city === location.city &&
                fav.state === location.state &&
                fav.country === location.country
        );

        let updatedFavorites;
        if (existingIndex >= 0) {
            // Remove from favorites
            updatedFavorites = favorites.filter((_, index) => index !== existingIndex);
        } else {
            // Add to favorites (prevent duplicates)
            updatedFavorites = [...favorites, { ...location, id: Date.now() }];
        }

        saveFavoritesToStorage(updatedFavorites);
        // Force re-render
        if (onLocationChange) {
            onLocationChange(location);
        }
    };

    const isCurrentFavorite = isFavorite();

    return (
        <section className="location-card" aria-label="Current location">
            <div className="location-card__content">
                <div className="location-card__info">
                    {/* City Name Row with Favorite Button */}
                    <div className="location-card__city-row">
                        <h2 className="location-card__city" title={location.city}>
                            {location.city}
                        </h2>
                        <button
                            type="button"
                            className={`location-card__fav-btn ${isCurrentFavorite ? 'location-card__fav-btn--active' : ''}`}
                            onClick={toggleFavorite}
                            aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-pressed={isCurrentFavorite}
                            title={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <svg
                                className="location-card__fav-icon"
                                viewBox="0 0 24 24"
                                fill={isCurrentFavorite ? 'currentColor' : 'none'}
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* State and Country */}
                    <p className="location-card__region" title={`${location.state}${location.state && location.country ? ', ' : ''}${location.country}`}>
                        {location.state && <span className="location-card__state">{location.state}</span>}
                        {location.state && location.country && <span className="location-card__separator">, </span>}
                        {location.country && <span className="location-card__country">{location.country}</span>}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default LocationInfo;
