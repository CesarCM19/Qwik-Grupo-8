# 🌤️ WeatherSky - Aplicación del Clima en Qwik

Proyecto universitario desarrollado para la materia de Ingeniería de Software (Universidad de Costa Rica). **WeatherSky** es una aplicación del clima responsiva, moderna y ultra rápida construida con el framework reactivo **Qwik**, **Qwik City** y la API gratuita de **OpenWeatherMap**.

---

## 🚀 Características del Proyecto

*   **Buscador Inteligente:** Permite consultar el clima de cualquier ciudad del mundo ingresando el nombre y presionando "Enter" o haciendo clic en "Buscar".
*   **Métricas del Clima en Tiempo Real:** Muestra la temperatura actual (°C), descripción detallada del clima en español, nivel de humedad (%) y velocidad del viento (km/h).
*   **Temas Dinámicos Visuales:** El gradiente del fondo de la aplicación cambia suavemente de color según el estado del tiempo de la ciudad consultada (despejado, lluvioso, nublado, nevado, tormentoso o con niebla).
*   **Diseño Premium (Glassmorphism):** Interfaz limpia, responsiva y translúcida construida desde cero con CSS puro, sin librerías de terceros.
*   **Historial de Búsquedas Persistente:** Muestra las últimas 5 ciudades buscadas como botones rápidos. El historial persiste en el navegador gracias a `localStorage`.
*   **Carga No Bloqueante (Spinner):** Muestra una animación de carga interactiva fluida mientras se realiza la consulta, evitando que la interfaz se congele.
*   **Control de Errores Amigable:** Si la ciudad no existe o hay problemas de red, se muestra una tarjeta explicativa con opción a reintentar.

---

## 🛠️ Tecnologías Utilizadas

*   [Qwik (v1.20.0)](https://qwik.dev/) - Framework de JavaScript optimizado para Resumabilidad y SSR.
*   [Qwik City](https://qwik.dev/docs/qwikcity/) - Router oficial y framework de meta-páginas para Qwik.
*   [Vite](https://vite.dev/) - Motor de construcción y servidor de desarrollo.
*   [TypeScript](https://www.typescriptlang.org/) - Tipado estático y robusto de datos.
*   [OpenWeatherMap API](https://openweathermap.org/) - Proveedor de datos climáticos mundiales.

---

## 💻 Instalación y Configuración Local

### Requisitos previos
*   Tener instalado [Node.js](https://nodejs.org/) (versión 18.17.0, 20.3.0 o superior).

### Paso 1: Clonar o descargar el repositorio
Navega a la carpeta del proyecto en tu terminal:
```bash
cd Qwik-Grupo-8
```

### Paso 2: Instalar dependencias
Instala los paquetes necesarios definidos en el `package.json`:
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crea un archivo llamado `.env` en la raíz del proyecto y añade tu API Key privada de OpenWeatherMap de la siguiente manera:
```env
OPENWEATHER_API_KEY=tu_api_key_real_aqui
```
> ⚠️ **Importante:** El archivo `.env` está configurado en el `.gitignore` para que tu clave privada nunca se suba públicamente a GitHub.

### Paso 4: Iniciar el servidor de desarrollo
Corre el comando para iniciar el servidor de desarrollo local de Vite:
```bash
npm start
```
Abre en tu navegador la dirección: [http://localhost:5173/](http://localhost:5173/)

---

## 📖 Manual de Usuario

1.  **Carga Inicial:** Al ingresar al sitio, verás el clima pre-renderizado de la ciudad de **San José** (Costa Rica).
2.  **Buscar Clima:** Escribe el nombre de la ciudad que deseas consultar (ej: `Madrid`, `Tokyo`, `Cartago`) en la barra superior.
3.  **Ejecutar Consulta:** Presiona la tecla **Enter** o haz clic en el botón **Buscar**. Verás aparecer un spinner animado mientras se obtienen los datos.
4.  **Ver Métricas:** Una vez cargada, la tarjeta central mostrará la temperatura redondeada, un icono representativo en alta resolución y detalles de viento y humedad. El fondo general cambiará de tonalidad según el clima.
5.  **Búsqueda Rápida:** Las últimas 5 ciudades consultadas se guardarán en la sección "Búsquedas Recientes". Puedes hacer clic en cualquiera de ellas para recargar su clima al instante.
6.  **Borrar Historial:** Si deseas limpiar la lista, puedes borrar los datos de navegación o limpiar la caché de `localStorage` del navegador.

---

## 🎓 Guía para la Defensa Técnica (Presentación Universitaria)

Si necesitas defender la arquitectura del proyecto frente a tus profesores de Ingeniería de Software, aquí tienes la explicación detallada de los hooks y características exclusivas de Qwik aplicadas:

### 1. `server$` (En `src/services/weather.ts`)
*   **Defensa:** Qwik provee la función `server$` para crear funciones RPC (Remote Procedure Call). Todo lo que se escriba dentro se ejecuta **exclusivamente en el servidor**.
*   **¿Para qué sirve aquí?:** Nos permite leer la variable `OPENWEATHER_API_KEY` mediante `this.env.get()` de manera segura en el backend de Vercel. De esta forma, el API Key nunca viaja al navegador del usuario, protegiendo las credenciales del proyecto de accesos maliciosos.

### 2. `useSignal` (En `index.tsx` y `search-bar.tsx`)
*   **Defensa:** Es el gancho reactivo base de Qwik para almacenar valores primitivos individuales (strings, numbers, booleans) y rastrear sus cambios de forma reactiva.
*   **¿Para qué sirve aquí?:** Almacena el valor de la ciudad activa (`activeCity`) y la entrada de texto del buscador (`query`).

### 3. `useStore` (En `index.tsx`)
*   **Defensa:** Similar a `useSignal`, pero optimizado para guardar estructuras y colecciones de objetos más complejos u objetos con múltiples propiedades anidadas.
*   **¿Para qué sirve aquí?:** Define el estado dinámico del clima (`weatherStore` con datos, loading y error) y del historial (`historyStore` con la lista de ciudades).

### 4. `useTask$` Híbrido (En `index.tsx`)
*   **Defensa:** Es un disparador reactivo que se ejecuta cuando cambian las dependencias rastreadas (en este caso, `activeCity.value`).
*   **¿Para qué sirve aquí?:**
    *   **En el servidor (SSR):** Si detecta que estamos en el servidor (`isServer === true`), retorna la promesa del fetch de clima para que el servidor de Qwik **espere** a cargar el clima antes de enviar el HTML final (cargando San José de inmediato al usuario).
    *   **En el cliente:** Retorna `void` para **no bloquear** la interfaz del navegador. Esto hace que el spinner de carga se dibuje al instante apenas el usuario escribe una nueva ciudad.

### 5. `useVisibleTask$` (En `index.tsx`)
*   **Defensa:** Qwik trabaja bajo el principio de "Resumabilidad", lo que significa que el JS en el cliente no se ejecuta al iniciar para mejorar la velocidad. Este hook es la excepción: le dice a Qwik que ejecute código obligatoriamente en el navegador tan pronto como el componente se monte en el DOM.
*   **¿Para qué sirve aquí?:** Lo usamos exclusivamente para interactuar con la API del navegador `localStorage` y recuperar el historial de búsquedas del usuario al cargar la web.

### 6. `preventdefault:submit` (En `search-bar.tsx`)
*   **Defensa:** Evita la recarga nativa de la página de forma síncrona mediante el Qwikloader (un script minúsculo de <1KB que corre antes de descargar el JS pesado).
*   **¿Para qué sirve aquí?:** Como Qwik carga el JS de forma diferida, un `event.preventDefault()` común de React en el submit de un formulario se ejecutaría demasiado tarde y la página se recargaría. `preventdefault:submit` lo intercepta al instante.
