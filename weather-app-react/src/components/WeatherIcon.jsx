import {
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow,
  Moon, Sun, SunDim, Wind
} from 'lucide-react';

export default function WeatherIcon({ condition = 'Clear', size = 42, className = '' }) {
  const value = condition.toLowerCase();
  const props = { size, strokeWidth: 1.5, className };
  if (value.includes('thunder')) return <CloudLightning {...props} />;
  if (value.includes('drizzle')) return <CloudDrizzle {...props} />;
  if (value.includes('rain')) return <CloudRain {...props} />;
  if (value.includes('snow')) return <CloudSnow {...props} />;
  if (value.includes('mist') || value.includes('fog') || value.includes('haze')) return <CloudFog {...props} />;
  if (value.includes('cloud')) return <Cloud {...props} />;
  if (value.includes('wind')) return <Wind {...props} />;
  if (value.includes('night')) return <Moon {...props} />;
  if (value.includes('clear')) return <Sun {...props} />;
  return <SunDim {...props} />;
}