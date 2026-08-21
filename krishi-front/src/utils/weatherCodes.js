// =========================================================
// WMO WEATHER CODES → ICON + LABEL
// Used by Open-Meteo's `weathercode` field
// https://open-meteo.com/en/docs
// =========================================================

const WEATHER_CODES = {
  0: { icon: "☀️", label: "Clear sky" },
  1: { icon: "🌤️", label: "Mostly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Overcast" },

  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Rime fog" },

  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌦️", label: "Dense drizzle" },
  56: { icon: "🌦️", label: "Freezing drizzle" },
  57: { icon: "🌦️", label: "Freezing drizzle" },

  61: { icon: "🌧️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  66: { icon: "🌧️", label: "Freezing rain" },
  67: { icon: "🌧️", label: "Freezing rain" },

  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "🌨️", label: "Snow" },
  75: { icon: "🌨️", label: "Heavy snow" },
  77: { icon: "🌨️", label: "Snow grains" },

  80: { icon: "🌦️", label: "Light showers" },
  81: { icon: "🌧️", label: "Showers" },
  82: { icon: "🌧️", label: "Violent showers" },

  85: { icon: "🌨️", label: "Snow showers" },
  86: { icon: "🌨️", label: "Heavy snow showers" },

  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm + hail" },
  99: { icon: "⛈️", label: "Severe thunderstorm" },
};


export function getWeatherInfo(code) {

  return WEATHER_CODES[code] || { icon: "🌡️", label: "Weather" };
}


export function formatDayLabel(dateStr, index) {

  if (index === 0) {
    return "Today";
  }

  const date = new Date(`${dateStr}T00:00:00`);

  return date.toLocaleDateString("en-US", { weekday: "short" });
}


export function formatFullDate(dateStr) {

  const date = new Date(`${dateStr}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}