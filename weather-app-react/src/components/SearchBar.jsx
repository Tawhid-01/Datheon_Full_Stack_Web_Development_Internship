import { MapPin, Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit, loading }) {
  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <MapPin size={18} aria-hidden="true" />
      <input
        aria-label="City name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search a city..."
      />
      <button type="submit" aria-label="Search weather" disabled={loading || !value.trim()}>
        {loading ? <span className="spinner" /> : <Search size={18} />}
      </button>
    </form>
  );
}