const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchWeather(city) {
  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    throw new Error('Add your OpenWeatherMap API key to a .env file, then restart the dev server.');
  }

  const currentUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
  currentUrl.search = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: 'metric',
  });

  const forecastUrl = new URL('https://api.openweathermap.org/data/2.5/forecast');
  forecastUrl.search = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: 'metric',
  });

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    if (!currentResponse.ok) {
      throw new Error(currentData.message || 'Could not find that city.');
    }
    if (!forecastResponse.ok) {
      throw new Error(forecastData.message || 'Could not load the forecast.');
    }

    return { current: currentData, forecast: forecastData };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error. Check your internet connection and try again.');
    }
    throw error;
  }
}

export function buildFiveDayForecast(forecastData) {
  const byDay = new Map();

  forecastData.list.forEach((entry) => {
    const dayKey = entry.dt_txt.split(' ')[0];
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, {
        date: new Date(entry.dt * 1000),
        temps: [],
        entries: [],
      });
    }
    const day = byDay.get(dayKey);
    day.temps.push(entry.main.temp);
    day.entries.push(entry);
  });

  return [...byDay.values()].slice(0, 5).map((day) => {
    // Prefer a forecast around midday as the representative condition.
    const representative = day.entries.reduce((best, entry) => {
      const hour = new Date(entry.dt * 1000).getHours();
      const bestHour = new Date(best.dt * 1000).getHours();
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? entry : best;
    }, day.entries[0]);

    return {
      date: day.date,
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
      condition: representative.weather[0].main,
      description: representative.weather[0].description,
      icon: representative.weather[0].icon,
    };
  });
}

export function getWeatherTheme(weather, currentTime = Date.now()) {
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const isNight = weather?.sys?.sunrise && weather?.sys?.sunset
    ? currentTime / 1000 < weather.sys.sunrise || currentTime / 1000 > weather.sys.sunset
    : false;

  if (isNight) return 'night';
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder')) return 'rain';
  if (condition.includes('snow')) return 'snow';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('clear')) return 'sunny';
  return 'default';
}