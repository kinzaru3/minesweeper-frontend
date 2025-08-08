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
  'text-blue-400',    // 1
  'text-green-400',   // 2
  'text-red-400',     // 3
  'text-purple-400',  // 4
  'text-yellow-400',  // 5
  'text-cyan-400',    // 6
  'text-gray-400',    // 7
  'text-pink-400',    // 8
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
    const baseClasses = 'w-8 h-8 border border-gray-600 flex items-center justify-center text-sm font-bold select-none transition-colors';
    
    if (cell.state === 'hidden') {
      return `${baseClasses} bg-gray-700 hover:bg-gray-600 ${isPressed ? 'bg-gray-600' : ''}`;
    }
    
    if (cell.state === 'flagged') {
      return `${baseClasses} bg-gray-700`;
    }
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return `${baseClasses} bg-red-600 text-white`;
      }
      
      if (cell.type === 'empty') {
        return `${baseClasses} bg-gray-800`;
      }
      
      if (cell.type === 'number') {
        return `${baseClasses} bg-gray-800 ${numberColors[cell.mineCount]}`;
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
