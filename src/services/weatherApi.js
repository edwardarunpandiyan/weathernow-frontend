// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://fatless-jutta-noncontiguous.ngrok-free.dev';

export async function getCitySuggestions(query) {
  if (!query) return [];

  const res = await fetch(`${BASE_URL}/city?name=${query}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  if (!res.ok) return [];

  const json = await res.json();
  return json.data;
}

export async function getWeather(latitude, longitude) {
  const res = await fetch(
    `${BASE_URL}/weather?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
  if (!res.ok) {
    throw new Error('Weather fetch failed');
  }
  return res.json();
}
