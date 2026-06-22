// component$: Crea componentes perezosos (lazy).
// useSignal: Maneja el estado local simple (como el texto del input).
// type PropFunction: Tipado especial para funciones pasadas como props, permite serialización.
// $: Crea un QRL (Qwik Resource Locator) para extraer el código de eventos y cargarlos asíncronamente.
import { component$, useSignal, type PropFunction, $ } from '@builder.io/qwik';

interface SearchBarProps {
  /**
   * PropFunction: En Qwik, las funciones que se pasan como props deben ser de tipo PropFunction.
   * Esto permite la serialización y la carga diferida (lazy loading) de la función que maneja el evento.
   */
  onSearch$: PropFunction<(city: string) => void>;
}

export const SearchBar = component$<SearchBarProps>(({ onSearch$ }) => {
  // useSignal: Crea un contenedor mutable y reactivo para un solo valor.
  // Es el hook ideal para almacenar el valor local de inputs o booleanos simples.
  const query = useSignal('');

  // Manejo del envío del formulario
  // $(...) define un QRL (Qwik Resource Locator) para que la función sea serializable y lazy-loaded.
  const handleSubmit = $(() => {
    const trimmed = query.value.trim();
    if (trimmed) {
      onSearch$(trimmed);
      query.value = ''; // Limpiar el campo de texto tras buscar
    }
  });

  return (
    // Contenedor principal de la barra de búsqueda
    <div class="search-bar-container">
      {/* 
        onKeyDown$ y onSubmit$ terminan con '$' porque son manejadores de eventos asíncronos en Qwik. 
        Qwik no descarga el código del manejador hasta que ocurre la interacción.
      */}
      <form
        preventdefault:submit
        onSubmit$={handleSubmit}
        class="search-form"
      >
        <div class="search-input-wrapper">
          {/* input: Campo de texto vinculado reactivamente al estado 'query' */}
          <input
            type="text"
            placeholder="Buscar ciudad (ej. Madrid, Tokyo, San José)..."
            value={query.value}
            // onInput$: Actualiza el estado 'query' en tiempo real cada vez que se teclea
            onInput$={(e) => {
              query.value = (e.target as HTMLInputElement).value;
            }}
            class="search-input"
            id="city-search-input"
            required
            autoComplete="off"
          />
          {/* button: Al hacer clic, dispara el evento onSubmit$ del formulario padre */}
          <button type="submit" class="search-button" aria-label="Buscar clima">
            {/* Icono de Lupa moderno en SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  );
});
