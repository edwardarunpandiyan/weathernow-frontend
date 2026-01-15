import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getWeatherIcon } from "../../utils/weatherIcons";
import "../../styles/weather/ForecastTabs.css";

export default function ForecastTabs() {
  const { weather } = useSelector(state => state.weather);
  if (!weather) return null;

  const [selectedDate, setSelectedDate] = useState(
    weather.daily[0].date
  );

  const hourlyForSelectedDay = useMemo(() => {
    return weather.hourly.filter(hour =>
      hour.date.startsWith(selectedDate)
    );
  }, [weather.hourly, selectedDate]);

  return (
    <section className="forecast">
      {/* DAILY FORECAST */}
      <div className="daily-cards">
        {weather.daily.map(day => {
          const active = selectedDate === day.date;

          return (
            <button
              key={day.date}
              className={`day-card ${active ? "active" : ""}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <div className="icon">
                {getWeatherIcon(day.condition)}
              </div>
              <p className="day">{formatDay(day.date)}</p>
              <p className="condition">{day.condition}</p>
              <p className="temp">
                {Math.round(day.max_temperature)}°
                <span className="min">
                  /{Math.round(day.min_temperature)}°
                </span>
              </p>
            </button>
          );
        })}
      </div>

      {/* HOURLY FORECAST */}
      <div className="hourly">
        <h3>Hourly Forecast</h3>
        <div className="hourly-scroll">
          {hourlyForSelectedDay.map(hour => (
            <div key={hour.date} className="hour-card">
              <p className="hour">{formatHour(hour.date)}</p>
              <div className="icon">
                {getWeatherIcon(hour.condition)}
              </div>
              <p className="hour-temp">
                {Math.round(hour.temperature)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDay(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short"
  });
}

function formatHour(dateTime) {
  return new Date(dateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
