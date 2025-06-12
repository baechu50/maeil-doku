import { useState, useCallback, useEffect } from "react";
import { SudokuBoard } from "../types/sudoku";

export function useSudokuBoard(initial: SudokuBoard, initialSolution: SudokuBoard) {
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>(initial);
  const [boardState, setBoardState] = useState<SudokuBoard>(initial);
  const [solution, setSolution] = useState<SudokuBoard>(initialSolution);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isMemoMode, setIsMemoMode] = useState(false);
  const [highlightNumber, setHighlightNumber] = useState<number | null>(null);
  const [highlightArea, setHighlightArea] = useState({
    row: null,
    col: null,
    box: null,
  } as { row: number | null; col: number | null; box: [number, number] | null });

  const [history, setHistory] = useState<SudokuBoard[]>([]);
  const [future, setFuture] = useState<SudokuBoard[]>([]);

  useEffect(() => {
    setInitialBoard(initial);
    setBoardState(initial);
    setHistory([]);
    setFuture([]);
  }, [initial]);

  useEffect(() => {
    setSolution(initialSolution);
  }, [initialSolution]);

  const pushToHistory = (snapshot: SudokuBoard) => {
    setHistory((prev) => {
      const newHistory = [...prev, snapshot];
      if (newHistory.length > 10) {
        newHistory.shift(); // 10개 초과 시 앞에서 제거
      }
      return newHistory;
    });
    setFuture([]); // 새로운 동작 이후 redo 불가
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard.board[row][col] !== 0) return;

    pushToHistory(boardState);

    if (isMemoMode) {
      const newMemos = boardState.memos.map((rowArr) =>
        rowArr.map((colArr) => [...colArr])
      );
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
    setHighlightNumber(value !== 0 ? value : null);
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

    pushToHistory(boardState);

    const newBoard = boardState.board.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? 0 : c)) : r
    );
    setBoardState({
      ...boardState,
      board: newBoard,
    });
    setHighlightNumber(null);
  };

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

    pushToHistory(boardState);

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = boardState.board.map((r, rIdx) =>
      rIdx === row ? r.map((v, cIdx) => (cIdx === col ? solution.board[row][col] : v)) : r
    );
    setBoardState({
      ...boardState,
      board: newBoard,
    });
  }, [boardState, initialBoard, solution]);

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture((f) => [boardState, ...f]);
    setBoardState(prev);
    setHistory((h) => h.slice(0, h.length - 1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((h) => [...h, boardState]);
    setBoardState(next);
    setFuture((f) => f.slice(1));
  };

  const setNewPuzzle = useCallback((puzzle: SudokuBoard, newSolution: SudokuBoard) => {
    setInitialBoard(puzzle);
    setBoardState(puzzle);
    setSolution(newSolution);
    setSelectedCell(null);
    setHighlightNumber(null);
    setHighlightArea({ row: null, col: null, box: null });
    setHistory([]);
    setFuture([]);
  }, []);

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
    undo,
    redo,
  };
}