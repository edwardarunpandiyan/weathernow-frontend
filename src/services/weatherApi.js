import apiClient from "./apiClient";

export async function getCitySuggestions(query, signal) {
  if (!query) return [];
  try {
    const res = await apiClient.get("/city", {
      params: { name: query },
      signal,
    });

    return res.data?.data ?? [];
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
}


export async function getWeather(latitude, longitude, signal) {
  try {
    const res = await apiClient.get("/weather", {
      params: { latitude, longitude },
      signal,
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data');
  }
}

