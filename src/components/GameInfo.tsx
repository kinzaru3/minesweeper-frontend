'use client';

import { GameDifficulty } from '@/types/minesweeper';
import styles from './GameInfo.module.scss';

interface GameInfoProps {
  mineCount: number;
  flaggedCount: number;
  gameStatus: 'playing' | 'won' | 'lost';
  difficulty: GameDifficulty;
  boardWidth: number;
  boardHeight: number;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onReset: () => void;
}

export default function GameInfo({
  mineCount,
  flaggedCount,
  gameStatus,
  difficulty,
  boardWidth,
  boardHeight,
  onDifficultyChange,
  onReset,
}: GameInfoProps) {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return '🎉 勝利！';
      case 'lost':
        return '💥 ゲームオーバー';
      default:
        return '🎮 プレイ中';
    }
  };

  const getStatusClass = () => {
    switch (gameStatus) {
      case 'won':
        return styles.won;
      case 'lost':
        return styles.lost;
      default:
        return styles.playing;
    }
  };

  return (
    <div className={styles.gameInfo}>
      <div className={styles.container}>
        {/* ゲーム統計 */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>残り地雷</div>
            <div className={`${styles.statValue} ${styles.mines}`}>
              {mineCount - flaggedCount}
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statLabel}>フラグ</div>
            <div className={`${styles.statValue} ${styles.flags}`}>
              {flaggedCount}
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statLabel}>ボードサイズ</div>
            <div className={`${styles.statValue} ${styles.size}`}>
              {boardWidth}×{boardHeight}
            </div>
          </div>
        </div>

        {/* ゲーム状態 */}
        <div className={styles.gameStatus}>
          <div className={`${styles.statusMessage} ${getStatusClass()}`}>
            {getStatusMessage()}
          </div>
        </div>

        {/* 難易度選択とリセットボタン */}
        <div className={styles.controls}>
          <div className={styles.difficultyButtons}>
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`${styles.difficultyButton} ${
                difficulty === 'easy' ? styles.active : styles.inactive
              }`}
            >
              初級
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`${styles.difficultyButton} ${
                difficulty === 'medium' ? styles.active : styles.inactive
              }`}
            >
              中級
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`${styles.difficultyButton} ${
                difficulty === 'hard' ? styles.active : styles.inactive
              }`}
            >
              上級
            </button>
          </div>
          
          <button
            onClick={onReset}
            className={styles.resetButton}
          >
            新しいゲーム
          </button>
        </div>
      </div>
    </div>
  );
}
