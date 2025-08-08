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
} from '@/utils/minesweeper'

// Mock the utils
jest.mock('@/utils/minesweeper', () => ({
  getDifficultyConfig: jest.fn(() => ({ width: 3, height: 3, mineCount: 2 })),
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
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    newBoard[y][x].state = newBoard[y][x].state === 'flagged' ? 'hidden' : 'flagged'
    return newBoard
  }),
  checkGameStatus: jest.fn(() => 'playing'),
  getGameStats: jest.fn(() => ({ revealedCount: 0, flaggedCount: 0 })),
  revealAllMines: jest.fn((board) => board),
}))

describe('useMinesweeper Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useMinesweeper())

    expect(result.current.gameState).toEqual({
      cells: expect.any(Array),
      width: 3,
      height: 3,
      mineCount: 2,
      flaggedCount: 0,
      revealedCount: 0,
      gameStatus: 'playing',
      isFirstClick: true,
      isFlagMode: false,
    })
    expect(result.current.difficulty).toBe('easy')
  })

  it('resets game correctly', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.gameState.isFirstClick).toBe(true)
    expect(result.current.gameState.isFlagMode).toBe(false)
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

    expect(result.current.gameState.isFlagMode).toBe(false)

    act(() => {
      result.current.toggleFlagMode()
    })

    expect(result.current.gameState.isFlagMode).toBe(true)

    act(() => {
      result.current.toggleFlagMode()
    })

    expect(result.current.gameState.isFlagMode).toBe(false)
  })

  it('handles cell click in normal mode', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(placeMines).toHaveBeenCalled()
    expect(revealCell).toHaveBeenCalled()
  })

  it('handles cell click in flag mode', () => {
    const { result } = renderHook(() => useMinesweeper())

    // Enable flag mode
    act(() => {
      result.current.toggleFlagMode()
    })

    act(() => {
      result.current.handleCellClick(0, 0)
    })

    expect(toggleFlag).toHaveBeenCalled()
    expect(placeMines).not.toHaveBeenCalled()
    expect(revealCell).not.toHaveBeenCalled()
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
})
