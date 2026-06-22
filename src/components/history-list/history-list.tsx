// component$: Utilizado para declarar el componente visual de la lista.
// type PropFunction: Asegura que el evento onSelectCity$ sea serializable por Qwik.
import { component$, type PropFunction } from '@builder.io/qwik';

interface HistoryListProps {
  cities: string[];
  /**
   * onSelectCity$: Callback para notificar cuando se hace clic en una ciudad del historial.
   * Al ser de tipo PropFunction, Qwik puede serializar y retrasar la carga de este callback.
   */
  onSelectCity$: PropFunction<(city: string) => void>;
}

/**
 * component$: Función fundamental de Qwik.
 * El sufijo '$' indica que este componente se puede extraer y cargar de forma asíncrona
 * (lazy loading) solo cuando sea necesario, mejorando el rendimiento inicial.
 */
export const HistoryList = component$<HistoryListProps>(({ cities, onSelectCity$ }) => {
  // Si no hay historial de búsquedas, no mostramos nada
  if (cities.length === 0) {
    return null;
  }

  return (
    // Contenedor principal de la sección del historial
    <div class="history-container">
      {/* Cabecera con icono y título */}
      <div class="history-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="history-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <h3 class="history-title">Búsquedas Recientes</h3>
      </div>
      <div class="history-pills">
        {/* Recorre el arreglo de ciudades y genera un botón por cada una */}
        {cities.map((city) => (
          <button
            // key: Obligatorio al renderizar listas para que el framework optimice las actualizaciones
            key={city}
            type="button"
            // onClick$: Evento asíncrono en Qwik. El código del manejador no se descarga
            // hasta que el usuario hace clic, evitando enviar JavaScript innecesario.
            onClick$={() => onSelectCity$(city)}
            class="history-pill-button"
            aria-label={`Buscar clima para ${city}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
});
