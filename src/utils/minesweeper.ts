import { Cell, GameState, GameConfig, CellState, CellType } from '@/types/minesweeper';

const DIFFICULTY_CONFIGS = {
  easy: { width: 9, height: 9, mineCount: 10 },
  medium: { width: 16, height: 16, mineCount: 40 },
  hard: { width: 30, height: 16, mineCount: 99 },
};

export const getDifficultyConfig = (difficulty: 'easy' | 'medium' | 'hard'): GameConfig => {
  return DIFFICULTY_CONFIGS[difficulty];
};

export const createEmptyBoard = (width: number, height: number): Cell[][] => {
  const board: Cell[][] = [];
  
  for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
      board[y][x] = {
        id: `${x}-${y}`,
        x,
        y,
        state: 'hidden',
        type: 'empty',
        mineCount: 0,
        isMine: false,
      };
    }
  }
  
  return board;
};

export const placeMines = (board: Cell[][], mineCount: number, excludeX: number, excludeY: number): Cell[][] => {
  const height = board.length;
  const width = board[0].length;
  const totalCells = width * height;
  const mines: Set<string> = new Set();
  
  // 最初のクリック位置とその周囲を除外
  const excludePositions = new Set<string>();
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const newX = excludeX + dx;
      const newY = excludeY + dy;
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        excludePositions.add(`${newX}-${newY}`);
      }
    }
  }
  
  // 地雷を配置
  while (mines.size < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const position = `${x}-${y}`;
    
    if (!mines.has(position) && !excludePositions.has(position)) {
      mines.add(position);
    }
  }
  
  // ボードを更新
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  mines.forEach(position => {
    const [x, y] = position.split('-').map(Number);
    newBoard[y][x].isMine = true;
    newBoard[y][x].type = 'mine';
  });
  
  // 周囲の地雷数を計算
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!newBoard[y][x].isMine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
              if (newBoard[newY][newX].isMine) {
                count++;
              }
            }
          }
        }
        newBoard[y][x].mineCount = count;
        newBoard[y][x].type = count > 0 ? 'number' : 'empty';
      }
    }
  }
  
  return newBoard;
};

export const revealCell = (board: Cell[][], x: number, y: number): Cell[][] => {
  const height = board.length;
  const width = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const stack: [number, number][] = [[x, y]];
  
  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop()!;
    const cell = newBoard[currentY][currentX];
    
    if (cell.state === 'revealed' || cell.state === 'flagged') {
      continue;
    }
    
    cell.state = 'revealed';
    
    if (cell.isMine) {
      continue;
    }
    
    // 空のセルの場合、周囲のセルも開く
    if (cell.type === 'empty') {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newX = currentX + dx;
          const newY = currentY + dy;
          if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            const neighbor = newBoard[newY][newX];
            if (neighbor.state === 'hidden') {
              stack.push([newX, newY]);
            }
          }
        }
      }
    }
  }
  
  return newBoard;
};

export const toggleFlag = (board: Cell[][], x: number, y: number): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[y][x];
  
  if (cell.state === 'hidden') {
    cell.state = 'flagged';
  } else if (cell.state === 'flagged') {
    cell.state = 'hidden';
  }
  
  return newBoard;
};

export const checkGameStatus = (board: Cell[][], mineCount: number): 'playing' | 'won' | 'lost' => {
  const height = board.length;
  const width = board[0].length;
  let revealedCount = 0;
  let hasExploded = false;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = board[y][x];
      if (cell.state === 'revealed') {
        revealedCount++;
        if (cell.isMine) {
          hasExploded = true;
        }
      }
    }
  }
  
  if (hasExploded) {
    return 'lost';
  }
  
  const totalCells = width * height;
  if (revealedCount === totalCells - mineCount) {
    return 'won';
  }
  
  return 'playing';
};

export const getGameStats = (board: Cell[][]): { revealedCount: number; flaggedCount: number } => {
  let revealedCount = 0;
  let flaggedCount = 0;
  
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const cell = board[y][x];
      if (cell.state === 'revealed') {
        revealedCount++;
      } else if (cell.state === 'flagged') {
        flaggedCount++;
      }
    }
  }
  
  return { revealedCount, flaggedCount };
};

export const revealAllMines = (board: Cell[][]): Cell[][] => {
  return board.map(row => 
    row.map(cell => ({
      ...cell,
      state: cell.isMine ? 'revealed' : cell.state
    }))
  );
};

export const autoRevealCell = (board: Cell[][], x: number, y: number): Cell[][] => {
  const height = board.length;
  const width = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[y][x];
  
  // 数字のセルでない場合は何もしない
  if (cell.type !== 'number' || cell.state !== 'revealed') {
    return newBoard;
  }
  
  // 周囲のフラグ数を数える
  let flagCount = 0;
  const neighbors: [number, number][] = [];
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const neighbor = newBoard[newY][newX];
        if (neighbor.state === 'flagged') {
          flagCount++;
        } else if (neighbor.state === 'hidden') {
          neighbors.push([newX, newY]);
        }
      }
    }
  }
  
  // フラグ数がセルの数字と一致する場合、周囲の隠れたセルを開く
  if (flagCount === cell.mineCount) {
    const stack: [number, number][] = [...neighbors];
    
    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop()!;
      const currentCell = newBoard[currentY][currentX];
      
      if (currentCell.state === 'revealed' || currentCell.state === 'flagged') {
        continue;
      }
      
      currentCell.state = 'revealed';
      
      if (currentCell.isMine) {
        continue;
      }
      
      // 空のセルの場合、周囲のセルも開く
      if (currentCell.type === 'empty') {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const newX = currentX + dx;
            const newY = currentY + dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
              const neighbor = newBoard[newY][newX];
              if (neighbor.state === 'hidden') {
                stack.push([newX, newY]);
              }
            }
          }
        }
      }
    }
  }
  
  return newBoard;
};
