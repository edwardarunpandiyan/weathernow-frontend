import apiClient from "./apiClient";

export async function getCitySuggestions(query, signal) {
  if (!query) return [];

  const res = await apiClient.get("/city", {
    params: { name: query },
    signal,
  });

  return res.data?.data ?? [];
}


export async function getWeather(latitude, longitude, signal) {
  const res = await apiClient.get("/weather", {
    params: { latitude, longitude },
    signal,
  });

  return res.data;
}

