import { useState, useRef, useEffect } from 'react';
import './Header.css';

/**
 * Sample cities data
 */
const SAMPLE_CITIES = [
  { id: 1, name: 'New York', country: 'USA' },
  { id: 2, name: 'London', country: 'UK' },
  { id: 3, name: 'Tokyo', country: 'Japan' },
  { id: 4, name: 'Paris', country: 'France' },
  { id: 5, name: 'Sydney', country: 'Australia' },
  { id: 6, name: 'Berlin', country: 'Germany' },
  { id: 7, name: 'Toronto', country: 'Canada' },
  { id: 8, name: 'Dubai', country: 'UAE' },
  { id: 9, name: 'Singapore', country: 'Singapore' },
  { id: 10, name: 'Los Angeles', country: 'USA' },
  { id: 11, name: 'Chicago', country: 'USA' },
  { id: 12, name: 'Mumbai', country: 'India' },
  { id: 13, name: 'Hong Kong', country: 'China' },
  { id: 14, name: 'Seoul', country: 'South Korea' },
  { id: 15, name: 'Barcelona', country: 'Spain' },
];

/**
 * Header Component
 * Responsive header with logo, app name, search bar, and favorite button.
 * Mobile-first design using Flexbox.
 */
function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const searchWrapperRef = useRef(null);
  const favoritesRef = useRef(null);
  const inputRef = useRef(null);

  // Filter cities based on search input
  const filteredCities = searchValue.trim()
    ? SAMPLE_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        city.country.toLowerCase().includes(searchValue.toLowerCase())
    )
    : SAMPLE_CITIES;

  // Check if a city is in favorites
  const isFavorite = (cityId) => favorites.some((fav) => fav.id === cityId);

  // Toggle favorite status
  const toggleFavorite = (city, e) => {
    e?.stopPropagation();
    if (isFavorite(city.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== city.id));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  // Select a city (from search or favorites)
  const selectCity = (city) => {
    setSearchValue(`${city.name}, ${city.country}`);
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setIsFavoritesOpen(false);
    setSelectedIndex(-1);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target)) {
        setIsFavoritesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isDropdownOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setIsDropdownOpen(true);
        setSelectedIndex(0);
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && filteredCities[selectedIndex]) {
          selectCity(filteredCities[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setIsDropdownOpen(true);
    setSelectedIndex(-1);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsDropdownOpen(true);
    setIsFavoritesOpen(false);
  };

  // Toggle favorites panel
  const toggleFavoritesPanel = () => {
    setIsFavoritesOpen(!isFavoritesOpen);
    setIsDropdownOpen(false);
  };

  return (
    <header className="header" role="banner">
      <div className="header__container">
        {/* Logo and App Name */}
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg
              className="header__logo-icon"
              viewBox="0 0 64 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Cloud logo"
            >
              {/* Cloud shape with gradient */}
              <defs>
                <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a8d4f5" />
                  <stop offset="50%" stopColor="#7ec8e3" />
                  <stop offset="100%" stopColor="#5cb3d9" />
                </linearGradient>
              </defs>
              <path
                d="M52 28c6.627 0 12-5.373 12-12S58.627 4 52 4c-1.5 0-2.938.275-4.262.777C44.895 2.014 40.685 0 36 0c-7.732 0-14 6.268-14 14 0 .342.012.68.036 1.016C18.158 15.28 15 18.614 15 22.75c0 4.004 3.004 7.308 6.882 7.75H52z"
                fill="url(#cloudGradient)"
              />
              {/* Bottom shadow/reflection */}
              <ellipse cx="34" cy="36" rx="22" ry="4" fill="#d0e8f5" opacity="0.5" />
            </svg>
          </div>
          <h1 className="header__app-name">Weatherly</h1>
        </div>

        {/* Search and Favorite */}
        <div className="header__actions">
          <div
            className="header__search-container"
            ref={searchWrapperRef}
          >
            <div className="header__search-wrapper">
              {/* Search Icon */}
              <svg
                className="header__search-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M16 16l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <label htmlFor="city-search" className="visually-hidden">
                Search for a city
              </label>
              <input
                ref={inputRef}
                id="city-search"
                type="text"
                className="header__search-input"
                placeholder="Search city..."
                value={searchValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                aria-label="Search for a city"
                aria-expanded={isDropdownOpen}
                aria-controls="city-suggestions-list"
                aria-activedescendant={
                  selectedIndex >= 0 ? `city-option-${filteredCities[selectedIndex]?.id}` : undefined
                }
                autoComplete="off"
              />
            </div>

            {/* Custom Dropdown */}
            {isDropdownOpen && filteredCities.length > 0 && (
              <ul
                id="city-suggestions-list"
                className="header__dropdown"
                role="listbox"
                aria-label="City suggestions"
              >
                {filteredCities.map((city, index) => (
                  <li
                    key={city.id}
                    id={`city-option-${city.id}`}
                    className={`header__dropdown-item ${index === selectedIndex ? 'header__dropdown-item--selected' : ''
                      }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={() => selectCity(city)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <svg
                      className="header__dropdown-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <div className="header__dropdown-text">
                      <span className="header__dropdown-city">{city.name}</span>
                      <span className="header__dropdown-country">{city.country}</span>
                    </div>
                    {/* Add to favorites button */}
                    <button
                      type="button"
                      className={`header__dropdown-fav-btn ${isFavorite(city.id) ? 'header__dropdown-fav-btn--active' : ''}`}
                      onClick={(e) => toggleFavorite(city, e)}
                      aria-label={isFavorite(city.id) ? 'Remove from favorites' : 'Add to favorites'}
                      title={isFavorite(city.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={isFavorite(city.id) ? 'currentColor' : 'none'}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* No results message */}
            {isDropdownOpen && searchValue.trim() && filteredCities.length === 0 && (
              <div className="header__dropdown header__dropdown--empty">
                <p className="header__dropdown-no-results">No cities found</p>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <div className="header__favorites-container" ref={favoritesRef}>
            <button
              type="button"
              className={`header__favorite-btn ${isFavoritesOpen ? 'header__favorite-btn--active' : ''} ${favorites.length > 0 ? 'header__favorite-btn--has-items' : ''}`}
              aria-label="View favorite cities"
              aria-expanded={isFavoritesOpen}
              title="Favorites"
              onClick={toggleFavoritesPanel}
            >
              <svg
                className="header__favorite-icon"
                viewBox="0 0 24 24"
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {favorites.length > 0 && (
                <span className="header__favorite-badge">{favorites.length}</span>
              )}
            </button>

            {/* Favorites Panel */}
            {isFavoritesOpen && (
              <div className="header__favorites-panel" role="dialog" aria-label="Favorite cities">
                <div className="header__favorites-header">
                  <h2 className="header__favorites-title">
                    <svg
                      className="header__favorites-title-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Favorite Cities
                  </h2>
                </div>

                {favorites.length === 0 ? (
                  <div className="header__favorites-empty">
                    <svg
                      className="header__favorites-empty-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <p>No favorite cities yet</p>
                    <span>Search and add cities to your favorites</span>
                  </div>
                ) : (
                  <ul className="header__favorites-list">
                    {favorites.map((city) => (
                      <li
                        key={city.id}
                        className={`header__favorites-item ${selectedCity?.id === city.id ? 'header__favorites-item--active' : ''}`}
                      >
                        <button
                          type="button"
                          className="header__favorites-item-btn"
                          onClick={() => selectCity(city)}
                        >
                          <svg
                            className="header__favorites-item-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          <div className="header__favorites-item-text">
                            <span className="header__favorites-item-city">{city.name}</span>
                            <span className="header__favorites-item-country">{city.country}</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          className="header__favorites-remove-btn"
                          onClick={(e) => toggleFavorite(city, e)}
                          aria-label={`Remove ${city.name} from favorites`}
                          title="Remove from favorites"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
