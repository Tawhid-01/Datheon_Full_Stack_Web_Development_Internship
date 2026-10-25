import { useCallback, useEffect, useState } from 'react';
import { CloudSun, RefreshCw, Sunrise, Sunset } from 'lucide-react';
import SearchBar from './components/SearchBar.jsx';
import WeatherIcon from './components/WeatherIcon.jsx';
import ForecastCard from './components/ForecastCard.jsx';
import WeatherDetails from './components/WeatherDetails.jsx';
import { buildFiveDayForecast, fetchWeather, getWeatherTheme } from './utils/weather.js';

const INITIAL_CITY = 'Dhaka';

function formatClock(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
}

export default function App() {
  const [cityInput, setCityInput] = useState(INITIAL_CITY);
  const [weatherBundle, setWeatherBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const searchCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeather(city.trim());
      setWeatherBundle(data);
      setCityInput(data.current.name);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Something went wrong while loading weather.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchCity(INITIAL_CITY);
  }, [searchCity]);

  const weather = weatherBundle?.current;
  const forecast = weatherBundle ? buildFiveDayForecast(weatherBundle.forecast) : [];
  const theme = getWeatherTheme(weather);

  function handleSubmit(event) {
    event.preventDefault();
    searchCity(cityInput);
  }

  return (
    <main className={`app-shell theme-${theme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Atmos home">
          <span className="brand-mark"><CloudSun size={21} /></span>
          <span>atmosfear<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-indicator"><i /> Live weather</span>
          <SearchBar value={cityInput} onChange={setCityInput} onSubmit={handleSubmit} loading={loading} />
        </div>
      </header>

      <div className="content">
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => searchCity(cityInput)}><RefreshCw size={14} /> Try again</button>
          </div>
        )}

        {!weather && loading ? (
          <section className="loading-state"><span className="large-spinner" /><p>Reading the sky...</p></section>
        ) : weather ? (
          <>
            <section className="hero-weather">
              <div className="hero-copy">
                <p className="eyebrow">YOUR LOCAL WEATHER</p>
                <h1>{weather.name}<span className="location-comma">,</span> <span>{weather.sys.country}</span></h1>
                <p className="weather-description">{weather.weather[0].description}</p>
                <div className="temperature-line">
                  <span className="temperature">{Math.round(weather.main.temp)}°</span>
                  <div className="temp-extra">
                    <p>Feels like <strong>{Math.round(weather.main.feels_like)}°</strong></p>
                    <p>H: {Math.round(weather.main.temp_max)}° <span>/</span> L: {Math.round(weather.main.temp_min)}°</p>
                  </div>
                </div>
                <p className="weather-note">A little look at what the sky has in store.</p>
              </div>
              <div className="hero-art">
                <div className="sun-halo" />
                <WeatherIcon condition={weather.weather[0].main} size={116} className="hero-weather-icon" />
                <span className="art-orbit orbit-one" />
                <span className="art-orbit orbit-two" />
              </div>
              <div className="sun-times">
                <div><Sunrise size={18} /><span>Sunrise</span><strong>{formatClock(weather.sys.sunrise)}</strong></div>
                <div><Sunset size={18} /><span>Sunset</span><strong>{formatClock(weather.sys.sunset)}</strong></div>
              </div>
            </section>

            <WeatherDetails weather={weather} />

            <section className="forecast-section">
              <div className="section-heading">
                <div><p className="eyebrow">PLAN AHEAD</p><h2>5-day forecast</h2></div>
                {lastUpdated && <p className="updated">Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
              </div>
              <div className="forecast-grid">
                {forecast.map((day, index) => <ForecastCard key={day.date.toISOString()} day={day} index={index} />)}
              </div>
              <p className="forecast-footnote">Daily temperatures are summarized from the 3-hour forecast.</p>
            </section>
          </>
        ) : (
          <section className="empty-state">
            <div className="empty-icon"><CloudSun size={42} /></div>
            <h1>Find your forecast.</h1>
            <p>Search for a city to see its current weather and the next five days.</p>
          </section>
        )}
      </div>

      <footer className="footer">
        <span>ATMOS WEATHER</span>
        <span>Made for wherever the day takes you <span className="footer-star">✳</span></span>
      </footer>
    </main>
  );
}