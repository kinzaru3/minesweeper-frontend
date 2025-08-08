'use client';

import { GameDifficulty } from '@/types/minesweeper';

interface GameInfoProps {
  mineCount: number;
  flaggedCount: number;
  gameStatus: 'playing' | 'won' | 'lost';
  difficulty: GameDifficulty;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onReset: () => void;
}

export default function GameInfo({
  mineCount,
  flaggedCount,
  gameStatus,
  difficulty,
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

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-green-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* ゲーム統計 */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-300">残り地雷</div>
            <div className="text-2xl font-bold text-red-500">
              {mineCount - flaggedCount}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-300">フラグ</div>
            <div className="text-2xl font-bold text-yellow-500">
              {flaggedCount}
            </div>
          </div>
        </div>

        {/* ゲーム状態 */}
        <div className="text-center">
          <div className={`text-lg font-bold ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
        </div>

        {/* 難易度選択とリセットボタン */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                difficulty === 'easy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              初級
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                difficulty === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              中級
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                difficulty === 'hard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              上級
            </button>
          </div>
          
          <button
            onClick={onReset}
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
          >
            新しいゲーム
          </button>
        </div>
      </div>
    </div>
  );
}
