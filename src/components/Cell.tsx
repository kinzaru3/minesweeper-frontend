'use client';

import { Cell as CellType } from '@/types/minesweeper';
import { useState } from 'react';
import styles from './Cell.module.scss';

interface CellProps {
  cell: CellType;
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
  onDoubleClick: (x: number, y: number) => void;
}

export default function Cell({ cell, onClick, onRightClick, onDoubleClick }: CellProps) {
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

  const handleDoubleClick = () => {
    if (cell.state === 'revealed' && cell.type === 'number') {
      onDoubleClick(cell.x, cell.y);
    }
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
    const classes = [styles.cell];
    
    if (cell.state === 'hidden') {
      classes.push(styles.hidden);
      if (isPressed) {
        classes.push(styles.pressed);
      }
    } else if (cell.state === 'flagged') {
      classes.push(styles.flagged);
    } else if (cell.state === 'revealed') {
      classes.push(styles.revealed);
      
      if (cell.isMine) {
        classes.push(styles.mine);
      } else if (cell.type === 'empty') {
        classes.push(styles.empty);
      } else if (cell.type === 'number') {
        classes.push(styles.number);
        classes.push(styles[`number-${cell.mineCount}`]);
      }
    }
    
    return classes.join(' ');
  };

  return (
    <button
      className={getCellClasses()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={cell.state === 'revealed' && cell.type !== 'number'}
    >
      {getCellContent()}
    </button>
  );
}
