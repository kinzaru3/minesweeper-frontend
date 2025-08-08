'use client';

import { useMinesweeper } from '@/hooks/useMinesweeper';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">マインスイーパー</h1>
          <p className="text-gray-400">左クリックでセルを開く、右クリックでフラグを立てる</p>
        </div>

        {/* ゲーム情報パネル - 上部に配置 */}
        <div className="mb-6">
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
        <div className="flex justify-center">
          <GameBoard
            board={gameState.cells}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>💡 ヒント: 数字は周囲の地雷の数を示しています</p>
        </div>
      </div>
    </div>
  );
}
