import WeatherIcon from './WeatherIcon.jsx';

export default function ForecastCard({ day, index }) {
  const label = index === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' });
  return (
    <article className="forecast-card">
      <p className="forecast-day">{label}</p>
      <WeatherIcon condition={day.condition} size={34} className="forecast-icon" />
      <p className="forecast-condition">{day.condition}</p>
      <div className="forecast-temps">
        <strong>{day.max}°</strong>
        <span>{day.min}°</span>
      </div>
    </article>
  );
}