# Atmos — React Weather App

A responsive React + Vite weather dashboard using OpenWeatherMap. Includes city search, current conditions, a dynamic weather/time background, and five-day forecast cards.

## Run locally

1. Install Node.js (LTS).
2. In the project folder, install dependencies:
   ```bash
   npm install
   ```
3. Create a file named `.env` in the project root. Copy the contents of `.env.example` into it and replace the placeholder with your OpenWeatherMap API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_real_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL Vite prints in your terminal.

Get a free API key at https://home.openweathermap.org/users/sign_up. New keys can take a little while to activate.

## Notes

- Uses the OpenWeatherMap Current Weather and 5 day / 3 hour Forecast endpoints.
- The five-day cards summarize forecast entries by local calendar day (daily min/max temperatures and a representative condition).
- Keep `.env` private and do not commit it to a public repository. Vite exposes `VITE_` variables to browser code, so this approach is suitable for a learning/demo app, not a secret-bearing production integration.
- Search errors (invalid city, network issue, missing API key) are shown in the UI.
