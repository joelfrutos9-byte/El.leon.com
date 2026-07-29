import React, { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';

// Configuración de tu cliente de Sanity con las credenciales de tu proyecto
const client = createClient({
  projectId: '837br3mo', // ID de tu proyecto en Sanity
  dataset: 'production', // Cambialo por 'desarrollo' o el nombre exacto de tu conjunto si usás otro
  useCdn: true,
  apiVersion: '2023-05-03',
});

export default function App() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Consulta en GROQ para traer las noticias ordenadas por fecha reciente
    const query = `*[_type == "post" || _type == "noticia"] | order(_createdAt desc){
      _id,
      title,
      slug,
      summary,
      publishedAt,
      "imageUrl": mainImage.asset->url,
      body
    }`;

    client
      .fetch(query)
      .then((data) => {
        setNoticias(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al conectar con Sanity:', err);
        setCargando(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      {/* Encabezado Principal */}
      <header style={styles.header}>
        <h1 style={styles.title}>EL LEÓN</h1>
        <p style={styles.subtitle}>Joel Diaz — Boxeador & Profesor</p>
      </header>

      {/* Sección de Noticias / Novedades */}
      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Últimas Novedades</h2>

        {cargando ? (
          <p style={styles.status}>Cargando contenido...</p>
        ) : noticias.length === 0 ? (
          <p style={styles.status}>
            Aún no hay publicaciones cargadas. Podés agregar la primera desde Sanity Studio.
          </p>
        ) : (
          <div style={styles.grid}>
            {noticias.map((item) => (
              <article key={item._id} style={styles.card}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} style={styles.cardImage} />
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  {item.publishedAt && (
                    <small style={styles.cardDate}>
                      {new Date(item.publishedAt).toLocaleDateString('es-AR')}
                    </small>
                  )}
                  <p style={styles.cardText}>
                    {item.summary || (item.body && item.body[0]?.children[0]?.text)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Pie de Página */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Joel Diaz — El León. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

// Estilos directos en JSX
const styles = {
  container: {
    backgroundColor: '#0d0d0d',
    color: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
  },
  header: {
    padding: '30px 20px',
    textAlign: 'center',
    borderBottom: '2px solid #ffde00',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    color: '#ffde00',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: '1.1rem',
    margin: '5px 0 0 0',
    color: '#cccccc',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  sectionTitle: {
    borderLeft: '4px solid #ffde00',
    paddingLeft: '10px',
    fontSize: '1.8rem',
    marginBottom: '30px',
  },
  status: {
    textAlign: 'center',
    color: '#888888',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333333',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.3rem',
    color: '#ffffff',
  },
  cardDate: {
    color: '#ffde00',
    fontSize: '0.85rem',
    display: 'block',
    marginBottom: '10px',
  },
  cardText: {
    color: '#aaaaaa',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: 0,
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #222222',
    color: '#666666',
    fontSize: '0.9rem',
  },
};
