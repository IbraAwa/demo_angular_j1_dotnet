export type Priorite = 'haute' | 'moyenne' | 'basse';

export interface Tache {
  id: number;
  titre: string;
  done: boolean;
  priorite: Priorite;
}
