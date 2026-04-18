import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StatName, NatureModifier } from '../utils/mathStats';

export interface EVSet {
  hp: number; attack: number; defense: number;
  'special-attack': number; 'special-defense': number; speed: number;
}

export interface IVSet {
  hp: number; attack: number; defense: number;
  'special-attack': number; 'special-defense': number; speed: number;
}

export interface MoveDetail {
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  flavor_text: string | null;
}

export interface TeamMember {
  uniqueId: string;
  id: number;
  name: string;
  sprite: string;
  types: string[];
  baseStats: EVSet;
  level: number;
  nature: NatureModifier & { name: string };
  ability: string;
  evs: EVSet;
  ivs: IVSet;
  moves: MoveDetail[];
}

interface TeamContextType {
  team: TeamMember[];
  addMember: (member: Omit<TeamMember, 'uniqueId'>) => void;
  updateMember: (uniqueId: string, updates: Partial<TeamMember>) => void;
  removeMember: (uniqueId: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('pokefield_team');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pokefield_team', JSON.stringify(team));
  }, [team]);

  const addMember = (member: Omit<TeamMember, 'uniqueId'>) => {
    if (team.length >= 6) {
      alert("Sua equipe já está cheia (Mín: 1, Máx: 6)");
      return;
    }
    const newMember = { ...member, uniqueId: crypto.randomUUID() };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateMember = (uniqueId: string, updates: Partial<TeamMember>) => {
    setTeam((prev) => prev.map((m) => m.uniqueId === uniqueId ? { ...m, ...updates } : m));
  };

  const removeMember = (uniqueId: string) => {
    setTeam((prev) => prev.filter((m) => m.uniqueId !== uniqueId));
  };

  return (
    <TeamContext.Provider value={{ team, addMember, updateMember, removeMember }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) throw new Error('useTeam must be used within a TeamProvider');
  return context;
};
