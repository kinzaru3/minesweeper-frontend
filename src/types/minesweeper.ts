export type CellState = 'hidden' | 'revealed' | 'flagged';

export type CellType = 'empty' | 'mine' | 'number';

export interface Cell {
  id: string;
  x: number;
  y: number;
  state: CellState;
  type: CellType;
  mineCount: number;
  isMine: boolean;
}

export interface GameState {
  cells: Cell[][];
  width: number;
  height: number;
  mineCount: number;
  flaggedCount: number;
  revealedCount: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isFirstClick: boolean;
  isFlagMode: boolean;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  width: number;
  height: number;
  mineCount: number;
}
