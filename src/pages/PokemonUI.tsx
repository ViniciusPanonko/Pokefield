import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPokemonDetailedGraphQL } from '../services/pokeApi';
import { useTeam } from '../context/TeamContext';
import type { EVSet, IVSet, MoveDetail } from '../context/TeamContext';
import { calculateTotalStat } from '../utils/mathStats';
import { Search, X, PlusCircle, Trash2 } from 'lucide-react';

export default function PokemonUI() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const navigate = useNavigate();
  const { team, addMember, updateMember } = useTeam();

  const [apiData, setApiData] = useState<any>(null);
  
  // Customization States
  const [level, setLevel] = useState(100);
  const [natureName, setNatureName] = useState('hardy');
  const [ability, setAbility] = useState('');
  const [evs, setEvs] = useState<EVSet>({ hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 });
  const [ivs, setIvs] = useState<IVSet>({ hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 });
  
  // Tactical Moveset State: Exactly 4 fixed slots
  const [selectedMoves, setSelectedMoves] = useState<(MoveDetail | null)[]>([null, null, null, null]);
  
  // Modal Actions
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [moveSearchQuery, setMoveSearchQuery] = useState('');
  const [focusMove, setFocusMove] = useState<MoveDetail | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchPokemonDetailedGraphQL(id).then(data => {
        setApiData(data);
        if (uid) {
           const existing = team.find(m => m.uniqueId === uid);
           if (existing) {
             setLevel(existing.level);
             setEvs(existing.evs);
             setIvs(existing.ivs);
             setNatureName(existing.nature.name);
             setAbility(existing.ability || '');
             
             const loadedMoves: (MoveDetail | null)[] = [null, null, null, null];
             (existing.moves || []).forEach((m, i) => { if(i < 4) loadedMoves[i] = m; });
             setSelectedMoves(loadedMoves);
           }
        } else {
           // Default to first available ability if creating new
           if (data.pokemon_v2_pokemonabilities && data.pokemon_v2_pokemonabilities.length > 0) {
             setAbility(data.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.name);
           }
        }
      });
    }
  }, [id, uid]);

  if (!apiData) return <div className="container" style={{paddingTop: '3rem', textAlign: 'center'}}>Loading Deep GraphQL Data...</div>;

  const totalEvs = Object.values(evs).reduce((a, b) => a + Number(b), 0);
  
  const handleEvChange = (stat: keyof EVSet, value: number) => {
    if (value < 0) value = 0;
    if (value > 252) value = 252;
    const currentOthers = totalEvs - evs[stat];
    if (currentOthers + value > 510) value = 510 - currentOthers;
    setEvs({ ...evs, [stat]: value });
  };

  const handleIvChange = (stat: keyof IVSet, value: number) => {
    if (value < 0) value = 0;
    if (value > 31) value = 31;
    setIvs({ ...ivs, [stat]: value });
  };

  const handleSave = () => {
    const natureModifier = { name: natureName, increasedStat: null, decreasedStat: null }; 
    const types = apiData.pokemon_v2_pokemontypes.map((t: any) => t.pokemon_v2_type.name);
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`;

    const baseStats = {
      hp: apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='hp').base_stat,
      attack: apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='attack').base_stat,
      defense: apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='defense').base_stat,
      'special-attack': apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='special-attack').base_stat,
      'special-defense': apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='special-defense').base_stat,
      speed: apiData.pokemon_v2_pokemonstats.find((s:any)=>s.pokemon_v2_stat.name==='speed').base_stat,
    };

    // Filter out empty slots
    const cleanMoves = selectedMoves.filter(m => m !== null) as MoveDetail[];

    if (uid) {
      updateMember(uid, {
        level, evs, ivs, nature: natureModifier, moves: cleanMoves, ability
      });
    } else {
      addMember({
        id: apiData.id,
        name: apiData.name,
        sprite: sprite,
        types: types,
        baseStats: baseStats,
        level, nature: natureModifier, evs, ivs, moves: cleanMoves, ability
      });
    }
    navigate('/team');
  };

  const handleSelectMoveForSlot = (move: MoveDetail) => {
    if (activeSlot === null) return;
    
    // Prevent duplicated moves
    if (selectedMoves.some(m => m?.name === move.name)) {
      alert("A Pokémon cannot learn the exact same move twice!");
      return;
    }
    
    const newMoves = [...selectedMoves];
    newMoves[activeSlot] = move;
    setSelectedMoves(newMoves);
    setActiveSlot(null);
    setMoveSearchQuery('');
  };

  const currentMovePool = apiData.unique_moves.filter((m: MoveDetail) => 
    m.name.toLowerCase().includes(moveSearchQuery.toLowerCase()) || 
    m.type.toLowerCase().includes(moveSearchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      
      {/* -------------------- MODAL OVERLAY -------------------- */}
      {activeSlot !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button onClick={() => { setActiveSlot(null); setMoveSearchQuery(''); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
               <X size={28} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Select Move for Slot {activeSlot + 1}</h2>
            
            {/* Modal Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%', overflow: 'hidden' }}>
               {/* Left: Input + List */}
               <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                 <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} size={20} />
                    <input 
                      type="text" autoFocus
                      placeholder="Search move by name or type..." 
                      value={moveSearchQuery} onChange={e => setMoveSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-hover)', color: 'white' }}
                    />
                 </div>
                 
                 <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   {currentMovePool.length === 0 ? <p style={{color:'var(--text-secondary)'}}>No moves match criteria.</p> : null}
                   {currentMovePool.map((m: MoveDetail) => (
                      <div 
                        key={m.name} 
                        onMouseEnter={() => setFocusMove(m)}
                        onClick={() => handleSelectMoveForSlot(m)}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'var(--surface-color)', padding: '0.75rem', borderRadius: '8px', 
                          border: `1px solid var(--glass-border)`, cursor: 'pointer' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className={`type-badge type-${m.type}`} style={{ fontSize: '0.6rem', width: '60px', textAlign: 'center' }}>{m.type}</span>
                          <span style={{ textTransform: 'capitalize', color: 'white' }}>{m.name}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Power: {m.power || '--'}</div>
                      </div>
                   ))}
                 </div>
               </div>

               {/* Right: Rich Viewer */}
               <div>
                  <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Move Description</h3>
                  {focusMove ? (
                     <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--surface-hover)', border: '1px solid var(--glass-border)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <div>
                            <span className={`type-badge type-${focusMove.type}`} style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'inline-block' }}>{focusMove.type}</span>
                            <h2 style={{ textTransform: 'capitalize', color: 'white', fontSize: '1.8rem', margin: 0 }}>{focusMove.name}</h2>
                          </div>
                       </div>
                       
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background:'var(--surface-color)', padding:'1rem', borderRadius:'8px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Power</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: focusMove.power ? 'white' : 'var(--text-secondary)' }}>{focusMove.power || '--'}</div>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--glass-border)' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Accuracy</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: focusMove.accuracy ? 'white' : 'var(--text-secondary)' }}>{focusMove.accuracy ? `${focusMove.accuracy}%` : '--'}</div>
                          </div>
                       </div>
                       
                       <p style={{ color: 'white', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.5' }}>"{focusMove.flavor_text}"</p>
                     </div>
                  ) : (
                     <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                        Pass the mouse over an attack in the list to reveal its tactical details here.
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------------------------------- */}



      <div className="grid grid-cols-2">
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
           {/* Header Info */}
           <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--accent-color)' }}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${apiData.id}.png`} alt={apiData.name} style={{ width: '128px', height: '128px', imageRendering: 'pixelated', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} />
              <div>
                 <h1 style={{ textTransform: 'capitalize', color: 'white', fontSize: '2.5rem', margin: 0 }}>{apiData.name.replace('-', ' ')}</h1>
                 <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                   {apiData.pokemon_v2_pokemontypes.map((t: any) => (
                     <span key={t.pokemon_v2_type.name} className={`type-badge type-${t.pokemon_v2_type.name}`}>{t.pokemon_v2_type.name}</span>
                   ))}
                 </div>
              </div>
           </div>

           {/* Tactical Move Slots UI */}
           <div className="glass-card">
             <h2 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Moveset (4 Slots)</h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1rem', minHeight: '200px' }}>
                {[0, 1, 2, 3].map((slotIndex) => {
                  const move = selectedMoves[slotIndex];
                  return (
                    <div key={slotIndex} style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {move ? (
                        <div style={{ height: '100%', border: '1px solid var(--accent-color)', borderRadius: '8px', padding: '1rem', background: 'var(--surface-color)', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                           <button onClick={() => { const nn = [...selectedMoves]; nn[slotIndex] = null; setSelectedMoves(nn); }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                             <Trash2 size={16} />
                           </button>
                           <span className={`type-badge type-${move.type}`} style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>{move.type}</span>
                           <h3 style={{ margin: 0, textTransform: 'capitalize', color: 'white' }}>{move.name}</h3>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Power: {move.power || '--'} | Acc: {move.accuracy || '--'}</div>
                        </div>
                      ) : (
                        <button onClick={() => { setActiveSlot(slotIndex); setFocusMove(null); }} style={{ height: '100%', border: '2px dashed var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.2rem', fontWeight: 'bold' }}>
                           <PlusCircle /> Click to add move
                        </button>
                      )}
                    </div>
                  )
                })}
             </div>
           </div>
        </div>

        <div>
           {/* Stats Configuration */}
           <div className="glass-card" style={{ height: '100%' }}>
              <h2 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Stat Adjustments</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{display:'block', marginBottom:'0.25rem', color: 'var(--text-secondary)'}}>Level (1-100)</label>
                  <input type="number" min="1" max="100" value={level} onChange={e => setLevel(Number(e.target.value))} style={{ width: '100%', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'0.25rem', color: 'var(--text-secondary)'}}>Nature</label>
                  <select value={natureName} onChange={e => setNatureName(e.target.value)} style={{ width: '100%', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px' }}>
                     <option value="hardy">Hardy (Neutral)</option>
                     <option value="adamant">Adamant (+Atk, -SpA)</option>
                     <option value="modest">Modest (+SpA, -Atk)</option>
                     <option value="jolly">Jolly (+Spe, -SpA)</option>
                     <option value="timid">Timid (+Spe, -Atk)</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'0.25rem', color: 'var(--text-secondary)'}}>Ability</label>
                  <select value={ability} onChange={e => setAbility(e.target.value)} style={{ width: '100%', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                     {apiData.pokemon_v2_pokemonabilities.map((a: any) => (
                       <option key={a.pokemon_v2_ability.name} value={a.pokemon_v2_ability.name}>
                          {a.pokemon_v2_ability.name.replace('-', ' ')} {a.is_hidden ? '(Hidden)' : ''}
                       </option>
                     ))}
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
                 <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Stat</div>
                 <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>EVs <span style={{ color: totalEvs === 510 ? 'var(--danger-color)' : 'inherit'}}>( {totalEvs}/510 )</span></div>
                 <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>IVs (0-31)</div>
                 <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'right' }}>Total</div>

                {apiData.pokemon_v2_pokemonstats.map((s: any) => {
                  const sName = s.pokemon_v2_stat.name as keyof EVSet;
                  const finalStat = calculateTotalStat(sName, s.base_stat, ivs[sName], evs[sName], level, { increasedStat: null, decreasedStat: null, name: natureName });
                  return (
                    <React.Fragment key={sName}>
                      <span style={{ textTransform: 'capitalize', color: 'white', fontWeight: 'bold' }}>{sName === 'special-attack' ? 'Sp.Atk' : sName === 'special-defense' ? 'Sp.Def' : sName}</span>
                      
                      {/* EV Control */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="range" min="0" max="252" value={evs[sName]} onChange={e => handleEvChange(sName, Number(e.target.value))} style={{ flex: 1 }} />
                        <input type="number" min="0" max="252" value={evs[sName]} onChange={e => handleEvChange(sName, Number(e.target.value))} style={{ width: '50px', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.2rem', borderRadius: '4px' }} />
                      </div>

                      {/* IV Control */}
                      <input type="number" min="0" max="31" value={ivs[sName]} onChange={e => handleIvChange(sName, Number(e.target.value))} style={{ width: '50px', background: 'var(--surface-color)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.2rem', borderRadius: '4px', textAlign: 'center' }} />

                      {/* Final Value */}
                      <span style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--success-color)', fontSize: '1.1rem' }}>{finalStat}</span>
                    </React.Fragment>
                  )
                })}
              </div>

              <button onClick={handleSave} className="btn" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', padding: '1rem', background: 'var(--accent-color)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: 'var(--shadow-elevated)' }}>
                 {uid ? 'Save Changes' : 'Confirm & Add to Team'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
