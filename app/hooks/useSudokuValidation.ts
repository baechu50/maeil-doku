import { useEffect, useState } from "react";
import { SudokuBoard } from "../types/sudoku";

export const useSudokuValidation = (board: SudokuBoard) => {
  const [conflictCells, setConflictCells] = useState<[number, number][]>([]);
  const [isBoardFull, setIsBoardFull] = useState(false);

  useEffect(() => {
    const full = board.every((row) => row.every((cell) => cell !== 0));
    setIsBoardFull(full);

    const conflicts: [number, number][] = [];

    // Check each cell
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value === 0) continue;

        // Check row
        for (let c = 0; c < 9; c++) {
          if (c !== col && board[row][c] === value) {
            conflicts.push([row, col]);
            break;
          }
        }

        // Check column
        for (let r = 0; r < 9; r++) {
          if (r !== row && board[r][col] === value) {
            conflicts.push([row, col]);
            break;
          }
        }

        // Check box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            if (r !== row && c !== col && board[r][c] === value) {
              conflicts.push([row, col]);
              break;
            }
          }
        }
      }
    }

    setConflictCells(conflicts);
  }, [board]);

  return { conflictCells, isBoardFull };
};

const isValidPlacement = (
  board: SudokuBoard,
  row: number,
  col: number,
  value: number
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === value) return false;
    }
  }

  return true;
};