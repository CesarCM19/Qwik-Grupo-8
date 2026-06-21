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

export interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

/**
 * Función que realiza la petición a OpenWeatherMap de forma segura en el servidor.
 * Retorna un objeto WeatherResponse en lugar de arrojar errores directamente.
 * Esto evita que el framework enmascare las excepciones del servidor como "Internal Server Error" en el cliente.
 */
export const fetchWeather = server$(async function (city: string): Promise<WeatherResponse> {
  const apiKey = this.env.get('OPENWEATHER_API_KEY');
  
  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    return {
      success: false,
      error: 'La API Key de OpenWeatherMap no está configurada en el servidor o es inválida.',
    };
  }

  const cleanCity = city.trim();
  if (!cleanCity) {
    return {
      success: false,
      error: 'El nombre de la ciudad no puede estar vacío.',
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cleanCity
    )}&appid=${apiKey}&units=metric&lang=es`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Ciudad no encontrada',
        };
      }
      return {
        success: false,
        error: `Error de la API (Status: ${response.status})`,
      };
    }

    const data = await response.json();

    if (!data || !data.main || !data.weather || data.weather.length === 0) {
      return {
        success: false,
        error: 'Los datos devueltos por la API están incompletos.',
      };
    }

    return {
      success: true,
      data: {
        name: data.name,
        temp: Math.round(data.main.temp),
        description:
          data.weather[0].description.charAt(0).toUpperCase() +
          data.weather[0].description.slice(1),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        icon: data.weather[0].icon,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error inesperado de red al conectar con el servidor del clima.',
    };
  }
});
