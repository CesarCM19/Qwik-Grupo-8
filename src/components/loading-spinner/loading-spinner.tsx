// component$: Usado para construir componentes puramente visuales en Qwik, permitiendo su separación y carga asíncrona si es necesario.
import { component$ } from '@builder.io/qwik';

/**
 * Componente LoadingSpinner.
 * Muestra un indicador visual de carga animado con CSS puro y un diseño de "vidrio esmerilado".
 * 
 * Explicación sobre component$:
 * - Qwik utiliza la función component$ para definir componentes. El símbolo '$' le dice al 
 *   compilador de Qwik que este componente puede dividirse y cargarse de forma perezosa (lazy load)
 *   en el navegador cuando sea estrictamente necesario.
 */
export const LoadingSpinner = component$(() => {
  return (
    // Capa de fondo semitransparente (overlay) que cubre la pantalla
    <div class="loader-container">
      <div class="spinner-card">
        {/* Anillos animados por CSS que giran */}
        <div class="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p class="loader-text">Buscando clima...</p>
      </div>
    </div>
  );
});
