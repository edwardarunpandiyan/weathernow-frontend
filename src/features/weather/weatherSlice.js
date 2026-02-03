// Weather Redux Slice

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWeather, getCitySuggestions } from "../../services/weatherApi";
import {
  getRecentCity,
  setRecentCity,
  getFavorites,
  addFavorite as addFav,
  removeFavorite as removeFav,
} from "../../utils/storage";
import { DEFAULT_CITY } from "../../config/appConfig";

const initialState = {
  weather: null,
  selectedCity: null,
  favorites: getFavorites(),
  suggestions: [],
  isLoading: true,
  isSuggestionsLoading: false,
  error: null,
  selectedDayIndex: 0,
  selectedHourIndex: -1, // -1 means use current hour
};

// Async thunk: Fetch weather data
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { rejectWithValue }) => {
    try {
      const data = await getWeather(city.latitude, city.longitude);
      setRecentCity(city);
      return { weather: data, city };
    } catch (error) {
      return rejectWithValue("Failed to fetch weather data");
    }
  }
);

// Async thunk: Fetch city suggestions
export const fetchCitySuggestions = createAsyncThunk(
  "weather/fetchCitySuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const cities = await getCitySuggestions(query);
      return cities;
    } catch (error) {
      return rejectWithValue("Failed to fetch city suggestions");
    }
  }
);

// Async thunk: Initialize app
export const initializeApp = createAsyncThunk(
  "weather/initializeApp",
  async (_, { dispatch }) => {
    let cityToLoad = getRecentCity();

    if (!cityToLoad) {
      const favorites = getFavorites();
      if (favorites.length > 0) {
        cityToLoad = favorites[0];
      }
    }

    if (!cityToLoad) {
      cityToLoad = DEFAULT_CITY;
    }

    await dispatch(fetchWeather(cityToLoad));
    return cityToLoad;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setSelectedDayIndex(state, action) {
      state.selectedDayIndex = action.payload;
      state.selectedHourIndex = -1;
    },
    setSelectedHourIndex(state, action) {
      state.selectedHourIndex = action.payload;
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
    addFavorite(state, action) {
      state.favorites = addFav(action.payload);
    },
    removeFavorite(state, action) {
      state.favorites = removeFav(action.payload);
    },
    updateCurrentHour(state) {
      if (state.weather) {
        const now = new Date();
        const currentHour = now.getHours();

        state.weather.hourly = state.weather.hourly.map((hour, index) => ({
          ...hour,
          isNow: index < 24 && hour.hour === currentHour,
        }));

        state.weather.locationNow = now.toISOString();
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch weather
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weather = action.payload.weather;
        state.selectedCity = action.payload.city;
        state.selectedDayIndex = 0;
        state.selectedHourIndex = -1;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch suggestions
      .addCase(fetchCitySuggestions.pending, (state) => {
        state.isSuggestionsLoading = true;
      })
      .addCase(fetchCitySuggestions.fulfilled, (state, action) => {
        state.isSuggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchCitySuggestions.rejected, (state) => {
        state.isSuggestionsLoading = false;
        state.suggestions = [];
      })

      // Initialize app
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeApp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to initialize app";
      });
  },
});

export const {
  setSelectedDayIndex,
  setSelectedHourIndex,
  clearSuggestions,
  addFavorite,
  removeFavorite,
  updateCurrentHour,
  clearError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
