'use client';

import { Cell as CellType } from '@/types/minesweeper';
import Cell from './Cell';

interface GameBoardProps {
  board: CellType[][];
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
}

export default function GameBoard({ board, onCellClick, onCellRightClick }: GameBoardProps) {
  return (
    <div className="inline-block border-2 border-gray-600 bg-gray-600 p-1">
      <div 
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={cell.id}
              cell={cell}
              onClick={onCellClick}
              onRightClick={onCellRightClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
