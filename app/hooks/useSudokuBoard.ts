import { useState } from "react";
import { SudokuBoard } from "../types/sudoku";

export const useSudokuBoard = (initial: SudokuBoard) => {
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>(initial);
  const [board, setBoard] = useState<SudokuBoard>(initial);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );

  const [isMemoMode, setIsMemoMode] = useState(false);
  const [memos, setMemos] = useState<boolean[][][]>(() =>
    Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(false))
      )
  );

  const [highlightNumber, setHighlightNumber] = useState<number | null>(null);
  const [highlightArea, setHighlightArea] = useState<{
    row: number | null;
    col: number | null;
    box: [number, number] | null;
  }>({ row: null, col: null, box: null });

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    if (isMemoMode) {
      const newMemos = [...memos];
      newMemos[row][col][num - 1] = !newMemos[row][col][num - 1];
      setMemos(newMemos);
    } else {
      const newBoard = board.map((r, rIdx) =>
        rIdx === row ? r.map((c, cIdx) => (cIdx === col ? num : c)) : r
      );
      setBoard(newBoard);
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col]);
    const value = board[row][col];
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
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? 0 : c)) : r
    );
    setBoard(newBoard);
    setHighlightNumber(null);
  };

  const setNewPuzzle = (puzzle: SudokuBoard) => {
    setInitialBoard(puzzle);
    setBoard(puzzle);
    setSelectedCell(null);
    setHighlightNumber(null);
    setHighlightArea({ row: null, col: null, box: null });
    setMemos(
      Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => Array(9).fill(false))
        )
    );
  };

  return {
    board,
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
    memos,
  };
};
