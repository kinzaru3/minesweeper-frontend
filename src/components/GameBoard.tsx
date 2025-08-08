'use client';

import { Cell as CellType } from '@/types/minesweeper';
import Cell from './Cell';
import styles from './GameBoard.module.scss';

interface GameBoardProps {
  board: CellType[][];
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
}

export default function GameBoard({ board, onCellClick, onCellRightClick }: GameBoardProps) {
  const handleCellClick = (x: number, y: number) => {
    onCellClick(x, y);
  };

  const handleCellRightClick = (x: number, y: number) => {
    onCellRightClick(x, y);
  };

  return (
    <div className={styles.gameBoard}>
      <div 
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={cell.id}
              cell={cell}
              onClick={handleCellClick}
              onRightClick={handleCellRightClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
