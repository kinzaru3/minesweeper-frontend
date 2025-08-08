'use client';

import { useMinesweeper } from '@/hooks/useMinesweeper';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import styles from './Minesweeper.module.scss';

export default function Minesweeper() {
  const {
    gameState,
    difficulty,
    resetGame,
    handleCellClick,
    handleCellRightClick,
  } = useMinesweeper();

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    resetGame(newDifficulty);
  };

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>マインスイーパー</h1>
          <p className={styles.subtitle}>左クリックでセルを開く、右クリックでフラグを立てる</p>
        </div>

        {/* ゲーム情報パネル - 上部に配置 */}
        <div className={styles.menuContainer}>
          <GameInfo
            mineCount={gameState.mineCount}
            flaggedCount={gameState.flaggedCount}
            gameStatus={gameState.gameStatus}
            difficulty={difficulty}
            boardWidth={gameState.width}
            boardHeight={gameState.height}
            onDifficultyChange={handleDifficultyChange}
            onReset={handleReset}
          />
        </div>

        {/* ゲームボード - 中央に配置 */}
        <div className={styles.gameBoardContainer}>
          <GameBoard
            board={gameState.cells}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>

        <div className={styles.footer}>
          <p>💡 ヒント: 数字は周囲の地雷の数を示しています</p>
        </div>
      </div>
    </div>
  );
}
