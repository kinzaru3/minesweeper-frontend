'use client';

import { useState, useCallback } from 'react';
import { Cell, GameState, GameDifficulty } from '@/types/minesweeper';
import {
  getDifficultyConfig,
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkGameStatus,
  getGameStats,
  revealAllMines,
} from '@/utils/minesweeper';

export function useMinesweeper() {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('hard');
  const [gameState, setGameState] = useState<GameState>(() => {
    const config = getDifficultyConfig('hard');
    return {
      cells: createEmptyBoard(config.width, config.height),
      width: config.width,
      height: config.height,
      mineCount: config.mineCount,
      flaggedCount: 0,
      revealedCount: 0,
      gameStatus: 'playing',
      isFirstClick: true,
      isFlagMode: true,
    };
  });

  const resetGame = useCallback((newDifficulty?: GameDifficulty) => {
    const newDiff = newDifficulty || difficulty;
    const config = getDifficultyConfig(newDiff);
    
    setGameState({
      cells: createEmptyBoard(config.width, config.height),
      width: config.width,
      height: config.height,
      mineCount: config.mineCount,
      flaggedCount: 0,
      revealedCount: 0,
      gameStatus: 'playing',
      isFirstClick: true,
      isFlagMode: true,
    });
    
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
  }, [difficulty]);

  const toggleFlagMode = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isFlagMode: !prevState.isFlagMode,
    }));
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prevState => {
      let newCells = [...prevState.cells];

      // 最初のクリックの場合、地雷を配置してセルを開く（旗立モードに関係なく）
      if (prevState.isFirstClick) {
        newCells = placeMines(newCells, prevState.mineCount, x, y);
        newCells = revealCell(newCells, x, y);
      } else {
        // 2回目以降のクリックの場合
        if (prevState.isFlagMode) {
          // 旗立モードの場合、フラグを切り替える
          newCells = toggleFlag(newCells, x, y);
          const stats = getGameStats(newCells);
          return {
            ...prevState,
            cells: newCells,
            flaggedCount: stats.flaggedCount,
          };
        } else {
          // 通常モードの場合、セルを開く
          newCells = revealCell(newCells, x, y);
        }
      }

      // ゲーム状態をチェック
      const newGameStatus = checkGameStatus(newCells, prevState.mineCount);
      
      // ゲーム終了時は全ての地雷を表示
      if (newGameStatus === 'lost') {
        newCells = revealAllMines(newCells);
      }

      // 統計を更新
      const stats = getGameStats(newCells);

      return {
        ...prevState,
        cells: newCells,
        gameStatus: newGameStatus,
        isFirstClick: false,
        revealedCount: stats.revealedCount,
        flaggedCount: stats.flaggedCount,
      };
    });
  }, [gameState.gameStatus, gameState.isFirstClick, gameState.mineCount, gameState.isFlagMode]);

  const handleCellRightClick = useCallback((x: number, y: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prevState => {
      const newCells = toggleFlag(prevState.cells, x, y);
      const stats = getGameStats(newCells);

      return {
        ...prevState,
        cells: newCells,
        flaggedCount: stats.flaggedCount,
      };
    });
  }, [gameState.gameStatus]);

  return {
    gameState,
    difficulty,
    resetGame,
    toggleFlagMode,
    handleCellClick,
    handleCellRightClick,
  };
}
