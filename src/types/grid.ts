export type CellType = 'default' | 'start' | 'target' | 'wall' | 'visited' | 'path';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  f: number; // Total cost (g + h)
  g: number; // Cost from start
  h: number; // Heuristic cost to target
  parent: Cell | null;
}

export type Mode = 'start' | 'target' | 'wall';

export interface GridState {
  grid: Cell[][];
  start: { row: number; col: number } | null;
  target: { row: number; col: number } | null;
  isRunning: boolean;
  isComplete: boolean;
}
