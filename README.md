# WeatherNow Frontend

WeatherNow Frontend is a React-based web application that provides
real-time weather information with an intelligent city autocomplete
experience.

The application focuses on clean UX, debounced API calls, and clear
separation from backend logic. All third-party API complexity is handled
server-side.

---

## 🚀 Features

- City search with debounced autocomplete
- Dynamic weather display after city selection
- Loading and error states for better UX
- Clean and minimal UI
- Backend-driven data rendering

---

## 🛠 Tech Stack

- React
- JavaScript (ES6+)
- Fetch API
- CSS (basic styling)

---

## 📂 Project Structure

    src/
    ├── components/
    │   └── Weather.jsx
    ├── services/
    │   └── weatherApi.js
    ├── App.js
    └── index.js

---

## ▶️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Backend server running locally

### Installation

    npm install
    npm start

The app will run on:

    http://localhost:3000

---

## 📌 Notes

- City suggestions and weather data are fetched from the backend only
- No third-party weather APIs are called directly from the frontend
- Designed to mimic real-world frontend--backend separation

---

## 📄 License

MIT
