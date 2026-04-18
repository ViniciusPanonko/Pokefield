import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { fetchAllPokemonGraphQL } from '../services/pokeApi';
import { Link } from 'react-router-dom';
import { Search, ArrowDownWideNarrow } from 'lucide-react';

export default function Builder() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(50);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchAllPokemonGraphQL().then(data => {
      setList(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const processedList = useMemo(() => {
    let result = [...list];
    
    if (search) {
      result = result.filter(p => p.name.includes(search.toLowerCase()));
    }

    if (sortBy !== 'id') {
      result.sort((a, b) => {
         const statA = a.pokemon_v2_pokemonstats.find((s:any) => s.pokemon_v2_stat.name === sortBy)?.base_stat || 0;
         const statB = b.pokemon_v2_pokemonstats.find((s:any) => s.pokemon_v2_stat.name === sortBy)?.base_stat || 0;
         return statB - statA;
      });
    }

    return result;
  }, [list, search, sortBy]);

  const visibleList = useMemo(() => {
    return processedList.slice(0, displayCount);
  }, [processedList, displayCount]);

  useEffect(() => {
    setDisplayCount(50);
  }, [search, sortBy]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prev => prev + 50);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading]);

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Pokédex Global</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '2rem' }}>
         <div style={{ position: 'relative' }}>
           <Search style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} size={20} />
           <input 
             type="text" 
             placeholder="Search Pokémon by name..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             style={{ 
               width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', 
               borderRadius: '8px', border: '1px solid var(--glass-border)',
               background: 'var(--surface-color)', color: 'var(--text-primary)',
               fontSize: '1rem'
             }}
           />
         </div>
         <div style={{ position: 'relative' }}>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{
                height: '100%', padding: '0 1rem 0 2.5rem', borderRadius: '8px',
                background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)',
                appearance: 'none', cursor: 'pointer'
              }}
            >
              <option value="id">Sort by Pokedex #</option>
              <option value="hp">Highest HP</option>
              <option value="attack">Highest Attack</option>
              <option value="defense">Highest Defense</option>
              <option value="special-attack">Highest Spl. Attack</option>
              <option value="special-defense">Highest Spl. Defense</option>
              <option value="speed">Highest Speed</option>
            </select>
            <ArrowDownWideNarrow style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--text-secondary)' }} size={20} />
         </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: 'var(--accent-color)' }}>Accessing Global PokeAPI DB...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>(Loading up to 900+ entries securely via GraphQL)</p>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {visibleList.map(poke => {
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
            
            // Extract sorted stat to display if not default
            let highlightStat = null;
            if (sortBy !== 'id') {
              highlightStat = poke.pokemon_v2_pokemonstats.find((s:any) => s.pokemon_v2_stat.name === sortBy)?.base_stat;
            }

            return (
              <Link to={`/pokemon/${poke.id}`} key={poke.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>#{poke.id}</span>
                {highlightStat !== null && (
                   <span style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                     ★ {highlightStat}
                   </span>
                )}
                
                <img src={spriteUrl} alt={poke.name} style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} loading="lazy" />
                <h3 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{poke.name.replace('-', ' ')}</h3>
                
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  {poke.pokemon_v2_pokemontypes.map((t: any) => (
                    <span key={t.pokemon_v2_type.name} className={`type-badge type-${t.pokemon_v2_type.name}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                       {t.pokemon_v2_type.name}
                    </span>
                  ))}
                </div>
                
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                   {poke.pokemon_v2_pokemonabilities?.map((a: any) => (
                      <span key={a.pokemon_v2_ability.name} style={{ color: a.is_hidden ? 'var(--accent-color)' : 'inherit' }}>
                        {a.is_hidden ? 'Hidden: ' : ''}{a.pokemon_v2_ability.name.replace('-', ' ')}
                      </span>
                   ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}
      
      {!loading && visibleList.length < processedList.length && (
        <div ref={lastElementRef} style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Carregando mais Pokémons...</p>
        </div>
      )}
    </div>
  );
}
