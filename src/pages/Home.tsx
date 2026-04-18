import React from 'react';
import { useTeam } from '../context/TeamContext';
import { ShieldAlert, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_TYPES, getDefensiveMultiplier } from '../utils/typeChart';

export default function Home() {
  const { team, removeMember } = useTeam();

  const handleRemove = (uniqueId: string) => {
    if (confirm("Are you sure you want to remove this Pokémon from your team?")) {
      removeMember(uniqueId);
    }
  }

  const getCellColor = (multiplier: number) => {
    if (multiplier > 1) return 'var(--danger-color)'; // Weak (take double/quadruple damage) -> Red/Danger
    if (multiplier < 1) return 'var(--success-color)'; // Resist/Immune (take half/no damage) -> Green/Safe
    return 'var(--surface-hover)'; // Neutral
  };

  const formatMultiplier = (val: number) => {
    if (val === 0) return '0';
    if (val === 0.5) return '½';
    if (val === 0.25) return '¼';
    return val;
  }

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
            <ShieldAlert style={{ color: 'var(--accent-color)' }} /> 
            Team Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your lineup and review elemental weaknesses. ({team.length}/6)
          </p>
        </div>
        <Link to="/" className="btn btn-primary">Adicionar Novo</Link>
      </div>

      {team.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>You don't have any Pokémon in your team yet.</p>
          <Link to="/" className="btn btn-primary">Start Building Now</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
            {team.map((member) => (
              <div key={member.uniqueId} className="glass-card" style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                 <img src={member.sprite} alt={member.name} style={{ width: '96px', height: '96px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', imageRendering: 'pixelated' }} />
                 <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <h3 style={{ textTransform: 'capitalize', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{member.name.replace('-', ' ')} <span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>Lv.{member.level}</span></h3>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <Link to={`/pokemon/${member.id}?uid=${member.uniqueId}`} className="btn" style={{ padding: '0.25rem 0.5rem', color: 'white' }}><Edit2 size={16} /></Link>
                       <button className="btn" style={{ padding: '0.25rem 0.5rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', background: 'transparent' }} onClick={() => handleRemove(member.uniqueId)}>
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                   
                   <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                     {member.types.map(t => (
                       <span key={t} className={`type-badge type-${t}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>{t}</span>
                     ))}
                   </div>
                   {member.ability && (
                     <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                       Ability: <b style={{ color: 'white', textTransform: 'capitalize' }}>{member.ability.replace('-', ' ')}</b>
                     </div>
                   )}
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '1rem', marginTop: '8px' }}>
                      <div title="EVs (IVs)">HP: <b style={{color:'white'}}>{member.evs.hp}</b> <span>({member.ivs.hp})</span></div>
                      <div title="EVs (IVs)">Atk: <b style={{color:'white'}}>{member.evs.attack}</b> <span>({member.ivs.attack})</span></div>
                      <div title="EVs (IVs)">Def: <b style={{color:'white'}}>{member.evs.defense}</b> <span>({member.ivs.defense})</span></div>
                      <div title="EVs (IVs)">SpA: <b style={{color:'white'}}>{member.evs['special-attack']}</b> <span>({member.ivs['special-attack']})</span></div>
                      <div title="EVs (IVs)">SpD: <b style={{color:'white'}}>{member.evs['special-defense']}</b> <span>({member.ivs['special-defense']})</span></div>
                      <div title="EVs (IVs)">Spe: <b style={{color:'white'}}>{member.evs.speed}</b> <span>({member.ivs.speed})</span></div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                     {member.moves?.map(m => (
                       <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                          <span className={`type-badge type-${m.type}`} style={{ fontSize: '0.55rem', padding: '0.1rem 0.2rem', minWidth: '40px', textAlign: 'center' }}>{m.type}</span>
                          <span style={{ fontSize: '0.75rem', color: 'white', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                       </div>
                     ))}
                     {(!member.moves || member.moves.length === 0) && (
                       <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)', fontStyle: 'italic' }}>No moves learned</span>
                     )}
                   </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <h2 style={{ marginBottom: '1rem', color: 'white' }}>Team Weakness Matrix</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Shows damage taken from each attacking element. Green = Resistant/Immune. Red = Weak.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'left', position: 'sticky', left: '0', background: 'var(--surface-color)', zIndex: 2 }}>Pokémon</th>
                  {ALL_TYPES.map(type => (
                    <th key={type} style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', zIndex: 1 }}>
                      <span className={`type-badge type-${type}`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.3rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: '0 auto', minHeight: '60px' }}>{type}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.map(member => (
                  <tr key={member.uniqueId}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'left', position: 'sticky', left: '0', background: 'var(--surface-color)', textTransform: 'capitalize', fontWeight: 'bold', whiteSpace: 'nowrap', zIndex: 2 }}>
                      {member.name.replace('-',' ')}
                    </td>
                    {ALL_TYPES.map(attackType => {
                      const damage = getDefensiveMultiplier(attackType, member.types);
                      return (
                        <td key={attackType} style={{ 
                          padding: '0.5rem', 
                          borderBottom: '1px solid var(--glass-border)',
                          background: getCellColor(damage)
                        }}>
                          <span style={{ 
                            color: damage === 1 ? 'var(--text-secondary)' : 'white',
                            fontWeight: damage !== 1 ? 'bold' : 'normal'
                          }}>
                            {formatMultiplier(damage)}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
