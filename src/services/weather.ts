import { server$ } from '@builder.io/qwik-city';

// Definición estricta de la interfaz de datos climatológicos
export interface WeatherData {
  name: string;          // Nombre de la ciudad devuelto por la API
  temp: number;          // Temperatura en °C
  description: string;   // Descripción en español (ej. "cielo claro")
  humidity: number;      // Humedad en %
  windSpeed: number;     // Velocidad del viento en km/h
  icon: string;          // Código del icono del clima
}

/**
 * Función que realiza la petición a OpenWeatherMap de forma segura en el servidor.
 * Al usar server$(), el código interno NUNCA se enviará al cliente.
 * El API Key se lee de forma segura mediante 'this.env.get()'.
 */
export const fetchWeather = server$(async function (city: string): Promise<WeatherData> {
  // Acceso seguro a variables de entorno en el contexto de Qwik City
  const apiKey = this.env.get('OPENWEATHER_API_KEY');
  
  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    throw new Error(
      'La API Key de OpenWeatherMap no está configurada o sigue teniendo el valor por defecto. Por favor, edita tu archivo .env y proporciona una clave válida.'
    );
  }

  // Sanitizar el nombre de la ciudad
  const cleanCity = city.trim();
  if (!cleanCity) {
    throw new Error('El nombre de la ciudad no puede estar vacío.');
  }

  try {
    // Endpoint para la clima actual (Current Weather Data API)
    // Usamos units=metric para obtener °C y lang=es para las descripciones traducidas
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cleanCity
    )}&appid=${apiKey}&units=metric&lang=es`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`La ciudad "${cleanCity}" no fue encontrada en OpenWeatherMap.`);
      }
      throw new Error(`Error de la API (Status: ${response.status}).`);
    }

    const data = await response.json();

    // Mapeo estricto de tipos con validaciones básicas
    if (!data || !data.main || !data.weather || data.weather.length === 0) {
      throw new Error('Los datos devueltos por la API están incompletos.');
    }

    return {
      name: data.name,
      temp: Math.round(data.main.temp),
      // Capitalizar la primera letra de la descripción
      description:
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1),
      humidity: data.main.humidity,
      // Convertir velocidad de m/s a km/h (multiplicando por 3.6) y redondear
      windSpeed: Math.round(data.wind.speed * 3.6),
      icon: data.weather[0].icon,
    };
  } catch (error: any) {
    // Mantener mensajes de error amigables
    throw new Error(error.message || 'Ocurrió un error inesperado de red al conectar con el servidor del clima.');
  }
});
