import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Cell from '../Cell'
import { Cell as CellType } from '@/types/minesweeper'

// Mock the CSS module
jest.mock('../Cell.module.scss', () => ({
  cell: 'cell',
  hidden: 'hidden',
  flagged: 'flagged',
  revealed: 'revealed',
  mine: 'mine',
  empty: 'empty',
  number: 'number',
  pressed: 'pressed',
  'number-1': 'number-1',
  'number-2': 'number-2',
  'number-3': 'number-3',
  'number-4': 'number-4',
  'number-5': 'number-5',
  'number-6': 'number-6',
  'number-7': 'number-7',
  'number-8': 'number-8',
}))

describe('Cell Component', () => {
  const mockOnClick = jest.fn()
  const mockOnRightClick = jest.fn()
  const mockOnDoubleClick = jest.fn()

  const createCell = (overrides: Partial<CellType> = {}): CellType => ({
    id: '0-0',
    x: 0,
    y: 0,
    state: 'hidden',
    type: 'empty',
    mineCount: 0,
    isMine: false,
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hidden cell correctly', () => {
    const cell = createCell()
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    expect(cellElement).toBeInTheDocument()
    expect(cellElement).toHaveTextContent('')
  })

  it('renders flagged cell correctly', () => {
    const cell = createCell({ state: 'flagged' })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    expect(cellElement).toHaveTextContent('🚩')
  })

  it('renders revealed mine cell correctly', () => {
    const cell = createCell({ 
      state: 'revealed', 
      isMine: true,
      type: 'mine'
    })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    expect(cellElement).toHaveTextContent('💣')
  })

  it('renders revealed number cell correctly', () => {
    const cell = createCell({ 
      state: 'revealed', 
      type: 'number',
      mineCount: 3
    })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    expect(cellElement).toHaveTextContent('3')
  })

  it('calls onClick when hidden cell is clicked', () => {
    const cell = createCell()
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.click(cellElement)

    expect(mockOnClick).toHaveBeenCalledWith(0, 0)
  })

  it('does not call onClick when revealed cell is clicked', () => {
    const cell = createCell({ state: 'revealed' })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.click(cellElement)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('calls onRightClick when cell is right-clicked', () => {
    const cell = createCell()
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.contextMenu(cellElement)

    expect(mockOnRightClick).toHaveBeenCalledWith(0, 0)
  })

  it('prevents default on right click', () => {
    const cell = createCell()
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    
    const preventDefaultSpy = jest.spyOn(contextMenuEvent, 'preventDefault')
    fireEvent(cellElement, contextMenuEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('calls onDoubleClick when revealed number cell is double-clicked', () => {
    const cell = createCell({ 
      state: 'revealed', 
      type: 'number',
      mineCount: 3
    })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.doubleClick(cellElement)

    expect(mockOnDoubleClick).toHaveBeenCalledWith(0, 0)
  })

  it('does not call onDoubleClick when hidden cell is double-clicked', () => {
    const cell = createCell()
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.doubleClick(cellElement)

    expect(mockOnDoubleClick).not.toHaveBeenCalled()
  })

  it('does not call onDoubleClick when non-number cell is double-clicked', () => {
    const cell = createCell({ 
      state: 'revealed', 
      type: 'empty'
    })
    render(
      <Cell
        cell={cell}
        onClick={mockOnClick}
        onRightClick={mockOnRightClick}
        onDoubleClick={mockOnDoubleClick}
      />
    )

    const cellElement = screen.getByRole('button')
    fireEvent.doubleClick(cellElement)

    expect(mockOnDoubleClick).not.toHaveBeenCalled()
  })
})
