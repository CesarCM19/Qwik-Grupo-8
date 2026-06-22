// component$: Función base para crear componentes con carga diferida (lazy load) en Qwik
import { component$ } from '@builder.io/qwik';

// type WeatherData: Interfaz TypeScript que define la estructura de datos del clima para evitar errores
import type { WeatherData } from '../../services/weather';

interface WeatherCardProps {
  data: WeatherData;
}

/**
 * component$: Declaración principal de un componente en Qwik.
 * El uso de '$' indica al framework que este componente (WeatherCard) puede ser
 * serializado y empaquetado de forma independiente para cargarse solo cuando sea renderizado.
 */
export const WeatherCard = component$<WeatherCardProps>(({ data }) => {
  // Obtener la URL del icono en alta resolución (las de OpenWeatherMap @4x son grandes y nítidas)
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

  return (
    // Contenedor principal de la tarjeta de clima
    <div class="weather-card">
      <div class="card-header">
        {/* data.name: Imprime reactivamente el nombre de la ciudad */}
        <h2 class="city-name">{data.name}</h2>
        <span class="country-badge">Clima Actual</span>
      </div>

      <div class="card-body">
        {/* Sección principal de temperatura e icono */}
        <div class="main-info">
          <div class="temp-container">
            {/* data.temp: Imprime la temperatura */}
            <span class="temperature">{data.temp}</span>
            <span class="temp-unit">°C</span>
          </div>
          <div class="weather-icon-wrapper">
            {/* img: Muestra el icono descargado de OpenWeather */}
            <img
              src={iconUrl}
              alt={data.description}
              width={120}
              height={120}
              class="weather-icon"
              loading="eager"
            />
          </div>
        </div>

        {/* Descripción general del clima */}
        <p class="weather-description">{data.description}</p>
      </div>

      {/* Detalles adicionales: Humedad y Viento */}
      <div class="card-footer">
        <div class="detail-item">
          <div class="detail-icon-wrapper humidity-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="detail-icon"
            >
              <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>
            </svg>
          </div>
          <div class="detail-text">
            <span class="detail-label">Humedad</span>
            <span class="detail-value">{data.humidity}%</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon-wrapper wind-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="detail-icon"
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
            </svg>
          </div>
          <div class="detail-text">
            <span class="detail-label">Viento</span>
            <span class="detail-value">{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
});
