import { SudokuBoard, DifficultyLevel } from "../types/sudoku";
import { BOARD_SIZE, SUDOKU_DIFFICULTY } from "./constants";

export function createEmptyBoard(): number[][] {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

export function wrapSudokuBoard(board: number[][]): SudokuBoard {
  return {
    board,
    memos: Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(false))
      ),
  };
}

function cloneBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}

function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[row][x] === num) return false;
  }
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[x][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
}

function fillBoard(board: number[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function removeCells(board: number[][], removeCount: number): number[][] {
  const result = cloneBoard(board);
  let removed = 0;
  while (removed < removeCount) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (result[row][col] !== 0) {
      result[row][col] = 0;
      removed++;
    }
  }
  return result;
}

export function generateSudokuPuzzle(difficulty: DifficultyLevel): {
  puzzle: SudokuBoard;
  solution: SudokuBoard;
} {
  const solutionArr = createEmptyBoard();
  fillBoard(solutionArr);
  const puzzleArr = removeCells(solutionArr, SUDOKU_DIFFICULTY[difficulty]);
  return {
    puzzle: wrapSudokuBoard(puzzleArr),
    solution: wrapSudokuBoard(solutionArr),
  };
}
