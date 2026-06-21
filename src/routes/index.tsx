import { component$, useSignal, useStore, useTask$, useVisibleTask$, isServer, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { fetchWeather, type WeatherData } from '../services/weather';
import { SearchBar } from '../components/search-bar/search-bar';
import { WeatherCard } from '../components/weather-card/weather-card';
import { HistoryList } from '../components/history-list/history-list';
import { LoadingSpinner } from '../components/loading-spinner/loading-spinner';

export default component$(() => {
  // useSignal: Almacena la ciudad que se está consultando actualmente.
  // Iniciamos con "San José" como valor predeterminado (Capital de Costa Rica/UCR).
  const activeCity = useSignal('San José');

  // useStore: Almacena un objeto con múltiples propiedades de estado.
  // Ideal para agrupar estados relacionados como datos del clima, carga y error.
  const weatherStore = useStore({
    data: null as WeatherData | null,
    loading: true,
    error: null as string | null,
  });

  // useStore: Almacena el historial de las últimas 5 ciudades.
  const historyStore = useStore({
    cities: [] as string[],
  });

  /**
   * useTask$: Corre en el servidor durante SSR y en el cliente cuando cambian
   * las señales que rastrea (en este caso, 'activeCity.value').
   * Qwik rastrea automáticamente las señales leídas dentro de 'track()'.
   */
  useTask$(({ track }) => {
    const city = track(() => activeCity.value);
    if (!city) return;

    weatherStore.loading = true;
    weatherStore.error = null;

    // Realizar la petición asíncrona
    const promise = fetchWeather(city)
      .then((data) => {
        weatherStore.data = data;

        // Actualizar el historial reactivamente
        const cleanName = data.name.trim();
        const currentList = historyStore.cities;

        // Filtrar la ciudad si ya existe y ponerla al inicio (máx 5 ciudades)
        historyStore.cities = [
          cleanName,
          ...currentList.filter((c) => c.toLowerCase() !== cleanName.toLowerCase()),
        ].slice(0, 5);
      })
      .catch((err: any) => {
        // Manejo amigable de errores
        weatherStore.error = err.message || 'Error inesperado al obtener los datos del clima.';
        weatherStore.data = null;
      })
      .finally(() => {
        weatherStore.loading = false;
      });

    // Si estamos en el servidor (SSR), retornamos la promesa para que Qwik espere
    // a resolverla antes de enviar el HTML final (cargando el clima inicial).
    // Si estamos en el cliente, retornamos void para que no bloquee el renderizado
    // y muestre el Spinner inmediatamente.
    if (isServer) {
      return promise;
    }
  });

  /**
   * useVisibleTask$: Se ejecuta ÚNICAMENTE en el navegador del cliente cuando
   * el componente es visible (se monta en el DOM).
   * Es el lugar perfecto para interactuar con APIs del navegador como 'localStorage'.
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const saved = localStorage.getItem('weather_history');
    if (saved) {
      try {
        historyStore.cities = JSON.parse(saved);
      } catch (e) {
        console.error('Error cargando el historial desde localStorage:', e);
      }
    }
  });

  /**
   * useTask$: Registra cambios en 'historyStore.cities' y actualiza localStorage.
   * Evitamos ejecutarlo en el servidor usando 'isServer'.
   */
  useTask$(({ track }) => {
    const cities = track(() => historyStore.cities);
    if (isServer) return; // Evitar acceder a localStorage en el servidor durante SSR
    localStorage.setItem('weather_history', JSON.stringify(cities));
  });

  // Manejador para realizar una búsqueda desde el componente SearchBar o HistoryList
  const handleSearch = $((city: string) => {
    activeCity.value = city;
  });

  // Función para determinar la clase CSS de fondo dinámico según el clima
  const getThemeClass = () => {
    if (weatherStore.loading) return 'theme-loading';
    if (weatherStore.error || !weatherStore.data) return 'theme-default';

    // Obtener las primeras 2 letras del código del icono de OpenWeather (ej: "01d" -> "01")
    const iconPrefix = weatherStore.data.icon.substring(0, 2);
    switch (iconPrefix) {
      case '01': // Cielo despejado
        return 'theme-clear';
      case '02': // Nubes dispersas
      case '03': // Nubes rotas
      case '04': // Mayormente nublado
        return 'theme-clouds';
      case '09': // Lluvia intensa
      case '10': // Lluvia ligera/moderada
        return 'theme-rain';
      case '11': // Tormenta eléctrica
        return 'theme-storm';
      case '13': // Nieve
        return 'theme-snow';
      case '50': // Niebla o neblina
        return 'theme-mist';
      default:
        return 'theme-default';
    }
  };

  return (
    <div class={`app-wrapper ${getThemeClass()}`}>
      <main class="main-container">
        {/* Cabecera Principal */}
        <header class="app-header">
          <div class="header-logo-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="header-logo-icon"
            >
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3"></circle>
            </svg>
            <h1 class="app-title">Clima</h1>
          </div>
          <p class="app-subtitle">Consulta el estado del clima en tiempo real</p>
        </header>

        {/* Buscador de Ciudad */}
        <SearchBar onSearch$={handleSearch} />

        {/* Historial de Ciudades */}
        <HistoryList cities={historyStore.cities} onSelectCity$={handleSearch} />

        {/* Contenido Dinámico: Carga, Clima o Mensaje de Error */}
        <section class="content-section" aria-live="polite">
          {weatherStore.loading ? (
            <LoadingSpinner />
          ) : weatherStore.error ? (
            <div class="error-card">
              <div class="error-icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="error-details">
                <h4 class="error-title">No pudimos obtener el clima</h4>
                <p class="error-message">{weatherStore.error}</p>
                <button
                  type="button"
                  onClick$={() => {
                    // Reintentar la búsqueda actual
                    const temp = activeCity.value;
                    activeCity.value = '';
                    activeCity.value = temp;
                  }}
                  class="retry-button"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : weatherStore.data ? (
            <WeatherCard data={weatherStore.data} />
          ) : null}
        </section>
      </main>

      <footer class="app-footer-info">
        <p>Proyecto Universitario - Universidad de Costa Rica</p>
        <p class="footer-subtext">Desarrollado con Qwik City & OpenWeatherMap API</p>
      </footer>
    </div>
  );
});

// DocumentHead para optimización SEO básica en Qwik City
export const head: DocumentHead = {
  title: "Clima - Consulta el Clima en Tiempo Real",
  meta: [
    {
      name: "description",
      content: "Aplicación del clima moderna y ultra rápida construida con Qwik, Qwik City y OpenWeatherMap API. Consulta la temperatura, humedad y viento.",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=device-width, initial-scale=1.0",
    },
  ],
};
