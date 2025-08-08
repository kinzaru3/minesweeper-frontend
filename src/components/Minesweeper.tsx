'use client';

import { useEffect, useCallback } from 'react';
import { useMinesweeper } from '@/hooks/useMinesweeper';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import styles from './Minesweeper.module.scss';

export default function Minesweeper() {
  const {
    gameState,
    difficulty,
    resetGame,
    toggleFlagMode,
    handleCellClick,
    handleCellRightClick,
  } = useMinesweeper();

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    resetGame(newDifficulty);
  };

  const handleReset = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // キーボードイベント処理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // フォーム要素やボタンがフォーカスされている場合は無視
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement || 
          event.target instanceof HTMLButtonElement) {
        return;
      }

      switch (event.key) {
        case ' ':
          // スペースキーでゲームリセット
          event.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleReset]);

  return (
    <div className={styles.container}>
      {/* 固定ヘッダー */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>マインスイーパー</h1>
          <p className={styles.subtitle}>左クリックでセルを開く、右クリックでフラグを立てる</p>
        </div>
      </div>

      {/* 固定メニュー */}
      <div className={styles.menuContainer}>
        <div className={styles.menuContent}>
          <GameInfo
            mineCount={gameState.mineCount}
            flaggedCount={gameState.flaggedCount}
            gameStatus={gameState.gameStatus}
            difficulty={difficulty}
            boardWidth={gameState.width}
            boardHeight={gameState.height}
            isFlagMode={gameState.isFlagMode}
            onDifficultyChange={handleDifficultyChange}
            onReset={handleReset}
            onToggleFlagMode={toggleFlagMode}
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className={styles.mainContent}>
        <div className={styles.content}>
          {/* ゲームボード - 中央に配置 */}
          <div className={styles.gameBoardContainer}>
            <GameBoard
              board={gameState.cells}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
            />
          </div>

          <div className={styles.footer}>
            <p className={styles.keyboardHints}>
              キーボードショートカット: スペースキーでリセット
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
