export type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

// The neutral nature multiplier is 1.0. A beneficial nature gives 1.1x, hindering gives 0.9x.
// This is a simplified interface for Natures.
export interface NatureModifier {
  increasedStat: StatName | null;
  decreasedStat: StatName | null;
}

export const calculateHPStat = (base: number, iv: number, ev: number, level: number): number => {
  if (base === 1) return 1; // Shedinja case
  return Math.floor((((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10);
};

export const calculateOtherStat = (
  statName: StatName,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: NatureModifier
): number => {
  const rawStat = Math.floor((((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5);
  let natureMultiplier = 1.0;
  
  if (nature.increasedStat === statName) natureMultiplier = 1.1;
  if (nature.decreasedStat === statName) natureMultiplier = 0.9;
  
  return Math.floor(rawStat * natureMultiplier);
};

export const calculateTotalStat = (
  statName: StatName,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: NatureModifier
): number => {
  if (statName === 'hp') {
    return calculateHPStat(base, iv, ev, level);
  }
  return calculateOtherStat(statName, base, iv, ev, level, nature);
};
