import { useEffect, useState } from "react";

export function useSudokuValidation(board: number[][]) {
  const [conflictCells, setConflictCells] = useState<[number, number][]>([]);
  const [isBoardFull, setIsBoardFull] = useState(false);

  useEffect(() => {
    const full = board.every((row) => row.every((cell) => cell !== 0));
    const conflicts: [number, number][] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value === 0) continue;

        // 같은 행에서 중복 검사
        for (let c = 0; c < 9; c++) {
          if (c !== col && board[row][c] === value) {
            conflicts.push([row, col]);
            break;
          }
        }

        // 같은 열에서 중복 검사
        for (let r = 0; r < 9; r++) {
          if (r !== row && board[r][col] === value) {
            conflicts.push([row, col]);
            break;
          }
        }

        // 같은 3x3 박스에서 중복 검사
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
    setIsBoardFull(full && conflicts.length === 0);
  }, [board]);

  return { conflictCells, isBoardFull };
}
