
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiClient";

export const fetchWeather = createAsyncThunk(
  "weather/fetch",
  async ({ lat, lon }) => {
    const res = await api.get(`/weather?latitude=${lat}&longitude=${lon}`);
    return res.data.data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: { data: null, status: "idle" },
  extraReducers: builder => {
    builder
      .addCase(fetchWeather.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      });
  }
});

export default weatherSlice.reducer;
