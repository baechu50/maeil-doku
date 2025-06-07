import { DifficultyLevel } from "./sudoku";

export interface SudokuRecord {
  date: string;
  difficulty: DifficultyLevel;
  timeInSeconds: number;
  hintsUsed: number;
}