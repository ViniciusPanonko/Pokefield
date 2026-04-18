import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useMemo } from 'react';

import Home from './pages/Home';
import Builder from './pages/Builder';
import PokemonUI from './pages/PokemonUI';

const PokeballShield = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M3.5 12h5.5" />
    <path d="M15 12h5.5" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DynamicBackground = () => {
  const icons = useMemo(() => {
    const list = [];
    const total = 154; // Primeiros 154 conforme pedido
    const cols = 14; 
    const rows = Math.ceil(total / cols);
    
    for (let i = 1; i <= total; i++) {
        const col = (i - 1) % cols;
        const row = Math.floor((i - 1) / cols);
        
        // Padrão de Favo de Mel (Checkerboard Offset) para visual profissional 
        const isOddRow = row % 2 !== 0;
        const offsetX = isOddRow ? (100 / cols) / 2 : 0;
        
        const baseX = (col / cols) * 100 + offsetX;
        const baseY = (row / rows) * 100;
        
        list.push({
          id: i,
          x: baseX,
          y: baseY
        });
    }
    return list;
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', overflow: 'hidden', background: 'var(--bg-color)' }}>
       {icons.map(icon => (
          <div key={icon.id} style={{
               position: 'absolute',
               left: `${icon.x}%`,
               top: `${icon.y}%`,
               transform: 'translate(-50%, -50%)' // Centralização Perfeita protegida
          }}>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${icon.id}.png`}
              style={{
                 width: '64px',
                 height: '64px',
                 opacity: 0.15,
                 filter: 'grayscale(100%)',
                 imageRendering: 'pixelated',
                 // Animação idêntica ao Rotom, mas dessincronizada para organicidade
                 animation: `rotomFloat ${5 + Math.random() * 3}s ease-in-out infinite`,
                 animationDelay: `-${Math.random() * 5}s`
              }}
              alt=""
            />
          </div>
       ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <DynamicBackground />
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <PokeballShield size={28} color="var(--accent-color)" />
          Pokéfield Dex
        </Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/team" className="btn btn-primary">Team Builder</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/team" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonUI />} />
        </Routes>
      </main>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png" alt="Rotom Dex" className="rotom-bg" />
      <div style={{
        position: 'fixed',
        bottom: '5px',
        right: '20px',
        width: '150px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.65rem',
        opacity: 0.7,
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        By: Vinícius Panonko
      </div>
    </Router>
  );
}

export default App;
