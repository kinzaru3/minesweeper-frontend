import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import GameInfo from '../GameInfo'

// Mock the CSS module
jest.mock('../GameInfo.module.scss', () => ({
  gameInfo: 'gameInfo',
  container: 'container',
  stats: 'stats',
  statItem: 'statItem',
  statLabel: 'statLabel',
  statValue: 'statValue',
  mines: 'mines',
  flags: 'flags',
  size: 'size',
  gameStatus: 'gameStatus',
  statusMessage: 'statusMessage',
  playing: 'playing',
  won: 'won',
  lost: 'lost',
  controls: 'controls',
  difficultyButtons: 'difficultyButtons',
  difficultyButton: 'difficultyButton',
  active: 'active',
  inactive: 'inactive',
  flagModeButton: 'flagModeButton',
  resetButton: 'resetButton',
}))

describe('GameInfo Component', () => {
  const defaultProps = {
    mineCount: 10,
    flaggedCount: 3,
    gameStatus: 'playing' as const,
    difficulty: 'easy' as const,
    boardWidth: 9,
    boardHeight: 9,
    isFlagMode: false,
    onDifficultyChange: jest.fn(),
    onReset: jest.fn(),
    onToggleFlagMode: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders game statistics correctly', () => {
    render(<GameInfo {...defaultProps} />)

    expect(screen.getByText('残り地雷')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument() // 10 - 3
    expect(screen.getByText('フラグ')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('ボードサイズ')).toBeInTheDocument()
    expect(screen.getByText('9×9')).toBeInTheDocument()
  })

  it('renders game status correctly', () => {
    render(<GameInfo {...defaultProps} />)

    expect(screen.getByText('🎮 プレイ中')).toBeInTheDocument()
  })

  it('renders won status correctly', () => {
    render(<GameInfo {...defaultProps} gameStatus="won" />)

    expect(screen.getByText('🎉 勝利！')).toBeInTheDocument()
  })

  it('renders lost status correctly', () => {
    render(<GameInfo {...defaultProps} gameStatus="lost" />)

    expect(screen.getByText('💥 ゲームオーバー')).toBeInTheDocument()
  })

  it('renders difficulty buttons correctly', () => {
    render(<GameInfo {...defaultProps} />)

    expect(screen.getByText('初級')).toBeInTheDocument()
    expect(screen.getByText('中級')).toBeInTheDocument()
    expect(screen.getByText('上級')).toBeInTheDocument()
  })

  it('calls onDifficultyChange when difficulty button is clicked', () => {
    const mockOnDifficultyChange = jest.fn()
    render(<GameInfo {...defaultProps} onDifficultyChange={mockOnDifficultyChange} />)

    const mediumButton = screen.getByText('中級')
    fireEvent.click(mediumButton)

    expect(mockOnDifficultyChange).toHaveBeenCalledWith('medium')
  })

  it('calls onReset when reset button is clicked', () => {
    const mockOnReset = jest.fn()
    render(<GameInfo {...defaultProps} onReset={mockOnReset} />)

    const resetButton = screen.getByText('新しいゲーム')
    fireEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalled()
  })

  it('renders flag mode button correctly', () => {
    render(<GameInfo {...defaultProps} />)

    expect(screen.getByText('🚩 旗立モード')).toBeInTheDocument()
  })

  it('calls onToggleFlagMode when flag mode button is clicked', () => {
    const mockOnToggleFlagMode = jest.fn()
    render(<GameInfo {...defaultProps} onToggleFlagMode={mockOnToggleFlagMode} />)

    const flagModeButton = screen.getByText('🚩 旗立モード')
    fireEvent.click(flagModeButton)

    expect(mockOnToggleFlagMode).toHaveBeenCalled()
  })

  it('shows active state for current difficulty', () => {
    render(<GameInfo {...defaultProps} difficulty="medium" />)

    const easyButton = screen.getByText('初級')
    const mediumButton = screen.getByText('中級')
    const hardButton = screen.getByText('上級')

    // Medium button should have active class
    expect(mediumButton).toHaveClass('active')
    expect(easyButton).toHaveClass('inactive')
    expect(hardButton).toHaveClass('inactive')
  })

  it('shows active state for flag mode when enabled', () => {
    render(<GameInfo {...defaultProps} isFlagMode={true} />)

    const flagModeButton = screen.getByText('🚩 旗立モード')
    expect(flagModeButton).toHaveClass('active')
  })

  it('shows inactive state for flag mode when disabled', () => {
    render(<GameInfo {...defaultProps} isFlagMode={false} />)

    const flagModeButton = screen.getByText('🚩 旗立モード')
    expect(flagModeButton).toHaveClass('inactive')
  })
})
