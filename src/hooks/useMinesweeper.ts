'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  autoRevealCell,
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

  // タイマー関連の状態
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // タイマーをリセット
    setElapsedTime(0);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
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
        
        // タイマーを開始
        if (!isTimerRunning) {
          setIsTimerRunning(true);
          timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
        }
      } else {
        // 2回目以降のクリックの場合
        if (prevState.isFlagMode) {
          // 旗立モードの場合
          const clickedCell = newCells[y][x];
          
          if (clickedCell.state === 'hidden') {
            // 隠れたセルにフラグを立てる
            newCells = toggleFlag(newCells, x, y);
          } else if (clickedCell.state === 'revealed' && clickedCell.type === 'number') {
            // 既に開かれている数字のセルをクリックした場合、オートオープン機能を実行
            newCells = autoRevealCell(newCells, x, y);
          }
        } else {
          // 通常モードの場合
          const clickedCell = newCells[y][x];
          
          if (clickedCell.state === 'hidden') {
            // 隠れたセルを開く
            newCells = revealCell(newCells, x, y);
          } else if (clickedCell.state === 'revealed' && clickedCell.type === 'number') {
            // 既に開かれている数字のセルをクリックした場合、オートオープン機能を実行
            newCells = autoRevealCell(newCells, x, y);
          }
        }

        // 旗立モード時でも地雷を踏んだ場合は、そのセルを開く
        if (prevState.isFlagMode) {
          const clickedCell = newCells[y][x];
          if (clickedCell.state === 'hidden' && clickedCell.isMine) {
            newCells = revealCell(newCells, x, y);
          }
        }
      }

      // ゲーム状態をチェック
      const newGameStatus = checkGameStatus(newCells, prevState.mineCount);
      
      // ゲーム終了時は全ての地雷を表示
      if (newGameStatus === 'lost') {
        newCells = revealAllMines(newCells);
      }

      // ゲーム終了時はタイマーを停止
      if (newGameStatus === 'won' || newGameStatus === 'lost') {
        setIsTimerRunning(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
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
  }, [gameState.gameStatus, gameState.isFirstClick, gameState.mineCount, gameState.isFlagMode, isTimerRunning]);

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



  // コンポーネントのクリーンアップ時にタイマーを停止
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    difficulty,
    elapsedTime,
    isTimerRunning,
    resetGame,
    toggleFlagMode,
    handleCellClick,
    handleCellRightClick,
  };
}
