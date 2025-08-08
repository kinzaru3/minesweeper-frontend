'use client';

import { GameDifficulty } from '@/types/minesweeper';

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

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl border border-gray-700 shadow-2xl">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        {/* ゲーム統計 */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">残り地雷</div>
            <div className="text-3xl font-bold text-red-400 mt-1">
              {mineCount - flaggedCount}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">フラグ</div>
            <div className="text-3xl font-bold text-yellow-400 mt-1">
              {flaggedCount}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">ボードサイズ</div>
            <div className="text-xl font-bold text-blue-400 mt-1">
              {boardWidth}×{boardHeight}
            </div>
          </div>
        </div>

        {/* ゲーム状態 */}
        <div className="text-center">
          <div className={`text-xl font-bold ${getStatusColor()} bg-gray-800 px-4 py-2 rounded-lg border border-gray-600`}>
            {getStatusMessage()}
          </div>
        </div>

        {/* 難易度選択とリセットボタン */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-1">
            <button
              onClick={() => onDifficultyChange('easy')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                difficulty === 'easy'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
              }`}
            >
              初級
            </button>
            <button
              onClick={() => onDifficultyChange('medium')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                difficulty === 'medium'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
              }`}
            >
              中級
            </button>
            <button
              onClick={() => onDifficultyChange('hard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                difficulty === 'hard'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
              }`}
            >
              上級
            </button>
          </div>
          
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            新しいゲーム
          </button>
        </div>
      </div>
    </div>
  );
}
