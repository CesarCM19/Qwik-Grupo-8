// component$: Construye el componente Head de la página.
import { component$ } from "@builder.io/qwik";

// useDocumentHead: Obtiene los metadatos de SEO y título definidos en la ruta actual.
// useLocation: Obtiene la información de la URL actual para configuraciones como el enlace canónico.
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * El componente RouterHead se coloca dentro del elemento `<head>` del documento.
 * 
 * component$: Convierte a RouterHead en un componente que puede ser cargado 
 * dinámicamente por Qwik gracias al sufijo '$' (marca el punto de lazy-loading).
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
