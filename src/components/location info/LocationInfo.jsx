import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import {
    addFavorite,
    removeFavorite,
} from "../../features/weather/weatherSlice";
import { isFavorite } from '../../utils/storage';

import '../../styles/location info/LocationInfo.css';

/**
 * LocationInfo Component
 * Displays current location info with city, state, country and favorite button.
 * Persists favorites to localStorage.
 */
function LocationInfo() {

    const dispatch = useAppDispatch();
    const {
        isLoading,
        selectedCity,
        favorites,
    } = useAppSelector((state) => state.weather);

    if (!selectedCity) return null

    // Toggle favorite status
    const toggleFavorite = (e) => {
        e.stopPropagation();

        if (isFavorite(selectedCity?.id)) {
            dispatch(removeFavorite(selectedCity.id));
        } else {
            dispatch(addFavorite(selectedCity));
        }
    };

    const isCurrentFavorite = isFavorite(selectedCity?.id);

    return (
        <section className="location-card" aria-label="Current location">
            <div className="location-card__content">
                <div className="location-card__info">
                    {/* City Name Row with Favorite Button */}
                    <div className="location-card__city-row">
                        <h2 className="location-card__city" title={selectedCity?.name}>
                            {selectedCity?.name}
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
                    <p className="location-card__region" title={`${selectedCity?.state}${selectedCity?.state && selectedCity?.country ? ', ' : ''}${selectedCity?.country}`}>
                        {selectedCity?.state && <span className="location-card__state">{selectedCity.state}</span>}
                        {selectedCity?.state && selectedCity?.country && <span className="location-card__separator">, </span>}
                        {selectedCity?.country && <span className="location-card__country">{selectedCity.country}</span>}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default LocationInfo;
