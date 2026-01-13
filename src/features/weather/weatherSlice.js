
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

export const fetchWeather = createAsyncThunk(
  "weather/fetch",
  async ({ lat, lon }) => {
    const res = await apiClient.get(`/weather?latitude=${lat}&longitude=${lon}`);
    return res.data.data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: { city: null, weather: null, status: "idle" },
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWeather.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.status = "success";
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});


export const { setCity } = weatherSlice.actions;
export default weatherSlice.reducer;
