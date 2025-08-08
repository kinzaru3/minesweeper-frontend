'use client';

import { Cell as CellType } from '@/types/minesweeper';
import { useState } from 'react';

interface CellProps {
  cell: CellType;
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
}

const numberColors = [
  'text-transparent', // 0
  'text-blue-600',    // 1
  'text-green-600',   // 2
  'text-red-600',     // 3
  'text-purple-600',  // 4
  'text-yellow-600',  // 5
  'text-cyan-600',    // 6
  'text-gray-600',    // 7
  'text-pink-600',    // 8
];

export default function Cell({ cell, onClick, onRightClick }: CellProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (cell.state === 'hidden') {
      onClick(cell.x, cell.y);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.x, cell.y);
  };

  const handleMouseDown = () => {
    if (cell.state === 'hidden') {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const getCellContent = () => {
    if (cell.state === 'flagged') {
      return '🚩';
    }
    
    if (cell.state === 'hidden') {
      return '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    if (cell.type === 'empty') {
      return '';
    }
    
    if (cell.type === 'number') {
      return cell.mineCount.toString();
    }
    
    return '';
  };

  const getCellClasses = () => {
    const baseClasses = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold select-none transition-colors';
    
    if (cell.state === 'hidden') {
      return `${baseClasses} bg-gray-200 hover:bg-gray-300 ${isPressed ? 'bg-gray-300' : ''}`;
    }
    
    if (cell.state === 'flagged') {
      return `${baseClasses} bg-gray-200`;
    }
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return `${baseClasses} bg-red-500 text-white`;
      }
      
      if (cell.type === 'empty') {
        return `${baseClasses} bg-gray-100`;
      }
      
      if (cell.type === 'number') {
        return `${baseClasses} bg-gray-100 ${numberColors[cell.mineCount]}`;
      }
    }
    
    return baseClasses;
  };

  return (
    <button
      className={getCellClasses()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={cell.state === 'revealed'}
    >
      {getCellContent()}
    </button>
  );
}
