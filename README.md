# 🌤 WeatherNow Frontend

**WeatherNow** is a production-style React application that delivers
real-time weather information with a clean, responsive, and scalable
architecture.

The application is built with a feature-driven structure, clear
separation of concerns, reusable components, and environment-based
configuration --- closely mimicking real-world product architecture
standards.

------------------------------------------------------------------------

## 🚀 Key Features

-   🔎 Intelligent city search with debounced API calls\
-   🌍 Real-time weather data rendering\
-   🕒 Hourly weather alignment based on time changes\
-   ⭐ Recent city persistence (local storage support)\
-   🎯 Default city configuration for first-time users\
-   ⏳ Skeleton loaders for better perceived performance\
-   ⚠️ Proper loading & error handling states\
-   📱 Fully responsive (Mobile / Tablet / Desktop)\
-   🧩 Modular and scalable architecture

------------------------------------------------------------------------

## 🏗 Architecture Philosophy

This project follows a **feature-based scalable structure** with
separation of concerns:

-   UI Components are reusable and presentation-focused\
-   Feature modules contain domain-specific logic\
-   Services layer handles API communication\
-   Config layer manages environment and default settings\
-   Hooks & utils provide reusable business logic

The frontend does **not directly call third-party weather APIs**.\
All external API complexity is abstracted through the backend service.

------------------------------------------------------------------------

## 🛠 Tech Stack

-   React (Functional Components + Hooks)
-   JavaScript (ES6+)
-   Fetch API
-   CSS (Modular styling structure)
-   Environment-based configuration

------------------------------------------------------------------------

## 📂 Updated Project Structure

    src/
    │
    ├── app/                    # App-level setup & layout structure
    │
    ├── assets/                 # Static assets (icons, images, logos)
    │
    ├── components/             # Reusable UI components
    │
    ├── config/                 # Environment configs & default city setup
    │
    ├── features/
    │   └── weather/
    │       ├── weatherSlice.js # Redux slice (state, reducers, async thunks)
    │
    ├── hooks/                  # Custom reusable React hooks
    │
    ├── pages/                  # Page-level components (screen containers)
    │
    ├── services/               # API service layer (backend communication)
    │
    ├── styles/                 # Global and modular styling
    │
    ├── utils/                  # Utility/helper functions
    │
    ├── index.css               # Global base styles
    └── main.jsx                # Application entry point

------------------------------------------------------------------------

## ⚙️ Configuration Strategy

### Default City Logic

-   On first launch → app loads weather using default city from `config`
-   On subsequent visits → loads most recently searched city from local
    storage
-   Recent city updates automatically on every successful search

### Environment Handling

Environment variables are managed through `.env` configuration files.

Example:

    VITE_API_BASE_URL=http://localhost:5000

------------------------------------------------------------------------

## ▶️ Getting Started

### Prerequisites

-   Node.js (v16+ recommended)
-   Backend server running

### Installation

    npm install

### Run Development Server

    npm run dev

Application will run at:

    http://localhost:5173

------------------------------------------------------------------------

## 📈 Production-Ready Considerations

-   Clean separation between UI and business logic\
-   Feature-based scalable structure\
-   No direct third-party API exposure in frontend\
-   Environment-driven configuration\
-   Persistent user preferences\
-   Structured service layer for easy backend migration

------------------------------------------------------------------------

## 📄 License

MIT
