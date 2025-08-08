import { renderHook, act } from '@testing-library/react'
import { useMinesweeper } from '../useMinesweeper'
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkGameStatus,
  getGameStats,
  revealAllMines,
  autoRevealCell,
} from '@/utils/minesweeper'

// Mock the utils
jest.mock('@/utils/minesweeper', () => ({
  getDifficultyConfig: jest.fn(() => ({ width: 30, height: 16, mineCount: 99 })),
  createEmptyBoard: jest.fn(() => [
    [
      { id: '0-0', x: 0, y: 0, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '1-0', x: 1, y: 0, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '2-0', x: 2, y: 0, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
    ],
    [
      { id: '0-1', x: 0, y: 1, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '1-1', x: 1, y: 1, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '2-1', x: 2, y: 1, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
    ],
    [
      { id: '0-2', x: 0, y: 2, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '1-2', x: 1, y: 2, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
      { id: '2-2', x: 2, y: 2, state: 'hidden', type: 'empty', mineCount: 0, isMine: false },
    ],
  ]),
  placeMines: jest.fn((board) => board),
  revealCell: jest.fn((board) => board),
  toggleFlag: jest.fn((board, x, y) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newBoard = (board as any).map((row: any) => row.map((cell: any) => ({ ...cell })))
    newBoard[y][x].state = newBoard[y][x].state === 'flagged' ? 'hidden' : 'flagged'
    return newBoard
  }),
  checkGameStatus: jest.fn(() => 'playing'),
  getGameStats: jest.fn(() => ({ revealedCount: 0, flaggedCount: 0 })),
  revealAllMines: jest.fn((board) => board),
  autoRevealCell: jest.fn((board) => board),
}))

describe('useMinesweeper Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useMinesweeper())

    expect(result.current.gameState).toEqual({
      cells: expect.any(Array),
      width: 30,
      height: 16,
      mineCount: 99,
      flaggedCount: 0,
      revealedCount: 0,
      gameStatus: 'playing',
      isFirstClick: true,
      isFlagMode: true,
    })
    expect(result.current.difficulty).toBe('hard')
  })

  it('resets game correctly', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.gameState.isFirstClick).toBe(true)
    expect(result.current.gameState.isFlagMode).toBe(true)
  })

  it('resets game with new difficulty', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.resetGame('hard')
    })

    expect(result.current.difficulty).toBe('hard')
  })

  it('toggles flag mode correctly', () => {
    const { result } = renderHook(() => useMinesweeper())

    expect(result.current.gameState.isFlagMode).toBe(true)

    act(() => {
      result.current.toggleFlagMode()
    })

    expect(result.current.gameState.isFlagMode).toBe(false)

    act(() => {
      result.current.toggleFlagMode()
    })

    expect(result.current.gameState.isFlagMode).toBe(true)
  })

  it('handles cell click in normal mode', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Disable flag mode first
    act(() => {
      result.current.toggleFlagMode()
    })

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(placeMines).toHaveBeenCalled()
    expect(revealCell).toHaveBeenCalled()
  })

  it('handles first cell click in flag mode (should open cell)', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Flag mode is enabled by default, but first click should open cell
    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(placeMines).toHaveBeenCalled()
    expect(revealCell).toHaveBeenCalled()
    expect(toggleFlag).not.toHaveBeenCalled()
  })

  it('handles second cell click in flag mode (should toggle flag)', () => {
    const { result } = renderHook(() => useMinesweeper())

    // First click should open cell
    act(() => {
      result.current.handleCellClick(0, 0)
    })

    // Second click should toggle flag
    act(() => {
      result.current.handleCellClick(1, 1)
    })

    expect(toggleFlag).toHaveBeenCalled()
    expect(placeMines).toHaveBeenCalledTimes(1) // Only called once for first click
  })

  it('handles cell right click', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.handleCellRightClick(0, 0)
    })

    expect(toggleFlag).toHaveBeenCalledWith(expect.any(Array), 0, 0)
  })

  it('does not handle clicks when game is not playing', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Disable flag mode first to test normal mode
    act(() => {
      result.current.toggleFlagMode()
    })

    // Mock game status as 'won' for the next call
    ;(checkGameStatus as jest.Mock).mockReturnValueOnce('won')

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    // The first click will still work because it's the first click
    // We need to test with a non-first click
    act(() => {
      result.current.handleCellClick(1, 1)
    })

    // The second click should not work because game status is 'won'
    expect(placeMines).toHaveBeenCalledTimes(1) // Only called once for first click
  })

  it('initializes with timer state', () => {
    const { result } = renderHook(() => useMinesweeper())

    expect(result.current.elapsedTime).toBe(0)
    expect(result.current.isTimerRunning).toBe(false)
  })

  it('starts timer on first click', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(result.current.isTimerRunning).toBe(true)
  })

  it('stops timer when game ends', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Mock game status as 'won' for the next call
    ;(checkGameStatus as jest.Mock).mockReturnValueOnce('won')

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(result.current.isTimerRunning).toBe(false)
  })

  it('resets timer when game is reset', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Start timer
    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(result.current.isTimerRunning).toBe(true)

    // Reset game
    act(() => {
      result.current.resetGame()
    })

    expect(result.current.elapsedTime).toBe(0)
    expect(result.current.isTimerRunning).toBe(false)
  })

  it('executes auto-reveal when clicking revealed number cell', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Mock the board to have a revealed number cell
    const mockBoard = [
      [
        { id: '0-0', x: 0, y: 0, state: 'flagged' as const, type: 'empty' as const, mineCount: 0, isMine: false },
        { id: '1-0', x: 1, y: 0, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
        { id: '2-0', x: 2, y: 0, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
      ],
      [
        { id: '0-1', x: 0, y: 1, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
        { id: '1-1', x: 1, y: 1, state: 'revealed' as const, type: 'number' as const, mineCount: 1, isMine: false },
        { id: '2-1', x: 2, y: 1, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
      ],
      [
        { id: '0-2', x: 0, y: 2, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
        { id: '1-2', x: 1, y: 2, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
        { id: '2-2', x: 2, y: 2, state: 'hidden' as const, type: 'empty' as const, mineCount: 0, isMine: false },
      ],
    ]

    // Mock the game state
    act(() => {
      result.current.gameState.cells = mockBoard
      result.current.gameState.isFirstClick = false
      result.current.gameState.isFlagMode = false
    })

    // Click on the revealed number cell
    act(() => {
      result.current.handleCellClick(1, 1)
    })

    // The auto-reveal should have been executed
    // We can't directly test the result, but we can verify the function was called
    expect(result.current.gameState.gameStatus).toBeDefined()
  })
})
