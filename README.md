# Aplicación del Clima en Qwik

Proyecto universitario desarrollado para la materia de Ingeniería de Software (Universidad de Costa Rica). **WeatherSky** es una aplicación del clima responsiva, moderna y ultra rápida construida con el framework reactivo **Qwik**, **Qwik City** y la API gratuita de **OpenWeatherMap**.

---

## Características del Proyecto

*   **Buscador Inteligente:** Permite consultar el clima de cualquier ciudad del mundo ingresando el nombre y presionando "Enter" o haciendo clic en "Buscar".
*   **Métricas del Clima en Tiempo Real:** Muestra la temperatura actual (°C), descripción detallada del clima en español, nivel de humedad (%) y velocidad del viento (km/h).
*   **Temas Dinámicos Visuales:** El gradiente del fondo de la aplicación cambia suavemente de color según el estado del tiempo de la ciudad consultada (despejado, lluvioso, nublado, nevado, tormentoso o con niebla).
*   **Diseño Premium (Glassmorphism):** Interfaz limpia, responsiva y translúcida construida desde cero con CSS puro, sin librerías de terceros.
*   **Historial de Búsquedas Persistente:** Muestra las últimas 5 ciudades buscadas como botones rápidos. El historial persiste en el navegador gracias a `localStorage`.
*   **Carga No Bloqueante (Spinner):** Muestra una animación de carga interactiva fluida mientras se realiza la consulta, evitando que la interfaz se congele.
*   **Control de Errores Amigable:** Si la ciudad no existe o hay problemas de red, se muestra una tarjeta explicativa con opción a reintentar.

---

## Tecnologías Utilizadas

*   [Qwik (v1.20.0)](https://qwik.dev/) - Framework de JavaScript optimizado para Resumabilidad y SSR.
*   [Qwik City](https://qwik.dev/docs/qwikcity/) - Router oficial y framework de meta-páginas para Qwik.
*   [Vite](https://vite.dev/) - Motor de construcción y servidor de desarrollo.
*   [TypeScript](https://www.typescriptlang.org/) - Tipado estático y robusto de datos.
*   [OpenWeatherMap API](https://openweathermap.org/) - Proveedor de datos climáticos mundiales.

---

## Instalación y Configuración Local

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
> **Importante:** El archivo `.env` está configurado en el `.gitignore` para que tu clave privada nunca se suba públicamente a GitHub.

### Paso 4: Iniciar el servidor de desarrollo
Corre el comando para iniciar el servidor de desarrollo local de Vite:
```bash
npm start
```
Abre en tu navegador la dirección: [http://localhost:5173/](http://localhost:5173/)

---

## Manual de Usuario

1.  **Carga Inicial:** Al ingresar al sitio, verás el clima pre-renderizado de la ciudad de **San José** (Costa Rica).
2.  **Buscar Clima:** Escribe el nombre de la ciudad que deseas consultar (ej: `Madrid`, `Tokyo`, `Cartago`) en la barra superior.
3.  **Ejecutar Consulta:** Presiona la tecla **Enter** o haz clic en el botón **Buscar**. Verás aparecer un spinner animado mientras se obtienen los datos.
4.  **Ver Métricas:** Una vez cargada, la tarjeta central mostrará la temperatura redondeada, un icono representativo en alta resolución y detalles de viento y humedad. El fondo general cambiará de tonalidad según el clima.
5.  **Búsqueda Rápida:** Las últimas 5 ciudades consultadas se guardarán en la sección "Búsquedas Recientes". Puedes hacer clic en cualquiera de ellas para recargar su clima al instante.
6.  **Borrar Historial:** Si deseas limpiar la lista, puedes borrar los datos de navegación o limpiar la caché de `localStorage` del navegador.

---