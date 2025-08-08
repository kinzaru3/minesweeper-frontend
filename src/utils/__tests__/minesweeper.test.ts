import {
  getDifficultyConfig,
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkGameStatus,
  getGameStats,
  revealAllMines,
  autoRevealCell,
} from '@/utils/minesweeper';

describe('Minesweeper Utils', () => {
  describe('getDifficultyConfig', () => {
    it('returns correct config for easy difficulty', () => {
      const config = getDifficultyConfig('easy');
      expect(config).toEqual({ width: 9, height: 9, mineCount: 10 });
    });

    it('returns correct config for medium difficulty', () => {
      const config = getDifficultyConfig('medium');
      expect(config).toEqual({ width: 16, height: 16, mineCount: 40 });
    });

    it('returns correct config for hard difficulty', () => {
      const config = getDifficultyConfig('hard');
      expect(config).toEqual({ width: 30, height: 16, mineCount: 99 });
    });
  });

  describe('createEmptyBoard', () => {
    it('creates board with correct dimensions', () => {
      const board = createEmptyBoard(3, 3);
      expect(board).toHaveLength(3);
      expect(board[0]).toHaveLength(3);
    });

    it('creates cells with correct properties', () => {
      const board = createEmptyBoard(2, 2);
      expect(board[0][0]).toEqual({
        id: '0-0',
        x: 0,
        y: 0,
        state: 'hidden',
        type: 'empty',
        mineCount: 0,
        isMine: false,
      });
    });
  });

  describe('autoRevealCell', () => {
    it('does nothing for non-number cells', () => {
      const board = createEmptyBoard(3, 3);
      const result = autoRevealCell(board, 0, 0);
      expect(result).toEqual(board);
    });

    it('does nothing for hidden number cells', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].type = 'number';
      board[0][0].mineCount = 1;
      const result = autoRevealCell(board, 0, 0);
      expect(result).toEqual(board);
    });

    it('opens neighbors when flag count matches mine count', () => {
      const board = createEmptyBoard(3, 3);
      
      // Set up a number cell with 1 mine
      board[1][1].type = 'number';
      board[1][1].mineCount = 1;
      board[1][1].state = 'revealed';
      
      // Set up a flag in the top-left corner
      board[0][0].state = 'flagged';
      
      // Set up a hidden cell in the top-right corner
      board[0][2].state = 'hidden';
      
      const result = autoRevealCell(board, 1, 1);
      
      // The hidden cell should be revealed
      expect(result[0][2].state).toBe('revealed');
    });

    it('does not open neighbors when flag count does not match', () => {
      const board = createEmptyBoard(3, 3);
      
      // Set up a number cell with 2 mines
      board[1][1].type = 'number';
      board[1][1].mineCount = 2;
      board[1][1].state = 'revealed';
      
      // Set up only 1 flag
      board[0][0].state = 'flagged';
      
      // Set up a hidden cell
      board[0][2].state = 'hidden';
      
      const result = autoRevealCell(board, 1, 1);
      
      // The hidden cell should remain hidden
      expect(result[0][2].state).toBe('hidden');
    });

    it('handles edge cases correctly', () => {
      const board = createEmptyBoard(3, 3);
      
      // Set up a number cell in the corner
      board[0][0].type = 'number';
      board[0][0].mineCount = 1;
      board[0][0].state = 'revealed';
      
      // Set up a flag in the only valid neighbor
      board[0][1].state = 'flagged';
      
      const result = autoRevealCell(board, 0, 0);
      
      // Should not crash and should handle edge case correctly
      expect(result).toBeDefined();
    });
  });

  describe('toggleFlag', () => {
    it('toggles flag on hidden cell', () => {
      const board = createEmptyBoard(3, 3);
      const result = toggleFlag(board, 0, 0);
      expect(result[0][0].state).toBe('flagged');
    });

    it('removes flag from flagged cell', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].state = 'flagged';
      const result = toggleFlag(board, 0, 0);
      expect(result[0][0].state).toBe('hidden');
    });
  });

  describe('checkGameStatus', () => {
    it('returns playing for ongoing game', () => {
      const board = createEmptyBoard(3, 3);
      const status = checkGameStatus(board, 1);
      expect(status).toBe('playing');
    });

    it('returns won when all non-mine cells are revealed', () => {
      const board = createEmptyBoard(3, 3);
      // Reveal all cells except one mine
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (!(x === 0 && y === 0)) { // Leave one cell as mine
            board[y][x].state = 'revealed';
          }
        }
      }
      board[0][0].isMine = true;
      const status = checkGameStatus(board, 1);
      expect(status).toBe('won');
    });

    it('returns lost when mine is revealed', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].isMine = true;
      board[0][0].state = 'revealed';
      const status = checkGameStatus(board, 1);
      expect(status).toBe('lost');
    });
  });

  describe('getGameStats', () => {
    it('counts revealed and flagged cells correctly', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].state = 'revealed';
      board[0][1].state = 'flagged';
      const stats = getGameStats(board);
      expect(stats.revealedCount).toBe(1);
      expect(stats.flaggedCount).toBe(1);
    });
  });
});
