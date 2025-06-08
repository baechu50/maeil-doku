import { SudokuBoard } from "../types/sudoku";
import { SUDOKU_DIFFICULTY, BOARD_SIZE } from "../lib/constants";

type Difficulty = keyof typeof SUDOKU_DIFFICULTY;

const createEmptyBoard = (): SudokuBoard =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

const cloneBoard = (board: SudokuBoard): SudokuBoard =>
  board.map((row) => [...row]);

const isValidPlacement = (
  board: SudokuBoard,
  row: number,
  col: number,
  num: number
): boolean => {
  // Check row
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

const fillBoard = (board: SudokuBoard): boolean => {
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
};

const shuffle = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const removeCells = (board: SudokuBoard, removeCount: number): SudokuBoard => {
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
};

export const generateSudokuPuzzle = (
  difficulty: Difficulty
): {
  puzzle: SudokuBoard;
  solution: SudokuBoard;
} => {
  const solution = createEmptyBoard();
  const success = fillBoard(solution);
  const puzzle = removeCells(solution, SUDOKU_DIFFICULTY[difficulty]);
  return { puzzle, solution };
};