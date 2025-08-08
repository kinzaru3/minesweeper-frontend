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
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <div className="space-y-6">
        {/* ゲーム統計 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-300">残り地雷</div>
            <div className="text-3xl font-bold text-red-500">
              {mineCount - flaggedCount}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-300">フラグ</div>
            <div className="text-3xl font-bold text-yellow-500">
              {flaggedCount}
            </div>
          </div>
        </div>

        {/* ゲーム状態 */}
        <div className="text-center">
          <div className={`text-xl font-bold ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
        </div>

        {/* 難易度選択 */}
        <div className="space-y-3">
          <div className="text-sm text-gray-300 font-medium">難易度</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                difficulty === 'easy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              初級
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                difficulty === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              中級
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                difficulty === 'hard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              上級
            </button>
          </div>
        </div>
        
        {/* リセットボタン */}
        <button
          onClick={onReset}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
        >
          新しいゲーム
        </button>
      </div>
    </div>
  );
}
