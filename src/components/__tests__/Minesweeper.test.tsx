import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Minesweeper from '../Minesweeper'

// Mock the CSS module
jest.mock('../Minesweeper.module.scss', () => ({
  container: 'container',
  header: 'header',
  headerContent: 'headerContent',
  title: 'title',
  subtitle: 'subtitle',
  menuContainer: 'menuContainer',
  menuContent: 'menuContent',
  mainContent: 'mainContent',
  content: 'content',
  gameBoardContainer: 'gameBoardContainer',
  footer: 'footer',
  flagModeHint: 'flagModeHint',
}))

// Mock the GameBoard component
jest.mock('../GameBoard', () => {
  return function MockGameBoard() {
    return <div data-testid="game-board">Game Board</div>
  }
})

// Mock the GameInfo component
jest.mock('../GameInfo', () => {
  return function MockGameInfo() {
    return <div data-testid="game-info">Game Info</div>
  }
})

// Mock the useMinesweeper hook
jest.mock('@/hooks/useMinesweeper', () => ({
  useMinesweeper: () => ({
    gameState: {
      cells: [],
      width: 9,
      height: 9,
      mineCount: 10,
      flaggedCount: 0,
      revealedCount: 0,
      gameStatus: 'playing',
      isFirstClick: true,
      isFlagMode: false,
    },
    difficulty: 'easy',
    resetGame: jest.fn(),
    toggleFlagMode: jest.fn(),
    handleCellClick: jest.fn(),
    handleCellRightClick: jest.fn(),
  }),
}))

describe('Minesweeper Component', () => {
  it('renders the game title', () => {
    render(<Minesweeper />)
    
    expect(screen.getByText('マインスイーパー')).toBeInTheDocument()
  })

  it('renders the game subtitle', () => {
    render(<Minesweeper />)
    
    expect(screen.getByText('左クリックでセルを開く、右クリックでフラグを立てる')).toBeInTheDocument()
  })

  it('renders game board and game info components', () => {
    render(<Minesweeper />)
    
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
    expect(screen.getByTestId('game-info')).toBeInTheDocument()
  })

  it('does not render hint text about numbers', () => {
    render(<Minesweeper />)
    
    // ヒントテキストが表示されないことを確認
    expect(screen.queryByText('💡 ヒント: 数字は周囲の地雷の数を示しています')).not.toBeInTheDocument()
  })

  it('does not render flag mode hint when flag mode is disabled', () => {
    render(<Minesweeper />)
    
    // 旗立モードのヒントが表示されないことを確認
    expect(screen.queryByText('🚩 旗立モード: 左クリックでフラグを立てます')).not.toBeInTheDocument()
  })

  it('does not render flag mode hint when flag mode is enabled', () => {
    // Mock the hook to return flag mode enabled
    const mockUseMinesweeper = jest.requireMock('@/hooks/useMinesweeper')
    mockUseMinesweeper.useMinesweeper = jest.fn(() => ({
      gameState: {
        cells: [],
        width: 9,
        height: 9,
        mineCount: 10,
        flaggedCount: 0,
        revealedCount: 0,
        gameStatus: 'playing',
        isFirstClick: true,
        isFlagMode: true,
      },
      difficulty: 'easy',
      resetGame: jest.fn(),
      toggleFlagMode: jest.fn(),
      handleCellClick: jest.fn(),
      handleCellRightClick: jest.fn(),
    }))

    render(<Minesweeper />)
    
    // 旗立モードのヒントが表示されないことを確認（削除されたため）
    expect(screen.queryByText('🚩 旗立モード: 左クリックでフラグを立てます')).not.toBeInTheDocument()
  })

  it('renders keyboard shortcuts hint', () => {
    render(<Minesweeper />)
    
    expect(screen.getByText('キーボードショートカット: スペースキーでリセット、Tabキーで旗立モード切り替え')).toBeInTheDocument()
  })

  it('handles space key for game reset', () => {
    const mockResetGame = jest.fn()
    const mockUseMinesweeper = jest.requireMock('@/hooks/useMinesweeper')
    mockUseMinesweeper.useMinesweeper = jest.fn(() => ({
      gameState: {
        cells: [],
        width: 9,
        height: 9,
        mineCount: 10,
        flaggedCount: 0,
        revealedCount: 0,
        gameStatus: 'playing',
        isFirstClick: true,
        isFlagMode: false,
      },
      difficulty: 'easy',
      resetGame: mockResetGame,
      toggleFlagMode: jest.fn(),
      handleCellClick: jest.fn(),
      handleCellRightClick: jest.fn(),
    }))

    render(<Minesweeper />)
    
    // スペースキーをシミュレート
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
    window.dispatchEvent(spaceEvent)
    
    expect(mockResetGame).toHaveBeenCalled()
  })

  it('handles tab key for flag mode toggle', () => {
    const mockToggleFlagMode = jest.fn()
    const mockUseMinesweeper = jest.requireMock('@/hooks/useMinesweeper')
    mockUseMinesweeper.useMinesweeper = jest.fn(() => ({
      gameState: {
        cells: [],
        width: 9,
        height: 9,
        mineCount: 10,
        flaggedCount: 0,
        revealedCount: 0,
        gameStatus: 'playing',
        isFirstClick: true,
        isFlagMode: false,
      },
      difficulty: 'easy',
      resetGame: jest.fn(),
      toggleFlagMode: mockToggleFlagMode,
      handleCellClick: jest.fn(),
      handleCellRightClick: jest.fn(),
    }))

    render(<Minesweeper />)
    
    // Tabキーをシミュレート
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
    window.dispatchEvent(tabEvent)
    
    expect(mockToggleFlagMode).toHaveBeenCalled()
  })


})
