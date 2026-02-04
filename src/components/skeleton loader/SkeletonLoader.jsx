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
function SkeletonLoader() {
    const {
        isLoading,
    } = useAppSelector((state) => state.weather);

    return (
        <div className="location-skeleton">
            <div className="skeleton shimmer city" />
            <div className="skeleton shimmer country" />

            <div className="meta">
                <div className="skeleton shimmer meta-item" />
                <div className="skeleton shimmer meta-item" />
            </div>
        </div>
    );
}

export default SkeletonLoader;
