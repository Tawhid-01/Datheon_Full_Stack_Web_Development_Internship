import { Droplets, Eye, Gauge, Wind } from 'lucide-react';

const details = [
  { key: 'humidity', label: 'Humidity', icon: Droplets, get: (data) => `${data.main.humidity}%` },
  { key: 'wind', label: 'Wind speed', icon: Wind, get: (data) => `${Math.round(data.wind.speed * 3.6)} km/h` },
  { key: 'visibility', label: 'Visibility', icon: Eye, get: (data) => `${(data.visibility / 1000).toFixed(1)} km` },
  { key: 'pressure', label: 'Pressure', icon: Gauge, get: (data) => `${data.main.pressure} hPa` },
];

export default function WeatherDetails({ weather }) {
  return (
    <section className="details-grid" aria-label="Weather details">
      {details.map(({ key, label, icon: Icon, get }) => (
        <div className="detail-card" key={key}>
          <div className="detail-top"><Icon size={17} /><span>{label}</span></div>
          <strong>{get(weather)}</strong>
        </div>
      ))}
    </section>
  );
}