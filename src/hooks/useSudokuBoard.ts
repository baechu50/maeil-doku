import { useState, useCallback, useEffect } from "react";
import { SudokuBoard } from "../types/sudoku";

export function useSudokuBoard(initial: SudokuBoard, initialSolution: SudokuBoard) {
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>(initial);
  const [boardState, setBoardState] = useState<SudokuBoard>(initial);
  const [solution, setSolution] = useState<SudokuBoard>(initialSolution);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isMemoMode, setIsMemoMode] = useState(false);
  const [highlightNumber, setHighlightNumber] = useState<number | null>(null);
  const [highlightArea, setHighlightArea] = useState<{
    row: number | null;
    col: number | null;
    box: [number, number] | null;
  }>({ row: null, col: null, box: null });

  useEffect(() => {
    setInitialBoard(initial);
    setBoardState(initial);
  }, [initial]);

  useEffect(() => {
    setSolution(initialSolution);
  }, [initialSolution]);

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard.board[row][col] !== 0) return;
    if (isMemoMode) {
      const newMemos = boardState.memos.map(rowArr => rowArr.map(colArr => [...colArr]));
      newMemos[row][col][num - 1] = !newMemos[row][col][num - 1];
      setBoardState({
        ...boardState,
        memos: newMemos,
      });
    } else {
      const newBoard = boardState.board.map((r, rIdx) =>
        rIdx === row ? r.map((c, cIdx) => (cIdx === col ? num : c)) : r
      );
      setBoardState({
        ...boardState,
        board: newBoard,
      });
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col]);
    const value = boardState.board[row][col];
    value !== 0 ? setHighlightNumber(value) : setHighlightNumber(null);
    setHighlightArea({
      row,
      col,
      box: [Math.floor(row / 3), Math.floor(col / 3)],
    });
  };

  const handleCellClear = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard.board[row][col] !== 0) return;
    const newBoard = boardState.board.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? 0 : c)) : r
    );
    setBoardState({
      ...boardState,
      board: newBoard,
    });
    setHighlightNumber(null);
  };

  const setNewPuzzle = useCallback((puzzle: SudokuBoard, newSolution: SudokuBoard) => {
    setInitialBoard(puzzle);
    setBoardState(puzzle);
    setSolution(newSolution);
    setSelectedCell(null);
    setHighlightNumber(null);
    setHighlightArea({ row: null, col: null, box: null });
  }, []);

  const handleHint = useCallback(() => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (boardState.board[r][c] === 0 && initialBoard.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }
    if (emptyCells.length === 0) return;
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = boardState.board.map((r, rIdx) =>
      rIdx === row ? r.map((v, cIdx) => (cIdx === col ? solution.board[row][col] : v)) : r
    );
    setBoardState({
      ...boardState,
      board: newBoard,
    });
  }, [boardState, initialBoard, solution]);

  return {
    board: boardState.board,
    memos: boardState.memos,
    initialBoard,
    selectedCell,
    handleNumberInput,
    handleCellSelect,
    handleCellClear,
    setNewPuzzle,
    highlightNumber,
    highlightArea,
    isMemoMode,
    setIsMemoMode,
    handleHint,
  };
} 