import { Link } from 'react-router-dom';
import Canales from '../components/Canales';
import '../styles/Home.css';

function Home() {
  return (
    <div className="page-shell home-shell">
      <section className="home-hero">
        <div className="eyebrow">Streaming en vivo</div>
        <h1>noWatch: canales al instante, <span>sin límites</span>.</h1>
        <p>
          Zapping rápido, grillas limpias y un player siempre visible. Crea tu mood del día con categorías, favoritos y autenticación rápida.
        </p>
        <div className="home-cta">
          <Link className="pill-button secondary" to="/categoria">Explorar categorías</Link>
        </div>

        <div className="home-metrics">
          <div className="metric">
            <span className="metric-value">+120</span>
            <span className="metric-label">Canales disponibles</span>
          </div>
          <div className="metric">
            <span className="metric-value">Favoritos</span>
            <span className="metric-label">Sincronizados con tu perfil</span>
          </div>
          <div className="metric">
            <span className="metric-value">24/7</span>
            <span className="metric-label">Streaming continuo</span>
          </div>
        </div>
      </section>

      <section id="en-vivo" className="home-section">
        <Canales />
      </section>
    </div>
  );
}

export default Home;